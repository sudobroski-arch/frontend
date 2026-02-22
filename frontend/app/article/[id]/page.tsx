import { Article } from '@/types';
import { notFound } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Metadata } from 'next';
import { fetchApi } from '@/lib/api';

interface PageProps {
    params: Promise<{ id: string }>;
}

async function getArticle(id: string) {
    try {
        return await fetchApi<Article>(`/articles/${id}`, {
            revalidateSeconds: 300
        });
    } catch (error) {
        return null;
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const article = await getArticle(id);

    if (!article) {
        return {
            title: 'Article Not Found',
        };
    }

    return {
        title: `${article.title} | Momentumz`,
        description: article.summary.substring(0, 160),
        openGraph: {
            title: article.title,
            description: article.summary,
            type: 'article',
            publishedTime: article.published_at,
            authors: article.source_names,
            tags: [article.category, article.region],
        },
    };
}

export default async function ArticlePage({ params }: PageProps) {
    const { id } = await params;
    const article = await getArticle(id);

    if (!article) {
        notFound();
    }

    return (
        <article className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-10">
                <header className="mb-8">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                        <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase">
                            {article.category}
                        </span>
                        <span>&bull;</span>
                        <span className="uppercase">{article.region}</span>
                        <span>&bull;</span>
                        <time dateTime={article.published_at}>
                            {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
                        </time>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
                        {article.title}
                    </h1>

                    <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium mr-2">Sources:</span>
                        <span>{article.source_names.join(', ')}</span>
                    </div>
                </header>

                <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed">
                    {article.summary.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4">{paragraph}</p>
                    ))}
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Original Sources</h3>
                    <ul className="space-y-2">
                        {article.source_urls.map((url, idx) => (
                            <li key={idx}>
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                                >
                                    {url}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </article>
    );
}

export const revalidate = 3600;
