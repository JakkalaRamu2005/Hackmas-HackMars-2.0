"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Flame } from "lucide-react";
import { Achievement } from "@/lib/gamification";

interface AchievementPopupProps {
    achievement: Achievement;
    onClose: () => void;
}

export const AchievementPopup = ({ achievement, onClose }: AchievementPopupProps) => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 50 }}
                className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-christmas-gold to-yellow-500 text-christmas-green p-6 rounded-2xl shadow-2xl border-4 border-white max-w-sm"
            >
                <div className="flex items-start gap-4">
                    <div className="text-5xl">{achievement.icon}</div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Trophy className="w-5 h-5" />
                            <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
                        </div>
                        <p className="font-bold text-xl mb-1">{achievement.name}</p>
                        <p className="text-sm opacity-90">{achievement.description}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-christmas-green hover:text-christmas-red transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Confetti effect */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: 0, x: Math.random() * 100 - 50, opacity: 1 }}
                            animate={{
                                y: -200,
                                x: Math.random() * 200 - 100,
                                opacity: 0,
                                rotate: Math.random() * 360,
                            }}
                            transition={{ duration: 2, delay: i * 0.05 }}
                            className="absolute top-1/2 left-1/2 w-2 h-2 bg-christmas-red rounded-full"
                            style={{
                                backgroundColor: ["#D42426", "#F8B229", "#165B33", "#FFFFFF"][i % 4],
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
