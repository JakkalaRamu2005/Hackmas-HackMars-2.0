/**
 * AI Personalization Engine
 * Analyzes user behavior and provides intelligent study recommendations
 */

import type { GamificationStats } from "./gamification";
import type { AnalyticsData } from "./analytics";

export interface StudyPattern {
    preferredStudyTime: "morning" | "afternoon" | "evening" | "night";
    averageSessionLength: number;
    completionRate: number;
    streakConsistency: number;
    difficultyPreference: "easy" | "moderate" | "challenging";
}

export interface PersonalizedRecommendation {
    id: string;
    type: "study-time" | "task-breakdown" | "motivation" | "strategy" | "warning";
    title: string;
    message: string;
    icon: string;
    priority: "low" | "medium" | "high";
    actionable: boolean;
    action?: string;
}

export interface LearningInsight {
    pattern: string;
    confidence: number;
    suggestion: string;
    impact: "positive" | "neutral" | "negative";
}

/**
 * Analyze user's study patterns from analytics data
 */
export function analyzeStudyPatterns(
    analytics: AnalyticsData,
    gamification: GamificationStats
): StudyPattern {
    // Determine preferred study time based on completion patterns
    const hourlyCompletions = analytics.sessions.reduce((acc, session) => {
        const hour = new Date(session.startTime).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    const peakHour = Object.entries(hourlyCompletions).sort(
        ([, a], [, b]) => b - a
    )[0]?.[0];

    const preferredStudyTime =
        parseInt(peakHour || "14") < 12
            ? "morning"
            : parseInt(peakHour || "14") < 17
                ? "afternoon"
                : parseInt(peakHour || "14") < 21
                    ? "evening"
                    : "night";

    // Calculate average session length
    const totalDuration = analytics.sessions.reduce(
        (sum, session) => sum + session.duration,
        0
    );
    const averageSessionLength =
        analytics.sessions.length > 0
            ? totalDuration / analytics.sessions.length
            : 30;

    // Calculate completion rate
    const completedSessions = analytics.sessions.filter(
        (s) => s.completedTask
    ).length;
    const completionRate =
        analytics.sessions.length > 0
            ? (completedSessions / analytics.sessions.length) * 100
            : 0;

    // Calculate streak consistency
    const streakConsistency = gamification.streak > 0 ? gamification.streak / 7 : 0;

    // Determine difficulty preference (simplified)
    const difficultyPreference =
        completionRate > 80 ? "challenging" : completionRate > 50 ? "moderate" : "easy";

    return {
        preferredStudyTime,
        averageSessionLength,
        completionRate,
        streakConsistency,
        difficultyPreference,
    };
}

/**
 * Generate personalized recommendations based on study patterns
 */
export function generateRecommendations(
    pattern: StudyPattern,
    gamification: GamificationStats,
    completedCount: number,
    totalTasks: number
): PersonalizedRecommendation[] {
    const recommendations: PersonalizedRecommendation[] = [];

    // Study time recommendation
    const timeEmoji = {
        morning: "🌅",
        afternoon: "☀️",
        evening: "🌆",
        night: "🌙",
    };

    recommendations.push({
        id: "study-time",
        type: "study-time",
        title: "Your Peak Study Time",
        message: `You're most productive in the ${pattern.preferredStudyTime}! ${timeEmoji[pattern.preferredStudyTime]} Schedule your toughest tasks during this time.`,
        icon: timeEmoji[pattern.preferredStudyTime],
        priority: "medium",
        actionable: true,
        action: "Schedule next study session",
    });

    // Session length recommendation
    if (pattern.averageSessionLength < 20) {
        recommendations.push({
            id: "session-length",
            type: "strategy",
            title: "Extend Your Study Sessions",
            message: `Your average session is ${Math.round(pattern.averageSessionLength)} minutes. Try the Pomodoro technique (25 min focus + 5 min break) to boost productivity! 🍅`,
            icon: "⏱️",
            priority: "medium",
            actionable: true,
            action: "Start Grinch Mode timer",
        });
    }

    // Completion rate feedback
    if (pattern.completionRate > 80) {
        recommendations.push({
            id: "high-performer",
            type: "motivation",
            title: "You're Crushing It! 🎄",
            message: `${Math.round(pattern.completionRate)}% completion rate! You're a study superstar! Keep up the amazing work!`,
            icon: "⭐",
            priority: "low",
            actionable: false,
        });
    } else if (pattern.completionRate < 50) {
        recommendations.push({
            id: "need-support",
            type: "strategy",
            title: "Let's Boost Your Success Rate",
            message: `Break tasks into smaller chunks! Try completing just 10 minutes at a time. Small wins build momentum! 💪`,
            icon: "🎯",
            priority: "high",
            actionable: true,
            action: "Break down next task",
        });
    }

    // Streak protection
    if (gamification.streak >= 3 && gamification.streak < 7) {
        recommendations.push({
            id: "streak-protection",
            type: "warning",
            title: "Protect Your Streak! 🔥",
            message: `You're on a ${gamification.streak}-day streak! Don't break it now. Complete at least one task today to keep the momentum going!`,
            icon: "🔥",
            priority: "high",
            actionable: true,
            action: "Complete a task now",
        });
    } else if (gamification.streak >= 7) {
        recommendations.push({
            id: "streak-master",
            type: "motivation",
            title: "Streak Master! 🏆",
            message: `${gamification.streak} days strong! You're building an incredible habit. Santa would be proud! 🎅`,
            icon: "🏆",
            priority: "low",
            actionable: false,
        });
    }

    // Progress prediction
    const remainingTasks = totalTasks - completedCount;
    const daysUntilChristmas = Math.ceil(
        (new Date("2024-12-25").getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    if (remainingTasks > 0 && daysUntilChristmas > 0) {
        const tasksPerDay = remainingTasks / daysUntilChristmas;
        if (tasksPerDay <= 1) {
            recommendations.push({
                id: "on-track",
                type: "motivation",
                title: "You're On Track! 🎯",
                message: `At your current pace, you'll finish ${Math.ceil(daysUntilChristmas - remainingTasks)} days before Christmas! Keep it up! 🎄`,
                icon: "✅",
                priority: "low",
                actionable: false,
            });
        } else {
            recommendations.push({
                id: "need-acceleration",
                type: "warning",
                title: "Time to Accelerate! 🚀",
                message: `You need to complete ${Math.ceil(tasksPerDay)} tasks per day to finish on time. You've got this! Break them into smaller chunks! 💪`,
                icon: "⚡",
                priority: "high",
                actionable: true,
                action: "View study plan",
            });
        }
    }

    // Difficulty adjustment
    if (pattern.difficultyPreference === "challenging" && completedCount > 5) {
        recommendations.push({
            id: "challenge-seeker",
            type: "strategy",
            title: "Challenge Accepted! 🎮",
            message: `You're ready for harder material! Try tackling the most complex topics during your peak ${pattern.preferredStudyTime} hours.`,
            icon: "🎯",
            priority: "medium",
            actionable: false,
        });
    }

    // Christmas motivation
    recommendations.push({
        id: "christmas-spirit",
        type: "motivation",
        title: "Christmas Spirit Boost! 🎅",
        message: `Every task you complete adds an ornament to your tree! You're ${Math.round((completedCount / totalTasks) * 100)}% closer to a fully decorated Christmas tree! 🎄`,
        icon: "🎁",
        priority: "low",
        actionable: false,
    });

    return recommendations.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
}

/**
 * Generate learning insights from patterns
 */
export function generateLearningInsights(pattern: StudyPattern): LearningInsight[] {
    const insights: LearningInsight[] = [];

    // Study time insight
    insights.push({
        pattern: `Peak productivity in the ${pattern.preferredStudyTime}`,
        confidence: 0.85,
        suggestion: `Schedule your most challenging tasks during ${pattern.preferredStudyTime} hours for maximum efficiency`,
        impact: "positive",
    });

    // Session length insight
    if (pattern.averageSessionLength < 25) {
        insights.push({
            pattern: "Short study sessions detected",
            confidence: 0.75,
            suggestion: "Consider using the Pomodoro technique to extend focus time while maintaining breaks",
            impact: "neutral",
        });
    } else if (pattern.averageSessionLength > 60) {
        insights.push({
            pattern: "Long study sessions without breaks",
            confidence: 0.8,
            suggestion: "Take regular breaks every 45-50 minutes to maintain focus and prevent burnout",
            impact: "negative",
        });
    }

    // Completion rate insight
    if (pattern.completionRate > 80) {
        insights.push({
            pattern: "High task completion rate",
            confidence: 0.9,
            suggestion: "You're excelling! Consider increasing task difficulty or adding bonus challenges",
            impact: "positive",
        });
    } else if (pattern.completionRate < 50) {
        insights.push({
            pattern: "Lower completion rate detected",
            confidence: 0.7,
            suggestion: "Break tasks into smaller, 10-15 minute chunks to build momentum and confidence",
            impact: "negative",
        });
    }

    // Streak consistency insight
    if (pattern.streakConsistency > 0.7) {
        insights.push({
            pattern: "Excellent study consistency",
            confidence: 0.95,
            suggestion: "Your daily habit is strong! Maintain this rhythm through the holidays",
            impact: "positive",
        });
    } else if (pattern.streakConsistency < 0.3) {
        insights.push({
            pattern: "Inconsistent study pattern",
            confidence: 0.65,
            suggestion: "Set a specific daily study time and enable reminders to build consistency",
            impact: "negative",
        });
    }

    return insights;
}

/**
 * Get AI-powered study tips based on current context
 */
export function getContextualStudyTips(
    currentHour: number,
    pattern: StudyPattern,
    streak: number
): string[] {
    const tips: string[] = [];

    // Time-based tips
    if (currentHour >= 6 && currentHour < 12) {
        tips.push("🌅 Morning minds are fresh! Tackle your hardest topics now.");
    } else if (currentHour >= 12 && currentHour < 17) {
        tips.push("☀️ Afternoon energy dip? Take a quick walk before studying!");
    } else if (currentHour >= 17 && currentHour < 21) {
        tips.push("🌆 Evening review session? Perfect time to consolidate what you learned!");
    } else {
        tips.push("🌙 Late night? Keep sessions short and focus on lighter review material.");
    }

    // Pattern-based tips
    if (pattern.preferredStudyTime === "morning" && currentHour < 12) {
        tips.push("⭐ You're in your peak time zone! Make the most of it!");
    }

    // Streak-based tips
    if (streak > 0) {
        tips.push(`🔥 ${streak}-day streak! You're building an incredible habit!`);
    } else {
        tips.push("🎯 Start your streak today! Consistency is key to success!");
    }

    // General Christmas-themed tips
    const christmasTips = [
        "🎄 Each task is like unwrapping a gift of knowledge!",
        "🎅 Santa rewards consistent learners with success!",
        "❄️ Cool, calm, and collected - that's how winners study!",
        "🎁 Every completed task is a present to your future self!",
        "⭐ Shine bright like a Christmas star - you've got this!",
    ];

    tips.push(christmasTips[Math.floor(Math.random() * christmasTips.length)]);

    return tips;
}

