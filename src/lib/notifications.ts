// Smart Reminders & Notifications System

export interface NotificationSettings {
    enabled: boolean;
    dailyTaskReminder: boolean;
    dailyTaskTime: string; // HH:MM format
    streakReminder: boolean;
    streakReminderTime: string;
    motivationalQuotes: boolean;
    christmasCountdown: boolean;
    soundEnabled: boolean;
}

export interface Notification {
    id: string;
    type: 'task' | 'streak' | 'quote' | 'countdown' | 'achievement';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    icon: string;
}

const STORAGE_KEY = 'notification_settings';
const NOTIFICATIONS_KEY = 'notifications_history';

// Christmas-themed motivational quotes
export const MOTIVATIONAL_QUOTES = [
    {
        quote: "Every task completed is a gift to your future self! 🎁",
        author: "Santa's Study Helper"
    },
    {
        quote: "Keep your study streak alive, just like the Christmas spirit! 🎄",
        author: "StudyAdvent.ai"
    },
    {
        quote: "Small daily improvements lead to stunning results! ⭐",
        author: "Santa's Workshop"
    },
    {
        quote: "Your dedication today is tomorrow's success story! 🌟",
        author: "StudyAdvent.ai"
    },
    {
        quote: "Like decorating a tree, one ornament at a time - one task at a time! 🎄",
        author: "Santa's Study Helper"
    },
    {
        quote: "The best time to study was yesterday. The second best time is now! ❄️",
        author: "StudyAdvent.ai"
    },
    {
        quote: "Your future is created by what you do today, not tomorrow! 🎅",
        author: "Santa's Workshop"
    },
    {
        quote: "Success is the sum of small efforts repeated day in and day out! 🔥",
        author: "StudyAdvent.ai"
    },
    {
        quote: "Don't let your streak melt away like a snowman in spring! ⛄",
        author: "Santa's Study Helper"
    },
    {
        quote: "Every expert was once a beginner who refused to give up! 🏆",
        author: "StudyAdvent.ai"
    },
];

// Default settings
export const DEFAULT_SETTINGS: NotificationSettings = {
    enabled: false, // Disabled by default (requires user permission)
    dailyTaskReminder: true,
    dailyTaskTime: '09:00',
    streakReminder: true,
    streakReminderTime: '20:00',
    motivationalQuotes: true,
    christmasCountdown: true,
    soundEnabled: true,
};

// Storage functions
export const notificationStorage = {
    getSettings: (): NotificationSettings => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : DEFAULT_SETTINGS;
        } catch (error) {
            console.error('Failed to load notification settings:', error);
            return DEFAULT_SETTINGS;
        }
    },

    saveSettings: (settings: NotificationSettings): void => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error('Failed to save notification settings:', error);
        }
    },

    getNotifications: (): Notification[] => {
        try {
            const data = localStorage.getItem(NOTIFICATIONS_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Failed to load notifications:', error);
            return [];
        }
    },

    saveNotification: (notification: Notification): void => {
        try {
            const notifications = notificationStorage.getNotifications();
            notifications.unshift(notification); // Add to beginning
            // Keep only last 50 notifications
            const trimmed = notifications.slice(0, 50);
            localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(trimmed));
        } catch (error) {
            console.error('Failed to save notification:', error);
        }
    },

    markAsRead: (notificationId: string): void => {
        try {
            const notifications = notificationStorage.getNotifications();
            const updated = notifications.map(n =>
                n.id === notificationId ? { ...n, read: true } : n
            );
            localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    },

    clearAll: (): void => {
        try {
            localStorage.removeItem(NOTIFICATIONS_KEY);
        } catch (error) {
            console.error('Failed to clear notifications:', error);
        }
    },
};

// Request browser notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
};

// Show browser notification
export const showBrowserNotification = (title: string, body: string, icon?: string): void => {
    if (Notification.permission === 'granted') {
        new Notification(title, {
            body,
            icon: icon || '/favicon.ico',
            badge: '/favicon.ico',
            tag: 'studyadvent-notification',
        });
    }
};

// Create notification
export const createNotification = (
    type: Notification['type'],
    title: string,
    message: string,
    icon: string = '🔔'
): Notification => {
    return {
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        title,
        message,
        timestamp: new Date().toISOString(),
        read: false,
        icon,
    };
};

// Get random motivational quote
export const getRandomQuote = () => {
    return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
};

// Calculate days until Christmas
export const getDaysUntilChristmas = (): number => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const christmas = new Date(currentYear, 11, 25); // December 25

    // If Christmas has passed this year, calculate for next year
    if (now > christmas) {
        christmas.setFullYear(currentYear + 1);
    }

    const diffTime = christmas.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

// Check if it's time to show a notification
export const shouldShowNotification = (
    settings: NotificationSettings,
    type: 'task' | 'streak' | 'quote',
    lastShownTime?: string
): boolean => {
    if (!settings.enabled) return false;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // Check if already shown today
    if (lastShownTime) {
        const lastShown = new Date(lastShownTime);
        const today = new Date();
        if (
            lastShown.getDate() === today.getDate() &&
            lastShown.getMonth() === today.getMonth() &&
            lastShown.getFullYear() === today.getFullYear()
        ) {
            return false; // Already shown today
        }
    }

    switch (type) {
        case 'task':
            return settings.dailyTaskReminder && currentTime >= settings.dailyTaskTime;
        case 'streak':
            return settings.streakReminder && currentTime >= settings.streakReminderTime;
        case 'quote':
            return settings.motivationalQuotes;
        default:
            return false;
    }
};

// Format time for display
export const formatNotificationTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
};

// Play notification sound
export const playNotificationSound = (): void => {
    try {
        const audio = new Audio('/notification-sound.mp3');
        audio.volume = 0.5;
        audio.play().catch(err => console.log('Could not play notification sound:', err));
    } catch (error) {
        console.log('Notification sound not available:', error);
    }
};
