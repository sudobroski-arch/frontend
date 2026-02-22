const express = require('express');
const cors = require('cors');
const compression = require('compression');
const NodeCache = require('node-cache');
const db = require('./db');
const {
    port,
    allowedOrigins,
    rateLimitWindowMs,
    rateLimitMaxRequests,
    isProduction
} = require('./env');

const app = express();
const apiCache = new NodeCache({ stdTTL: 60, checkperiod: 120 });
let server;
const requestLog = new Map();

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(compression());

app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    if (isProduction) {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }
    next();
});

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'HEAD', 'OPTIONS']
}));

app.use(express.json({ limit: '100kb' }));

app.use((req, res, next) => {
    const now = Date.now();
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const current = requestLog.get(ip);

    if (!current || now - current.windowStart >= rateLimitWindowMs) {
        requestLog.set(ip, { count: 1, windowStart: now });
        return next();
    }

    if (current.count >= rateLimitMaxRequests) {
        return res.status(429).json({
            error: 'Too many requests',
            retryAfterMs: Math.max(rateLimitWindowMs - (now - current.windowStart), 0)
        });
    }

    current.count += 1;
    return next();
});

setInterval(() => {
    const now = Date.now();
    for (const [ip, current] of requestLog.entries()) {
        if (now - current.windowStart >= rateLimitWindowMs) {
            requestLog.delete(ip);
        }
    }
}, rateLimitWindowMs).unref();

function parseLimit(rawValue, fallback = 20, max = 100) {
    const value = Number.parseInt(rawValue, 10);
    if (!Number.isFinite(value) || value <= 0) {
        return fallback;
    }
    return Math.min(value, max);
}

function parseOffset(rawValue) {
    const value = Number.parseInt(rawValue, 10);
    if (!Number.isFinite(value) || value < 0) {
        return 0;
    }
    return value;
}

app.get('/healthz', (req, res) => {
    res.status(200).json({
        status: 'ok',
        uptimeSeconds: Math.round(process.uptime()),
        timestamp: new Date().toISOString()
    });
});

app.get('/readyz', async (req, res) => {
    try {
        await db.query('SELECT 1');
        res.status(200).json({ status: 'ready' });
    } catch (err) {
        console.error('[readyz] readiness check failed:', err.message);
        res.status(503).json({ status: 'not-ready' });
    }
});

// Get all articles with pagination
app.get('/articles', async (req, res) => {
    const limit = parseLimit(req.query.limit);
    const offset = parseOffset(req.query.offset);
    const cacheKey = `articles_${limit}_${offset}`;

    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');

    const cached = apiCache.get(cacheKey);
    if (cached) return res.json(cached);

    try {
        const { rows } = await db.query(
            'SELECT * FROM articles ORDER BY published_at DESC LIMIT $1 OFFSET $2',
            [limit, offset]
        );
        apiCache.set(cacheKey, rows);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get single article
app.get('/articles/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await db.query('SELECT * FROM articles WHERE id = $1', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Article not found' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get by category
app.get('/category/:category', async (req, res) => {
    const category = String(req.params.category || '').toLowerCase();
    const limit = parseLimit(req.query.limit);
    const offset = parseOffset(req.query.offset);
    const cacheKey = `category_${category}_${limit}_${offset}`;

    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');

    if (!category) {
        return res.status(400).json({ error: 'Category is required' });
    }

    const cached = apiCache.get(cacheKey);
    if (cached) return res.json(cached);

    try {
        const { rows } = await db.query(
            'SELECT * FROM articles WHERE category = $1 ORDER BY published_at DESC LIMIT $2 OFFSET $3',
            [category, limit, offset]
        );
        apiCache.set(cacheKey, rows);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get by region
app.get('/region/:region', async (req, res) => {
    const region = String(req.params.region || '').toLowerCase();
    const limit = parseLimit(req.query.limit);
    const offset = parseOffset(req.query.offset);
    const cacheKey = `region_${region}_${limit}_${offset}`;

    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');

    if (!region) {
        return res.status(400).json({ error: 'Region is required' });
    }

    const cached = apiCache.get(cacheKey);
    if (cached) return res.json(cached);

    try {
        const { rows } = await db.query(
            'SELECT * FROM articles WHERE region = $1 ORDER BY published_at DESC LIMIT $2 OFFSET $3',
            [region, limit, offset]
        );
        apiCache.set(cacheKey, rows);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ error: 'CORS origin denied' });
    }
    console.error('[server] Unhandled error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
});

async function startServer() {
    const connected = await db.ensureConnection();
    if (!connected) {
        process.exit(1);
    }

    server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

async function shutdown(signal) {
    console.log(`[server] Received ${signal}, shutting down...`);

    if (server) {
        await new Promise((resolve) => server.close(resolve));
    }
    await db.close();
    process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

startServer().catch((err) => {
    console.error('[server] Failed to start:', err);
    process.exit(1);
});
