import os
import hmac
import hashlib
import uuid
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import razorpay
from dotenv import load_dotenv

from database import get_db
from models.resume import ResumeAnalysis

load_dotenv()

router = APIRouter()

RAZORPAY_KEY_ID     = os.getenv("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")
PREMIUM_AMOUNT_PAISE = 14900  # ₹149 in paise

razorpay_client = razorpay.Client(
    auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
)


class CreateOrderRequest(BaseModel):
    analysis_id: str


class VerifyPaymentRequest(BaseModel):
    analysis_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


@router.post("/payment/create-order")
async def create_order(
    body: CreateOrderRequest,
    db: AsyncSession = Depends(get_db),
):
    """Create a Razorpay order for premium unlock."""
    result = await db.execute(
        select(ResumeAnalysis).where(
            ResumeAnalysis.id == uuid.UUID(body.analysis_id)
        )
    )
    analysis = result.scalar_one_or_none()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found.")
    if analysis.is_premium_unlocked:
        raise HTTPException(status_code=400, detail="Premium already unlocked.")

    try:
        order = razorpay_client.order.create({
            "amount": PREMIUM_AMOUNT_PAISE,
            "currency": "INR",
            "receipt": f"receipt_{body.analysis_id[:8]}",
            "notes": {"analysis_id": body.analysis_id},
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Razorpay error: {str(e)}")

    # Store order_id against this analysis
    analysis.order_id = order["id"]
    await db.commit()

    return {
        "order_id": order["id"],
        "amount": PREMIUM_AMOUNT_PAISE,
        "currency": "INR",
        "key_id": RAZORPAY_KEY_ID,
    }


@router.post("/payment/verify")
async def verify_payment(
    body: VerifyPaymentRequest,
    db: AsyncSession = Depends(get_db),
):
    """Verify Razorpay payment signature and unlock premium."""
    # HMAC verification
    message = f"{body.razorpay_order_id}|{body.razorpay_payment_id}"
    expected_sig = hmac.new(
        RAZORPAY_KEY_SECRET.encode(),
        message.encode(),
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(expected_sig, body.razorpay_signature):
        raise HTTPException(status_code=400, detail="Payment signature verification failed.")

    result = await db.execute(
        select(ResumeAnalysis).where(
            ResumeAnalysis.id == uuid.UUID(body.analysis_id)
        )
    )
    analysis = result.scalar_one_or_none()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found.")

    analysis.is_premium_unlocked = True
    analysis.payment_id = body.razorpay_payment_id
    await db.commit()
    await db.refresh(analysis)

    return {"success": True, "message": "Premium unlocked successfully.", "data": analysis.to_dict()}
