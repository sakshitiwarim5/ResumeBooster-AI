import os
import json
import re
from openai import AsyncOpenAI
from fastapi import HTTPException
from dotenv import load_dotenv
import httpx

load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """You are an expert resume reviewer and career coach with 15+ years of experience in recruiting.
Analyze resumes objectively and return ONLY a valid JSON object with no markdown, no extra text.
Always return exactly the specified JSON structure."""

ANALYSIS_PROMPT = """Analyze the following resume text and return a JSON object with this exact structure:
{{
  "score": <integer 0-100 overall resume quality>,
  "ats_score": <integer 0-100 ATS compatibility score>,
  "missing_keywords": [<list of 5-10 important missing keywords/skills for modern job market>],
  "suggestions": [<list of 5-8 specific, actionable improvement suggestions>],
  "interview_questions": [<list of 5 likely interview questions based on this resume>]
}}

Scoring criteria:
- score: formatting, clarity, impact statements, quantified achievements, length
- ats_score: keyword density, standard section headers, no tables/graphics, clean formatting

Resume text:
---
{resume_text}
---

Return ONLY the JSON object, no other text."""


async def analyze_resume(resume_text: str) -> dict:
    """Send resume text to OpenAI and return structured analysis."""
    if not resume_text or len(resume_text.strip()) < 100:
        raise HTTPException(
            status_code=422,
            detail="Resume text is too short or could not be extracted properly."
        )

    prompt = ANALYSIS_PROMPT.format(resume_text=resume_text[:6000])

    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
            max_tokens=1000,
            temperature=0.3,
            response_format={"type": "json_object"},
        )

        content = response.choices[0].message.content
        result = json.loads(content)

    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI returned invalid JSON: {str(e)}"
        )
    except Exception as e:
        # Fallback to Gemini if OpenAI fails
        gemini_key = os.getenv("GEMINI_API_KEY")
        if gemini_key:
            gemini_key = gemini_key.strip()
        if not gemini_key:
            raise HTTPException(
                status_code=500,
                detail=f"OpenAI API error: {str(e)} (Gemini fallback not configured)"
            )
        
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_key}"
            payload = {
                "system_instruction": {
                    "parts": [{"text": SYSTEM_PROMPT}]
                },
                "contents": [{
                    "parts": [{"text": prompt}]
                }],
                "generationConfig": {
                    "responseMimeType": "application/json"
                }
            }
            async with httpx.AsyncClient(timeout=30.0) as httpx_client:
                gemini_resp = await httpx_client.post(url, json=payload)
                gemini_resp.raise_for_status()
                data = gemini_resp.json()
                
                text_content = data["candidates"][0]["content"]["parts"][0]["text"]
                
                # Strip markdown json block if Gemini includes it
                text_content = text_content.strip()
                if text_content.startswith("```json"):
                    text_content = text_content[7:-3]
                elif text_content.startswith("```"):
                    text_content = text_content[3:-3]
                    
                result = json.loads(text_content)
        except Exception as gemini_e:
            raise HTTPException(
                status_code=500,
                detail=f"OpenAI API error: {str(e)} | Gemini fallback also failed: {str(gemini_e)}"
            )

    # Validate and normalize output
    result = _normalize_result(result)
    return result


def _normalize_result(result: dict) -> dict:
    """Ensure the result has all required fields with correct types."""
    def clamp(val, lo=0, hi=100):
        try:
            return max(lo, min(hi, int(val)))
        except (TypeError, ValueError):
            return 50

    def ensure_list(val):
        if isinstance(val, list):
            return [str(item) for item in val]
        return []

    return {
        "score": clamp(result.get("score", 50)),
        "ats_score": clamp(result.get("ats_score", 50)),
        "missing_keywords": ensure_list(result.get("missing_keywords", [])),
        "suggestions": ensure_list(result.get("suggestions", [])),
        "interview_questions": ensure_list(result.get("interview_questions", [])),
    }
