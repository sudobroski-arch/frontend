'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Zap } from 'lucide-react';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/category/politics', label: 'Politics' },
    { href: '/category/tech', label: 'Tech' },
    { href: '/category/science', label: 'Science' },
    { href: '/category/general', label: 'General' },
];

const regionLinks = [
    { href: '/region/us', label: 'US' },
    { href: '/region/eu', label: 'Europe' },
    { href: '/region/global', label: 'Global' },
];

export default function Header() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                                <Zap className="h-6 w-6 text-indigo-600" />
                                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                    Momentumz
                                </span>
                            </Link>
                            <nav className="hidden md:ml-8 md:flex md:space-x-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="border-l border-gray-200 h-6 mx-1 self-center"></div>
                                {regionLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                        <button
                            className="md:hidden text-gray-500 hover:text-gray-700 p-2 rounded-md"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-[100] md:hidden" role="dialog" aria-modal="true">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setSidebarOpen(false)}
                    />

                    {/* Sidebar Panel */}
                    <div className="fixed inset-y-0 right-0 w-72 bg-white shadow-2xl flex flex-col animate-slide-in">
                        {/* Sidebar Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-indigo-600" />
                                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                    Momentumz
                                </span>
                            </div>
                            <button
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-md"
                                onClick={() => setSidebarOpen(false)}
                                aria-label="Close menu"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                            <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Categories
                            </p>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block px-3 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-sm font-medium transition-colors"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <div className="my-4 border-t border-gray-100" />

                            <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Regions
                            </p>
                            {regionLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block px-3 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-sm font-medium transition-colors"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Sidebar Footer */}
                        <div className="px-5 py-4 border-t border-gray-100 text-xs text-gray-400 text-center">
                            &copy; {new Date().getFullYear()} Momentumz
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
