"use client";

import { motion } from "framer-motion";
import { TrendingUp, Clock, Target, Flame, Calendar, Award } from "lucide-react";
import type { AnalyticsData, DailyStats } from "@/lib/analytics";
import { getLast7DaysStats, getWeeklyStats } from "@/lib/analytics";

interface AnalyticsDashboardProps {
    analytics: AnalyticsData;
}

export const AnalyticsDashboard = ({ analytics }: AnalyticsDashboardProps) => {
    const last7Days = getLast7DaysStats(analytics);
    const weeklyStats = getWeeklyStats(analytics);

    const formatTime = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours === 0) return `${mins}m`;
        return `${hours}h ${mins}m`;
    };

    const formatHour = (hour: number): string => {
        if (hour === 0) return "12 AM";
        if (hour < 12) return `${hour} AM`;
        if (hour === 12) return "12 PM";
        return `${hour - 12} PM`;
    };

    const getDayName = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    const maxDailyTime = Math.max(...last7Days.map(d => d.totalStudyTime), 1);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2 font-[family-name:var(--font-christmas)]">
                    📊 Your Study Analytics
                </h2>
                <p className="text-gray-300 text-sm">
                    Track your progress and stay motivated! 🎄
                </p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Total Study Time */}
                <MetricCard
                    icon={<Clock className="w-6 h-6" />}
                    label="Total Study Time"
                    value={formatTime(analytics.totalStudyTime)}
                    color="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30"
                    iconColor="text-blue-400"
                />

                {/* Tasks Completed */}
                <MetricCard
                    icon={<Target className="w-6 h-6" />}
                    label="Tasks Completed"
                    value={analytics.totalTasksCompleted.toString()}
                    color="bg-gradient-to-br from-christmas-green/20 to-green-600/20 border-christmas-green/30"
                    iconColor="text-christmas-gold"
                />

                {/* Current Streak */}
                <MetricCard
                    icon={<Flame className="w-6 h-6" />}
                    label="Current Streak"
                    value={`${analytics.currentStreak} days`}
                    color="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30"
                    iconColor="text-orange-400"
                />

                {/* Completion Rate */}
                <MetricCard
                    icon={<Award className="w-6 h-6" />}
                    label="Completion Rate"
                    value={`${analytics.completionRate}%`}
                    color="bg-gradient-to-br from-christmas-gold/20 to-yellow-500/20 border-christmas-gold/30"
                    iconColor="text-christmas-gold"
                />

                {/* Avg Session */}
                <MetricCard
                    icon={<TrendingUp className="w-6 h-6" />}
                    label="Avg Session"
                    value={formatTime(Math.round(analytics.averageSessionDuration))}
                    color="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30"
                    iconColor="text-purple-400"
                />

                {/* Longest Streak */}
                <MetricCard
                    icon={<Calendar className="w-6 h-6" />}
                    label="Longest Streak"
                    value={`${analytics.longestStreak} days`}
                    color="bg-gradient-to-br from-pink-500/20 to-pink-600/20 border-pink-500/30"
                    iconColor="text-pink-400"
                />
            </div>

            {/* Last 7 Days Chart */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-christmas-gold" />
                    Last 7 Days Activity
                </h3>
                <div className="space-y-3">
                    {last7Days.map((day, index) => (
                        <div key={day.date} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-300 font-medium">
                                    {getDayName(day.date)}
                                </span>
                                <span className="text-christmas-gold font-bold">
                                    {formatTime(day.totalStudyTime)}
                                </span>
                            </div>
                            <div className="relative h-8 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(day.totalStudyTime / maxDailyTime) * 100}%` }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-christmas-red to-christmas-gold rounded-full flex items-center justify-end pr-2"
                                >
                                    {day.tasksCompleted > 0 && (
                                        <span className="text-xs font-bold text-white">
                                            {day.tasksCompleted} ✓
                                        </span>
                                    )}
                                </motion.div>
                                {/* Candy cane stripes effect */}
                                <div className="absolute inset-0 opacity-20"
                                    style={{
                                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Productivity Heatmap */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-christmas-gold" />
                    Best Study Times
                </h3>
                <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                    {analytics.productivityByHour.map((minutes, hour) => {
                        const maxHourTime = Math.max(...analytics.productivityByHour, 1);
                        const intensity = (minutes / maxHourTime) * 100;

                        return (
                            <motion.div
                                key={hour}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: hour * 0.02 }}
                                className="relative group"
                            >
                                <div
                                    className="aspect-square rounded-lg transition-all cursor-pointer"
                                    style={{
                                        backgroundColor: intensity > 0
                                            ? `rgba(248, 178, 41, ${Math.max(intensity / 100, 0.1)})`
                                            : 'rgba(255, 255, 255, 0.05)',
                                    }}
                                >
                                    {/* Snowflake for high productivity hours */}
                                    {intensity > 50 && (
                                        <div className="absolute inset-0 flex items-center justify-center text-white text-xs">
                                            ❄️
                                        </div>
                                    )}
                                </div>
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                    {formatHour(hour)}: {formatTime(minutes)}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                    <span>12 AM</span>
                    <span>6 AM</span>
                    <span>12 PM</span>
                    <span>6 PM</span>
                    <span>11 PM</span>
                </div>
            </div>

            {/* Weekly Summary */}
            <div className="bg-gradient-to-br from-christmas-red/10 to-christmas-green/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-christmas-gold" />
                    This Week's Summary
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-300 text-sm">Total Study Time</p>
                        <p className="text-2xl font-bold text-christmas-gold">
                            {formatTime(weeklyStats.totalStudyTime)}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-300 text-sm">Tasks Completed</p>
                        <p className="text-2xl font-bold text-christmas-gold">
                            {weeklyStats.tasksCompleted}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-300 text-sm">Daily Average</p>
                        <p className="text-2xl font-bold text-christmas-gold">
                            {formatTime(Math.round(weeklyStats.averageDailyTime))}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-300 text-sm">Peak Hour</p>
                        <p className="text-2xl font-bold text-christmas-gold">
                            {formatHour(weeklyStats.mostProductiveHour)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Motivational Message */}
            {analytics.currentStreak >= 3 && (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-gradient-to-r from-christmas-gold/20 to-yellow-500/20 border border-christmas-gold/30 rounded-2xl p-4 text-center"
                >
                    <p className="text-lg font-bold text-christmas-gold">
                        🔥 Amazing! You're on a {analytics.currentStreak}-day streak! Keep it up! 🎄
                    </p>
                </motion.div>
            )}
        </div>
    );
};

interface MetricCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: string;
    iconColor: string;
}

const MetricCard = ({ icon, label, value, color, iconColor }: MetricCardProps) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className={`${color} backdrop-blur-md border rounded-xl p-4 text-center`}
        >
            <div className={`${iconColor} mb-2 flex justify-center`}>
                {icon}
            </div>
            <p className="text-xs text-gray-300 mb-1">{label}</p>
            <p className="text-xl font-bold text-white">{value}</p>
        </motion.div>
    );
};
