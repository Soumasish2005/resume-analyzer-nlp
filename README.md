# CVPilot — AI-Powered Resume Intelligence

CVPilot is a production-grade, full-stack resume analysis platform. It combines large language model extraction (Google Gemini), transformer-based semantic similarity (BAAI BGE), and a local NLP fallback (spaCy) to produce high-fidelity matching scores between resumes and job descriptions. The system provides structured candidate profiles, keyword gap analysis, and ranked, actionable feedback — all surfaced through a premium React dashboard.

---

## Key Features

| Feature | Description |
| :--- | :--- |
| Structural Parsing | Two-pass PDF and DOCX parsing that preserves section boundaries (Education, Experience, Skills, Projects). |
| Hybrid AI Extraction | Gemini 2.5 Flash extracts structured JSON profiles. A local heuristic engine activates automatically on API quota limits. |
| Semantic Scoring | BAAI BGE-small embeddings compute cosine similarity across weighted resume sections for a nuanced match score. |
| Keyword Gap Analysis | Identifies matched and missing JD keywords using ontology-aware token comparison. |
| Explainable Feedback | Generates recruiter-aligned, numbered improvement suggestions based on the match tier. |
| Resilient Pipeline | Every stage is independently fault-tolerant. Partial failures do not crash the analysis. |
| Authenticated Multi-user | JWT-based authentication allows multiple users to maintain isolated analysis histories. |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│              React 19 + Vite + TanStack Query               │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS / REST
┌────────────────────────────▼────────────────────────────────┐
│                       API GATEWAY                            │
│                FastAPI  (Python 3.10+)                       │
│          JWT Auth Middleware  |  CORS  |  Routing            │
└───────────────┬──────────────────────────┬──────────────────┘
                │                          │
┌───────────────▼──────────┐  ┌────────────▼─────────────────┐
│    ANALYSIS PIPELINE      │  │       DATABASE LAYER          │
│                           │  │                               │
│  1. Structural Parser     │  │   PostgreSQL                  │
│  2. Project Analyzer      │  │   SQLAlchemy ORM              │
│  3. JD Entity Ruler       │  │                               │
│  4. NLP / AI Extraction   │  │   Tables:                     │
│     ├── Gemini 2.5 Flash  │  │   ├── users                   │
│     └── spaCy Fallback    │  │   ├── resumes                 │
│  5. Semantic Scorer       │  │   ├── analysis_results        │
│     └── BGE Embeddings    │  │   ├── extracted_profiles      │
│  6. Keyword Comparator    │  │   └── feedback                │
│  7. Feedback Generator    │  │                               │
│  8. DB Persistence        │  └───────────────────────────────┘
└───────────────────────────┘
```

### Data Flow

1. The user uploads a resume (PDF/DOCX) and pastes a job description on the Dashboard.
2. The frontend posts `multipart/form-data` to `POST /api/v1/js/upload`.
3. The backend parser extracts raw text and classifies it into labelled sections.
4. The NLP engine calls Gemini to extract a structured candidate profile (name, email, LinkedIn, education, experience, skills). If the AI quota is exceeded, the local fallback engine runs heuristic extraction instead.
5. The scoring engine generates BGE embeddings for both the resume and JD, computes section-weighted cosine similarity, and combines it with keyword overlap for a final match score (0–100).
6. The feedback generator produces ranked suggestions and identifies under-performing resume sections.
7. All results are persisted to PostgreSQL and a `result_id` is returned to the client.
8. The frontend polls the result endpoint once and renders the full Analytics view.

---

## Project Structure

```bash
resume-analyzer/
├── backend/                  # Python analysis engine and REST API
│   ├── app/
│   │   ├── api/              # FastAPI route handlers
│   │   ├── core/             # NLP engine, scorer, parser, feedback
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── services/         # Pipeline orchestration
│   │   └── schemas/          # Pydantic request/response models
│   ├── logs/                 # Rotating pipeline logs
│   ├── migrate.py            # Schema migration utility
│   └── requirements.txt
│
└── frontend/                 # React dashboard application
    ├── src/
    │   ├── api/              # Axios service layer
    │   ├── hooks/            # TanStack Query hooks
    │   ├── pages/            # Route-level page components
    │   └── components/       # Shared UI components (ShadcnUI)
    └── vite.config.ts
```

---

## Technology Stack

### Backend
| Layer | Technology |
| :--- | :--- |
| API Framework | FastAPI (Python 3.10+) |
| ORM | SQLAlchemy 2.0 |
| Database | PostgreSQL |
| LLM Extraction | Google Gemini 2.5 Flash |
| Semantic Embeddings | BAAI BGE-small-en-v1.5 |
| Local NLP | spaCy `en_core_web_trf` / `en_core_web_lg` |
| Document Parsing | pdfplumber, python-docx |
| Auth | JWT (python-jose) + bcrypt |
| Logging | Python logging with rotating file handler |

### Frontend
| Layer | Technology |
| :--- | :--- |
| Framework | React 19 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS + ShadcnUI |
| Animations | Framer Motion |
| State / Fetching | TanStack React Query |
| Routing | React Router 6 |

---

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL instance (local or Docker)

### Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1          # Windows
pip install -r requirements.txt

# Install spaCy models (direct links to avoid 404 errors)
pip install https://github.com/explosion/spacy-models/releases/download/en_core_web_lg-3.7.1/en_core_web_lg-3.7.1-py3-none-any.whl

# Apply database schema
python migrate.py

# Start API server
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev                          # Starts on http://localhost:5173
```

---

## Configuration

Copy `.env.example` to `.env` in the `backend/` directory and fill in the required values:

```bash
DATABASE_URL=postgresql://user:password@localhost:5435/cvpilot
GOOGLE_API_KEY=your_gemini_api_key
SECRET_KEY=your_jwt_secret_key
```

> For detailed API documentation, architecture diagrams, and execution instructions, see [backend/README.md](./backend/README.md).
> For frontend structure, state management patterns, and build instructions, see [frontend/README.md](./frontend/README.md).
