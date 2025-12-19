// Gamification system types and utilities

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlockedAt?: string;
}

export interface GamificationStats {
    points: number;
    streak: number;
    lastCompletedDate: string | null;
    totalCompleted: number;
    achievements: Achievement[];
    unlockedRewards: string[];
}

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: "first_task",
        name: "Getting Started",
        description: "Complete your first task",
        icon: "🎁",
        unlocked: false,
    },
    {
        id: "early_bird",
        name: "Early Bird",
        description: "Complete 3 tasks before noon",
        icon: "🌅",
        unlocked: false,
    },
    {
        id: "night_owl",
        name: "Night Owl",
        description: "Complete 3 tasks after 8 PM",
        icon: "🦉",
        unlocked: false,
    },
    {
        id: "streak_3",
        name: "On Fire!",
        description: "Maintain a 3-day streak",
        icon: "🔥",
        unlocked: false,
    },
    {
        id: "streak_7",
        name: "Week Warrior",
        description: "Maintain a 7-day streak",
        icon: "⚡",
        unlocked: false,
    },
    {
        id: "halfway",
        name: "Halfway There",
        description: "Complete 12 tasks",
        icon: "🎯",
        unlocked: false,
    },
    {
        id: "perfectionist",
        name: "Perfectionist",
        description: "Complete all 24 tasks",
        icon: "🏆",
        unlocked: false,
    },
    {
        id: "speed_demon",
        name: "Speed Demon",
        description: "Complete 5 tasks in one day",
        icon: "💨",
        unlocked: false,
    },
];

export const REWARDS = [
    { id: "ornament_gold", name: "Golden Ornament", points: 100, icon: "🟡" },
    { id: "ornament_silver", name: "Silver Ornament", points: 200, icon: "⚪" },
    { id: "ornament_rainbow", name: "Rainbow Ornament", points: 300, icon: "🌈" },
    { id: "snow_heavy", name: "Heavy Snowfall", points: 150, icon: "❄️" },
    { id: "snow_sparkle", name: "Sparkle Snow", points: 250, icon: "✨" },
    { id: "music_jingle", name: "Jingle Bells", points: 200, icon: "🔔" },
    { id: "music_carol", name: "Christmas Carols", points: 300, icon: "🎵" },
];

export const calculatePoints = (completedCount: number, streak: number): number => {
    const basePoints = completedCount * 10;
    const streakBonus = streak * 5;
    return basePoints + streakBonus;
};

export const calculateStreak = (
    lastCompletedDate: string | null,
    currentDate: Date = new Date()
): { isStreakActive: boolean; shouldIncrement: boolean } => {
    if (!lastCompletedDate) {
        return { isStreakActive: false, shouldIncrement: true };
    }

    const lastDate = new Date(lastCompletedDate);
    const diffTime = currentDate.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        // Same day - don't increment
        return { isStreakActive: true, shouldIncrement: false };
    } else if (diffDays === 1) {
        // Next day - increment streak
        return { isStreakActive: true, shouldIncrement: true };
    } else {
        // Streak broken
        return { isStreakActive: false, shouldIncrement: true };
    }
};

export const checkAchievements = (
    stats: GamificationStats,
    completedCount: number,
    completionTime?: Date
): Achievement[] => {
    const newAchievements: Achievement[] = [];
    const hour = completionTime?.getHours() || new Date().getHours();

    ACHIEVEMENTS.forEach((achievement) => {
        const existing = stats.achievements.find((a) => a.id === achievement.id);
        if (existing?.unlocked) return;

        let shouldUnlock = false;

        switch (achievement.id) {
            case "first_task":
                shouldUnlock = completedCount >= 1;
                break;
            case "early_bird":
                shouldUnlock = hour < 12 && completedCount >= 3;
                break;
            case "night_owl":
                shouldUnlock = hour >= 20 && completedCount >= 3;
                break;
            case "streak_3":
                shouldUnlock = stats.streak >= 3;
                break;
            case "streak_7":
                shouldUnlock = stats.streak >= 7;
                break;
            case "halfway":
                shouldUnlock = completedCount >= 12;
                break;
            case "perfectionist":
                shouldUnlock = completedCount >= 24;
                break;
            case "speed_demon":
                // This would need daily tracking - simplified for now
                shouldUnlock = completedCount >= 5;
                break;
        }

        if (shouldUnlock) {
            newAchievements.push({
                ...achievement,
                unlocked: true,
                unlockedAt: new Date().toISOString(),
            });
        }
    });

    return newAchievements;
};

export const getAvailableRewards = (points: number) => {
    return REWARDS.filter((reward) => reward.points <= points);
};
