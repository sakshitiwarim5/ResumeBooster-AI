import uuid
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database import get_db
from models.resume import ResumeAnalysis
from services.report_service import generate_pdf_report

router = APIRouter()


@router.get("/download-report/{analysis_id}")
async def download_report(
    analysis_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Generate and download a PDF report for a completed analysis (premium required)."""
    try:
        uid = uuid.UUID(analysis_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid analysis ID format.")

    result = await db.execute(
        select(ResumeAnalysis).where(ResumeAnalysis.id == uid)
    )
    analysis = result.scalar_one_or_none()

    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found.")

    if not analysis.is_premium_unlocked:
        raise HTTPException(
            status_code=403,
            detail="Premium required. Please unlock the full report first."
        )

    pdf_bytes = generate_pdf_report(analysis)

    safe_filename = f"ResumeBooster_Report_{analysis_id[:8]}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{safe_filename}"',
            "Content-Length": str(len(pdf_bytes)),
        },
    )
