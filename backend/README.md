# CVPilot Backend 
CVPilot is a resilient, AI-augmented nlp resume analyzer service built with FastAPI. It handles complex PDF/DOCX parsing, semantic similarity scoring, and entity extraction.

---

## Project Structure

```bash
backend/
├── app/
│   ├── api/                 # API Route handlers (Auth, Analysis, JS)
│   ├── core/
│   │   ├── config.py         # Pydantic Settings (ENV Management)
│   │   ├── feedback.py       # AI-driven suggestion logic
│   │   ├── logger.py         # Structured logging (Console + File)
│   │   ├── nlp_engine.py     # ENTITY EXTRACTION & HEURISTIC FALLBACK
│   │   ├── parser.py         # STRUCTURAL PDF/DOCX PARSING
│   │   ├── project_analyzer.py# Skill inference from project descriptions
│   │   └── scorer.py         # SEMANTIC SCORING (BGE + Keywords)
│   ├── db/                  # Database session & base configuration
│   ├── models/              # SQLAlchemy database models
│   ├── schemas/             # Pydantic validation schemas
│   └── services/            # Business logic orchestration (Pipeline)
├── logs/                    # Rotating application logs (app.log)
├── tests/                   # Pytest suite
├── .env.example             # Configuration variables
├── migrate.py               # DB Schema update utility
└── requirements.txt         # Dependency manifest
```

---

## API Specification (v1)

| Endpoint | Method | Payload | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | | | |
| `/api/v1/auth/register` | `POST` | `{"email": "", "password": "", "name": ""}` | Creates a new user account. |
| `/api/v1/auth/login` | `POST` | `{"email": "", "password": ""}` | Returns a JWT Access Token. |
| **Analysis** | | | |
| `/api/v1/js/upload` | `POST` | `FormData` (resume, job_description) | **Entry Point**: Parses, extracts, and analyzes. Returns `result_id`. |
| `/api/v1/results` | `GET` | Header: `Authorization` | Lists all analysis history for the current user. |
| `/api/v1/results/{id}` | `GET` | `result_id` (path param) | Full match report: score, profile, keywords. |
| `/api/v1/feedback/{id}` | `GET` | `result_id` (path param) | AI-generated actionable improvement suggestions. |

---

## Core Engine Walkthrough

### 1. NLP Engine (`nlp_engine.py`)
The engine implements a **Dual-Mode Extraction** strategy:

- **AI Mode (Gemini 2.5 Flash)**: Attempts to extract a structured JSON profile (Name, Contact, LinkedIn, Education, Experience, Skills). It handles malformed structures via "Dictionary Melting" to ensure list-consistency.
- **Resilience Fallback**: If Gemini fails (429 Quota), the system triggers local heuristics:
    - **Identity Discovery**: Grabs Name from the top 5 lines; uses Regex for Email/Phone.
    - **College Detection**: Scans for "University" or "Institute" strings near degree keywords.
    - **Experience Proximity**: Locates job titles (Engineer, Manager, etc.) and analyzes adjacent lines to infer the Company Name.

### 2. Scoring Engine (`scorer.py`)
Matches are calculated using a **Segmented Similarity** approach:

- **Semantic Match (70%)**: Uses `BAAI/bge-small-en-v1.5` embeddings to perform cosine similarity between the Resume sections and the JD sections. This catches *meaningful* matches even if keywords differ (e.g., "AI" vs "Machine Learning").
- **Keyword Match (30%)**: A direct overlap analysis of technical terms.
- **Weighted Aggregation**:
    - Skills & Experience are weighted higher (0.4 each).
    - Education and Projects are weighted lower (0.2 total).

---

## Observability & Logging (`logger.py`)

The system follows a **Step-by-Step Instrumentation** pattern. Every analysis is tracked in `backend/logs/app.log`:

- **Structured Output**: Every log entry includes a timestamp, log level, and the specific pipeline step.
- **Pipeline Tracking**:
    ```text
    2026-06-02 | INFO | Step 1: Parsing PDF Structure.
    2026-06-02 | INFO | Step 4: Extracting entities via Gemini.
    2026-06-02 | WARNING| Gemini Quota Hit. Falling back to Local Heuristics.
    2026-06-02 | INFO | Step 10: Saving to PostgreSQL.
    ```
- **Rotation**: Logs are kept for 5 generations with a 10MB limit per file to prevent disk overflow.

---

## Execution Instructions

### 1. Environment Setup
Ensure you have Python 3.10+ installed.
```bash
# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Install NLP Models (Direct links to avoid 404 errors)
pip install https://github.com/explosion/spacy-models/releases/download/en_core_web_trf-3.7.3/en_core_web_trf-3.7.3-py3-none-any.whl #Works better with Nvidia GPU

pip install https://github.com/explosion/spacy-models/releases/download/en_core_web_lg-3.7.1/en_core_web_lg-3.7.1-py3-none-any.whl #Normal CPU
```

### 2. Database Initialization
This project uses PostgreSQL. Ensure your `.env` is configured with a valid `DATABASE_URL`.
```bash
# Apply schema and add missing columns (e.g. linkedin)
python migrate.py
```

### 3. Launching the Server
```bash
# Run with auto-reload (development mode)
uvicorn app.main:app --reload --port 8000
```