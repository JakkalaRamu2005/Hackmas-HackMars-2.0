// Study Analytics System

export interface StudySession {
    id: string;
    startTime: string;
    endTime: string;
    duration: number; // in minutes
    taskId?: number;
    taskTitle?: string;
    completedTask: boolean;
    date: string; // YYYY-MM-DD format
    hourOfDay: number; // 0-23
}

export interface DailyStats {
    date: string;
    totalStudyTime: number; // in minutes
    tasksCompleted: number;
    sessionsCount: number;
    focusScore: number; // 0-100, based on session completion rate
}

export interface WeeklyStats {
    weekStart: string;
    weekEnd: string;
    totalStudyTime: number;
    tasksCompleted: number;
    averageDailyTime: number;
    mostProductiveDay: string;
    mostProductiveHour: number;
}

export interface AnalyticsData {
    sessions: StudySession[];
    dailyStats: DailyStats[];
    totalStudyTime: number; // all-time in minutes
    totalTasksCompleted: number;
    currentStreak: number;
    longestStreak: number;
    averageSessionDuration: number;
    productivityByHour: number[]; // 24 hours, study time in minutes
    completionRate: number; // percentage
}

const STORAGE_KEY = "study_analytics";

// Helper functions
export const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

export const getHourOfDay = (date: Date): number => {
    return date.getHours();
};

export const calculateDuration = (start: string, end: string): number => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    return Math.round((endTime - startTime) / 60000); // Convert to minutes
};

export const calculateFocusScore = (sessionsCompleted: number, totalSessions: number): number => {
    if (totalSessions === 0) return 0;
    return Math.round((sessionsCompleted / totalSessions) * 100);
};

// Storage functions
export const analyticsStorage = {
    save: (data: AnalyticsData): void => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error("Failed to save analytics:", error);
        }
    },

    load: (): AnalyticsData => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) return getDefaultAnalytics();
            return JSON.parse(data);
        } catch (error) {
            console.error("Failed to load analytics:", error);
            return getDefaultAnalytics();
        }
    },

    clear: (): void => {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error("Failed to clear analytics:", error);
        }
    },
};

export const getDefaultAnalytics = (): AnalyticsData => ({
    sessions: [],
    dailyStats: [],
    totalStudyTime: 0,
    totalTasksCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    averageSessionDuration: 0,
    productivityByHour: Array(24).fill(0),
    completionRate: 0,
});

// Analytics calculation functions
export const addStudySession = (
    analytics: AnalyticsData,
    session: Omit<StudySession, 'id'>
): AnalyticsData => {
    const newSession: StudySession = {
        ...session,
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    const updatedSessions = [...analytics.sessions, newSession];

    // Update daily stats
    const dailyStats = updateDailyStats(analytics.dailyStats, newSession);

    // Update productivity by hour
    const productivityByHour = [...analytics.productivityByHour];
    productivityByHour[session.hourOfDay] += session.duration;

    // Calculate totals
    const totalStudyTime = analytics.totalStudyTime + session.duration;
    const totalTasksCompleted = analytics.totalTasksCompleted + (session.completedTask ? 1 : 0);
    const averageSessionDuration = totalStudyTime / updatedSessions.length;
    const completionRate = calculateCompletionRate(updatedSessions);

    // Calculate streaks
    const { currentStreak, longestStreak } = calculateStreaks(dailyStats);

    return {
        sessions: updatedSessions,
        dailyStats,
        totalStudyTime,
        totalTasksCompleted,
        currentStreak,
        longestStreak,
        averageSessionDuration,
        productivityByHour,
        completionRate,
    };
};

const updateDailyStats = (
    dailyStats: DailyStats[],
    session: StudySession
): DailyStats[] => {
    const existingDayIndex = dailyStats.findIndex(d => d.date === session.date);

    if (existingDayIndex >= 0) {
        const updated = [...dailyStats];
        const day = updated[existingDayIndex];
        updated[existingDayIndex] = {
            ...day,
            totalStudyTime: day.totalStudyTime + session.duration,
            tasksCompleted: day.tasksCompleted + (session.completedTask ? 1 : 0),
            sessionsCount: day.sessionsCount + 1,
            focusScore: calculateFocusScore(
                day.tasksCompleted + (session.completedTask ? 1 : 0),
                day.sessionsCount + 1
            ),
        };
        return updated;
    } else {
        return [
            ...dailyStats,
            {
                date: session.date,
                totalStudyTime: session.duration,
                tasksCompleted: session.completedTask ? 1 : 0,
                sessionsCount: 1,
                focusScore: session.completedTask ? 100 : 0,
            },
        ];
    }
};

const calculateCompletionRate = (sessions: StudySession[]): number => {
    if (sessions.length === 0) return 0;
    const completed = sessions.filter(s => s.completedTask).length;
    return Math.round((completed / sessions.length) * 100);
};

const calculateStreaks = (dailyStats: DailyStats[]): { currentStreak: number; longestStreak: number } => {
    if (dailyStats.length === 0) return { currentStreak: 0, longestStreak: 0 };

    // Sort by date descending
    const sorted = [...dailyStats].sort((a, b) => b.date.localeCompare(a.date));

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = formatDate(new Date());
    let checkDate = new Date(today);

    // Calculate current streak
    for (const stat of sorted) {
        const statDate = formatDate(new Date(stat.date));
        const expectedDate = formatDate(checkDate);

        if (statDate === expectedDate && stat.tasksCompleted > 0) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }

    // Calculate longest streak
    for (let i = 0; i < sorted.length; i++) {
        if (sorted[i].tasksCompleted > 0) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
        } else {
            tempStreak = 0;
        }
    }

    return { currentStreak, longestStreak };
};

export const getWeeklyStats = (analytics: AnalyticsData): WeeklyStats => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const weekSessions = analytics.sessions.filter(s => {
        const sessionDate = new Date(s.date);
        return sessionDate >= weekStart && sessionDate <= weekEnd;
    });

    const totalStudyTime = weekSessions.reduce((sum, s) => sum + s.duration, 0);
    const tasksCompleted = weekSessions.filter(s => s.completedTask).length;
    const averageDailyTime = totalStudyTime / 7;

    // Find most productive day
    const dayTotals = new Map<string, number>();
    weekSessions.forEach(s => {
        dayTotals.set(s.date, (dayTotals.get(s.date) || 0) + s.duration);
    });

    let mostProductiveDay = formatDate(weekStart);
    let maxTime = 0;
    dayTotals.forEach((time, date) => {
        if (time > maxTime) {
            maxTime = time;
            mostProductiveDay = date;
        }
    });

    // Find most productive hour
    const hourTotals = Array(24).fill(0);
    weekSessions.forEach(s => {
        hourTotals[s.hourOfDay] += s.duration;
    });
    const mostProductiveHour = hourTotals.indexOf(Math.max(...hourTotals));

    return {
        weekStart: formatDate(weekStart),
        weekEnd: formatDate(weekEnd),
        totalStudyTime,
        tasksCompleted,
        averageDailyTime,
        mostProductiveDay,
        mostProductiveHour,
    };
};

export const getLast7DaysStats = (analytics: AnalyticsData): DailyStats[] => {
    const last7Days: DailyStats[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = formatDate(date);

        const existing = analytics.dailyStats.find(d => d.date === dateStr);
        last7Days.push(existing || {
            date: dateStr,
            totalStudyTime: 0,
            tasksCompleted: 0,
            sessionsCount: 0,
            focusScore: 0,
        });
    }

    return last7Days;
};
