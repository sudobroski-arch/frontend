const axios = require('axios');
const Parser = require('rss-parser');
const parser = new Parser();

const REDDIT_SOURCES = [
    { subreddit: 'news', category: 'general', region: 'global' },
    { subreddit: 'worldnews', category: 'general', region: 'global' },
    { subreddit: 'technology', category: 'tech', region: 'global' },
    { subreddit: 'science', category: 'science', region: 'global' },
    { subreddit: 'politics', category: 'politics', region: 'us' }
];

const TWITTER_USERS = [ // Using Nitter instances
    { username: 'CNN', category: 'general', region: 'us' },
    { username: 'BBCWorld', category: 'general', region: 'eu' },
    { username: 'Reuters', category: 'general', region: 'global' },
    { username: 'TechCrunch', category: 'tech', region: 'global' },
    { username: 'NASA', category: 'science', region: 'global' }
];

// List of Public Nitter Instances (these change frequently, update as needed)
const NITTER_INSTANCES = [
    'https://nitter.net',
    'https://nitter.cz',
    'https://nitter.privacydev.net',
    'https://nitter.projectsegfau.lt'
];

async function fetchReddit() {
    let articles = [];
    console.log('Fetching from Reddit...');

    for (let source of REDDIT_SOURCES) {
        try {
            const url = `https://www.reddit.com/r/${source.subreddit}/hot.json?limit=10`;
            const response = await axios.get(url, {
                headers: { 'User-Agent': 'NewsAggregator/1.0' } // Required by Reddit API
            });

            const posts = response.data.data.children;
            posts.forEach(post => {
                const data = post.data;
                if (data.stickied || data.is_self) return; // Skip pinned posts and self-posts (usually discussions, looking for news links)

                articles.push({
                    title: data.title,
                    link: data.url, // Ensure we link to the external article, not the reddit thread
                    content: `Discussed on r/${source.subreddit}. Upvotes: ${data.ups}`,
                    pubDate: new Date(data.created_utc * 1000),
                    source: `Reddit (r/${source.subreddit})`,
                    category: source.category,
                    region: source.region,
                    originUrl: `https://reddit.com${data.permalink}`
                });
            });
            console.log(` fetched ${articles.length} posts from r/${source.subreddit}`);
        } catch (err) {
            console.error(`Failed to fetch r/${source.subreddit}:`, err.message);
        }
    }
    return articles;
}

async function fetchTwitter() {
    let articles = [];
    console.log('Fetching from Twitter (via Nitter)...');

    // Try to find a working instance
    let workingInstance = null;
    for (let instance of NITTER_INSTANCES) {
        try {
            // Test fetch
            await parser.parseURL(`${instance}/CNN/rss`);
            workingInstance = instance;
            console.log(`Using Nitter instance: ${workingInstance}`);
            break;
        } catch (e) {
            console.log(`Instance ${instance} failed, trying next...`);
        }
    }

    if (!workingInstance) {
        console.error('No working Nitter/Twitter instances found.');
        return [];
    }

    for (let source of TWITTER_USERS) {
        try {
            const feed = await parser.parseURL(`${workingInstance}/${source.username}/rss`);
            feed.items.forEach(item => {
                articles.push({
                    title: item.title, // Use tweet content as title for better clustering
                    link: item.link,
                    content: item.contentSnippet || item.content,
                    pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
                    source: `Twitter (@${source.username})`,
                    category: source.category,
                    region: source.region,
                    originUrl: item.link
                });
            });
            console.log(` fetched ${feed.items.length} tweets from @${source.username}`);
        } catch (err) {
            console.error(`Failed to fetch @${source.username}:`, err.message);
        }
    }
    return articles;
}

async function fetchSocial() {
    const [redditNews, twitterNews] = await Promise.all([
        fetchReddit(),
        fetchTwitter()
    ]);

    return [...redditNews, ...twitterNews];
}

module.exports = { fetchSocial };
