"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Shield, X, Clock, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

interface DistractionBlockerProps {
    isActive: boolean;
    duration: number; // in minutes
    onEnd: () => void;
}

const DISTRACTING_SITES = [
    { name: "Facebook", domain: "facebook.com", icon: "📘" },
    { name: "Instagram", domain: "instagram.com", icon: "📷" },
    { name: "Twitter/X", domain: "twitter.com", icon: "🐦" },
    { name: "YouTube", domain: "youtube.com", icon: "▶️" },
    { name: "TikTok", domain: "tiktok.com", icon: "🎵" },
    { name: "Reddit", domain: "reddit.com", icon: "🤖" },
    { name: "Netflix", domain: "netflix.com", icon: "🎬" },
    { name: "Twitch", domain: "twitch.tv", icon: "🎮" },
];

export const DistractionBlocker = ({
    isActive,
    duration,
    onEnd,
}: DistractionBlockerProps) => {
    const [timeRemaining, setTimeRemaining] = useState(duration * 60);
    const [blockedAttempts, setBlockedAttempts] = useState(0);
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onEnd();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, onEnd]);

    // Monitor for distraction attempts (simulated)
    useEffect(() => {
        if (!isActive) return;

        const checkInterval = setInterval(() => {
            // In a real implementation, this would check if user tries to visit blocked sites
            // For demo, we'll simulate occasional attempts
            if (Math.random() < 0.05) {
                setBlockedAttempts((prev) => prev + 1);
                setShowWarning(true);
                setTimeout(() => setShowWarning(false), 3000);
            }
        }, 10000);

        return () => clearInterval(checkInterval);
    }, [isActive]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    if (!isActive) return null;

    return (
        <>
            {/* Floating Status Badge */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="fixed top-20 right-6 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2"
            >
                <Shield className="w-4 h-4" />
                <span className="font-bold text-sm">Focus Mode: {formatTime(timeRemaining)}</span>
            </motion.div>

            {/* Warning Toast */}
            <AnimatePresence>
                {showWarning && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        className="fixed top-32 right-6 z-50 bg-red-500/90 backdrop-blur-xl text-white px-6 py-4 rounded-xl shadow-2xl border-2 border-red-400 max-w-sm"
                    >
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold mb-1">Distraction Detected! 🚫</p>
                                <p className="text-sm text-red-100">
                                    Stay focused! You're in study mode. {formatTime(timeRemaining)} remaining.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats Display */}
            {blockedAttempts > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed bottom-24 right-6 z-40 bg-black/80 backdrop-blur-xl text-white px-4 py-2 rounded-lg text-sm"
                >
                    🛡️ Blocked {blockedAttempts} distraction{blockedAttempts !== 1 ? 's' : ''}
                </motion.div>
            )}
        </>
    );
};

// Distraction Blocker Modal
interface DistractionBlockerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStart: (duration: number) => void;
}

export const DistractionBlockerModal = ({
    isOpen,
    onClose,
    onStart,
}: DistractionBlockerModalProps) => {
    const [selectedDuration, setSelectedDuration] = useState(25);

    const durations = [
        { value: 15, label: "15 min", emoji: "⚡" },
        { value: 25, label: "25 min", emoji: "🎯" },
        { value: 45, label: "45 min", emoji: "🔥" },
        { value: 60, label: "60 min", emoji: "💪" },
    ];

    const handleStart = () => {
        onStart(selectedDuration);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-gradient-to-br from-green-900/95 via-emerald-900/95 to-green-900/95 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full border-2 border-green-500/30 shadow-2xl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white">
                                    Focus Mode 🎯
                                </h2>
                                <p className="text-gray-200 text-sm">
                                    Block distractions and stay focused
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>
                    </div>

                    {/* What Gets Blocked */}
                    <div className="mb-6">
                        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-400" />
                            Blocked Sites During Focus Mode:
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {DISTRACTING_SITES.map((site) => (
                                <div
                                    key={site.domain}
                                    className="bg-white/5 rounded-lg p-3 border border-white/10 flex items-center gap-2"
                                >
                                    <span className="text-2xl">{site.icon}</span>
                                    <div>
                                        <p className="text-white text-sm font-bold">{site.name}</p>
                                        <p className="text-gray-400 text-xs">{site.domain}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Duration Selection */}
                    <div className="mb-6">
                        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-400" />
                            Choose Focus Duration:
                        </h3>
                        <div className="grid grid-cols-4 gap-3">
                            {durations.map((duration) => (
                                <motion.button
                                    key={duration.value}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedDuration(duration.value)}
                                    className={`p-4 rounded-xl font-bold transition-all ${selectedDuration === duration.value
                                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                                            : "bg-white/10 text-gray-300 hover:bg-white/20"
                                        }`}
                                >
                                    <div className="text-3xl mb-1">{duration.emoji}</div>
                                    <div className="text-sm">{duration.label}</div>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Features */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                        <h4 className="text-blue-300 font-bold mb-2">
                            ✨ What You'll Get:
                        </h4>
                        <ul className="text-blue-200 text-sm space-y-1">
                            <li>• Visual reminders to stay focused</li>
                            <li>• Distraction attempt tracking</li>
                            <li>• Countdown timer display</li>
                            <li>• Motivational alerts</li>
                            <li>• Focus session statistics</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleStart}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                        >
                            Start Focus Mode 🚀
                        </button>
                    </div>

                    {/* Note */}
                    <p className="text-gray-400 text-xs text-center mt-4">
                        💡 Tip: For full site blocking, install a browser extension like "StayFocusd" or "Freedom"
                    </p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Focus Mode Button
export const FocusModeButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className="fixed bottom-6 right-24 z-40 p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-2xl hover:shadow-green-500/50 transition-all group"
        >
            <Shield className="w-6 h-6 text-white" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Focus Mode
            </div>
        </motion.button>
    );
};
