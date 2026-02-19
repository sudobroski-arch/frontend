import Link from 'next/link';
import { Menu, Search, User } from 'lucide-react';

export default function Header() {
    return (
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                NewsAI
                            </span>
                        </Link>
                        <nav className="hidden md:ml-8 md:flex md:space-x-8">
                            <Link href="/" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                                Home
                            </Link>
                            <Link href="/category/politics" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                                Politics
                            </Link>
                            <Link href="/category/tech" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                                Tech
                            </Link>
                            <Link href="/category/science" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                                Science
                            </Link>
                            <div className="border-l border-gray-200 h-6 mx-2"></div>
                            <Link href="/region/us" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                                US
                            </Link>
                            <Link href="/region/eu" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                                Europe
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="text-gray-400 hover:text-gray-500">
                            <span className="sr-only">Search</span>
                            <Search className="h-6 w-6" />
                        </button>
                        <button className="md:hidden text-gray-400 hover:text-gray-500">
                            <span className="sr-only">Menu</span>
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
