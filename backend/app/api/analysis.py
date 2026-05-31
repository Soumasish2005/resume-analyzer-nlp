from fastapi import APIRouter, Depends, UploadFile, File, Form, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.security.dependencies import get_current_user
from app.security.validators import validate_resume_file, validate_file_size, validate_job_description
from app.services.resume_service import run_analysis_pipeline
from app.services.analysis_service import get_result_by_id, get_full_result
from app.schemas.analysis import AnalysisResultResponse, FullResultResponse

router = APIRouter()


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
    # Client-side validation mirrors (server enforces regardless)
    validate_resume_file(resume)
    validate_job_description(job_description)

    file_bytes = await resume.read()
    validate_file_size(file_bytes)

    file_ext = resume.filename.rsplit(".", 1)[-1].lower()

    outcome = run_analysis_pipeline(
        db=db,
        file_bytes=file_bytes,
        file_ext=file_ext,
        jd_text=job_description,
        user_id=current_user.userID
    )

    return {
        "message": "Analysis complete",
        "result_id": outcome["result_id"],
        "feedback_id": outcome["feedback_id"],
        "score": outcome["score"]
    }


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