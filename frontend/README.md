# EcoProcure AI – Frontend

Next.js + Tailwind CSS dashboard for sustainable B2B proposals and impact reporting.

## Setup

```bash
npm install
```

## Run

Start the **backend** first (from `../backend`: `npm start` on port 3000). Then:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) (Next.js default port). API requests are proxied to the backend via `next.config.js` rewrites.

## Pages

- **Dashboard** – Stats (proposals, impact reports, plastic saved, carbon avoided) and recent activity
- **Generate Proposal** – Form to create an AI-generated B2B proposal (Module 2)
- **Proposals** – List and view proposal details
- **Orders** – Placeholder (orders linked to impact reports)
- **Impact Reports** – List, generate new report (Module 3), view report detail

## Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- TypeScript
