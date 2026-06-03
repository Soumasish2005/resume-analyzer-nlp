# CVPilot Frontend

A modern, high-performance React application for NLP-powered resume evaluation. Built with a focus on design quality, state management efficiency, and a seamless user experience.

---

## Project Structure

```bash
frontend/
├── src/
│   ├── api/               # Axios service layer (auth, analysis)
│   ├── components/
│   │   └── ui/            # ShadcnUI base components (Button, Input, etc.)
│   ├── hooks/             # Custom React Query hooks (useAnalysis, useAuth)
│   ├── pages/             # Route-level page components
│   │   ├── Landing.tsx    # Public marketing page
│   │   ├── Login.tsx      # Authentication form
│   │   ├── Register.tsx   # Account creation form
│   │   ├── Dashboard.tsx  # Resume upload and JD entry
│   │   ├── Analytics.tsx  # Match results and candidate profile view
│   │   ├── Resumes.tsx    # Resume history (Resume Bank)
│   │   ├── Matches.tsx    # Job match recommendations
│   │   └── Settings.tsx   # User account settings
│   ├── types/             # TypeScript interfaces (analysis, auth)
│   ├── lib/               # Utility functions (cn, formatters)
│   └── main.tsx           # Application entry point and router setup
├── public/                # Static assets
├── index.html
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| Framework | React 19 + Vite | Component model and fast HMR development |
| Language | TypeScript | Type-safe component and API contract enforcement |
| Styling | Tailwind CSS + ShadcnUI | Utility-first design with accessible, composable base components |
| Animations | Framer Motion | Layout transitions and micro-interaction animations |
| Data Fetching | TanStack React Query | Server state management, caching, and request deduplication |
| HTTP Client | Axios | API communication with JWT interceptor |
| Routing | React Router 6 | Client-side declarative routing |
| Icons | Lucide React | Consistent, lightweight SVG icon set |

---

## Application Pages

### Landing
Public-facing marketing page with feature highlights and calls-to-action for registration.

### Dashboard
The primary entry point for authenticated users. Provides a file picker for PDF/DOCX resumes and a text area for pasting job descriptions. Triggers the backend analysis pipeline on submission and redirects to the Analytics view upon completion.

### Analytics
Displays the full analysis report for a given `result_id`. Includes:
- A radial match score dial with tier-based colour coding (Excellent / Strong / Partial / Low).
- Keyword coverage metrics: matched keywords and missing keywords separated into tagged chips.
- An AI suggestions panel with numbered, actionable recommendations.
- The extracted candidate profile: name, contact details, detected skills, education, and experience.

---

## State Management

Data fetching is handled entirely through **TanStack React Query** with dedicated hooks in `src/hooks/`:

- `useAnalysisResult(resultId)` — Fetches a single full result. Configured with `refetchOnWindowFocus: false` and a 5-minute `staleTime` to prevent redundant GET requests when switching browser tabs.
- `useAnalysisList()` — Fetches the user's analysis history.
- `useUploadResume()` — Mutation hook wrapping the `POST /api/v1/js/upload` endpoint.
- `useLogin()` / `useLogout()` — Authentication mutations with automatic token handling via Axios interceptor.

---

## Execution Instructions

### Option 1: Using Docker (Recommended)
You can run the frontend as part of the full stack from the root directory, or individually using the Dockerfile.

**From the Root Directory (Full Stack):**
```bash
docker compose up --build frontend
```

**Using Docker Build:**
```bash
docker build -t cvpilot-frontend .
docker run -p 80:80 cvpilot-frontend
```

---

### Option 2: Local Manual Setup

#### Prerequisites
- Node.js 18+
- Backend server running on `http://localhost:8000`

### Development Server

```bash
# Install dependencies
npm install

# Start the development server (defaults to http://localhost:5173)
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

### Environment Variables

Create a `.env` file in the `frontend/` directory if the backend URL differs from the default:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

---

## Performance Notes

- **Request Deduplication**: React Query ensures that identical requests triggered simultaneously (e.g., from React Strict Mode double-renders) are deduplicated into a single network call.
- **Window Focus Refetch Disabled**: The `useAnalysisResult` hook does not refetch when the user returns to the tab, preventing the repeated GET requests previously observed in backend logs.
- **Bundle Optimization**: Vite's Rollup-based production build applies tree-shaking and code splitting automatically for minimal initial load time.
