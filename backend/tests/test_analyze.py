"""
Tests for the /api/analyze endpoint and the supporting service layer.
Run with:  pytest tests/ -v
"""
import io
import json
from unittest.mock import AsyncMock, patch

import pytest
import pytest_asyncio

from services.pdf_service import clean_text, validate_pdf
from services.ai_service import _normalize_result
from fastapi import HTTPException


# ── pdf_service ───────────────────────────────────────────────
class TestCleanText:
    def test_strips_whitespace(self):
        raw = "  hello   world  \n\n\n  "
        assert clean_text(raw).startswith("hello")

    def test_truncates_to_4000_words(self):
        long_text = " ".join(["word"] * 5000)
        result = clean_text(long_text)
        assert len(result.split()) <= 4000

    def test_removes_non_printable(self):
        raw = "hello\x00world\x01test"
        assert "\x00" not in clean_text(raw)
        assert "\x01" not in clean_text(raw)


class TestValidatePdf:
    def test_accepts_pdf_content_type(self):
        class FakeFile:
            content_type = "application/pdf"
        # Should not raise
        validate_pdf(FakeFile())

    def test_rejects_non_pdf(self):
        class FakeFile:
            content_type = "image/png"
        with pytest.raises(HTTPException) as exc_info:
            validate_pdf(FakeFile())
        assert exc_info.value.status_code == 400


# ── ai_service ────────────────────────────────────────────────
class TestNormalizeResult:
    def test_clamps_scores(self):
        r = _normalize_result({"score": 150, "ats_score": -10})
        assert r["score"] == 100
        assert r["ats_score"] == 0

    def test_converts_lists(self):
        r = _normalize_result({
            "score": 70,
            "ats_score": 60,
            "missing_keywords": ["Docker", "Kubernetes"],
            "suggestions": ["Add metrics"],
            "interview_questions": ["Tell me about yourself"],
        })
        assert isinstance(r["missing_keywords"], list)
        assert isinstance(r["suggestions"], list)
        assert isinstance(r["interview_questions"], list)

    def test_defaults_missing_fields(self):
        r = _normalize_result({})
        assert r["score"] == 50
        assert r["ats_score"] == 50
        assert r["missing_keywords"] == []

    def test_handles_non_numeric_score(self):
        r = _normalize_result({"score": "excellent", "ats_score": None})
        assert r["score"] == 50   # fallback default


# ── /api/analyze endpoint ─────────────────────────────────────
MOCK_AI_RESULT = {
    "score": 78,
    "ats_score": 65,
    "missing_keywords": ["Docker", "CI/CD"],
    "suggestions": ["Quantify achievements"],
    "interview_questions": ["Tell me about yourself"],
}

MINIMAL_PDF_BYTES = (
    b"%PDF-1.4\n"
    b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
    b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"
    b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
    b"/Contents 4 0 R /Resources << /Font << /F1 << /Type /Font "
    b"/Subtype /Type1 /BaseFont /Helvetica >> >> >> >>\nendobj\n"
    b"4 0 obj\n<< /Length 44 >>\nstream\n"
    b"BT /F1 12 Tf 100 700 Td (Hello World) Tj ET\n"
    b"endstream\nendobj\n"
    b"xref\n0 5\n0000000000 65535 f \n"
    b"trailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n0\n%%EOF"
)


@pytest.mark.asyncio
async def test_analyze_endpoint_success(client):
    with (
        patch("services.pdf_service.extract_text_from_pdf", new_callable=AsyncMock) as mock_extract,
        patch("services.ai_service.analyze_resume", new_callable=AsyncMock) as mock_ai,
    ):
        mock_extract.return_value = "John Doe Software Engineer Python Django REST APIs..."
        mock_ai.return_value = MOCK_AI_RESULT

        response = await client.post(
            "/api/analyze",
            files={"file": ("resume.pdf", io.BytesIO(MINIMAL_PDF_BYTES), "application/pdf")},
        )

    assert response.status_code == 200
    data = response.json()
    assert data["score"] == 78
    assert data["ats_score"] == 65
    assert "Docker" in data["missing_keywords"]
    assert "id" in data


@pytest.mark.asyncio
async def test_analyze_rejects_non_pdf(client):
    response = await client.post(
        "/api/analyze",
        files={"file": ("resume.docx", io.BytesIO(b"PK..."), "application/vnd.openxmlformats-officedocument.wordprocessingml.document")},
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_health_check(client):
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
