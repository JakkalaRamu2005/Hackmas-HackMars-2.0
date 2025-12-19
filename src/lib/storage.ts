// LocalStorage utility for persisting user data

import { GamificationStats, ACHIEVEMENTS } from "./gamification";

export interface DayTask {
    day: number;
    title: string;
    isUnlocked: boolean;
    isCompleted: boolean;
}

export interface UserProgress {
    tasks: DayTask[];
    completedCount: number;
    syllabusText: string;
    lastUpdated: string;
    gamification: GamificationStats;
}

const STORAGE_KEY = "studyadvent_progress";

export const storage = {
    // Save progress to localStorage
    saveProgress: (progress: UserProgress): void => {
        try {
            const data = {
                ...progress,
                lastUpdated: new Date().toISOString(),
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error("Failed to save progress:", error);
        }
    },

    // Load progress from localStorage
    loadProgress: (): UserProgress | null => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) return null;
            return JSON.parse(data);
        } catch (error) {
            console.error("Failed to load progress:", error);
            return null;
        }
    },

    // Clear all saved progress
    clearProgress: (): void => {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error("Failed to clear progress:", error);
        }
    },

    // Check if there's saved progress
    hasProgress: (): boolean => {
        try {
            return localStorage.getItem(STORAGE_KEY) !== null;
        } catch (error) {
            return false;
        }
    },
};
