import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Boolean, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    userID: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    passwordHash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(Enum("seeker", "recruiter", name="user_role"), nullable=False)
    createdAt: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    sessions: Mapped[list["Session"]] = relationship("Session", back_populates="user")
    resumes: Mapped[list["Resume"]] = relationship("Resume", back_populates="user")


class Session(Base):
    __tablename__ = "sessions"

    sessionID: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    userID: Mapped[str] = mapped_column(String, ForeignKey("users.userID"), nullable=False)  # ← fixed
    jwtToken: Mapped[str] = mapped_column(String(512), nullable=False)
    expiresAt: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    isActive: Mapped[bool] = mapped_column(Boolean, default=True)

    user: Mapped["User"] = relationship("User", back_populates="sessions")