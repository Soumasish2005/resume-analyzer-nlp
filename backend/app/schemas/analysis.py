from pydantic import BaseModel
from datetime import datetime

# ── Request schemas ───────────────────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    resume_id: str
    jd_id: str

# ── Response schemas ──────────────────────────────────────────────────────────

class AnalysisResultResponse(BaseModel):
    resultID: str
    resumeID: str
    jdID: str
    finalScore: float           # 0.0 to 1.0
    matchedKeywords: list[str]
    timestamp: datetime

    class Config:
        from_attributes = True

class FeedbackResponse(BaseModel):
    feedbackID: str
    resultID: str
    missingKeywords: list[str]
    suggestions: list[str]
    highlightedSections: list[str]

    class Config:
        from_attributes = True

class FullResultResponse(BaseModel):
    """
    Combined response returned to the Results Dashboard —
    score + extracted profile + feedback all in one payload.
    """
    result: AnalysisResultResponse
    feedback: FeedbackResponse