import { Article } from '@/types';
import ArticleCard from '@/components/ArticleCard';
import { fetchApi } from '@/lib/api';

interface PageProps {
    params: Promise<{ region: string }>;
}

async function getArticlesByRegion(region: string) {
    try {
        return await fetchApi<Article[]>(`/region/${region}`, {
            revalidateSeconds: 300
        });
    } catch (error) {
        return [];
    }
}

export async function generateMetadata({ params }: PageProps) {
    const { region } = await params;
    return {
        title: `${region.toUpperCase()} News | Momentumz`,
    };
}

export default async function RegionPage({ params }: PageProps) {
    const { region } = await params;
    const articles = await getArticlesByRegion(region);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8 uppercase border-b border-gray-200 pb-4">
                {region} News
            </h1>

            {articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
                    <p className="text-gray-500">No articles found in this region.</p>
                </div>
            )}
        </div>
    );
}

export const revalidate = 3600;
