"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, TrendingUp, X, Zap, Target } from "lucide-react";
import { useEffect, useState } from "react";
import {
    analyzeStudyPatterns,
    generateRecommendations,
    generateLearningInsights,
    getContextualStudyTips,
    type PersonalizedRecommendation,
    type LearningInsight,
    type StudyPattern,
} from "@/lib/aiPersonalization";
import type { GamificationStats } from "@/lib/gamification";
import type { AnalyticsData } from "@/lib/analytics";

interface AIStudyBuddyProps {
    analytics: AnalyticsData;
    gamification: GamificationStats;
    completedCount: number;
    totalTasks: number;
    isOpen: boolean;
    onClose: () => void;
}

export const AIStudyBuddy = ({
    analytics,
    gamification,
    completedCount,
    totalTasks,
    isOpen,
    onClose,
}: AIStudyBuddyProps) => {
    const [pattern, setPattern] = useState<StudyPattern | null>(null);
    const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
    const [insights, setInsights] = useState<LearningInsight[]>([]);
    const [tips, setTips] = useState<string[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(true);

    useEffect(() => {
        if (isOpen) {
            // Simulate AI analysis
            setIsAnalyzing(true);
            setTimeout(() => {
                const analyzedPattern = analyzeStudyPatterns(analytics, gamification);
                const recs = generateRecommendations(
                    analyzedPattern,
                    gamification,
                    completedCount,
                    totalTasks
                );
                const learningInsights = generateLearningInsights(analyzedPattern);
                const contextTips = getContextualStudyTips(
                    new Date().getHours(),
                    analyzedPattern,
                    gamification.streak
                );

                setPattern(analyzedPattern);
                setRecommendations(recs);
                setInsights(learningInsights);
                setTips(contextTips);
                setIsAnalyzing(false);
            }, 1500);
        }
    }, [isOpen, analytics, gamification, completedCount, totalTasks]);

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
                    className="bg-gradient-to-br from-purple-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-xl rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-purple-500/30 shadow-2xl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                                <Brain className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                                    AI Study Buddy
                                    <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                                </h2>
                                <p className="text-purple-200 text-sm">
                                    Personalized insights powered by AI
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

                    {isAnalyzing ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="mb-4"
                            >
                                <Brain className="w-16 h-16 text-purple-400" />
                            </motion.div>
                            <p className="text-white text-lg">Analyzing your study patterns...</p>
                            <p className="text-purple-300 text-sm mt-2">
                                🎄 AI is learning about you!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Study Pattern Summary */}
                            {pattern && (
                                <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-green-400" />
                                        Your Study Pattern
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center">
                                            <p className="text-3xl font-bold text-purple-300">
                                                {pattern.preferredStudyTime === "morning"
                                                    ? "🌅"
                                                    : pattern.preferredStudyTime === "afternoon"
                                                        ? "☀️"
                                                        : pattern.preferredStudyTime === "evening"
                                                            ? "🌆"
                                                            : "🌙"}
                                            </p>
                                            <p className="text-white font-semibold capitalize">
                                                {pattern.preferredStudyTime}
                                            </p>
                                            <p className="text-purple-200 text-xs">Peak Time</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-3xl font-bold text-blue-300">
                                                {Math.round(pattern.averageSessionLength)}m
                                            </p>
                                            <p className="text-white font-semibold">Session</p>
                                            <p className="text-purple-200 text-xs">Avg Length</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-3xl font-bold text-green-300">
                                                {Math.round(pattern.completionRate)}%
                                            </p>
                                            <p className="text-white font-semibold">Success</p>
                                            <p className="text-purple-200 text-xs">Rate</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-3xl font-bold text-yellow-300">
                                                {pattern.difficultyPreference === "challenging"
                                                    ? "🔥"
                                                    : pattern.difficultyPreference === "moderate"
                                                        ? "⚡"
                                                        : "🌟"}
                                            </p>
                                            <p className="text-white font-semibold capitalize">
                                                {pattern.difficultyPreference}
                                            </p>
                                            <p className="text-purple-200 text-xs">Preference</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* AI Recommendations */}
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-yellow-400" />
                                    Personalized Recommendations
                                </h3>
                                <div className="space-y-3">
                                    {recommendations.slice(0, 5).map((rec) => (
                                        <motion.div
                                            key={rec.id}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            className={`bg-white/10 rounded-xl p-4 border-l-4 ${rec.priority === "high"
                                                    ? "border-red-400"
                                                    : rec.priority === "medium"
                                                        ? "border-yellow-400"
                                                        : "border-green-400"
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="text-3xl">{rec.icon}</span>
                                                <div className="flex-1">
                                                    <h4 className="text-white font-bold mb-1">{rec.title}</h4>
                                                    <p className="text-purple-100 text-sm">{rec.message}</p>
                                                    {rec.actionable && rec.action && (
                                                        <button className="mt-2 px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded-lg transition-colors">
                                                            {rec.action}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Learning Insights */}
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-pink-400" />
                                    Learning Insights
                                </h3>
                                <div className="space-y-3">
                                    {insights.map((insight, index) => (
                                        <div
                                            key={index}
                                            className="bg-white/5 rounded-xl p-4 border border-white/10"
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="text-2xl">
                                                    {insight.impact === "positive"
                                                        ? "✅"
                                                        : insight.impact === "negative"
                                                            ? "⚠️"
                                                            : "ℹ️"}
                                                </span>
                                                <div>
                                                    <p className="text-white font-semibold mb-1">
                                                        {insight.pattern}
                                                    </p>
                                                    <p className="text-purple-200 text-sm">
                                                        {insight.suggestion}
                                                    </p>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <div className="flex-1 bg-white/10 rounded-full h-2">
                                                            <div
                                                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                                                style={{
                                                                    width: `${insight.confidence * 100}%`,
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="text-purple-300 text-xs">
                                                            {Math.round(insight.confidence * 100)}% confident
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Tips */}
                            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
                                <h3 className="text-xl font-bold text-white mb-4">
                                    🎄 Quick Tips for You
                                </h3>
                                <div className="space-y-2">
                                    {tips.map((tip, index) => (
                                        <p key={index} className="text-white text-sm">
                                            {tip}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Floating AI Buddy Button
export const AIStudyBuddyButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className="fixed bottom-6 left-6 z-40 p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all group"
        >
            <Brain className="w-6 h-6 text-white" />
            <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white"
            />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                AI Study Buddy
            </div>
        </motion.button>
    );
};
