import logging
from fastapi import APIRouter, Depends, UploadFile, File, Form, status, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.security.dependencies import get_current_user
from app.security.validators import validate_resume_file, validate_file_size, validate_job_description
from app.services.resume_service import run_analysis_pipeline
from app.services.analysis_service import get_result_by_id, get_full_result
from app.schemas.analysis import AnalysisResultResponse, FullResultResponse

router = APIRouter()
logger = logging.getLogger(__name__)


# ── GET /api/v1/results ───────────────────────────────────────────────────────
# Lists all analysis results for the authenticated job seeker.

@router.get("/results")
def list_results(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from app.models.resume import Resume
    from app.models.analysis import AnalysisResult, FeedbackItem

    # Get all resume IDs belonging to this user
    resume_ids = [r.resumeID for r in db.query(Resume).filter(Resume.userID == current_user.userID).all()]

    if not resume_ids:
        return {"results": []}

    results = (
        db.query(AnalysisResult)
        .filter(AnalysisResult.resumeID.in_(resume_ids))
        .order_by(AnalysisResult.timestamp.desc())
        .all()
    )

    items = []
    for r in results:
        feedback = db.query(FeedbackItem).filter(FeedbackItem.resultID == r.resultID).first()
        items.append({
            "resultID": r.resultID,
            "resumeID": r.resumeID,
            "jdID": r.jdID,
            "finalScore": r.finalScore,
            "matchedKeywords": r.matchedKeywords,
            "missingCount": len(feedback.missingKeywords) if feedback else 0,
            "timestamp": r.timestamp,
        })

    return {"results": items}


# ── POST /api/v1/js/upload ────────────────────────────────────────────────────
# Accepts resume file + job description text, runs the full NLP pipeline,
# and returns the result + feedback in one response.

@router.post("/js/upload", status_code=status.HTTP_201_CREATED)
async def upload_and_analyze(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # 1. Basic validation
        if not resume.filename:
            raise HTTPException(status_code=400, detail="No filename provided")
            
        validate_resume_file(resume)
        validate_job_description(job_description)

        # 2. Read and validate size
        file_bytes = await resume.read()
        validate_file_size(file_bytes)

        # 3. Safe extension extraction
        if "." not in resume.filename:
            raise HTTPException(status_code=400, detail="File must have an extension (e.g., .pdf)")
        file_ext = resume.filename.rsplit(".", 1)[-1].lower()

        # 4. Execute pipeline
        outcome = run_analysis_pipeline(
            db=db,
            file_bytes=file_bytes,
            file_ext=file_ext,
            jd_text=job_description,
            user_id=current_user.userID
        )

        return {
            "message": "Analysis complete",
            "result_id": outcome.get("result_id"),
            "feedback_id": outcome.get("feedback_id"),
            "score": outcome.get("score")
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Upload error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during file analysis. Please check file format and try again."
        )


# ── POST /api/v1/analyze ──────────────────────────────────────────────────────
# Triggers analysis on an already-uploaded resume + JD pair by their IDs.
# Used when re-analyzing without re-uploading.

@router.post("/analyze", status_code=status.HTTP_200_OK)
def trigger_analysis(
    resume_id: str,
    jd_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from app.models.resume import Resume
    from app.models.job import JobDescription
    from app.core.parser import extract_text
    from app.core.cleaner import clean_text
    from app.core.nlp_engine import extract_keywords
    from app.core.scorer import compute_match_score, get_matched_keywords
    from app.core.gap_analyzer import find_keyword_gaps
    from app.core.feedback import generate_feedback
    from app.models.analysis import AnalysisResult, FeedbackItem
    from app.models.resume import ExtractedProfile
    import uuid

    resume = db.query(Resume).filter(
        Resume.resumeID == resume_id,
        Resume.userID == current_user.userID
    ).first()
    if not resume:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Resume not found")

    jd = db.query(JobDescription).filter(JobDescription.jdID == jd_id).first()
    if not jd:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Job description not found")

    profile = db.query(ExtractedProfile).filter(
        ExtractedProfile.resumeID == resume_id
    ).first()

    clean_jd = clean_text(jd.rawText)
    resume_keywords = [s for s in (profile.skills if profile else [])]
    jd_keywords = extract_keywords(clean_jd)

    score = compute_match_score(" ".join(resume_keywords), clean_jd)
    matched = get_matched_keywords(resume_keywords, jd_keywords)
    missing = find_keyword_gaps(resume_keywords, jd_keywords)
    feedback_data = generate_feedback(
        score, missing, matched,
        {"skills": profile.skills if profile else [],
         "education": profile.education if profile else [],
         "experience": profile.experience if profile else [],
         "name": profile.candidateName if profile else None}
    )

    result = AnalysisResult(
        resultID=str(uuid.uuid4()),
        resumeID=resume_id,
        jdID=jd_id,
        finalScore=score,
        matchedKeywords=matched
    )
    db.add(result)
    db.flush()

    feedback = FeedbackItem(
        feedbackID=str(uuid.uuid4()),
        resultID=result.resultID,
        missingKeywords=missing,
        suggestions=feedback_data["suggestions"],
        highlightedSections=feedback_data["highlighted_sections"]
    )
    db.add(feedback)
    db.commit()

    return {
        "message": "Re-analysis complete",
        "result_id": result.resultID,
        "feedback_id": feedback.feedbackID,
        "score": score
    }


# ── GET /api/v1/results/{id} ──────────────────────────────────────────────────

@router.get("/results/{result_id}")
def get_result(
    result_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    data = get_full_result(db, result_id, current_user.userID)
    return {
        "result": {
            "resultID": data["result"].resultID,
            "resumeID": data["result"].resumeID,
            "jdID": data["result"].jdID,
            "finalScore": data["result"].finalScore,
            "matchedKeywords": data["result"].matchedKeywords,
            "timestamp": data["result"].timestamp
        },
        "feedback": {
            "feedbackID": data["feedback"].feedbackID,
            "missingKeywords": data["feedback"].missingKeywords,
            "suggestions": data["feedback"].suggestions,
            "highlightedSections": data["feedback"].highlightedSections
        } if data["feedback"] else None,
        "profile": {
            "candidateName": data["profile"].candidateName,
            "email": data["profile"].email,
            "phone": data["profile"].phone,
            "skills": data["profile"].skills,
            "education": data["profile"].education,
            "experience": data["profile"].experience
        } if data["profile"] else None
    }