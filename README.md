# HireBoost AI — AI Resume Analyzer SaaS

A production-ready full-stack SaaS that scores your resume with GPT-4, checks ATS compatibility, identifies missing keywords, and generates interview questions — in under 30 seconds.

---

## 📁 Project Structure

```
hireboost-ai/
├── backend/
│   ├── main.py                     # FastAPI app entry point
│   ├── database.py                 # Async SQLAlchemy setup
│   ├── requirements.txt
│   ├── .env.example
│   ├── models/
│   │   ├── __init__.py
│   │   └── resume.py               # ResumeAnalysis ORM model
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── analyze.py              # POST /api/analyze
│   │   ├── payment.py              # POST /api/payment/*
│   │   └── report.py               # GET  /api/download-report/{id}
│   └── services/
│       ├── __init__.py
│       ├── pdf_service.py          # PyMuPDF text extraction
│       ├── ai_service.py           # Async OpenAI analysis
│       └── report_service.py       # ReportLab PDF generation
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx                 # Router + ThemeContext
        ├── index.css               # CSS variables + utilities
        ├── pages/
        │   ├── LandingPage.jsx
        │   ├── UploadPage.jsx
        │   ├── ResultPage.jsx
        │   └── NotFoundPage.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── ScoreRing.jsx       # Animated SVG score ring
        │   ├── AnalysisCard.jsx    # Collapsible result card
        │   ├── PremiumBanner.jsx   # Razorpay unlock + download
        │   └── LoadingSpinner.jsx
        └── services/
            ├── api.js              # Axios layer
            └── razorpay.js         # Razorpay checkout helper
```

---

## ⚙️ Prerequisites

| Tool        | Version  |
|-------------|----------|
| Python      | 3.11+    |
| Node.js     | 18+      |
| PostgreSQL  | 14+      |

---

## 🔧 Backend Setup

### 1. Create & activate virtual environment

```bash
cd hireboost-ai/backend
python -m venv venv
source venv/bin/activate        # Linux/macOS
# venv\Scripts\activate         # Windows
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/hireboost
OPENAI_API_KEY=sk-...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

### 4. Create PostgreSQL database

```bash
psql -U postgres -c "CREATE DATABASE hireboost;"
```

### 5. Run the backend

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be live at **http://localhost:8000**  
Swagger docs: **http://localhost:8000/docs**

---

## 🎨 Frontend Setup

### 1. Install dependencies

```bash
cd hireboost-ai/frontend
npm install
```

### 2. Start development server

```bash
npm run dev
```

The app will be live at **http://localhost:5173**

> The Vite proxy forwards `/api/*` requests to `http://localhost:8000`, so no CORS issues in development.

---

## 🏗️ Build for Production

### Backend
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend
```bash
cd frontend
npm run build
# Serve the dist/ folder with nginx or any static host
```

---

## 🌐 API Reference

| Method | Endpoint                        | Description                     |
|--------|---------------------------------|---------------------------------|
| POST   | `/api/analyze`                  | Upload PDF, receive AI analysis |
| POST   | `/api/payment/create-order`     | Create Razorpay order           |
| POST   | `/api/payment/verify`           | Verify Razorpay signature       |
| GET    | `/api/download-report/{id}`     | Download PDF report (premium)   |
| GET    | `/health`                       | Health check                    |

### POST /api/analyze

**Request:** `multipart/form-data` with field `file` (PDF, max 5 MB)

**Response:**
```json
{
  "id": "uuid",
  "filename": "my_resume.pdf",
  "score": 78,
  "ats_score": 65,
  "missing_keywords": ["Docker", "Kubernetes", "CI/CD"],
  "suggestions": ["Quantify achievements with numbers", "..."],
  "interview_questions": ["Tell me about a time you...", "..."]
}
```

---

## 💳 Razorpay Integration

1. Create a free account at [razorpay.com](https://razorpay.com)
2. Go to **Settings → API Keys** and generate Test keys
3. Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to `.env`
4. In the frontend, Razorpay Checkout SDK is loaded via `index.html`

**Payment flow:**
```
Frontend                     Backend
   |                            |
   |-- POST /payment/create-order --> Creates Razorpay order
   |<-- { order_id, key_id } --------|
   |                            |
   |-- Opens Razorpay Checkout  |
   |   (user pays)              |
   |                            |
   |-- POST /payment/verify -------> Verifies HMAC signature
   |<-- { success, premium data } ---|
   |                            |
   |-- GET /download-report/{id} --> Returns PDF (premium)
```

---

## 🛠️ Tech Stack

**Backend:** FastAPI · SQLAlchemy (async) · PostgreSQL · PyMuPDF · OpenAI GPT-4o-mini · ReportLab · Razorpay  
**Frontend:** React 18 · Vite · Tailwind CSS · React Router v6 · Axios · react-dropzone · react-hot-toast
