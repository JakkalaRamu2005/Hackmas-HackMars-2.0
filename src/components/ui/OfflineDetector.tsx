"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Wifi } from "lucide-react";

export const OfflineDetector = () => {
    const [isOnline, setIsOnline] = useState(true);
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        // Set initial state
        setIsOnline(navigator.onLine);

        const handleOnline = () => {
            setIsOnline(true);
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowNotification(true);
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    return (
        <AnimatePresence>
            {showNotification && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]"
                >
                    <div
                        className={`px-6 py-3 rounded-full shadow-2xl backdrop-blur-xl border-2 flex items-center gap-3 ${isOnline
                                ? "bg-green-500/90 border-green-400 text-white"
                                : "bg-red-500/90 border-red-400 text-white"
                            }`}
                    >
                        {isOnline ? (
                            <>
                                <Wifi className="w-5 h-5" />
                                <span className="font-bold">Back Online! 🎄</span>
                            </>
                        ) : (
                            <>
                                <WifiOff className="w-5 h-5" />
                                <span className="font-bold">You're Offline</span>
                            </>
                        )}
                    </div>
                </motion.div>
            )}

            {!isOnline && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="bg-gradient-to-br from-red-900/95 via-orange-900/95 to-red-900/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border-2 border-red-500/30 shadow-2xl text-center"
                    >
                        {/* Icon */}
                        <motion.div
                            animate={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="inline-block p-6 bg-red-500/20 rounded-full mb-6"
                        >
                            <WifiOff className="w-16 h-16 text-red-400" />
                        </motion.div>

                        {/* Message */}
                        <h2 className="text-3xl font-bold text-white mb-3">
                            No Internet Connection
                        </h2>
                        <p className="text-gray-200 mb-6">
                            Don't worry! Your progress is saved locally. You can continue
                            working offline, and your data will sync when you're back online.
                        </p>

                        {/* Features Available Offline */}
                        <div className="bg-white/10 rounded-xl p-4 mb-6 text-left">
                            <p className="text-white font-bold mb-3 text-center">
                                ✅ Available Offline:
                            </p>
                            <ul className="text-gray-200 text-sm space-y-2">
                                <li className="flex items-center gap-2">
                                    <span className="text-green-400">✓</span>
                                    View your calendar
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-400">✓</span>
                                    Mark tasks as complete
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-400">✓</span>
                                    Track your progress
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-400">✓</span>
                                    View analytics
                                </li>
                            </ul>
                        </div>

                        {/* Not Available Offline */}
                        <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30 text-left">
                            <p className="text-red-300 font-bold mb-3 text-center">
                                ⚠️ Requires Internet:
                            </p>
                            <ul className="text-red-200 text-sm space-y-2">
                                <li className="flex items-center gap-2">
                                    <span className="text-red-400">✗</span>
                                    AI syllabus generation
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-red-400">✗</span>
                                    Study buddy chat
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-red-400">✗</span>
                                    Data sync across devices
                                </li>
                            </ul>
                        </div>

                        {/* Retry Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.location.reload()}
                            className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-christmas-green to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                        >
                            Try Again
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Hook for checking online status
export const useOnlineStatus = () => {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        setIsOnline(navigator.onLine);

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    return isOnline;
};
