import Link from 'next/link';
import { Article } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface ArticleCardProps {
    article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-gray-100">
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <span className="inline-block px-2 py-1 text-xs font-semibold tracking-wide text-blue-600 uppercase bg-blue-50 rounded-full">
                        {article.category}
                    </span>
                    <span className="text-xs text-gray-500 uppercase">{article.region}</span>
                </div>

                <Link href={`/article/${article.id}`} className="block mt-2">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight hover:text-blue-600 transition-colors">
                        {article.title}
                    </h3>
                </Link>

                <p className="mt-3 text-gray-600 line-clamp-3 text-sm leading-relaxed">
                    {article.summary}
                </p>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-700">Sources:</span>
                    <span className="truncate max-w-[150px]">{article.source_names.join(', ')}</span>
                </div>
                <time dateTime={article.published_at}>
                    {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
                </time>
            </div>
        </div>
    );
}
