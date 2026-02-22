# Frontend (Netlify)

This frontend is a Next.js App Router application configured for Netlify deployment.

## Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Default local URL: `http://localhost:3000`

## Required Environment Variables

- `NEXT_PUBLIC_SITE_URL`: Public site URL (used in metadata, robots, sitemap).
- `API_BASE_URL`: Backend API base URL for server-side data fetching.
- `NEXT_PUBLIC_API_BASE_URL` (optional): Fallback API URL if `API_BASE_URL` is not set.

## Build

```bash
npm run build
npm run start
```

## Deploy to Netlify

- Root contains `netlify.toml` pointing build base to `frontend`.
- Netlify build command: `npm run build`.
- Configure env vars from the list above in Netlify site settings.
