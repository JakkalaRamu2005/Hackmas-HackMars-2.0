"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Calendar, BarChart3, Settings, LogOut } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";

interface NavbarProps {
    currentView: "hero" | "input" | "calendar" | "analytics";
    onNavigate: (view: "hero" | "calendar" | "analytics") => void;
    onReset?: () => void;
}

export const Navbar = ({ currentView, onNavigate, onReset }: NavbarProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data: session, status } = useSession();

    const navItems = [
        { id: "hero", label: "Home", icon: Home, view: "hero" as const },
        { id: "calendar", label: "Calendar", icon: Calendar, view: "calendar" as const },
        { id: "analytics", label: "Analytics", icon: BarChart3, view: "analytics" as const },
    ];

    const handleNavClick = (view: "hero" | "calendar" | "analytics") => {
        onNavigate(view);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => handleNavClick("hero")}
                        >
                            <span className="text-3xl">🎄</span>
                            <div className="hidden sm:block">
                                <h1 className="text-xl font-bold text-white font-[family-name:var(--font-christmas)]">
                                    StudyAdvent.ai
                                </h1>
                                <p className="text-xs text-gray-300">Your Christmas Study Companion</p>
                            </div>
                            <div className="sm:hidden">
                                <h1 className="text-lg font-bold text-white font-[family-name:var(--font-christmas)]">
                                    StudyAdvent
                                </h1>
                            </div>
                        </motion.div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-2">
                            {navItems.map((item) => (
                                <motion.button
                                    key={item.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleNavClick(item.view)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentView === item.view
                                            ? "bg-christmas-red text-white"
                                            : "text-gray-300 hover:bg-white/10 hover:text-white"
                                        }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </motion.button>
                            ))}
                        </div>

                        {/* Auth Section */}
                        <div className="hidden md:flex items-center gap-3">
                            {status === "loading" ? (
                                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : session?.user ? (
                                <div className="flex items-center gap-3">
                                    {session.user.image && (
                                        <img
                                            src={session.user.image}
                                            alt={session.user.name || "User"}
                                            className="w-8 h-8 rounded-full border-2 border-christmas-gold"
                                        />
                                    )}
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-white">{session.user.name}</p>
                                        <p className="text-xs text-gray-300 flex items-center gap-1">
                                            <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                            Synced
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => signOut()}
                                        className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                        title="Sign Out"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => signIn("google")}
                                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg text-sm text-white transition-all"
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
                                    Sign In
                                </button>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="fixed top-16 left-0 right-0 z-40 md:hidden bg-white/10 backdrop-blur-md border-b border-white/20 overflow-hidden"
                    >
                        <div className="px-4 py-4 space-y-2">
                            {/* Navigation Items */}
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavClick(item.view)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${currentView === item.view
                                            ? "bg-christmas-red text-white"
                                            : "text-gray-300 hover:bg-white/10 hover:text-white"
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            ))}

                            {/* Divider */}
                            <div className="border-t border-white/20 my-2"></div>

                            {/* Auth Section */}
                            {status === "loading" ? (
                                <div className="flex justify-center py-4">
                                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                </div>
                            ) : session?.user ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg">
                                        {session.user.image && (
                                            <img
                                                src={session.user.image}
                                                alt={session.user.name || "User"}
                                                className="w-10 h-10 rounded-full border-2 border-christmas-gold"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-white">{session.user.name}</p>
                                            <p className="text-xs text-gray-300">{session.user.email}</p>
                                            <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                                                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                                Synced to cloud
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            signOut();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-all"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span className="font-medium">Sign Out</span>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        signIn("google");
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-3 rounded-lg text-white transition-all"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                                </button>
                            )}

                            {/* Reset Button (if on calendar) */}
                            {currentView === "calendar" && onReset && (
                                <>
                                    <div className="border-t border-white/20 my-2"></div>
                                    <button
                                        onClick={() => {
                                            onReset();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-all"
                                    >
                                        <Settings className="w-5 h-5" />
                                        <span className="font-medium">Reset Calendar</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Spacer to prevent content from going under navbar */}
            <div className="h-16"></div>
        </>
    );
};
