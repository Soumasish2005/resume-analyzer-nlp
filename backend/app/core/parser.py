import fitz  # PyMuPDF
from docx import Document
from fastapi import HTTPException, status

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extracts plain text from a PDF file given its raw bytes.
    Handles corrupted or unreadable PDFs gracefully.
    """
    try:
        pdf = fitz.open(stream=file_bytes, filetype="pdf")
        if pdf.is_encrypted:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password-protected PDFs are not supported. Please unlock the file first."
            )
        text = ""
        for page in pdf:
            text += page.get_text()
        pdf.close()
        if not text.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No readable text found in the PDF. The file may be scanned or image-based."
            )
        return text
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to parse PDF: {str(e)}"
        )


def extract_text_from_docx(file_bytes: bytes) -> str:
    """
    Extracts plain text from a DOCX file given its raw bytes.
    """
    try:
        import io
        doc = Document(io.BytesIO(file_bytes))
        text = "\n".join([para.text for para in doc.paragraphs])
        if not text.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No readable text found in the DOCX file."
            )
        return text
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to parse DOCX: {str(e)}"
        )


def extract_text(file_bytes: bytes, file_ext: str) -> str:
    """
    Unified entry point — routes to the correct parser based on extension.
    file_ext should be 'pdf' or 'docx' (lowercase, no dot).
    """
    if file_ext == "pdf":
        return extract_text_from_pdf(file_bytes)
    elif file_ext == "docx":
        return extract_text_from_docx(file_bytes)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type: {file_ext}"
        )