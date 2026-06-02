import os
import uuid
import json
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.resume import Resume, ExtractedProfile
from app.models.job import JobDescription
from app.core.config import settings

# NLP & Intelligence imports
from app.core.parser import extract_text
from app.core.cleaner import clean_text
from app.core.nlp_engine import extract_entities, extract_keywords, add_jd_entity_ruler
from app.core.scorer import compute_match_score, get_matched_keywords
from app.core.gap_analyzer import find_keyword_gaps
from app.core.feedback import generate_feedback
from app.core.project_analyzer import infer_skills_from_projects
from app.core.llm_reviewer import get_recruiter_review
from app.core.logger import logger


# ── File storage ──────────────────────────────────────────────────────────────

def save_temp_file(file_bytes: bytes, filename: str) -> str:
    """Saves uploaded file to temp_uploads/ and returns its path."""
    os.makedirs(settings.TEMP_UPLOAD_DIR, exist_ok=True)
    unique_name = f"{uuid.uuid4()}_{filename}"
    path = os.path.join(settings.TEMP_UPLOAD_DIR, unique_name)
    with open(path, "wb") as f:
        f.write(file_bytes)
    return path

def delete_temp_file(path: str) -> None:
    """Deletes the temp file after analysis."""
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
    Orchestrates the full multi-layer analysis pipeline.
    """
    from app.models.analysis import AnalysisResult, FeedbackItem

    temp_path = None

    try:
        # Step 1 — Parse (Two-pass structural parsing)
        logger.info(f"Starting analysis for user {user_id}. Step 1: Parsing.")
        sections = extract_text(file_bytes, file_ext)
        full_raw_text = "\n".join(sections.values())

        # Step 2 — Project Analysis (LLM Inferred Skills)
        # We enrich the 'skills' section or a virtual collection with LLM insights
        inferred_skills = infer_skills_from_projects(sections.get("projects", ""))
        
        # Step 3 — Tune NLP engine with JD context
        add_jd_entity_ruler(jd_text)

        # Step 4 — NER & Profile Extraction
        logger.info("Step 4: Extracting entities via Gemini.")
        entities = extract_entities(sections)
        # Add inferred skills to the entity profile with type safety
        if inferred_skills:
            existing_skills = entities.get("skills", [])
            # Combine and force to string to prevent unhashable dict errors
            combined = [str(s) for s in (existing_skills + inferred_skills)]
            entities["skills"] = list(set(combined))

        # Step 5 — Clean & Keywords
        clean_resume = clean_text(full_raw_text)
        clean_jd = clean_text(jd_text)
        resume_keywords = extract_keywords(clean_resume)
        jd_keywords = extract_keywords(clean_jd)

        # Step 6 — Section-level Semantic Scoring (BGE)
        logger.info("Step 6: Computing semantic match scores.")
        score_data = compute_match_score(sections, jd_text)
        final_score = score_data["final_score"]
        breakdown = score_data["breakdown"]

        # Step 7 — LLM Recruiter Review
        logger.info(f"Running LLM Recruiter Review for user {user_id}")
        llm_review = get_recruiter_review(sections, jd_text, breakdown)

        # Step 8 — Ontology-aware Gap Analysis
        # We pass full keywords including inferred ones
        gaps = find_keyword_gaps(resume_keywords + inferred_skills, jd_keywords)
        matched = get_matched_keywords(resume_keywords + inferred_skills, jd_keywords)

        # Step 9 — Generate Explainable Feedback
        feedback_data = generate_feedback(
            final_score, gaps, matched, entities, 
            breakdown=breakdown, llm_review=llm_review
        )

        # Step 10 — Persist Data
        temp_path = save_temp_file(file_bytes, f"resume.{file_ext}")
        resume = create_resume_record(db, user_id, file_ext, temp_path)

        # Profile
        profile = ExtractedProfile(
            profileID=str(uuid.uuid4()),
            resumeID=resume.resumeID,
            candidateName=entities.get("name"),
            email=entities.get("email"),
            phone=entities.get("phone"),
            linkedin=entities.get("linkedin"),
            skills=entities.get("skills", []),
            education=entities.get("education", []),
            experience=entities.get("experience", [])
        )
        db.add(profile)

        # JD
        jd = create_jd_record(db, user_id, jd_text)

        # Analysis Result
        result = AnalysisResult(
            resultID=str(uuid.uuid4()),
            resumeID=resume.resumeID,
            jdID=jd.jdID,
            finalScore=final_score,
            skillsScore=breakdown.get("skills_score"),
            experienceScore=breakdown.get("experience_score"),
            projectsScore=breakdown.get("projects_score"),
            educationScore=breakdown.get("education_score"),
            matchedKeywords=matched
        )
        db.add(result)
        db.flush()

        # Feedback
        feedback = FeedbackItem(
            feedbackID=str(uuid.uuid4()),
            resultID=result.resultID,
            missingKeywords=[g["keyword"] for g in gaps if g["confidence"] > 0.7],
            suggestions=feedback_data["suggestions"],
            highlightedSections=feedback_data["highlighted_sections"],
            scoreBreakdown=breakdown,
            llmReview=llm_review
        )
        db.add(feedback)
        db.commit()
        logger.info(f"Analysis pipeline complete for result {result.resultID}.")

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        print(f"PIPELINE ERROR: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis pipeline failed: {str(e)}"
        )
    finally:
        delete_temp_file(temp_path)
        if temp_path:
            db.query(Resume).filter(Resume.rawFilePath == temp_path).update({"rawFilePath": None})
            db.commit()

    return {
        "result_id": result.resultID,
        "feedback_id": feedback.feedbackID,
        "score": final_score,
        "breakdown": breakdown,
        "recruiter_review": llm_review
    }