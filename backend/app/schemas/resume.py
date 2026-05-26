from pydantic import BaseModel
from datetime import datetime

# ── Request schemas ───────────────────────────────────────────────────────────

class UploadRequest(BaseModel):
    job_description: str  # pasted JD text from the user

# ── Response schemas ──────────────────────────────────────────────────────────

class ExtractedProfileResponse(BaseModel):
    profileID: str
    candidateName: str | None
    email: str | None
    phone: str | None
    skills: list[str]
    education: list[dict]
    experience: list[dict]

    class Config:
        from_attributes = True

class ResumeUploadResponse(BaseModel):
    resumeID: str
    fileType: str
    uploadedAt: datetime
    message: str

    class Config:
        from_attributes = True