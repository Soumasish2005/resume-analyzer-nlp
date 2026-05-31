import os
import uuid
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.resume import Resume, ExtractedProfile
from app.models.job import JobDescription
from app.core.config import settings

# NLP pipeline imports
from app.core.parser import extract_text
from app.core.cleaner import clean_text
from app.core.nlp_engine import extract_entities, extract_keywords
from app.core.scorer import compute_match_score, get_matched_keywords
from app.core.gap_analyzer import find_keyword_gaps
from app.core.feedback import generate_feedback


# ── File storage ──────────────────────────────────────────────────────────────

def save_temp_file(file_bytes: bytes, filename: str) -> str:
    """
    Saves uploaded file to temp_uploads/ and returns its path.
    File is deleted immediately after analysis completes.
    """
    os.makedirs(settings.TEMP_UPLOAD_DIR, exist_ok=True)
    unique_name = f"{uuid.uuid4()}_{filename}"
    path = os.path.join(settings.TEMP_UPLOAD_DIR, unique_name)
    with open(path, "wb") as f:
        f.write(file_bytes)
    return path

def delete_temp_file(path: str) -> None:
    """Deletes the temp file after analysis. Silently ignores missing files."""
    try:
        if path and os.path.exists(path):
            os.remove(path)
    except OSError:
        pass


# ── Resume record creation ────────────────────────────────────────────────────

def create_resume_record(db: Session, user_id: str, file_ext: str, temp_path: str) -> Resume:
    resume = Resume(
        resumeID=str(uuid.uuid4()),
        userID=user_id,
        fileType=file_ext,
        rawFilePath=temp_path
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume

def create_jd_record(db: Session, user_id: str, jd_text: str) -> JobDescription:
    jd = JobDescription(
        jdID=str(uuid.uuid4()),
        rawText=jd_text,
        postedBy=user_id
    )
    db.add(jd)
    db.commit()
    db.refresh(jd)
    return jd


# ── Full analysis pipeline ────────────────────────────────────────────────────

def run_analysis_pipeline(
    db: Session,
    file_bytes: bytes,
    file_ext: str,
    jd_text: str,
    user_id: str
) -> dict:
    """
    Orchestrates the full pipeline from raw file bytes to saved results.

    Steps:
      1. Parse raw text from PDF/DOCX
      2. Run NER on raw text (before cleaning strips contact info)
      3. Clean both resume and JD text
      4. Extract keywords from both
      5. Compute TF-IDF cosine similarity score
      6. Find matched and missing keywords
      7. Generate structured feedback
      8. Persist all results to DB
      9. Delete temp file

    Returns a dict with result_id and feedback_id for the API response.
    """
    from app.models.analysis import AnalysisResult, FeedbackItem

    temp_path = None

    try:
        # Step 1 — Parse
        raw_text = extract_text(file_bytes, file_ext)

        # Step 2 — NER on raw text
        entities = extract_entities(raw_text)

        # Step 3 — Clean
        clean_resume = clean_text(raw_text)
        clean_jd = clean_text(jd_text)

        # Step 4 — Keywords
        resume_keywords = extract_keywords(clean_resume)
        jd_keywords = extract_keywords(clean_jd)

        # Step 5 — Score
        score = compute_match_score(clean_resume, clean_jd)

        # Step 6 — Match + gap
        matched = get_matched_keywords(resume_keywords, jd_keywords)
        missing = find_keyword_gaps(resume_keywords, jd_keywords)

        # Step 7 — Feedback
        feedback_data = generate_feedback(score, missing, matched, entities)

        # Step 8 — Persist
        # Save resume record
        temp_path = save_temp_file(file_bytes, f"resume.{file_ext}")
        resume = create_resume_record(db, user_id, file_ext, temp_path)

        # Save extracted profile
        profile = ExtractedProfile(
            profileID=str(uuid.uuid4()),
            resumeID=resume.resumeID,
            candidateName=entities.get("name"),
            email=entities.get("email"),
            phone=entities.get("phone"),
            skills=entities.get("skills", []),
            education=entities.get("education", []),
            experience=entities.get("experience", [])
        )
        db.add(profile)

        # Save JD
        jd = create_jd_record(db, user_id, jd_text)

        # Save analysis result
        result = AnalysisResult(
            resultID=str(uuid.uuid4()),
            resumeID=resume.resumeID,
            jdID=jd.jdID,
            finalScore=score,
            matchedKeywords=matched
        )
        db.add(result)
        db.flush()  # get resultID before feedback insert

        # Save feedback
        feedback = FeedbackItem(
            feedbackID=str(uuid.uuid4()),
            resultID=result.resultID,
            missingKeywords=missing,
            suggestions=feedback_data["suggestions"],
            highlightedSections=feedback_data["highlighted_sections"]
        )
        db.add(feedback)
        db.commit()

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis pipeline failed: {str(e)}"
        )
    finally:
        # Step 9 — Always delete temp file regardless of success or failure
        delete_temp_file(temp_path)
        if temp_path:
            db.query(Resume).filter(Resume.rawFilePath == temp_path).update({"rawFilePath": None})
            db.commit()

    return {
        "result_id": result.resultID,
        "feedback_id": feedback.feedbackID,
        "score": score
    }