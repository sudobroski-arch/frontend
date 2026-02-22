import Link from 'next/link';
import Header from './Header';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
                {children}
            </main>
            <footer className="bg-gray-900 text-gray-300 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Brand Column */}
                        <div>
                            <h3 className="text-xl font-bold text-white mb-3">Momentumz</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                AI-curated news summaries from trusted sources worldwide.
                                Stay informed without the noise — politics, tech, and science distilled into what matters.
                            </p>
                        </div>

                        {/* Categories Column */}
                        <div>
                            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Categories</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/category/politics" className="hover:text-white transition-colors">Politics</Link></li>
                                <li><Link href="/category/tech" className="hover:text-white transition-colors">Technology</Link></li>
                                <li><Link href="/category/science" className="hover:text-white transition-colors">Science</Link></li>
                                <li><Link href="/category/general" className="hover:text-white transition-colors">General</Link></li>
                            </ul>
                        </div>

                        {/* Regions Column */}
                        <div>
                            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Regions</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/region/us" className="hover:text-white transition-colors">United States</Link></li>
                                <li><Link href="/region/eu" className="hover:text-white transition-colors">Europe</Link></li>
                                <li><Link href="/region/global" className="hover:text-white transition-colors">Global</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                        <p>&copy; {new Date().getFullYear()} Momentumz. All rights reserved.</p>
                        <p>Powered by RSS feeds &amp; AI Summarization.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
