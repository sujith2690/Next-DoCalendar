
import Link from 'next/link';
import { auth, signIn, signOut } from "@/auth";

export default async function Header() {
    const session = await auth();
    const user = session?.user;

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-blue-600">
                    DoCalender
                </Link>
                {/* Navigation Links */}
                <nav className="space-x-6 hidden md:block">
                    <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                        Home
                    </Link>
                    <Link href="/myCalendar" className="text-gray-700 hover:text-blue-600 font-medium">
                        My Calendar
                    </Link>
                    <Link href="/addEvent" className="text-gray-700 hover:text-blue-600 font-medium">
                        Add Event
                    </Link>
                    <Link href="/profile/1" className="text-gray-700 hover:text-blue-600 font-medium">
                        Profile
                    </Link>
                </nav>

                {/* Auth Button */}
                {user ? (
                    <form action={async () => {
                        "use server";
                        await signOut({ redirectTo: '/login'});
                    }}>
                        <button
                            type="submit"
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
                        >
                            Logout
                        </button>
                    </form>
                ) : (
                    <Link
                        href="/login"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                    >
                        Login
                    </Link>
                )}
            </div>
        </header>
    );
}
