'use client';

import { signIn, signOut } from "@/auth";
import { Session } from "next-auth";

export default function SignInClient({ session }: { session: Session | null }) {
    const user = session?.user;

    return user ? (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h1>
            <p className="mb-6">You are already signed in.</p>
            <button
                onClick={() => signOut()}
                className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
                Sign Out
            </button>
        </div>
    ) : (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Sign In</h1>
            <p className="mb-6">Please sign in to continue.</p>
            <button
                onClick={() => signIn("google")}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Sign In with Google
            </button>
        </div>
    );
}
