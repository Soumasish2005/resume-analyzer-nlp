import uuid
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.job import JobDescription, MatchedJobs
from app.models.resume import Resume, ExtractedProfile
from app.models.analysis import AnalysisResult
from app.models.user import User
from app.core.cleaner import clean_text
from app.core.nlp_engine import extract_keywords
from app.core.scorer import compute_match_score, get_matched_keywords


def post_job(db: Session, jd_text: str, recruiter_id: str) -> JobDescription:
    """
    Saves a job description posted by a recruiter.
    Immediately computes match scores against all existing seeker resumes.
    """
    jd = JobDescription(
        jdID=str(uuid.uuid4()),
        rawText=jd_text,
        postedBy=recruiter_id
    )
    db.add(jd)
    db.commit()
    db.refresh(jd)

    # Compute and cache match scores for all existing seekers
    _compute_matches_for_job(db, jd)

    return jd


def _compute_matches_for_job(db: Session, jd: JobDescription) -> None:
    """
    Runs match scoring between a newly posted JD and all
    existing seeker analysis results. Saves MatchedJobs records.
    """
    clean_jd = clean_text(jd.rawText)
    jd_keywords = extract_keywords(clean_jd)

    # Get all analysis results for job seekers
    seeker_results = (
        db.query(AnalysisResult, Resume)
        .join(Resume, AnalysisResult.resumeID == Resume.resumeID)
        .join(User, Resume.userID == User.userID)
        .filter(User.role == "seeker")
        .all()
    )

    for result, resume in seeker_results:
        resume_keywords = result.matchedKeywords or []
        score = compute_match_score(clean_jd, " ".join(resume_keywords))

        match = MatchedJobs(
            matchID=str(uuid.uuid4()),
            userID=resume.userID,
            jobID=jd.jdID,
            matchScore=score
        )
        db.add(match)

    db.commit()


def get_matched_candidates(db: Session, jd_id: str, recruiter_id: str) -> list[dict]:
    """
    Returns candidates ranked by match score for a given job posting.
    Only accessible by the recruiter who posted the job.
    """
    jd = db.query(JobDescription).filter(JobDescription.jdID == jd_id).first()
    if not jd:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    if jd.postedBy != recruiter_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    matches = (
        db.query(MatchedJobs)
        .filter(MatchedJobs.jobID == jd_id)
        .order_by(MatchedJobs.matchScore.desc())
        .all()
    )

    results = []
    for match in matches:
        profile = (
            db.query(ExtractedProfile)
            .join(Resume, ExtractedProfile.resumeID == Resume.resumeID)
            .filter(Resume.userID == match.userID)
            .first()
        )
        analysis = (
            db.query(AnalysisResult)
            .join(Resume, AnalysisResult.resumeID == Resume.resumeID)
            .filter(Resume.userID == match.userID)
            .order_by(AnalysisResult.timestamp.desc())
            .first()
        )
        results.append({
            "matchID": match.matchID,
            "userID": match.userID,
            "candidateName": profile.candidateName if profile else None,
            "matchScore": match.matchScore,
            "matchedKeywords": analysis.matchedKeywords if analysis else [],
            "computedAt": match.computedAt
        })

    return results


def get_matched_jobs(db: Session, user_id: str) -> list[dict]:
    """
    Returns jobs ranked by match score for a given job seeker.
    """
    matches = (
        db.query(MatchedJobs)
        .filter(MatchedJobs.userID == user_id)
        .order_by(MatchedJobs.matchScore.desc())
        .all()
    )

    results = []
    for match in matches:
        jd = db.query(JobDescription).filter(JobDescription.jdID == match.jobID).first()
        if jd:
            results.append({
                "matchID": match.matchID,
                "jobID": match.jobID,
                "jobSnippet": jd.rawText[:200],
                "matchScore": match.matchScore,
                "computedAt": match.computedAt
            })

    return results