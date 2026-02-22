import { MetadataRoute } from 'next';
import { Article } from '@/types';
import { fetchApi, getSiteUrl } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = getSiteUrl();

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
        articles = await fetchApi<Article[]>('/articles?limit=100', {
            revalidateSeconds: 3600
        });
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
