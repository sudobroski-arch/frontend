# AI News Aggregator

A complete news blog website that aggregates, summarizes, and rewrites articles from trusted sources using AI. Built with Node.js, Next.js, and free tier cloud services.

## Features

- **Automated Aggregation**: Fetches news from CNN, BBC, Reuters, etc. every hour.
- **AI Summarization**: Uses Hugging Face Inference API (`facebook/bart-large-cnn`) to generate unique summaries.
- **Clustering**: Deduplicates similar stories from different sources.
- **SEO Optimized**: Next.js SSR, sitemap, robots.txt, and metadata.
- **Region & Category Targeting**: Dedicated sections for US/EU and Politics/Tech/Science.
- **Social Media Integration**: Sourcing trending news from Reddit (based on hot posts) and Twitter (via Nitter RSS for key accounts).

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS
- **Backend**: Node.js, Express, `rss-parser`, `node-cron`
- **Database**: PostgreSQL (Supabase Free Tier)
- **AI**: Hugging Face Inference API

## Prerequisites

- Node.js 18+
- PostgreSQL Database (e.g., Supabase)
- Hugging Face API Key (Free)

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
    # Edit .env with your DATABASE_URL and HF_API_KEY
    ```

3.  **Database Migration:**
    Run the SQL commands in `backend/schema.sql` in your PostgreSQL database query editor.

4.  **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    # Update API URL in fetch calls if deploying to production
    ```

## Running Locally

1.  **Start Backend:**
    ```bash
    cd backend
    node index.js --run-now # To fetch news immediately
    node server.js          # To start the API server
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
2.  Set Environment Variables: `DATABASE_URL`, `HF_API_KEY`.
3.  Command: `node server.js`.
4.  **Cron Job**: Use GitHub Actions (provided in `.github/workflows`) or a separate cron service to call an endpoint or run the script periodically.

### Frontend (Vercel)
1.  Import the repository to Vercel.
2.  Set Root Directory to `frontend`.
3.  Deploy.

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
