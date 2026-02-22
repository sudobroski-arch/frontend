import { Article } from '@/types';
import ArticleCard from '@/components/ArticleCard';
import { fetchApi } from '@/lib/api';

interface PageProps {
    params: Promise<{ category: string }>;
}

async function getArticlesByCategory(category: string) {
    try {
        return await fetchApi<Article[]>(`/category/${category}`, {
            revalidateSeconds: 300
        });
    } catch (error) {
        return [];
    }
}

export async function generateMetadata({ params }: PageProps) {
    const { category } = await params;
    return {
        title: `${category.charAt(0).toUpperCase() + category.slice(1)} News | Momentumz`,
    };
}

export default async function CategoryPage({ params }: PageProps) {
    const { category } = await params;
    const articles = await getArticlesByCategory(category);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8 capitalize border-b border-gray-200 pb-4">
                {category} News
            </h1>

            {articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
                    <p className="text-gray-500">No articles found in this category.</p>
                </div>
            )}
        </div>
    );
}

export const revalidate = 3600;
