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

// Cache for handling circular references during JSON serialization
const cache = new Set();

export const storage = {
    // Save progress to localStorage
    saveProgress: (progress: UserProgress): void => {
        try {
            if (typeof window === 'undefined') return;

            const data = {
                ...progress,
                lastUpdated: new Date().toISOString(),
            };

            // Safe JSON stringify with circular reference handling
            const jsonString = JSON.stringify(data, (key, value) => {
                // Handle circular references
                if (value instanceof Object && value !== null) {
                    if (cache.has(value)) {
                        return; // Circular reference found, discard key
                    }
                    cache.add(value);
                }
                return value;
            });

            cache.clear();
            localStorage.setItem(STORAGE_KEY, jsonString);
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'QuotaExceededError') {
                    console.error("Failed to save progress: Storage quota exceeded. Clearing old data...");
                    try {
                        localStorage.removeItem(STORAGE_KEY);
                        console.log("Old data cleared. Please try again.");
                    } catch (e) {
                        console.error("Failed to clear storage:", e);
                    }
                } else {
                    console.error("Failed to save progress:", error.message);
                }
            } else {
                console.error("Failed to save progress:", String(error));
            }
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
