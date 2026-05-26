import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Float, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base

class JobDescription(Base):
    __tablename__ = "job_descriptions"

    jdID: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    rawText: Mapped[str] = mapped_column(Text, nullable=False)
    postedBy: Mapped[str] = mapped_column(String, ForeignKey("users.userID"), nullable=False)
    createdAt: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    analysis_results: Mapped[list["AnalysisResult"]] = relationship("AnalysisResult", back_populates="job")


class MatchedJobs(Base):
    __tablename__ = "matched_jobs"

    matchID: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    userID: Mapped[str] = mapped_column(String, ForeignKey("users.userID"), nullable=False)
    jobID: Mapped[str] = mapped_column(String, ForeignKey("job_descriptions.jdID"), nullable=False)
    matchScore: Mapped[float] = mapped_column(Float, nullable=False)
    computedAt: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)