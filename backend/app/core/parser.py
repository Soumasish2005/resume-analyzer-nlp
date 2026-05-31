import fitz  # PyMuPDF
import io
from docx import Document
from fastapi import HTTPException, status


# ── PDF extraction ────────────────────────────────────────────────────────────

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extracts text from PDF using a multi-strategy approach:
    1. Block-based extraction sorted by position (handles multi-column layouts)
    2. Falls back to raw text extraction if blocks yield too little
    3. Tries pdfminer as final fallback for complex/tagged PDFs
    """
    try:
        pdf = fitz.open(stream=file_bytes, filetype="pdf")

        if pdf.is_encrypted:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password-protected PDFs are not supported. Please unlock the file first."
            )

        # Strategy 1 — block-based sorted extraction
        text = _extract_blocks_sorted(pdf)

        # Strategy 2 — fallback to raw if blocks gave too little
        if len(text.strip()) < 100:
            text = _extract_raw(pdf)

        pdf.close()

        # Strategy 3 — pdfminer fallback for complex layouts
        if len(text.strip()) < 100:
            text = _extract_with_pdfminer(file_bytes)

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


def _extract_blocks_sorted(pdf) -> str:
    """
    Extracts text blocks from each page and sorts them by vertical
    then horizontal position. This correctly handles two-column
    resume layouts that confuse simple top-to-bottom extraction.
    """
    full_text = []

    for page in pdf:
        # Get all text blocks: (x0, y0, x1, y1, text, block_no, block_type)
        blocks = page.get_text("blocks")

        # Filter to text blocks only (block_type == 0), skip image blocks
        text_blocks = [b for b in blocks if b[6] == 0]

        # Sort: top to bottom (y0), then left to right (x0)
        text_blocks.sort(key=lambda b: (round(b[1] / 20), b[0]))

        page_text = "\n".join(b[4].strip() for b in text_blocks if b[4].strip())
        full_text.append(page_text)

    return "\n\n".join(full_text)


def _extract_raw(pdf) -> str:
    """Simple fallback — extracts all text per page without sorting."""
    return "\n".join(page.get_text() for page in pdf)


def _extract_with_pdfminer(file_bytes: bytes) -> str:
    """
    pdfminer.six fallback for tagged or complex PDFs that PyMuPDF struggles with.
    Only called when both block and raw strategies yield < 100 chars.
    """
    try:
        from pdfminer.high_level import extract_text as pdfminer_extract
        return pdfminer_extract(io.BytesIO(file_bytes))
    except ImportError:
        return ""
    except Exception:
        return ""


# ── DOCX extraction ───────────────────────────────────────────────────────────

def extract_text_from_docx(file_bytes: bytes) -> str:
    """
    Extracts text from DOCX including:
    - Regular paragraphs
    - Tables (common in resume layouts)
    - Text boxes via XML fallback
    """
    try:
        doc = Document(io.BytesIO(file_bytes))
        parts = []

        # Paragraphs
        for para in doc.paragraphs:
            if para.text.strip():
                parts.append(para.text.strip())

        # Tables — many resume templates use tables for layout
        for table in doc.tables:
            for row in table.rows:
                row_text = " | ".join(
                    cell.text.strip() for cell in row.cells if cell.text.strip()
                )
                if row_text:
                    parts.append(row_text)

        text = "\n".join(parts)

        # Fallback: extract raw XML text if normal extraction yields too little
        if len(text.strip()) < 100:
            text = _extract_docx_xml_fallback(doc)

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


def _extract_docx_xml_fallback(doc) -> str:
    """
    Extracts all raw text from DOCX XML body.
    Catches text inside shapes, text boxes, and custom XML elements
    that python-docx's paragraph/table API misses.
    """
    from docx.oxml.ns import qn
    body = doc.element.body
    texts = [node.text for node in body.iter() if node.text and node.text.strip()]
    return "\n".join(texts)


# ── Unified entry point ───────────────────────────────────────────────────────

def extract_text(file_bytes: bytes, file_ext: str) -> str:
    """
    Routes to the correct parser based on file extension.
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