// components/Header.tsx

'use client';

import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-blue-600">
                    DoCalender
                </Link>

                {/* Navigation Links */}
                <nav className="space-x-6 hidden md:block">
                    <Link href="/calendar" className="text-gray-700 hover:text-blue-600 font-medium">
                        Calendar
                    </Link>
                    <Link href="/events" className="text-gray-700 hover:text-blue-600 font-medium">
                        Events
                    </Link>
                    <Link href="/profile" className="text-gray-700 hover:text-blue-600 font-medium">
                        Profile
                    </Link>
                </nav>

                {/* Action Button / Auth */}
                <Link
                    href="/login"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                >
                    Login
                </Link>
            </div>
        </header>
    );
}
