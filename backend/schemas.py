"""
Pydantic v2 schemas for request validation and response serialisation.
Keeping these separate from SQLAlchemy models keeps the layers clean.
"""
from __future__ import annotations

from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field, ConfigDict


# ── Analysis ──────────────────────────────────────────────────
class AnalysisResponse(BaseModel):
    id: UUID
    filename: str
    score: int = Field(..., ge=0, le=100)
    ats_score: int = Field(..., ge=0, le=100)
    missing_keywords: List[str] = []
    suggestions: List[str] = []
    interview_questions: List[str] = []
    is_premium_unlocked: bool = False
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# ── Payment ───────────────────────────────────────────────────
class CreateOrderRequest(BaseModel):
    analysis_id: UUID


class CreateOrderResponse(BaseModel):
    order_id: str
    amount: int
    currency: str = "INR"
    key_id: str


class VerifyPaymentRequest(BaseModel):
    analysis_id: UUID
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class VerifyPaymentResponse(BaseModel):
    success: bool
    message: str
    data: AnalysisResponse


# ── Health ────────────────────────────────────────────────────
class HealthResponse(BaseModel):
    status: str
    service: str
