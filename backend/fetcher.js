const Parser = require('rss-parser');
const parser = new Parser();

const sources = [
  { url: 'http://rss.cnn.com/rss/cnn_topstories.rss', name: 'CNN', category: 'general', region: 'us' },
  { url: 'http://feeds.bbci.co.uk/news/rss.xml', name: 'BBC', category: 'general', region: 'eu' },
  { url: 'https://www.reutersagency.com/feed/?best-topics=politics&post_type=best', name: 'Reuters', category: 'politics', region: 'global' },
  { url: 'https://feeds.feedburner.com/TechCrunch/', name: 'TechCrunch', category: 'tech', region: 'global' },
  { url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss', name: 'NASA', category: 'science', region: 'global' }
];

const { fetchSocial } = require('./socialFetcher');

async function fetchAll() {
  let articles = [];
  console.log('Starting fetch from RSS sources...');

  for (let source of sources) {
    try {
      console.log(`Fetching from ${source.name}...`);
      const feed = await parser.parseURL(source.url);

      feed.items.forEach(item => {
        // Basic validation
        if (!item.title || !item.link) return;

        articles.push({
          title: item.title,
          link: item.link,
          content: item.content || item.contentSnippet || item.summary || '',
          pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
          source: source.name,
          category: source.category,
          region: source.region,
          originUrl: source.url
        });
      });
      console.log(` fetched ${feed.items.length} items from ${source.name}`);
    } catch (err) {
      console.error(`Failed to fetch ${source.name} (${source.url}):`, err.message);
    }
  }

  // Fetch from Social Media
  try {
    console.log('Starting fetch from Social Media...');
    const socialArticles = await fetchSocial();
    console.log(` fetched ${socialArticles.length} items from Social Media`);
    articles = articles.concat(socialArticles);
  } catch (err) {
    console.error('Failed to fetch from Social Media:', err.message);
  }

  return articles;
}

module.exports = fetchAll;
