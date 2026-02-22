const fetchAll = require('./fetcher');
const clusterArticles = require('./cluster');
const summarize = require('./summarizer');
const db = require('./db');
const cron = require('node-cron');
require('./env');

async function run() {
    console.log('Fetching news...');
    try {
        const connected = await db.ensureConnection(3, 2000);
        if (!connected) {
            console.error('Skipping cycle: database is unavailable.');
            return;
        }

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
                if (!Array.isArray(cluster) || cluster.length === 0) {
                    console.log('Skipping empty cluster');
                    continue;
                }

                // Check if cluster already exists in DB (check by source URLs)
                // We use ANY operator for array check
                const links = cluster
                    .map((article) => (typeof article.link === 'string' ? article.link.trim() : ''))
                    .filter(Boolean);

                if (links.length === 0) {
                    console.log('Skipping cluster with no valid source links');
                    continue;
                }

                const { rows } = await db.query(
                    'SELECT id FROM articles WHERE source_urls && $1::text[]',
                    [links]
                );

                if (rows.length > 0) {
                    console.log(`Skipping duplicate cluster (First title: ${cluster[0]?.title || 'untitled'})`);
                    continue;
                }

                // Combine content logic
                // We take the longest content or just concatenate a few?
                // Let's just take the longest one to summarize, to avoid noise.
                const longestArticle = cluster.reduce((prev, current) => {
                    const previousLength = typeof prev?.content === 'string' ? prev.content.length : 0;
                    const currentLength = typeof current?.content === 'string' ? current.content.length : 0;
                    return previousLength > currentLength ? prev : current;
                }, cluster[0]);

                const representativeTitle = cluster[0]?.title || 'Untitled';
                console.log(`Summarizing cluster: ${representativeTitle}`);
                const summary = await summarize(longestArticle?.content || representativeTitle, 250);

                // Generate title - ideally use AI, for now use the representative title
                const title = representativeTitle;

                // Determine category/region (majority vote)
                const categories = cluster.map(a => a.category);
                const category = categories.sort((a, b) =>
                    categories.filter(v => v === a).length - categories.filter(v => v === b).length
                ).pop() || 'general';

                const regions = cluster.map(a => a.region);
                const region = regions.sort((a, b) =>
                    regions.filter(v => v === a).length - regions.filter(v => v === b).length
                ).pop() || 'global';

                await db.query(
                    `INSERT INTO articles (title, summary, source_urls, source_names, category, region, published_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [
                        title,
                        summary,
                        links,
                        cluster.map(a => a.source || 'Unknown'),
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
