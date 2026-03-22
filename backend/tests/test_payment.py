"""
Tests for the payment routes (mocked Razorpay).
"""
import hashlib
import hmac
import uuid
from unittest.mock import patch, MagicMock

import pytest

from models.resume import ResumeAnalysis


async def _create_analysis(db):
    """Helper: insert a ResumeAnalysis row and return it."""
    record = ResumeAnalysis(
        filename="test.pdf",
        raw_text="sample text",
        score=72,
        ats_score=60,
        missing_keywords=["Docker"],
        suggestions=["Add metrics"],
        interview_questions=["Tell me about yourself"],
    )
    db.add(record)
    await db.commit()
    await db.refresh(record)
    return record


@pytest.mark.asyncio
async def test_create_order_success(client, setup_test_db):
    # We need to insert a record directly — use the test session via fixture
    from tests.conftest import TestSessionLocal
    async with TestSessionLocal() as db:
        record = await _create_analysis(db)
        analysis_id = str(record.id)

    mock_order = {"id": "order_test123", "amount": 14900, "currency": "INR"}

    with patch("routes.payment.razorpay_client") as mock_rzp:
        mock_rzp.order.create.return_value = mock_order
        response = await client.post(
            "/api/payment/create-order",
            json={"analysis_id": analysis_id},
        )

    assert response.status_code == 200
    data = response.json()
    assert data["order_id"] == "order_test123"
    assert data["amount"] == 14900


@pytest.mark.asyncio
async def test_create_order_not_found(client):
    response = await client.post(
        "/api/payment/create-order",
        json={"analysis_id": str(uuid.uuid4())},
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_verify_payment_invalid_signature(client, setup_test_db):
    from tests.conftest import TestSessionLocal
    async with TestSessionLocal() as db:
        record = await _create_analysis(db)
        analysis_id = str(record.id)

    response = await client.post(
        "/api/payment/verify",
        json={
            "analysis_id": analysis_id,
            "razorpay_order_id": "order_fake",
            "razorpay_payment_id": "pay_fake",
            "razorpay_signature": "badsignature",
        },
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_verify_payment_valid_signature(client, setup_test_db):
    from tests.conftest import TestSessionLocal
    import os

    secret = "test_secret"
    order_id = "order_test"
    payment_id = "pay_test"
    message = f"{order_id}|{payment_id}"
    sig = hmac.new(secret.encode(), message.encode(), hashlib.sha256).hexdigest()

    async with TestSessionLocal() as db:
        record = await _create_analysis(db)
        analysis_id = str(record.id)

    with patch("routes.payment.RAZORPAY_KEY_SECRET", secret):
        response = await client.post(
            "/api/payment/verify",
            json={
                "analysis_id": analysis_id,
                "razorpay_order_id": order_id,
                "razorpay_payment_id": payment_id,
                "razorpay_signature": sig,
            },
        )

    assert response.status_code == 200
    assert response.json()["success"] is True
    assert response.json()["data"]["is_premium_unlocked"] is True
