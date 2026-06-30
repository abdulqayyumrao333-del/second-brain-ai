# Second Brain AI

An AI-powered assistant that connects to your Gmail, Google Drive, GitHub,
Calendar, and more — letting you ask natural-language questions like
*"What deadlines do I have this week?"* or *"Find every React project I
worked on"* across all your connected accounts.

## Status

🚧 **Step 1 of the build roadmap** — deployed skeleton with frontend ↔
backend connectivity confirmed via a health check. No real features yet.

## Stack

| Layer | Choice |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | Supabase (Postgres + pgvector) |
| Auth | Supabase Auth + Google OAuth (per-integration data scopes) |
| Embeddings | Sentence-Transformers (`all-MiniLM-L6-v2`), self-hosted via FastAPI |
| Chat / RAG generation | Groq API |
| Background jobs | BullMQ + Redis |
| Deployment | Frontend → Vercel, Backend & embedding service → Render |

## Project structure

```
second-brain-ai/
├── frontend/              React + Vite app
├── backend/                Express API
├── embedding-service/      FastAPI + Sentence-Transformers (Step 5+)
├── docs/                   Architecture diagrams, notes
├── docker-compose.yml       Local dev environment
└── .github/workflows/       CI pipeline
```

## Local development

### Prerequisites
- Node.js 22+
- (Later steps) Python 3.11+, Redis, Supabase project

### Run the backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev        # http://localhost:4000
```

### Run the frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev         # http://localhost:5173
```

The frontend dev server proxies `/api/*` requests to the backend, so once
both are running, visiting `http://localhost:5173` should show a green
"Backend status: ok" indicator.

### Run with Docker Compose (optional)
```bash
docker compose up
```

## Roadmap

1. ✅ Skeleton + deploy pipeline (frontend ↔ backend health check)
2. ⬜ Supabase Auth (app login)
3. ⬜ Google OAuth for Gmail scope (data access)
4. ⬜ Gmail sync job (BullMQ)
5. ⬜ Embedding service (FastAPI + Sentence-Transformers)
6. ⬜ Chunk + embed pipeline
7. ⬜ Vector search endpoint (pgvector)
8. ⬜ RAG chat endpoint (Groq)
9. ⬜ Frontend chat UI
10. ⬜ Polish, error/empty states, responsive pass
11. ⬜ Additional integrations: Google Drive, GitHub, Calendar

## Architecture

See `docs/architecture.md` (added once the RAG pipeline is in place).
