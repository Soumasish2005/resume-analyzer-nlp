import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base

class Resume(Base):
    __tablename__ = "resumes"

    resumeID: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    userID: Mapped[str] = mapped_column(String, ForeignKey("users.userID"), nullable=False)
    fileType: Mapped[str] = mapped_column(String(10), nullable=False)       # "pdf" or "docx"
    rawFilePath: Mapped[str] = mapped_column(String(512), nullable=True)    # temp path, deleted post-analysis
    uploadedAt: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship("User", back_populates="resumes")
    profile: Mapped["ExtractedProfile"] = relationship("ExtractedProfile", back_populates="resume", uselist=False)


class ExtractedProfile(Base):
    __tablename__ = "extracted_profiles"

    profileID: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    resumeID: Mapped[str] = mapped_column(String, ForeignKey("resumes.resumeID"), nullable=False, unique=True)
    candidateName: Mapped[str] = mapped_column(String(150), nullable=True)
    email: Mapped[str] = mapped_column(String(255), nullable=True)
    phone: Mapped[str] = mapped_column(String(20), nullable=True)
    linkedin: Mapped[str] = mapped_column(String(255), nullable=True)
    skills: Mapped[list] = mapped_column(JSON, default=list)          # ["Python", "SQL", ...]
    education: Mapped[list] = mapped_column(JSON, default=list)        # [{"degree": ..., "institute": ...}]
    experience: Mapped[list] = mapped_column(JSON, default=list)       # [{"title": ..., "company": ..., "years": ...}]

    resume: Mapped["Resume"] = relationship("Resume", back_populates="profile")