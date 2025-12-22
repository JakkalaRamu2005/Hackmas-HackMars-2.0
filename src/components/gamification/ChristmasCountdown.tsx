"use client";

import { motion } from "framer-motion";
import { Calendar, Gift, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface ChristmasCountdownProps {
    onSpecialUnlock?: (day: number) => void;
}

export const ChristmasCountdown = ({ onSpecialUnlock }: ChristmasCountdownProps) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [hasUnlockedToday, setHasUnlockedToday] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const christmas = new Date("2025-12-25T00:00:00");
            const now = new Date();
            const difference = christmas.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, []);

    const daysUntilChristmas = timeLeft.days;
    const isChristmasSeason = daysUntilChristmas <= 12 && daysUntilChristmas >= 0;

    const handleDailyUnlock = () => {
        if (!hasUnlockedToday && onSpecialUnlock) {
            onSpecialUnlock(13 - daysUntilChristmas);
            setHasUnlockedToday(true);
            // Store in localStorage
            localStorage.setItem(
                `christmas-unlock-${new Date().toDateString()}`,
                "true"
            );
        }
    };

    useEffect(() => {
        // Check if already unlocked today
        const unlocked = localStorage.getItem(
            `christmas-unlock-${new Date().toDateString()}`
        );
        if (unlocked) {
            setHasUnlockedToday(true);
        }
    }, []);

    return (
        <div className="bg-gradient-to-br from-red-900/30 via-green-900/30 to-red-900/30 backdrop-blur-md rounded-2xl p-6 border-2 border-christmas-gold/30 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-christmas-gold" />
                    <h3 className="text-xl font-bold text-white">
                        🎅 Countdown to Christmas
                    </h3>
                </div>
                {isChristmasSeason && (
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Sparkles className="w-6 h-6 text-yellow-400" />
                    </motion.div>
                )}
            </div>

            {/* Countdown Display */}
            <div className="grid grid-cols-4 gap-3 mb-4">
                <TimeUnit value={timeLeft.days} label="Days" />
                <TimeUnit value={timeLeft.hours} label="Hours" />
                <TimeUnit value={timeLeft.minutes} label="Mins" />
                <TimeUnit value={timeLeft.seconds} label="Secs" />
            </div>

            {/* 12 Days of Christmas Special */}
            {isChristmasSeason && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-christmas-gold/20 to-yellow-500/20 rounded-xl p-4 border border-christmas-gold/40"
                >
                    <div className="flex items-start gap-3">
                        <Gift className="w-8 h-8 text-christmas-gold flex-shrink-0 mt-1" />
                        <div className="flex-1">
                            <h4 className="text-white font-bold mb-1 flex items-center gap-2">
                                🎄 12 Days of Christmas Active!
                                <span className="text-xs bg-red-500 px-2 py-0.5 rounded-full">
                                    2x Points
                                </span>
                            </h4>
                            <p className="text-gray-200 text-sm mb-3">
                                Complete tasks during the final 12 days to earn DOUBLE points!
                                Day {13 - daysUntilChristmas} of 12
                            </p>

                            {!hasUnlockedToday ? (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleDailyUnlock}
                                    className="w-full px-4 py-2 bg-gradient-to-r from-christmas-red to-red-600 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all"
                                >
                                    🎁 Claim Today's Bonus!
                                </motion.button>
                            ) : (
                                <div className="text-center py-2 bg-green-500/20 rounded-lg border border-green-500/40">
                                    <p className="text-green-300 font-bold text-sm">
                                        ✅ Today's bonus claimed!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Christmas Day Message */}
            {daysUntilChristmas === 0 && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center py-4 bg-gradient-to-r from-christmas-gold to-yellow-500 rounded-xl"
                >
                    <p className="text-2xl font-bold text-christmas-green">
                        🎄 Merry Christmas! 🎅
                    </p>
                    <p className="text-christmas-green text-sm">
                        You did it! Enjoy your holiday! 🎁
                    </p>
                </motion.div>
            )}
        </div>
    );
};

// Time Unit Component
const TimeUnit = ({ value, label }: { value: number; label: string }) => {
    return (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
            <motion.div
                key={value}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl font-bold text-christmas-gold"
            >
                {value.toString().padStart(2, "0")}
            </motion.div>
            <div className="text-xs text-gray-300 mt-1">{label}</div>
        </div>
    );
};
