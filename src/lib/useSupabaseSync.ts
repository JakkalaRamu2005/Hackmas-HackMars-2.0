"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { userService } from "@/lib/supabase";
import type { AnalyticsData } from "./analytics";
import type { GamificationStats } from "./gamification";

interface Task {
    day: number;
    title: string;
    isUnlocked: boolean;
    isCompleted: boolean;
}

interface ProgressData {
    tasks: Task[];
    completedCount: number;
    syllabusText: string;
    gamification: GamificationStats;
    analytics: AnalyticsData;
}

export const useSupabaseSync = () => {
    const { data: session, status } = useSession();
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

    // Load progress from Supabase when user signs in
    const loadProgress = async (): Promise<ProgressData | null> => {
        if (!session?.user?.id) return null;

        try {
            setIsSyncing(true);
            const progress = await userService.loadProgress(session.user.id);

            if (progress) {
                setLastSyncTime(progress.last_updated);
                return {
                    tasks: progress.tasks,
                    completedCount: progress.completed_count,
                    syllabusText: progress.syllabus_text,
                    gamification: progress.gamification,
                    analytics: progress.analytics,
                };
            }
            return null;
        } catch (error) {
            console.error("Error loading progress from Supabase:", error);
            return null;
        } finally {
            setIsSyncing(false);
        }
    };

    // Save progress to Supabase
    const saveProgress = async (progressData: ProgressData): Promise<boolean> => {
        if (!session?.user?.id) return false;

        try {
            setIsSyncing(true);
            const result = await userService.saveProgress(session.user.id, {
                tasks: progressData.tasks,
                completed_count: progressData.completedCount,
                syllabus_text: progressData.syllabusText,
                gamification: progressData.gamification,
                analytics: progressData.analytics,
            });

            if (result) {
                setLastSyncTime(result.last_updated);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error saving progress to Supabase:", error);
            return false;
        } finally {
            setIsSyncing(false);
        }
    };

    // Delete progress from Supabase
    const deleteProgress = async (): Promise<boolean> => {
        if (!session?.user?.id) return false;

        try {
            setIsSyncing(true);
            const result = await userService.deleteProgress(session.user.id);
            if (result) {
                setLastSyncTime(null);
            }
            return result;
        } catch (error) {
            console.error("Error deleting progress from Supabase:", error);
            return false;
        } finally {
            setIsSyncing(false);
        }
    };

    return {
        isAuthenticated: status === "authenticated",
        isLoading: status === "loading",
        isSyncing,
        lastSyncTime,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        userName: session?.user?.name,
        userImage: session?.user?.image,
        loadProgress,
        saveProgress,
        deleteProgress,
    };
};
