"use client";

import { motion } from "framer-motion";
import { Trophy, Calendar, Flame, Target, Clock, Award } from "lucide-react";
import { GamificationStats } from "@/lib/gamification";
import { AnalyticsData } from "@/lib/analytics";

interface ProgressCardProps {
    completedCount: number;
    totalTasks: number;
    gamificationStats: GamificationStats;
    analytics: AnalyticsData;
}

export const ProgressCard = ({ completedCount, totalTasks, gamificationStats, analytics }: ProgressCardProps) => {
    const percentage = Math.round((completedCount / totalTasks) * 100);
    const formatTime = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours === 0) return `${mins}m`;
        return `${hours}h ${mins}m`;
    };

    return (
        <div id="progress-card" className="relative w-full max-w-2xl mx-auto bg-gradient-to-br from-christmas-green via-christmas-red to-christmas-green p-8 rounded-3xl">
            {/* Christmas decorations */}
            <div className="absolute top-4 left-4 text-4xl animate-bounce">🎄</div>
            <div className="absolute top-4 right-4 text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎁</div>
            <div className="absolute bottom-4 left-4 text-3xl">⭐</div>
            <div className="absolute bottom-4 right-4 text-3xl">❄️</div>

            {/* Main Content */}
            <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-8 text-center">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-4xl font-bold text-christmas-red font-[family-name:var(--font-christmas)] mb-2">
                        🎄 My StudyAdvent Journey 🎄
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Turning exam stress into holiday success!
                    </p>
                </div>

                {/* Progress Circle */}
                <div className="relative w-48 h-48 mx-auto mb-6">
                    <svg className="w-full h-full transform -rotate-90">
                        {/* Background circle */}
                        <circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="#E5E7EB"
                            strokeWidth="12"
                            fill="none"
                        />
                        {/* Progress circle */}
                        <motion.circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="url(#gradient)"
                            strokeWidth="12"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 88}
                            strokeDashoffset={2 * Math.PI * 88 * (1 - percentage / 100)}
                            initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - percentage / 100) }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#D42426" />
                                <stop offset="50%" stopColor="#F8B229" />
                                <stop offset="100%" stopColor="#165B33" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold text-christmas-red">
                            {percentage}%
                        </span>
                        <span className="text-sm text-gray-600 mt-1">
                            {completedCount}/{totalTasks} Tasks
                        </span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <StatItem
                        icon={<Flame className="w-5 h-5" />}
                        label="Streak"
                        value={`${gamificationStats.streak} days`}
                        color="text-orange-500"
                    />
                    <StatItem
                        icon={<Trophy className="w-5 h-5" />}
                        label="Points"
                        value={gamificationStats.points.toString()}
                        color="text-christmas-gold"
                    />
                    <StatItem
                        icon={<Clock className="w-5 h-5" />}
                        label="Study Time"
                        value={formatTime(analytics.totalStudyTime)}
                        color="text-blue-500"
                    />
                </div>

                {/* Achievements */}
                <div className="bg-gradient-to-r from-christmas-gold/10 to-christmas-red/10 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-christmas-gold" />
                        <span className="font-bold text-gray-800">Achievements Unlocked</span>
                    </div>
                    <div className="flex justify-center gap-2 flex-wrap">
                        {gamificationStats.achievements
                            .filter(a => a.unlocked)
                            .slice(0, 6)
                            .map((achievement, index) => (
                                <span key={index} className="text-2xl" title={achievement.name}>
                                    {achievement.icon}
                                </span>
                            ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        {gamificationStats.achievements.filter(a => a.unlocked).length} / {gamificationStats.achievements.length} achievements
                    </p>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 pt-4">
                    <p className="text-lg font-bold text-christmas-green mb-1">
                        StudyAdvent.ai
                    </p>
                    <p className="text-xs text-gray-500">
                        Turn your syllabus into a festive advent calendar! 🎁
                    </p>
                </div>
            </div>

            {/* Snowflakes decoration */}
            <div className="absolute top-10 left-1/4 text-white text-2xl opacity-70">❄️</div>
            <div className="absolute top-20 right-1/4 text-white text-xl opacity-70">❄️</div>
            <div className="absolute bottom-20 left-1/3 text-white text-2xl opacity-70">❄️</div>
        </div>
    );
};

interface StatItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: string;
}

const StatItem = ({ icon, label, value, color }: StatItemProps) => {
    return (
        <div className="bg-gray-50 rounded-lg p-3">
            <div className={`${color} flex justify-center mb-1`}>
                {icon}
            </div>
            <p className="text-xs text-gray-600 mb-1">{label}</p>
            <p className="text-lg font-bold text-gray-800">{value}</p>
        </div>
    );
};
