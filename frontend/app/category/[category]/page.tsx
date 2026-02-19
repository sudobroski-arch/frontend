import { Article } from '@/types';
import ArticleCard from '@/components/ArticleCard';
import axios from 'axios';
import { notFound } from 'next/navigation';

interface PageProps {
    params: { category: string };
}

async function getArticlesByCategory(category: string) {
    try {
        const res = await axios.get(`http://localhost:4000/category/${category}`);
        return res.data as Article[];
    } catch (error) {
        return [];
    }
}

export async function generateMetadata({ params }: PageProps) {
    return {
        title: `${params.category.charAt(0).toUpperCase() + params.category.slice(1)} News | NewsAI`,
    };
}

export default async function CategoryPage({ params }: PageProps) {
    const articles = await getArticlesByCategory(params.category);

    if (!articles) {
        notFound();
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8 capitalize border-b border-gray-200 pb-4">
                {params.category} News
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
