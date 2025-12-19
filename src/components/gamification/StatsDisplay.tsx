"use client";

import { motion } from "framer-motion";
import { Flame, Trophy, Star, Gift } from "lucide-react";
import { GamificationStats } from "@/lib/gamification";

interface StatsDisplayProps {
    stats: GamificationStats;
    completedCount: number;
}

export const StatsDisplay = ({ stats, completedCount }: StatsDisplayProps) => {
    const progress = (completedCount / 24) * 100;

    return (
        <div className="space-y-4">
            {/* Points and Streak */}
            <div className="grid grid-cols-2 gap-3">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-christmas-gold/20 to-yellow-500/20 border border-christmas-gold/30 rounded-xl p-3 text-center"
                >
                    <Star className="w-5 h-5 mx-auto mb-1 text-christmas-gold" />
                    <p className="text-2xl font-bold text-christmas-gold">{stats.points}</p>
                    <p className="text-xs text-gray-300">Points</p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl p-3 text-center"
                >
                    <Flame className="w-5 h-5 mx-auto mb-1 text-red-500" />
                    <p className="text-2xl font-bold text-red-500">{stats.streak}</p>
                    <p className="text-xs text-gray-300">Day Streak</p>
                </motion.div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white/5 rounded-xl p-3">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">Progress</span>
                    <span className="text-sm font-bold text-christmas-gold">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-christmas-gold to-yellow-500 rounded-full"
                    />
                </div>
            </div>

            {/* Achievements */}
            <div className="bg-white/5 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-4 h-4 text-christmas-gold" />
                    <span className="text-sm font-bold text-white">Achievements</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {stats.achievements.slice(0, 8).map((achievement) => (
                        <motion.div
                            key={achievement.id}
                            whileHover={{ scale: 1.1 }}
                            className={`text-2xl text-center p-2 rounded-lg transition-all ${achievement.unlocked
                                    ? "bg-christmas-gold/20 grayscale-0"
                                    : "bg-white/5 grayscale opacity-30"
                                }`}
                            title={achievement.name}
                        >
                            {achievement.icon}
                        </motion.div>
                    ))}
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                    {stats.achievements.filter((a) => a.unlocked).length} / {stats.achievements.length} unlocked
                </p>
            </div>

            {/* Rewards */}
            {stats.unlockedRewards.length > 0 && (
                <div className="bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                        <Gift className="w-4 h-4 text-christmas-red" />
                        <span className="text-sm font-bold text-white">Unlocked Rewards</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {stats.unlockedRewards.map((reward) => (
                            <span
                                key={reward}
                                className="text-xs bg-christmas-red/20 text-christmas-gold px-2 py-1 rounded-full"
                            >
                                {reward}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
