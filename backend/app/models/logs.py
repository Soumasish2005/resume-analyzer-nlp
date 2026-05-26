import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Integer, Float, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.db.database import Base

class ErrorLog(Base):
    __tablename__ = "error_logs"

    logID: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    level: Mapped[str] = mapped_column(String(20), nullable=False)     # "ERROR", "WARNING", "CRITICAL"
    message: Mapped[str] = mapped_column(Text, nullable=False)
    stackTrace: Mapped[str] = mapped_column(Text, nullable=True)
    retentionDays: Mapped[int] = mapped_column(Integer, default=180)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class SystemLog(Base):
    __tablename__ = "system_logs"

    logID: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    metricType: Mapped[str] = mapped_column(String(50), nullable=False)  # "cpu", "memory", "latency", "nlp_time"
    value: Mapped[float] = mapped_column(Float, nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    retentionDays: Mapped[int] = mapped_column(Integer, default=90)