"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import { grinchModeStorage, isUrlBlocked } from "@/lib/grinchMode";

export const GrinchBlocker = () => {
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockedSite, setBlockedSite] = useState("");
    const [settings, setSettings] = useState(grinchModeStorage.loadSettings());

    useEffect(() => {
        // Check current URL
        const checkUrl = () => {
            const currentUrl = window.location.href;
            const blocked = isUrlBlocked(currentUrl, settings.blockedWebsites);

            if (blocked && settings.isEnabled) {
                const urlObj = new URL(currentUrl);
                setBlockedSite(urlObj.hostname);
                setIsBlocked(true);
            }
        };

        checkUrl();

        // Listen for settings changes
        const handleStorageChange = () => {
            setSettings(grinchModeStorage.loadSettings());
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [settings.blockedWebsites, settings.isEnabled]);

    const handleOverride = () => {
        // Temporarily disable for this session
        const newSettings = { ...settings, isEnabled: false };
        grinchModeStorage.saveSettings(newSettings);
        setIsBlocked(false);
    };

    if (!isBlocked) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-christmas-green"
                style={{ isolation: "isolate" }}
            >
                {/* Grinch Animation Background */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Snowflakes */}
                    {[...Array(30)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: -20, x: Math.random() * window.innerWidth }}
                            animate={{
                                y: window.innerHeight + 20,
                                x: Math.random() * window.innerWidth,
                            }}
                            transition={{
                                duration: Math.random() * 3 + 5,
                                repeat: Infinity,
                                delay: Math.random() * 5,
                            }}
                            className="absolute w-2 h-2 bg-white rounded-full opacity-60"
                        />
                    ))}
                </div>

                {/* Content */}
                <motion.div
                    initial={{ scale: 0.8, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    className="relative bg-white rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl text-center"
                >
                    {/* Grinch Emoji/Icon */}
                    <motion.div
                        animate={{
                            rotate: [0, -10, 10, -10, 0],
                            scale: [1, 1.1, 1, 1.1, 1],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-9xl mb-4"
                    >
                        😈
                    </motion.div>

                    <h1 className="text-4xl font-bold text-christmas-red mb-4 font-[family-name:var(--font-christmas)]">
                        The Grinch Says NO! 🎄
                    </h1>

                    <div className="bg-red-50 border-2 border-christmas-red rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <AlertTriangle className="w-5 h-5 text-christmas-red" />
                            <p className="font-bold text-christmas-red">Blocked Website</p>
                        </div>
                        <p className="text-gray-700 font-mono text-sm break-all">{blockedSite}</p>
                    </div>

                    <p className="text-gray-700 text-lg mb-6">
                        You're in <span className="font-bold text-christmas-red">Grinch Mode</span>!
                        This site is blocked during your study session.
                    </p>

                    <div className="space-y-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.history.back()}
                            className="w-full bg-christmas-green text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition-colors"
                        >
                            🎅 Go Back to Studying
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleOverride}
                            className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors text-sm"
                        >
                            Disable Grinch Mode (Not Recommended)
                        </motion.button>
                    </div>

                    <p className="text-xs text-gray-500 mt-4">
                        💡 Tip: Stay focused and earn more points for your Christmas tree!
                    </p>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-white/10 backdrop-blur-sm" />
            </motion.div>
        </AnimatePresence>
    );
};
