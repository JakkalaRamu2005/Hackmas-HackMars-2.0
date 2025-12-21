"use client";

import { useEffect, useState } from "react";
import {
    notificationStorage,
    createNotification,
    showBrowserNotification,
    playNotificationSound,
    getRandomQuote,
    getDaysUntilChristmas,
    shouldShowNotification,
    type NotificationSettings,
} from "@/lib/notifications";

interface UseNotificationsProps {
    completedCount: number;
    streak: number;
    totalTasks: number;
}

export const useNotifications = ({ completedCount, streak, totalTasks }: UseNotificationsProps) => {
    const [settings, setSettings] = useState<NotificationSettings>(
        notificationStorage.getSettings()
    );
    const [lastTaskNotification, setLastTaskNotification] = useState<string | null>(null);
    const [lastStreakNotification, setLastStreakNotification] = useState<string | null>(null);
    const [lastQuoteNotification, setLastQuoteNotification] = useState<string | null>(null);

    // Check for notifications every minute
    useEffect(() => {
        const checkNotifications = () => {
            const currentSettings = notificationStorage.getSettings();
            setSettings(currentSettings);

            if (!currentSettings.enabled) return;

            // Daily Task Reminder
            if (shouldShowNotification(currentSettings, 'task', lastTaskNotification ?? undefined)) {
                const remaining = totalTasks - completedCount;
                if (remaining > 0) {
                    const notification = createNotification(
                        'task',
                        '📝 Time to Study!',
                        `You have ${remaining} task${remaining > 1 ? 's' : ''} remaining today. Let's keep the momentum going! 🎄`,
                        '📝'
                    );
                    notificationStorage.saveNotification(notification);
                    showBrowserNotification(notification.title, notification.message);
                    if (currentSettings.soundEnabled) {
                        playNotificationSound();
                    }
                    setLastTaskNotification(new Date().toISOString());
                }
            }

            // Streak Reminder
            if (shouldShowNotification(currentSettings, 'streak', lastStreakNotification ?? undefined)) {
                if (streak > 0) {
                    const notification = createNotification(
                        'streak',
                        '🔥 Don\'t Break Your Streak!',
                        `You're on a ${streak}-day streak! Complete today's task to keep it alive! ⛄`,
                        '🔥'
                    );
                    notificationStorage.saveNotification(notification);
                    showBrowserNotification(notification.title, notification.message);
                    if (currentSettings.soundEnabled) {
                        playNotificationSound();
                    }
                    setLastStreakNotification(new Date().toISOString());
                }
            }

            // Motivational Quote (once per day, random time)
            if (
                currentSettings.motivationalQuotes &&
                shouldShowNotification(currentSettings, 'quote', lastQuoteNotification ?? undefined)
            ) {
                const quote = getRandomQuote();
                const notification = createNotification(
                    'quote',
                    '💡 Daily Inspiration',
                    `"${quote.quote}" - ${quote.author}`,
                    '💡'
                );
                notificationStorage.saveNotification(notification);
                if (currentSettings.soundEnabled) {
                    playNotificationSound();
                }
                setLastQuoteNotification(new Date().toISOString());
            }

            // Christmas Countdown (once per day)
            if (currentSettings.christmasCountdown) {
                const daysUntilChristmas = getDaysUntilChristmas();
                if (daysUntilChristmas <= 25 && daysUntilChristmas > 0) {
                    // Show countdown notification once per day
                    const today = new Date().toDateString();
                    const lastCountdown = localStorage.getItem('last_countdown_notification');

                    if (lastCountdown !== today) {
                        const notification = createNotification(
                            'countdown',
                            '🎄 Christmas Countdown',
                            `Only ${daysUntilChristmas} day${daysUntilChristmas > 1 ? 's' : ''} until Christmas! Keep studying! 🎅`,
                            '🎄'
                        );
                        notificationStorage.saveNotification(notification);
                        localStorage.setItem('last_countdown_notification', today);
                    }
                }
            }
        };

        // Check immediately
        checkNotifications();

        // Check every minute
        const interval = setInterval(checkNotifications, 60000);

        return () => clearInterval(interval);
    }, [completedCount, streak, totalTasks, lastTaskNotification, lastStreakNotification, lastQuoteNotification]);

    // Send achievement notification
    const sendAchievementNotification = (achievementName: string, description: string) => {
        const notification = createNotification(
            'achievement',
            `🏆 Achievement Unlocked!`,
            `${achievementName}: ${description}`,
            '🏆'
        );
        notificationStorage.saveNotification(notification);
        showBrowserNotification(notification.title, notification.message);
        if (settings.soundEnabled) {
            playNotificationSound();
        }
    };

    // Send custom notification
    const sendNotification = (title: string, message: string, icon: string = '🔔') => {
        const notification = createNotification('task', title, message, icon);
        notificationStorage.saveNotification(notification);
        showBrowserNotification(title, message);
        if (settings.soundEnabled) {
            playNotificationSound();
        }
    };

    return {
        settings,
        sendAchievementNotification,
        sendNotification,
    };
};
