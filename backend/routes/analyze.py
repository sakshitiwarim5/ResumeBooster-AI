from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models.resume import ResumeAnalysis
from services.pdf_service import extract_text_from_pdf, validate_pdf
from services.ai_service import analyze_resume

router = APIRouter()


@router.post("/analyze")
async def analyze_resume_endpoint(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    """
    Upload a PDF resume and receive AI-powered analysis.
    Returns score, ATS score, missing keywords, suggestions, and interview questions.
    """
    # 1. Validate file
    validate_pdf(file)

    # 2. Extract text
    resume_text = await extract_text_from_pdf(file)

    # 3. Analyse with OpenAI
    analysis_result = await analyze_resume(resume_text)

    # 4. Persist to database
    record = ResumeAnalysis(
        filename=file.filename,
        raw_text=resume_text,
        score=analysis_result["score"],
        ats_score=analysis_result["ats_score"],
        missing_keywords=analysis_result["missing_keywords"],
        suggestions=analysis_result["suggestions"],
        interview_questions=analysis_result["interview_questions"],
        is_premium_unlocked=True,
    )
    db.add(record)
    await db.commit()
    await db.refresh(record)

    return {
        "id": str(record.id),
        **analysis_result,
        "filename": file.filename,
        "is_premium_unlocked": True,
    }
