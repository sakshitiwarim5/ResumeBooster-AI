import re
import fitz  # PyMuPDF
from fastapi import UploadFile, HTTPException
import io


MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


def validate_pdf(file: UploadFile) -> None:
    """Validate that the uploaded file is a PDF and within size limits."""
    if file.content_type not in ("application/pdf", "application/x-pdf"):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only PDF files are accepted."
        )


async def extract_text_from_pdf(file: UploadFile) -> str:
    """Read upload, validate size, extract and clean text from PDF bytes."""
    contents = await file.read()

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="File size exceeds 5 MB limit."
        )

    try:
        pdf_doc = fitz.open(stream=contents, filetype="pdf")
        text_parts = []
        for page in pdf_doc:
            text_parts.append(page.get_text("text"))
        pdf_doc.close()
        raw_text = "\n".join(text_parts)
    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"Could not parse PDF: {str(e)}"
        )

    return clean_text(raw_text)


def clean_text(text: str) -> str:
    """Clean extracted PDF text for AI analysis."""
    # Remove excessive whitespace / newlines
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r'[ \t]{2,}', ' ', text)
    # Remove non-printable characters
    text = re.sub(r'[^\x20-\x7E\n]', ' ', text)
    # Strip leading/trailing whitespace
    text = text.strip()
    # Truncate to ~4000 words to stay within token limits
    words = text.split()
    if len(words) > 4000:
        text = " ".join(words[:4000])
    return text
