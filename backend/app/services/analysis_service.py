from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.analysis import AnalysisResult, FeedbackItem
from app.models.resume import ExtractedProfile


def get_result_by_id(db: Session, result_id: str, user_id: str) -> AnalysisResult:
    """
    Retrieves an analysis result by ID.
    Enforces per-user isolation — a user can only access their own results.
    """
    result = db.query(AnalysisResult).filter(
        AnalysisResult.resultID == result_id
    ).first()

    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Result not found")

    # Verify ownership via resume → user link
    from app.models.resume import Resume
    resume = db.query(Resume).filter(Resume.resumeID == result.resumeID).first()
    if not resume or resume.userID != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    return result


def get_feedback_by_id(db: Session, feedback_id: str, user_id: str) -> FeedbackItem:
    """
    Retrieves feedback by ID.
    Validates ownership by tracing feedback → result → resume → user.
    """
    feedback = db.query(FeedbackItem).filter(
        FeedbackItem.feedbackID == feedback_id
    ).first()

    if not feedback:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Feedback not found")

    # Ownership check via result
    result = db.query(AnalysisResult).filter(
        AnalysisResult.resultID == feedback.resultID
    ).first()

    from app.models.resume import Resume
    resume = db.query(Resume).filter(Resume.resumeID == result.resumeID).first()
    if not resume or resume.userID != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    return feedback


def get_full_result(db: Session, result_id: str, user_id: str) -> dict:
    """
    Returns combined result + feedback + extracted profile for the dashboard.
    """
    result = get_result_by_id(db, result_id, user_id)
    feedback = db.query(FeedbackItem).filter(
        FeedbackItem.resultID == result_id
    ).first()
    profile = db.query(ExtractedProfile).filter(
        ExtractedProfile.resumeID == result.resumeID
    ).first()

    return {
        "result": result,
        "feedback": feedback,
        "profile": profile
    }