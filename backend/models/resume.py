import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, JSON
from database import Base


class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    filename = Column(String(255), nullable=False)
    raw_text = Column(Text, nullable=True)
    score = Column(Integer, nullable=True)
    ats_score = Column(Integer, nullable=True)
    missing_keywords = Column(JSON, nullable=True)
    suggestions = Column(JSON, nullable=True)
    interview_questions = Column(JSON, nullable=True)
    is_premium_unlocked = Column(Boolean, default=False)
    payment_id = Column(String(255), nullable=True)
    order_id = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": str(self.id),
            "filename": self.filename,
            "score": self.score,
            "ats_score": self.ats_score,
            "missing_keywords": self.missing_keywords or [],
            "suggestions": self.suggestions or [],
            "interview_questions": self.interview_questions or [],
            "is_premium_unlocked": self.is_premium_unlocked,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
