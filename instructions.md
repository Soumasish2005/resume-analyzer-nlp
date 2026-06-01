# CVPilot / ResuMatch AI - Frontend Build Specification

## Project Overview

Build a modern SaaS frontend for an AI-powered Resume Analysis and Job Matching platform.

The application allows users to:

- Upload resumes
- Paste job descriptions
- Run ATS analysis
- Get resume scores
- View keyword matching
- Receive AI-generated feedback
- Track analysis history
- Browse job matches
- Manage resumes

The design should closely match the supplied mockups while following the design system defined in DESIGN.md.

---

# Tech Stack

## Core

- React 19+
- TypeScript
- Vite

## UI

- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide React

## State Management

- TanStack Query (React Query)
- Zustand (preferred) or React Context

## Forms

- React Hook Form
- Zod

## API

- Axios

---

# Design System

## Brand

Product Name: CVPilot

Marketing Name: ResuMatch AI

Brand Personality:

- Professional
- Intelligent
- Trustworthy
- Corporate
- Modern

---

## Colors

```css
Primary: #0058BE
Primary Hover: #2170E4

Background: #F7F9FB
Card: #FFFFFF

Text: #191C1E
Muted: #64748B

Border: #E2E8F0

Success: #22C55E
Warning: #F59E0B
Error: #EF4444
```

## Typography

Font Family: Geist

| Type | Size | Weight |
|--------|--------|--------|
| Hero | 48px | 700 |
| H1 | 32px | 600 |
| H2 | 24px | 600 |
| Body | 16px | 400 |
| Small | 14px | 400 |
| Label | 12px | 600 |

## Radius

- Cards: 24px
- Inputs: 16px
- Buttons: 16px
- Pills/Badges: Full

---

# Application Routes

## Public

| Route | Description |
|---------|---------|
| / | Landing Page |
| /login | Login |
| /register | Register |
| /forgot-password | Forgot Password |
| /reset-password | Reset Password |

## Protected

| Route | Description |
|---------|---------|
| /dashboard | Main Dashboard |
| /analytics | Analytics |
| /resumes | Resume Bank |
| /matches | Job Matches |
| /results/:resultId | Analysis Result |
| /feedback/:feedbackId | Feedback |
| /settings | Settings |

---

# Landing Page

Build exactly according to the supplied design.

## Hero Section

Left Side:

- Headline
- Supporting copy
- Primary CTA
- Secondary CTA

Primary CTA:

Analyze My Resume

Right Side:

- Resume analysis illustration
- ATS score widget

---

## Trusted Companies

Display:

- Google
- Stripe
- Airbnb
- Revolut
- Netflix

---

## Features

### Semantic Keyword Extraction

Features:

- Hard skill detection
- Soft skill matching

### Instant Feedback

Features:

- Real-time scoring
- Score improvement visualization

### Enterprise Privacy

Display:

- GDPR
- CCPA
- Secure Storage

### Tailored Cover Letters

Display:

- AI-generated cover letters
- One-click generation

---

## How It Works

### Step 1

Upload Resume

### Step 2

Paste Job Description

### Step 3

Optimize & Apply

---

## Pricing

### Essential

$0/month

### Recruiter Pro

$19/month

### Enterprise

Custom

---

## CTA

Ready to beat the ATS?

Large blue CTA section.

---

# Authentication

## Register

Endpoint:

POST /api/v1/auth/register

Request:

```json
{
  "name": "string",
  "email": "user@example.com",
  "password": "string",
  "role": "string"
}
```

Response:

```json
{
  "userID": "string",
  "name": "string",
  "email": "string",
  "role": "string"
}
```

---

## Login

Endpoint:

POST /api/v1/auth/login

Request:

```json
{
  "email": "user@example.com",
  "password": "string"
}
```

Response:

```json
{
  "access_token": "string",
  "refresh_token": "string",
  "token_type": "bearer"
}
```

Requirements:

- Store access token
- Store refresh token
- Redirect to dashboard
- Fetch user profile

---

## Current User

GET /api/v1/auth/me

Response:

```json
{
  "userID": "string",
  "name": "string",
  "email": "string",
  "role": "string"
}
```

---

## Logout

POST /api/v1/auth/logout

Response:

```json
{
  "message": "string"
}
```

Requirements:

- Clear tokens
- Clear cache
- Redirect to login

