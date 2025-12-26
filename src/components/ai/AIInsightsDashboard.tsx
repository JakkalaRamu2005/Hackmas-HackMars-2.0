"use client";

import { motion } from "framer-motion";
import { TrendingUp, Clock, Target, Award, Lightbulb, AlertCircle } from "lucide-react";
import { analyzeStudyPatterns, generateRecommendations, generateLearningInsights, getContextualStudyTips } from "@/lib/aiPersonalization";
import type { AnalyticsData } from "@/lib/analytics";
import type { GamificationStats } from "@/lib/gamification";

interface AIInsightsDashboardProps {
    analytics: AnalyticsData;
    gamification: GamificationStats;
    completedCount: number;
    totalTasks: number;
}

export const AIInsightsDashboard = ({
    analytics,
    gamification,
    completedCount,
    totalTasks,
}: AIInsightsDashboardProps) => {
    const pattern = analyzeStudyPatterns(analytics, gamification);
    const recommendations = generateRecommendations(pattern, gamification, completedCount, totalTasks);
    const insights = generateLearningInsights(pattern);
    const tips = getContextualStudyTips(new Date().getHours(), pattern, gamification.streak);

    const priorityColors = {
        high: "from-red-500 to-orange-500",
        medium: "from-yellow-500 to-amber-500",
        low: "from-green-500 to-emerald-500",
    };

    const impactColors = {
        positive: "text-green-600 bg-green-50",
        neutral: "text-blue-600 bg-blue-50",
        negative: "text-orange-600 bg-orange-50",
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">🤖 AI Study Insights</h2>
                <p className="text-gray-300">Personalized recommendations powered by your study patterns</p>
            </div>

            {/* Study Pattern Overview */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-christmas-gold" />
                    Your Study Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white/5 rounded-xl p-4">
                        <div className="text-3xl mb-2">
                            {pattern.preferredStudyTime === "morning" && "🌅"}
                            {pattern.preferredStudyTime === "afternoon" && "☀️"}
                            {pattern.preferredStudyTime === "evening" && "🌆"}
                            {pattern.preferredStudyTime === "night" && "🌙"}
                        </div>
                        <div className="text-sm text-gray-300 mb-1">Peak Study Time</div>
                        <div className="text-lg font-bold text-white capitalize">{pattern.preferredStudyTime}</div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4">
                        <div className="text-3xl mb-2">⏱️</div>
                        <div className="text-sm text-gray-300 mb-1">Avg Session</div>
                        <div className="text-lg font-bold text-white">{Math.round(pattern.averageSessionLength)} min</div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4">
                        <div className="text-3xl mb-2">✅</div>
                        <div className="text-sm text-gray-300 mb-1">Completion Rate</div>
                        <div className="text-lg font-bold text-white">{Math.round(pattern.completionRate)}%</div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4">
                        <div className="text-3xl mb-2">🎯</div>
                        <div className="text-sm text-gray-300 mb-1">Difficulty Level</div>
                        <div className="text-lg font-bold text-white capitalize">{pattern.difficultyPreference}</div>
                    </div>
                </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-yellow-400" />
                    Personalized Recommendations
                </h3>
                <div className="space-y-3">
                    {recommendations.slice(0, 5).map((rec) => (
                        <motion.div
                            key={rec.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`bg-gradient-to-r ${priorityColors[rec.priority]} p-4 rounded-xl text-white`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="text-2xl">{rec.icon}</div>
                                <div className="flex-1">
                                    <div className="font-bold mb-1">{rec.title}</div>
                                    <div className="text-sm opacity-90">{rec.message}</div>
                                    {rec.actionable && rec.action && (
                                        <button className="mt-2 text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors">
                                            {rec.action}
                                        </button>
                                    )}
                                </div>
                                {rec.priority === "high" && (
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Progress Prediction Engine */}
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-cyan-400" />
                    Progress Prediction Engine
                </h3>

                {(() => {
                    const { calculateProgressPrediction, calculateEfficiencyScore } = require('@/lib/progressPredictions');
                    const startDate = new Date();
                    startDate.setDate(startDate.getDate() - Math.max(1, completedCount));

                    const prediction = calculateProgressPrediction(
                        completedCount,
                        totalTasks,
                        startDate,
                        new Date('2024-12-25')
                    );

                    const efficiency = calculateEfficiencyScore(
                        completedCount,
                        totalTasks,
                        Math.max(1, completedCount),
                        24
                    );

                    return (
                        <div className="space-y-4">
                            {/* Main Prediction Message */}
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={`bg-gradient-to-r ${prediction.color === 'green' ? 'from-green-500 to-emerald-600' :
                                        prediction.color === 'yellow' ? 'from-yellow-500 to-orange-500' :
                                            'from-red-500 to-pink-600'
                                    } p-6 rounded-xl text-white text-center`}
                            >
                                <div className="text-5xl mb-3">{prediction.emoji}</div>
                                <div className="text-xl font-bold mb-2">{prediction.message}</div>
                                <div className="text-sm opacity-90">
                                    Confidence: {prediction.confidence.toUpperCase()}
                                </div>
                            </motion.div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="bg-white/10 rounded-xl p-4 text-center">
                                    <div className="text-2xl mb-1">📈</div>
                                    <div className="text-xs text-gray-300 mb-1">Current Pace</div>
                                    <div className="text-lg font-bold text-white">{prediction.currentPace}</div>
                                    <div className="text-xs text-gray-400">tasks/day</div>
                                </div>

                                <div className="bg-white/10 rounded-xl p-4 text-center">
                                    <div className="text-2xl mb-1">🎯</div>
                                    <div className="text-xs text-gray-300 mb-1">Required Pace</div>
                                    <div className="text-lg font-bold text-white">{prediction.requiredPace}</div>
                                    <div className="text-xs text-gray-400">tasks/day</div>
                                </div>

                                <div className="bg-white/10 rounded-xl p-4 text-center">
                                    <div className="text-2xl mb-1">⏰</div>
                                    <div className="text-xs text-gray-300 mb-1">Days Remaining</div>
                                    <div className="text-lg font-bold text-white">{prediction.daysRemaining}</div>
                                    <div className="text-xs text-gray-400">until deadline</div>
                                </div>

                                <div className="bg-white/10 rounded-xl p-4 text-center">
                                    <div className="text-2xl mb-1">
                                        {prediction.daysAhead >= 0 ? '✅' : '⚠️'}
                                    </div>
                                    <div className="text-xs text-gray-300 mb-1">
                                        {prediction.daysAhead >= 0 ? 'Days Ahead' : 'Days Behind'}
                                    </div>
                                    <div className={`text-lg font-bold ${prediction.daysAhead >= 0 ? 'text-green-400' : 'text-orange-400'
                                        }`}>
                                        {Math.abs(prediction.daysAhead)}
                                    </div>
                                    <div className="text-xs text-gray-400">days</div>
                                </div>
                            </div>

                            {/* Efficiency Score */}
                            <div className="bg-white/10 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="text-2xl">🏆</div>
                                        <div>
                                            <div className="font-bold text-white">Efficiency Score</div>
                                            <div className="text-xs text-gray-300">{efficiency.message}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-christmas-gold">{efficiency.grade}</div>
                                        <div className="text-sm text-gray-300">{efficiency.score}%</div>
                                    </div>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${efficiency.score}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className={`h-full ${efficiency.score >= 85 ? 'bg-green-500' :
                                                efficiency.score >= 75 ? 'bg-yellow-500' :
                                                    'bg-orange-500'
                                            }`}
                                    />
                                </div>
                            </div>

                            {/* Projected Completion */}
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <div className="text-sm text-gray-300 mb-1">Projected Completion Date</div>
                                <div className="text-lg font-bold text-white">{prediction.projectedCompletionDate}</div>
                            </div>
                        </div>
                    );
                })()}
            </div>

            {/* Learning Insights */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Target className="w-6 h-6 text-blue-400" />
                    Learning Insights
                </h3>
                <div className="space-y-3">
                    {insights.map((insight, index) => (
                        <div
                            key={index}
                            className={`${impactColors[insight.impact]} rounded-xl p-4`}
                        >
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="font-bold">{insight.pattern}</div>
                                <div className="text-xs bg-white/50 px-2 py-1 rounded-full">
                                    {Math.round(insight.confidence * 100)}% confidence
                                </div>
                            </div>
                            <div className="text-sm opacity-80">{insight.suggestion}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contextual Study Tips */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Award className="w-6 h-6 text-purple-400" />
                    Smart Study Tips
                </h3>
                <div className="space-y-2">
                    {tips.map((tip, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/10 rounded-lg p-3 text-white text-sm"
                        >
                            {tip}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Performance Comparison */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">📊 Your Performance</h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm text-gray-300 mb-2">
                            <span>Completion Rate</span>
                            <span className="font-bold text-white">{Math.round(pattern.completionRate)}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pattern.completionRate}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full ${pattern.completionRate > 80
                                    ? "bg-green-500"
                                    : pattern.completionRate > 50
                                        ? "bg-yellow-500"
                                        : "bg-orange-500"
                                    }`}
                            />
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                            {pattern.completionRate > 80 && "🏆 Top 10% - Outstanding!"}
                            {pattern.completionRate > 50 && pattern.completionRate <= 80 && "⭐ Above Average - Great work!"}
                            {pattern.completionRate <= 50 && "💪 Keep going - You're building momentum!"}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-sm text-gray-300 mb-2">
                            <span>Progress</span>
                            <span className="font-bold text-white">{completedCount}/{totalTasks} tasks</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(completedCount / totalTasks) * 100}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-christmas-red to-christmas-gold"
                            />
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                            {Math.round((completedCount / totalTasks) * 100)}% of your Advent Calendar complete
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
