import Link from 'next/link';
import { Article } from '@/types';
import ArticleCard from '@/components/ArticleCard';
import axios from 'axios';

async function getArticles() {
  try {
    const res = await axios.get('http://localhost:4000/articles', {
      timeout: 5000
    });
    return res.data as Article[];
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return [];
  }
}

export default async function Home() {
  const articles = await getArticles();

  return (
    <div className="space-y-8">
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Global News <span className="text-blue-600">Reimagined</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
          AI-curated summaries from trusted sources worldwide.
          Stay informed without the noise.
        </p>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Latest Updates</h2>
          <Link href="/category/general" className="text-blue-600 hover:text-blue-800 font-medium">
            View all &rarr;
          </Link>
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No articles found. Please check back later or ensure the backend is running.</p>
          </div>
        )}
      </section>
    </div>
  );
}

// Revalidate every hour
export const revalidate = 3600;
