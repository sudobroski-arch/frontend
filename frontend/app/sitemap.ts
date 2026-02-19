import { MetadataRoute } from 'next';
import axios from 'axios';
import { Article } from '@/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://example.com'; // Replace with actual domain

    // Static routes
    const routes = [
        '',
        '/category/politics',
        '/category/tech',
        '/category/science',
        '/region/us',
        '/region/eu',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic article routes
    let articles: Article[] = [];
    try {
        const res = await axios.get('http://localhost:4000/articles?limit=100');
        articles = res.data;
    } catch (error) {
        console.error('Failed to fetch articles for sitemap');
    }

    const articleRoutes = articles.map((article) => ({
        url: `${baseUrl}/article/${article.id}`,
        lastModified: new Date(article.published_at),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [...routes, ...articleRoutes];
}
