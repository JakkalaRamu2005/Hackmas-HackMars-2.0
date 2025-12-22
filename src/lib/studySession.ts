/**
 * Study Session Timer
 * Track actual study time per task with session management
 */

export interface StudySession {
    id: string;
    taskId: number;
    taskTitle: string;
    startTime: string;
    endTime: string | null;
    duration: number; // in seconds
    isActive: boolean;
    pausedAt: string | null;
    totalPausedTime: number; // in seconds
}

export interface SessionStats {
    totalSessions: number;
    totalStudyTime: number; // in minutes
    averageSessionLength: number; // in minutes
    longestSession: number; // in minutes
    todayStudyTime: number; // in minutes
    thisWeekStudyTime: number; // in minutes
}

/**
 * Start a new study session
 */
export function startSession(taskId: number, taskTitle: string): StudySession {
    return {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        taskId,
        taskTitle,
        startTime: new Date().toISOString(),
        endTime: null,
        duration: 0,
        isActive: true,
        pausedAt: null,
        totalPausedTime: 0,
    };
}

/**
 * End a study session
 */
export function endSession(session: StudySession): StudySession {
    const now = new Date();
    const startTime = new Date(session.startTime);
    const totalElapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    const actualDuration = totalElapsed - session.totalPausedTime;

    return {
        ...session,
        endTime: now.toISOString(),
        duration: actualDuration,
        isActive: false,
        pausedAt: null,
    };
}

/**
 * Pause a study session
 */
export function pauseSession(session: StudySession): StudySession {
    if (!session.isActive || session.pausedAt) return session;

    return {
        ...session,
        pausedAt: new Date().toISOString(),
    };
}

/**
 * Resume a paused session
 */
export function resumeSession(session: StudySession): StudySession {
    if (!session.pausedAt) return session;

    const now = new Date();
    const pausedTime = new Date(session.pausedAt);
    const pauseDuration = Math.floor((now.getTime() - pausedTime.getTime()) / 1000);

    return {
        ...session,
        pausedAt: null,
        totalPausedTime: session.totalPausedTime + pauseDuration,
    };
}

/**
 * Get current session duration (live)
 */
export function getCurrentDuration(session: StudySession): number {
    if (!session.isActive) return session.duration;

    const now = new Date();
    const startTime = new Date(session.startTime);
    const totalElapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);

    if (session.pausedAt) {
        const pausedTime = new Date(session.pausedAt);
        const currentPauseDuration = Math.floor((now.getTime() - pausedTime.getTime()) / 1000);
        return totalElapsed - session.totalPausedTime - currentPauseDuration;
    }

    return totalElapsed - session.totalPausedTime;
}

/**
 * Format duration to HH:MM:SS
 */
export function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate session statistics
 */
export function calculateSessionStats(sessions: StudySession[]): SessionStats {
    const completedSessions = sessions.filter(s => !s.isActive);

    const totalStudyTime = completedSessions.reduce((sum, s) => sum + s.duration, 0) / 60;
    const averageSessionLength = completedSessions.length > 0
        ? totalStudyTime / completedSessions.length
        : 0;
    const longestSession = completedSessions.length > 0
        ? Math.max(...completedSessions.map(s => s.duration)) / 60
        : 0;

    // Today's study time
    const today = new Date().toDateString();
    const todayStudyTime = completedSessions
        .filter(s => new Date(s.startTime).toDateString() === today)
        .reduce((sum, s) => sum + s.duration, 0) / 60;

    // This week's study time
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const thisWeekStudyTime = completedSessions
        .filter(s => new Date(s.startTime) >= weekAgo)
        .reduce((sum, s) => sum + s.duration, 0) / 60;

    return {
        totalSessions: completedSessions.length,
        totalStudyTime: Math.round(totalStudyTime),
        averageSessionLength: Math.round(averageSessionLength),
        longestSession: Math.round(longestSession),
        todayStudyTime: Math.round(todayStudyTime),
        thisWeekStudyTime: Math.round(thisWeekStudyTime),
    };
}

/**
 * Get sessions for a specific task
 */
export function getTaskSessions(sessions: StudySession[], taskId: number): StudySession[] {
    return sessions.filter(s => s.taskId === taskId);
}

/**
 * Get total time spent on a task
 */
export function getTaskTotalTime(sessions: StudySession[], taskId: number): number {
    return getTaskSessions(sessions, taskId)
        .filter(s => !s.isActive)
        .reduce((sum, s) => sum + s.duration, 0) / 60; // in minutes
}

/**
 * Storage functions
 */
const STORAGE_KEY = 'study_sessions';
const ACTIVE_SESSION_KEY = 'active_study_session';

export const sessionStorage = {
    saveSessions: (sessions: StudySession[]): void => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
        } catch (error) {
            console.error('Failed to save study sessions:', error);
        }
    },

    loadSessions: (): StudySession[] => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Failed to load study sessions:', error);
            return [];
        }
    },

    saveActiveSession: (session: StudySession | null): void => {
        try {
            if (session) {
                localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
            } else {
                localStorage.removeItem(ACTIVE_SESSION_KEY);
            }
        } catch (error) {
            console.error('Failed to save active session:', error);
        }
    },

    loadActiveSession: (): StudySession | null => {
        try {
            const data = localStorage.getItem(ACTIVE_SESSION_KEY);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Failed to load active session:', error);
            return null;
        }
    },

    clear: (): void => {
        try {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(ACTIVE_SESSION_KEY);
        } catch (error) {
            console.error('Failed to clear study sessions:', error);
        }
    },
};
