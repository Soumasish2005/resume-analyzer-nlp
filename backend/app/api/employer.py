from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.security.dependencies import get_current_user, require_role
from app.schemas.employer import PostJobRequest, RankedCandidatesResponse, RankedJobsResponse
from app.services.employer_service import (
    post_job, get_matched_candidates, get_matched_jobs
)

router = APIRouter()


# ── POST /api/v1/emp/postJob ──────────────────────────────────────────────────
# Recruiter only — posts a job description and triggers candidate matching.

@router.post("/postJob", status_code=status.HTTP_201_CREATED)
def post_job_route(
    payload: PostJobRequest,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    jd = post_job(db, payload.job_description, current_user.userID)
    return {
        "message": "Job posted successfully. Candidate matching is complete.",
        "jdID": jd.jdID,
        "postedBy": jd.postedBy,
        "createdAt": jd.createdAt
    }


# ── GET /api/v1/emp/seeMatched (recruiter view) ───────────────────────────────
# Returns candidates ranked by match score for a given job posting.

@router.get("/seeMatched/candidates")
def see_matched_candidates(
    jd_id: str,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    candidates = get_matched_candidates(db, jd_id, current_user.userID)
    return {
        "jdID": jd_id,
        "totalMatches": len(candidates),
        "candidates": candidates
    }


# ── GET /api/v1/emp/seeMatched (seeker view) ──────────────────────────────────
# Returns jobs ranked by match score for the authenticated job seeker.

@router.get("/seeMatched/jobs")
def see_matched_jobs(
    current_user: User = Depends(require_role("seeker")),
    db: Session = Depends(get_db)
):
    jobs = get_matched_jobs(db, current_user.userID)
    return {
        "totalMatches": len(jobs),
        "jobs": jobs
    }