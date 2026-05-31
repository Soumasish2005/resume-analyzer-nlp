import traceback
import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.logs import ErrorLog, SystemLog


def log_error(db: Session, message: str, level: str = "ERROR", exc: Exception = None) -> None:
    """
    Persists an error or exception event to the error_logs table.
    Captures full stack trace when an exception is provided.
    """
    stack = traceback.format_exc() if exc else None
    entry = ErrorLog(
        logID=str(uuid.uuid4()),
        level=level,
        message=message,
        stackTrace=stack,
        retentionDays=180,
        timestamp=datetime.utcnow()
    )
    try:
        db.add(entry)
        db.commit()
    except Exception:
        db.rollback()


def log_metric(db: Session, metric_type: str, value: float) -> None:
    """
    Persists a system performance metric to the system_logs table.
    metric_type examples: 'cpu', 'memory', 'request_latency', 'nlp_processing_time'
    """
    entry = SystemLog(
        logID=str(uuid.uuid4()),
        metricType=metric_type,
        value=value,
        timestamp=datetime.utcnow(),
        retentionDays=90
    )
    try:
        db.add(entry)
        db.commit()
    except Exception:
        db.rollback()


def log_nlp_timing(db: Session, duration_seconds: float) -> None:
    """Convenience wrapper for logging NLP pipeline processing time."""
    log_metric(db, "nlp_processing_time", duration_seconds)


def log_request_latency(db: Session, duration_seconds: float) -> None:
    """Convenience wrapper for logging API request latency."""
    log_metric(db, "request_latency", duration_seconds)