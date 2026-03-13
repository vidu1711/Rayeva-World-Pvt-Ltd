# EcoProcure AI — Sustainable Commerce Platform

**AI-powered B2B proposal generation and sustainability impact reporting.**  
A full-stack assignment demonstrating structured AI integration with real business logic, clean architecture, and production-ready patterns.

---

## Table of contents

- [Architecture overview](#architecture-overview)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [AI prompt design](#ai-prompt-design)
- [Modules](#modules)
- [Getting started](#getting-started)
- [Design decisions](#design-decisions)

---

## Architecture overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js + React)                        │
│  Dashboard │ Generate Proposal │ Proposals │ Orders │ Impact Reports     │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTP /api/*
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Backend API (Node.js + Express)                      │
├─────────────────────────────────────────────────────────────────────────┤
│  Routes          →  Controllers  →  Services (business + AI)  →  Models   │
│  Validation      │  Error handling │  Prompt builders (prompts/)          │
│  Logging         │  Structured JSON│  AI provider (OpenAI / Gemini)       │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
             ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
             │  MongoDB    │  │  OpenAI API  │  │  Gemini API  │
             │  Proposals  │  │  or          │  │  (fallback) │
             │  ImpactRpts │  │  Gemini      │  │              │
             │  AILog      │  │              │  │              │
             └──────────────┘  └──────────────┘  └──────────────┘
```

**Layers**

| Layer | Responsibility |
|-------|----------------|
| **Frontend** | SaaS-style UI: dashboard, forms, tables. Calls backend via `/api/*`. |
| **Routes** | Mount endpoints; apply JSON body parsing and request logging. |
| **Controllers** | Validate input, call services, return HTTP status and JSON. No business or AI logic. |
| **Services** | Business rules (e.g. impact calculations), prompt building, AI calls, persistence. |
| **Prompts** | Pure functions that build prompt text from inputs; no DB or HTTP. |
| **AI service** | Single place for LLM calls (OpenAI or Gemini); logs every prompt/response to `AILog`. |
| **Models** | Mongoose schemas; all persistence in MongoDB. |

**Data flow (example: Generate Proposal)**

1. User submits form → **Controller** validates body.
2. **Proposal service** calls **prompt builder** with `event_type`, `budget`, `sustainability_goal`.
3. **AI service** sends prompt to LLM, receives raw text, logs to **AILog**, returns content.
4. **Proposal service** parses JSON, validates (e.g. total ≤ budget), saves **Proposal**.
5. **Controller** returns `{ success, data }` to frontend.

---

## Tech stack

| Area | Technology |
|------|------------|
| Frontend | Next.js 14 (App Router), React 18, Tailwind CSS, TypeScript |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| AI | OpenAI API (gpt-4o-mini) or Google Gemini (gemini-2.0-flash); key auto-detected |
| Env | dotenv; keys in `.env` (never committed) |

---

## Project structure

```
├── backend/                    # API and AI logic
│   ├── config/                 # Env, DB connection
│   ├── controllers/            # HTTP handlers (validation, status codes)
│   ├── middleware/             # Request/response logging
│   ├── models/                 # Proposal, ImpactReport, AILog
│   ├── prompts/                # AI prompt builders (see below)
│   ├── routes/                 # /api/proposal, /api/impact, /api/dashboard, etc.
│   ├── services/              # Business + AI: proposalService, impactService, aiService
│   ├── utils/                 # Validators, JSON parsing, mock fallbacks
│   └── server.js
│
├── frontend/                   # Next.js app
│   ├── src/
│   │   ├── app/               # Pages: dashboard, generate-proposal, proposals, impact-reports
│   │   ├── components/        # Layout, Navbar, Sidebar
│   │   └── lib/               # API client (typed)
│   └── package.json
│
├── .env.example
└── README.md
```

---

## AI prompt design

Prompts are **separate from business logic** and live in `backend/prompts/`. Each module has a single prompt builder that returns a string; the AI service sends that string to the LLM and returns the raw response. This keeps prompts easy to find, change, and reason about.

### Principles

1. **Single responsibility** — Each file builds one prompt for one use case.
2. **Structured output** — Prompts specify exact JSON shape or plain-text format so responses can be parsed and validated.
3. **Auditability** — Every prompt and response is stored in `AILog` (collection: `prompt`, `response`, `module_name`, `timestamp`).
4. **No logic in prompts** — Prompt builders only interpolate inputs into a template; calculations and validation stay in services.

### Module 2: Proposal prompt (`prompts/proposal.js`)

**Role:** Get a sustainable product mix and budget breakdown from the LLM.

**Inputs (from service):** `event_type`, `budget`, `sustainability_goal`.

**Design choices:**

- **Persona:** “You are a sustainability commerce consultant…” so the model stays on-task and tone-consistent.
- **Explicit schema:** The prompt includes the exact JSON structure required (`suggested_product_mix`, `budget_allocation`, `estimated_cost_breakdown`, `impact_summary`) so the model returns parseable JSON.
- **Constraints in prompt:** “Total cost must NOT exceed $X”, “All products must be eco-friendly” — reinforced again in code (e.g. `validateProposalOutput` checks total ≤ budget).
- **Output rule:** “Return ONLY valid JSON (no markdown, no code blocks)” to avoid parsing failures; the service still strips markdown fences if present (`utils/parseJson.js`).

**Flow:**  
`proposalService` → `buildProposalPrompt(input)` → `aiService.complete(prompt, 'proposal')` → parse JSON → validate → save `Proposal` and return.

### Module 3: Impact statement prompt (`prompts/impact.js`)

**Role:** Turn computed impact numbers into a short, human-readable statement.

**Inputs (from service):** `plastic_saved_grams`, `carbon_avoided_grams` (computed from order items: `quantity × 10g` and `quantity × 25g`).

**Design choices:**

- **Persona:** “You are a sustainability impact analyst” for consistent, report-style language.
- **Plain text, not JSON:** The prompt asks for “ONLY the impact statement text” so the response can be stored and displayed as-is.
- **Business logic first:** Plastic and carbon are **calculated in code** (`impactService.computeImpact()`); the LLM only generates narrative. This keeps metrics correct and auditable regardless of model behavior.

**Flow:**  
`impactService` computes metrics → `buildImpactStatementPrompt(computed)` → `aiService.complete(prompt, 'impact')` → trim → save `ImpactReport` (with `plastic_saved`, `carbon_avoided`, `impact_statement`) and return.

### Prompt logging (AILog)

Every call to `aiService.complete(prompt, moduleName)` writes one document to **AILog**: `prompt`, `response`, `module_name`, `timestamp`. That gives:

- **Debugging** — Inspect what was sent and what was returned.
- **Compliance / review** — Full history of AI inputs and outputs.
- **Improvement** — Easy to copy prompts and responses into eval sets or prompt iterations.

---

## Modules

| Module | Purpose | Input | Output |
|--------|---------|--------|--------|
| **Module 2: Proposal generator** | Sustainable B2B product mix within budget | `event_type`, `budget`, `sustainability_goal` | JSON: `suggested_product_mix`, `budget_allocation`, `estimated_cost_breakdown`, `impact_summary` |
| **Module 3: Impact reporter** | Metrics + narrative for orders | `order_items` (product, quantity, material) | Computed: `plastic_saved`, `carbon_avoided`; AI: `impact_statement` |

When the AI provider is unavailable (e.g. no key or quota), the app uses **fallback mocks** (`utils/mockAi.js`) so demos and testing still work; product mixes vary by industry and goals.

---

## Getting started

**Prerequisites:** Node.js 18+, MongoDB (local or Atlas).

1. **Backend**

   ```bash
   cd backend
   cp .env.example .env
   # Edit .env: OPENAI_API_KEY or GEMINI_API_KEY (or OpenAI key for Gemini), MONGODB_URI
   npm install
   npm start
   ```

   API base: `http://localhost:3000`

2. **Frontend**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   App: `http://localhost:3001` (or the port Next.js prints). It proxies `/api/*` to the backend.

3. **Quick test**

   - Open **Generate Proposal**, fill company name, budget, industry, sustainability goals → **Generate Proposal**.
   - Open **Impact Reports** → **Generate impact report** with e.g. product “bamboo toothbrush”, quantity 100, material “bamboo”.

---

## Design decisions

| Decision | Rationale |
|----------|-----------|
| **Prompts in dedicated `prompts/` folder** | Easy to locate and update; no prompt strings buried in services. |
| **AI logic in one place (`aiService`)** | Single provider abstraction; swap OpenAI/Gemini via env; consistent logging. |
| **Business logic in services, not controllers** | Controllers stay thin; services are testable and reusable. |
| **Structured JSON + validation** | AI output is parsed and validated (e.g. budget cap); invalid or over-budget responses are caught. |
| **Impact metrics in code, not in prompt** | Plastic and carbon are deterministic (e.g. 10g/25g per unit); only the narrative is LLM-generated. |
| **AILog for every prompt/response** | Supports debugging, audits, and prompt iteration. |
| **Mock fallbacks when AI fails** | Demos and grading work without API keys or quota; mocks vary by industry/goals. |

---

*EcoProcure AI — Sustainable Commerce Platform*
