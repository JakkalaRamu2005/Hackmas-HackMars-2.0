/**
 * Progress Predictions
 * AI-powered predictions for completion time and pace analysis
 */

export interface ProgressPrediction {
    currentPace: number; // tasks per day
    projectedCompletionDate: string;
    daysAhead: number; // positive = ahead, negative = behind
    daysRemaining: number;
    tasksRemaining: number;
    requiredPace: number; // tasks per day needed
    confidence: 'high' | 'medium' | 'low';
    message: string;
    emoji: string;
    color: 'green' | 'yellow' | 'red';
}

export interface PaceAnalysis {
    trend: 'accelerating' | 'steady' | 'slowing';
    trendMessage: string;
    weeklyComparison: {
        thisWeek: number;
        lastWeek: number;
        change: number; // percentage
    };
    bestDay: {
        date: string;
        tasksCompleted: number;
    };
    recommendations: string[];
}

/**
 * Calculate progress prediction
 */
export function calculateProgressPrediction(
    completedCount: number,
    totalTasks: number,
    startDate: Date,
    targetDate: Date = new Date('2024-12-25')
): ProgressPrediction {
    const now = new Date();
    const daysElapsed = Math.max(1, Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const daysUntilTarget = Math.max(0, Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    const tasksRemaining = totalTasks - completedCount;
    const currentPace = completedCount / daysElapsed;
    const requiredPace = daysUntilTarget > 0 ? tasksRemaining / daysUntilTarget : tasksRemaining;

    // Calculate projected completion date
    const daysNeeded = currentPace > 0 ? Math.ceil(tasksRemaining / currentPace) : 999;
    const projectedDate = new Date(now);
    projectedDate.setDate(projectedDate.getDate() + daysNeeded);

    // Calculate days ahead/behind
    const daysAhead = Math.round((targetDate.getTime() - projectedDate.getTime()) / (1000 * 60 * 60 * 24));

    // Determine confidence level
    let confidence: 'high' | 'medium' | 'low';
    if (completedCount >= totalTasks * 0.5) {
        confidence = 'high';
    } else if (completedCount >= totalTasks * 0.25) {
        confidence = 'medium';
    } else {
        confidence = 'low';
    }

    // Generate message and styling
    let message: string;
    let emoji: string;
    let color: 'green' | 'yellow' | 'red';

    if (completedCount === totalTasks) {
        message = "🎉 Congratulations! You've completed all tasks!";
        emoji = "🏆";
        color = "green";
    } else if (daysAhead > 2) {
        message = `Amazing! At this rate, you'll finish ${daysAhead} days early! 🎄`;
        emoji = "🚀";
        color = "green";
    } else if (daysAhead >= 0) {
        message = `Great pace! You're on track to finish on time! 🎯`;
        emoji = "✅";
        color = "green";
    } else if (daysAhead >= -2) {
        message = `You're slightly behind. Complete ${Math.ceil(requiredPace)} tasks per day to catch up! 💪`;
        emoji = "⚡";
        color = "yellow";
    } else {
        message = `Time to accelerate! You need ${Math.ceil(requiredPace)} tasks per day to finish on time! 🔥`;
        emoji = "⚠️";
        color = "red";
    }

    return {
        currentPace: Math.round(currentPace * 10) / 10,
        projectedCompletionDate: projectedDate.toLocaleDateString(),
        daysAhead,
        daysRemaining: daysUntilTarget,
        tasksRemaining,
        requiredPace: Math.round(requiredPace * 10) / 10,
        confidence,
        message,
        emoji,
        color,
    };
}

/**
 * Analyze pace trends
 */
export function analyzePace(
    completionHistory: { date: string; count: number }[]
): PaceAnalysis {
    if (completionHistory.length < 3) {
        return {
            trend: 'steady',
            trendMessage: 'Keep going! More data needed for trend analysis.',
            weeklyComparison: { thisWeek: 0, lastWeek: 0, change: 0 },
            bestDay: { date: new Date().toLocaleDateString(), tasksCompleted: 0 },
            recommendations: ['Complete more tasks to see personalized insights!'],
        };
    }

    // Calculate trend
    const recentDays = completionHistory.slice(-3);
    const olderDays = completionHistory.slice(-6, -3);
    const recentAvg = recentDays.reduce((sum, d) => sum + d.count, 0) / recentDays.length;
    const olderAvg = olderDays.length > 0
        ? olderDays.reduce((sum, d) => sum + d.count, 0) / olderDays.length
        : recentAvg;

    let trend: 'accelerating' | 'steady' | 'slowing';
    let trendMessage: string;

    if (recentAvg > olderAvg * 1.2) {
        trend = 'accelerating';
        trendMessage = '📈 You\'re picking up speed! Great momentum!';
    } else if (recentAvg < olderAvg * 0.8) {
        trend = 'slowing';
        trendMessage = '📉 Your pace is slowing. Time to refocus!';
    } else {
        trend = 'steady';
        trendMessage = '➡️ You\'re maintaining a steady pace. Keep it up!';
    }

    // Weekly comparison
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const thisWeek = completionHistory
        .filter(d => new Date(d.date) >= weekAgo)
        .reduce((sum, d) => sum + d.count, 0);
    const lastWeek = completionHistory
        .filter(d => new Date(d.date) >= twoWeeksAgo && new Date(d.date) < weekAgo)
        .reduce((sum, d) => sum + d.count, 0);
    const change = lastWeek > 0 ? ((thisWeek - lastWeek) / lastWeek) * 100 : 0;

    // Find best day
    const bestDay = completionHistory.reduce((best, current) =>
        current.count > best.count ? current : best
        , completionHistory[0]);

    // Generate recommendations
    const recommendations: string[] = [];

    if (trend === 'slowing') {
        recommendations.push('Try studying during your most productive hours');
        recommendations.push('Break tasks into smaller 10-minute chunks');
        recommendations.push('Use the Pomodoro timer to stay focused');
    } else if (trend === 'accelerating') {
        recommendations.push('Maintain this momentum - you\'re doing great!');
        recommendations.push('Consider tackling harder topics now');
        recommendations.push('Share your progress to stay motivated');
    } else {
        recommendations.push('Consistency is key - keep up the good work!');
        recommendations.push('Try completing tasks at the same time daily');
        recommendations.push('Challenge yourself with bonus tasks');
    }

    return {
        trend,
        trendMessage,
        weeklyComparison: {
            thisWeek,
            lastWeek,
            change: Math.round(change),
        },
        bestDay: {
            date: bestDay.date,
            tasksCompleted: bestDay.count,
        },
        recommendations,
    };
}

/**
 * Get motivational message based on progress
 */
export function getMotivationalMessage(
    completedCount: number,
    totalTasks: number,
    streak: number
): string {
    const percentage = (completedCount / totalTasks) * 100;

    if (percentage === 100) {
        return "🎄 Perfect! You're a study superstar! Santa is proud! 🎅";
    } else if (percentage >= 75) {
        return `🌟 Almost there! Just ${totalTasks - completedCount} more tasks to go!`;
    } else if (percentage >= 50) {
        return "🎯 Halfway done! You're crushing it! Keep the momentum!";
    } else if (percentage >= 25) {
        return "💪 Great start! You're building solid progress!";
    } else if (streak >= 3) {
        return `🔥 ${streak}-day streak! You're on fire! Don't break it now!`;
    } else {
        return "🎁 Every task brings you closer to success! Let's go!";
    }
}

/**
 * Calculate study efficiency score
 */
export function calculateEfficiencyScore(
    completedCount: number,
    totalTasks: number,
    daysElapsed: number,
    targetDays: number
): {
    score: number;
    grade: 'A+' | 'A' | 'B' | 'C' | 'D';
    message: string;
} {
    const expectedProgress = (daysElapsed / targetDays) * totalTasks;
    const efficiency = completedCount / expectedProgress;
    const score = Math.min(100, Math.round(efficiency * 100));

    let grade: 'A+' | 'A' | 'B' | 'C' | 'D';
    let message: string;

    if (score >= 95) {
        grade = 'A+';
        message = 'Outstanding! You\'re exceeding expectations!';
    } else if (score >= 85) {
        grade = 'A';
        message = 'Excellent work! Keep up the great pace!';
    } else if (score >= 75) {
        grade = 'B';
        message = 'Good progress! You\'re on the right track!';
    } else if (score >= 65) {
        grade = 'C';
        message = 'Fair pace. Consider increasing your study time!';
    } else {
        grade = 'D';
        message = 'Time to accelerate! You can do this!';
    }

    return { score, grade, message };
}
