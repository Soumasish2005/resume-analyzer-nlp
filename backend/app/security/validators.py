from fastapi import HTTPException, status, UploadFile
from app.core.config import settings

ALLOWED_EXTENSIONS = {"pdf", "docx"}
ALLOWED_MIME_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
}

def validate_resume_file(file: UploadFile) -> None:
    """
    Validates uploaded resume file for:
    - Correct extension (pdf / docx)
    - Correct MIME content-type
    - File size within limit
    Raises HTTP 400 on any violation.
    """
    # Extension check
    filename = file.filename or ""
    ext = filename.rsplit(".", 1)[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type '{ext}'. Only PDF and DOCX are accepted."
        )

    # MIME type check (prevents disguised uploads)
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid content type '{file.content_type}'. Upload a valid PDF or DOCX file."
        )

def validate_file_size(file_bytes: bytes) -> None:
    """
    Call after reading file bytes to enforce size limit.
    """
    max_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    if len(file_bytes) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds the {settings.MAX_FILE_SIZE_MB}MB size limit."
        )

def validate_job_description(text: str) -> None:
    """
    Ensures job description is not empty before triggering analysis.
    """
    if not text or not text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description cannot be empty."
        )