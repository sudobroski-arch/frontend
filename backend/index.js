const fetchAll = require('./fetcher');
const clusterArticles = require('./cluster');
const summarize = require('./summarizer');
const db = require('./db');
const cron = require('node-cron');
require('dotenv').config();

async function run() {
    console.log('Fetching news...');
    try {
        const articles = await fetchAll();
        console.log(`Fetched ${articles.length} raw articles`);

        if (articles.length === 0) {
            console.log('No articles fetched.');
            return;
        }

        const clusters = clusterArticles(articles);
        console.log(`Clustered into ${clusters.length} groups`);

        for (let cluster of clusters) {
            try {
                // Check if cluster already exists in DB (check by source URLs)
                // We use ANY operator for array check
                const links = cluster.map(a => a.link);
                const { rows } = await db.query(
                    'SELECT id FROM articles WHERE source_urls && $1',
                    [links]
                );

                if (rows.length > 0) {
                    console.log(`Skipping duplicate cluster (First title: ${cluster[0].title})`);
                    continue;
                }

                // Combine content logic
                // We take the longest content or just concatenate a few?
                // Let's just take the longest one to summarize, to avoid noise.
                const longestArticle = cluster.reduce((prev, current) =>
                    (prev.content.length > current.content.length) ? prev : current
                );

                console.log(`Summarizing cluster: ${cluster[0].title}`);
                const summary = await summarize(longestArticle.content, 250);

                // Generate title - ideally use AI, for now use the representative title
                const title = cluster[0].title;

                // Determine category/region (majority vote)
                const categories = cluster.map(a => a.category);
                const category = categories.sort((a, b) =>
                    categories.filter(v => v === a).length - categories.filter(v => v === b).length
                ).pop();

                const regions = cluster.map(a => a.region);
                const region = regions.sort((a, b) =>
                    regions.filter(v => v === a).length - regions.filter(v => v === b).length
                ).pop();

                await db.query(
                    `INSERT INTO articles (title, summary, source_urls, source_names, category, region, published_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [
                        title,
                        summary,
                        cluster.map(a => a.link),
                        cluster.map(a => a.source),
                        category,
                        region,
                        new Date()
                    ]
                );
                console.log(`Saved article: ${title}`);
            } catch (err) {
                console.error(`Error processing cluster: ${err.message}`);
            }
        }
        console.log('Finished processing cycle');
    } catch (err) {
        console.error('Fatal error in run loop:', err);
    }
}

// Run immediately on start if flag present
if (process.argv.includes('--run-now')) {
    run();
}

// Schedule task
// '0 * * * *' = Every hour
cron.schedule('0 * * * *', () => {
    console.log('Running scheduled task...');
    run();
});

console.log('News Aggregator Service Started. Scheduled to run hourly.');