---

## Refresh Token

POST /api/v1/auth/refresh

Requirements:

- Axios interceptor
- Automatic refresh flow
- Retry failed requests

---

# Dashboard

Build according to supplied dashboard mockup.

## Sidebar

Items:

- Dashboard
- Analytics
- Resume Bank
- Job Matches
- Settings

Bottom:

- Help Center
- Logout

Primary CTA:

Analyze Resume

---

## Header

Display:

- Welcome User
- Notification Bell
- User Avatar
- User Menu

---

## Resume Analysis Widget

### Resume Upload

Drag-and-drop upload area.

Supported:

- PDF
- DOCX

### Job Description

Textarea input.

### Analyze Button

Trigger analysis flow.

---

## Resume Score Card

Display:

- Circular progress chart
- Numeric score
- Weekly trend

Example:

84 / 100

---

## Skills Card

Display badges:

- TypeScript
- React
- Python
- Cloud Ops
- LLM Integration
- System Design

---

## Recent Job Matches

Each card contains:

- Company Logo
- Job Title
- Match Percentage
- Salary Range
- Location
- Work Mode

---

# Resume Analysis Flow

## Upload Resume

POST /api/v1/js/upload

Content-Type:

multipart/form-data

Fields:

```text
resume
job_description
```

Frontend should expect:

```json
{
  "resume_id": "string",
  "jd_id": "string"
}
```

---

## Analyze Resume

POST /api/v1/analyze

Request:

```json
{
  "resume_id": "string",
  "jd_id": "string"
}
```

Response:

```json
{
  "result": "analysis result string"
}
```

---

# Results Page

GET /api/v1/results/{result_id}

Response:

```json
{
  "result": "analysis result string"
}
```

Build a flexible renderer because backend currently returns text.

Display:

- ATS Score
- Keyword Match
- Missing Keywords
- Skills Match
- Strengths
- Weaknesses
- Recommendations
- Resume Preview
- Download Report

---

# Feedback Page

GET /api/v1/feedback/{feedback_id}

Response:

```json
{
  "result": "feedback string"
}
```

Display:

- Feedback Summary
- Recommendations
- Action Items
- Improvement Suggestions

---

# Analytics Page

Use Recharts.

Charts:

- Resume Score Trend
- ATS Improvement
- Match Distribution
- Skill Growth

---

# Resume Bank

Features:

- Upload Resume
- Search
- Filter
- Sort
- Delete

Views:

- Table View
- Card View

---

# Job Matches

Features:

- Search
- Sort
- Filter

Filters:

- Match Score
- Salary
- Remote
- Hybrid
- Location

---

# Settings

Features:

- Update Profile
- Change Password
- Notification Preferences
- Logout

---

# Folder Structure

```text
src/
│
├── api/
│   ├── axios.ts
│   ├── auth.ts
│   ├── analysis.ts
│   └── feedback.ts
│
├── components/
│   ├── ui/
│   ├── auth/
│   ├── dashboard/
│   ├── landing/
│   └── shared/
│
├── hooks/
│   ├── useLogin.ts
│   ├── useRegister.ts
│   ├── useCurrentUser.ts
│   ├── useUploadResume.ts
│   ├── useAnalyzeResume.ts
│   ├── useResult.ts
│   └── useFeedback.ts
│
├── pages/
├── routes/
├── store/
├── types/
├── lib/
└── utils/
```

---

# Animations

Use Framer Motion for:

- Page transitions
- Hero animations
- Sidebar transitions
- Card hover effects
- Loading states
- Modal animations

Keep animations subtle and professional.

---

# UX Requirements

Required:

- Skeleton loaders
- Error boundaries
- Empty states
- Toast notifications
- Protected routes
- Responsive design
- Drag & drop upload
- Retry actions
- Mobile navigation drawer

---

# TypeScript Requirements

Generate types from API contracts.

Required Types:

```ts
User
LoginRequest
RegisterRequest
AuthResponse
AnalysisRequest
AnalysisResponse
FeedbackResponse
```

Use strict TypeScript.

Avoid any.

---

# Final Goal

Build a premium AI-powered recruiting SaaS platform matching the supplied designs.

The application should feel comparable to modern SaaS products such as Lever, Ashby, Greenhouse, and modern AI recruiting tools.

Code should be scalable, maintainable, responsive, and production-ready.