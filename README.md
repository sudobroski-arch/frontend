# Momentumz — AI News Aggregator

A complete news blog website that aggregates, summarizes, and rewrites articles from trusted sources using AI. Built with Node.js, Next.js, and free tier cloud services.

## Features

- **Automated Aggregation**: Fetches news from CNN, BBC, Reuters, etc. every hour.
- **AI Summarization**: Uses Google Gemini 1.5 Flash to generate unique summaries.
- **Clustering**: Deduplicates similar stories from different sources.
- **SEO Optimized**: Next.js SSR, sitemap, robots.txt, and metadata.
- **Region & Category Targeting**: Dedicated sections for US/EU and Politics/Tech/Science.
- **Social Media Integration**: Sourcing trending news from Reddit (based on hot posts) and Twitter (via Nitter RSS for key accounts).

## Tech Stack

- **Frontend**: Next.js 16 (App Router), Tailwind CSS
- **Backend**: Node.js, Express, `rss-parser`, `node-cron`
- **Database**: PostgreSQL (Supabase Free Tier)
- **AI**: Google Gemini 1.5 Flash (via `@google/generative-ai`)

## Prerequisites

- Node.js 18+
- PostgreSQL Database (e.g., Supabase)
- Google Gemini API Key (Free Tier)

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <repo-url>
    cd news_aggregator
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    cp .env.example .env
    # In .env, replace [YOUR-PASSWORD] in DATABASE_URL, then set GEMINI_API_KEY
    ```
    Supabase project: `https://enanwtcwvikrmmxlqauh.supabase.co`
    Direct DB string format:
    `postgresql://postgres:[YOUR-PASSWORD]@db.enanwtcwvikrmmxlqauh.supabase.co:5432/postgres`
    If your DB password includes `#`, encode it as `%23` in the URL.

3.  **Database Migration:**
    Run `backend/schema.sql` in the Supabase SQL Editor for this project.

4.  **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    cp .env.example .env.local
    # Set NEXT_PUBLIC_SITE_URL and API_BASE_URL in .env.local
    ```

## Running Locally

1.  **Start Backend:**
    ```bash
    cd backend
    npm run fetch-now # To fetch news immediately
    npm run start     # To start the API server
    ```

2.  **Start Frontend:**
    ```bash
    cd frontend
    npm run dev
    ```
    Visit `http://localhost:3000`.

## Deployment

### Backend (Render/Fly.io)
1.  Deploy the `backend` folder as a Web Service.
2.  Set Environment Variables:
    - `DATABASE_URL`
    - `GEMINI_API_KEY`
    - `NODE_ENV=production`
    - `ALLOWED_ORIGINS=https://<your-netlify-site>.netlify.app`
3.  Command: `npm run start`.
4.  **Cron Job**: Use GitHub Actions (provided in `.github/workflows`) or a separate cron service to call an endpoint or run the script periodically.

### Frontend (Netlify)
1.  Import the repository to Netlify.
2.  Set Root Directory to `frontend`.
3.  Build command: `npm run build`.
4.  Publish directory: leave empty (Netlify Next.js plugin handles output via `netlify.toml`).
5.  Set environment variables:
    - `NEXT_PUBLIC_SITE_URL=https://<your-netlify-site>.netlify.app`
    - `API_BASE_URL=https://<your-backend-domain>`
    - `NEXT_PUBLIC_API_BASE_URL=https://<your-backend-domain>` (optional fallback)
6.  Deploy.

## Production Readiness Notes

- API endpoints use configurable base URLs instead of hardcoded localhost.
- Frontend sitemap/robots/metadata now use your production site URL.
- Backend includes:
  - readiness and health endpoints (`/readyz`, `/healthz`)
  - CORS allowlist via `ALLOWED_ORIGINS`
  - basic rate limiting via `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX_REQUESTS`
  - secure response headers and graceful shutdown
- Netlify deployment is configured in `netlify.toml`.

## Project Structure

```
news_aggregator/
├── backend/
│   ├── index.js        # Cron job entry point
│   ├── server.js       # API server
│   ├── fetcher.js      # RSS parsing
│   ├── socialFetcher.js # Reddit & Twitter logic
│   ├── summarizer.js   # AI summarization
│   └── ...
├── frontend/
│   ├── app/            # Next.js App Router pages
│   ├── components/     # React components
│   └── ...
└── .github/            # GitHub Actions
```
