import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Float, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base

class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    resultID: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    resumeID: Mapped[str] = mapped_column(String, ForeignKey("resumes.resumeID"), nullable=False)
    jdID: Mapped[str] = mapped_column(String, ForeignKey("job_descriptions.jdID"), nullable=False)
    finalScore: Mapped[float] = mapped_column(Float, nullable=False)
    
    # New component scores
    skillsScore: Mapped[float] = mapped_column(Float, nullable=True)
    experienceScore: Mapped[float] = mapped_column(Float, nullable=True)
    projectsScore: Mapped[float] = mapped_column(Float, nullable=True)
    educationScore: Mapped[float] = mapped_column(Float, nullable=True)
    
    matchedKeywords: Mapped[list] = mapped_column(JSON, default=list)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    job: Mapped["JobDescription"] = relationship("JobDescription", back_populates="analysis_results")
    feedback: Mapped["FeedbackItem"] = relationship("FeedbackItem", back_populates="result", uselist=False)


class FeedbackItem(Base):
    __tablename__ = "feedback_items"

    feedbackID: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    resultID: Mapped[str] = mapped_column(String, ForeignKey("analysis_results.resultID"), nullable=False, unique=True)
    missingKeywords: Mapped[list] = mapped_column(JSON, default=list)
    suggestions: Mapped[list] = mapped_column(JSON, default=list)
    highlightedSections: Mapped[list] = mapped_column(JSON, default=list)
    
    # New detailed breakdown and LLM review
    scoreBreakdown: Mapped[dict] = mapped_column(JSON, nullable=True)
    llmReview: Mapped[dict] = mapped_column(JSON, nullable=True)

    result: Mapped["AnalysisResult"] = relationship("AnalysisResult", back_populates="feedback")