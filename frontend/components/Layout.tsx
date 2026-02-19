import Header from './Header';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
            <footer className="bg-white border-t border-gray-100 mt-12 py-8 text-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} NewsAI Aggregator. All rights reserved.</p>
                <p className="mt-2 text-xs">Powered by RSS feeds and AI Summarization.</p>
            </footer>
        </div>
    );
}
