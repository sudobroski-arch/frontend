const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Get all articles with pagination
app.get('/articles', async (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    try {
        const { rows } = await db.query(
            'SELECT * FROM articles ORDER BY published_at DESC LIMIT $1 OFFSET $2',
            [limit, offset]
        );
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
    const { category } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    try {
        const { rows } = await db.query(
            'SELECT * FROM articles WHERE category = $1 ORDER BY published_at DESC LIMIT $2 OFFSET $3',
            [category, limit, offset]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get by region
app.get('/region/:region', async (req, res) => {
    const { region } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    try {
        const { rows } = await db.query(
            'SELECT * FROM articles WHERE region = $1 ORDER BY published_at DESC LIMIT $2 OFFSET $3',
            [region, limit, offset]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
