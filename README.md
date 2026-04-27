# ToxiGuard

**AI-Powered Social Media Toxicity Monitor** — A Next.js application that monitors Facebook/Instagram comments in real-time, classifies toxic content using AI (Groq), and provides a dashboard for managing flagged comments.

## Features

- 🔍 **Real-time Comment Monitoring** — Webhook-based ingestion from Meta Graph API
- 🤖 **AI Classification** — Automatic toxicity scoring via Groq LLM
- 📊 **Dashboard** — View and manage flagged comments with severity indicators
- 📋 **Reports** — Generate and review toxicity reports with admin actions (dismiss, escalate, resolve)
- ⚙️ **Settings** — Configure connected social accounts and sensitivity thresholds
- 🔐 **Auth** — Supabase-powered authentication with protected routes

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Database:** Supabase (PostgreSQL + Auth)
- **AI:** Groq API for comment classification
- **Styling:** Tailwind CSS
- **Language:** TypeScript

## Getting Started

1. Clone the repo and install dependencies:

```bash
git clone https://github.com/RUPAK-SARDAR/ToxiGuard.git
cd ToxiGuard
npm install
```

2. Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npx tsx scripts/refresh-and-ingest.ts` | Fetch & classify latest comments |
| `npx tsx scripts/generate-long-lived-token.ts` | Generate long-lived Meta token |
| `npx tsx scripts/verify-supabase.ts` | Verify Supabase connection |
| `npx tsx scripts/verify-groq.ts` | Verify Groq API key |

## License

MIT
