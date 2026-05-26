from pydantic import BaseModel
from datetime import datetime

# ── Request schemas ───────────────────────────────────────────────────────────

class PostJobRequest(BaseModel):
    job_description: str

# ── Response schemas ──────────────────────────────────────────────────────────

class JobPostResponse(BaseModel):
    jdID: str
    postedBy: str
    createdAt: datetime
    message: str

    class Config:
        from_attributes = True

class MatchedCandidateResponse(BaseModel):
    """
    One entry in the ranked candidate list shown to a recruiter.
    """
    matchID: str
    userID: str
    candidateName: str | None
    matchScore: float
    matchedKeywords: list[str]
    computedAt: datetime

class MatchedJobResponse(BaseModel):
    """
    One entry in the ranked job list shown to a job seeker.
    """
    matchID: str
    jobID: str
    jobSnippet: str             # first 200 chars of the JD for preview
    matchScore: float
    computedAt: datetime

class RankedCandidatesResponse(BaseModel):
    jdID: str
    totalMatches: int
    candidates: list[MatchedCandidateResponse]

class RankedJobsResponse(BaseModel):
    totalMatches: int
    jobs: list[MatchedJobResponse]