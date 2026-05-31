from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.security.dependencies import get_current_user
from app.services.analysis_service import get_feedback_by_id

router = APIRouter()


# ── GET /api/v1/feedback/{id} ─────────────────────────────────────────────────

@router.get("/feedback/{feedback_id}")
def get_feedback(
    feedback_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    feedback = get_feedback_by_id(db, feedback_id, current_user.userID)
    return {
        "feedbackID": feedback.feedbackID,
        "resultID": feedback.resultID,
        "missingKeywords": feedback.missingKeywords,
        "suggestions": feedback.suggestions,
        "highlightedSections": feedback.highlightedSections
    }