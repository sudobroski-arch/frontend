const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env') });

function parsePositiveInt(value, fallback) {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return fallback;
    }
    return parsed;
}

function parseCsv(value) {
    if (!value) {
        return [];
    }
    return value
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean);
}

const isProduction = process.env.NODE_ENV === 'production';
const port = parsePositiveInt(process.env.PORT, 4000);
const allowedOrigins = parseCsv(process.env.ALLOWED_ORIGINS);
const rateLimitWindowMs = parsePositiveInt(process.env.RATE_LIMIT_WINDOW_MS, 60_000);
const rateLimitMaxRequests = parsePositiveInt(process.env.RATE_LIMIT_MAX_REQUESTS, 120);

const geminiApiKey = process.env.GEMINI_API_KEY;

if (isProduction && allowedOrigins.length === 0) {
    console.warn('[env] ALLOWED_ORIGINS is empty in production. CORS is currently open.');
}

module.exports = {
    isProduction,
    port,
    allowedOrigins,
    rateLimitWindowMs,
    rateLimitMaxRequests,
    geminiApiKey
};
