const { Pool } = require('pg');
require('./env');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error(
        '[db] Missing DATABASE_URL. Set it in backend/.env (Supabase direct connection string).'
    );
}

try {
    // Validate early so malformed URLs fail with a clear hint.
    new URL(connectionString);
} catch {
    throw new Error(
        '[db] Invalid DATABASE_URL. If your password has special characters like #, encode them (for # use %23).'
    );
}

function isLocalConnection(url) {
    try {
        const parsed = new URL(url);
        return ['localhost', '127.0.0.1'].includes(parsed.hostname);
    } catch {
        return false;
    }
}

const pool = new Pool({
    connectionString,
    ssl: isLocalConnection(connectionString) ? false : { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 20
});

pool.on('error', (err) => {
    console.error('[db] Unexpected PostgreSQL error:', err.message);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    ensureConnection: async (retries = 5, delayMs = 2000) => {
        for (let attempt = 1; attempt <= retries; attempt += 1) {
            try {
                await pool.query('SELECT 1');
                return true;
            } catch (err) {
                if (attempt === retries) {
                    console.error(`[db] Unable to connect after ${retries} attempts: ${err.message}`);
                    return false;
                }
                await new Promise((resolve) => setTimeout(resolve, delayMs));
            }
        }
        return false;
    },
    close: () => pool.end()
};
