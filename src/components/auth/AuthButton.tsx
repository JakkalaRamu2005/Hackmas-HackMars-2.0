"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";

export const AuthButton = () => {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    if (session?.user) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full"
            >
                {session.user.image && (
                    <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-8 h-8 rounded-full border-2 border-christmas-gold"
                    />
                )}
                <div className="text-sm text-white">
                    <p className="font-medium">{session.user.name}</p>
                </div>
                <button
                    onClick={() => signOut()}
                    className="text-xs text-gray-300 hover:text-white transition-colors px-2 py-1 bg-white/10 rounded-full"
                >
                    Sign Out
                </button>
            </motion.div>
        );
    }

    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => signIn("google")}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-sm text-white hover:bg-white/20 transition-all"
        >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
            </svg>
            Sign in with Google
        </motion.button>
    );
};
