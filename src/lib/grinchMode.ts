// Grinch Mode - Distraction Blocker Logic

export interface GrinchModeSettings {
    isEnabled: boolean;
    studyDuration: number; // in minutes
    breakDuration: number; // in minutes
    blockedWebsites: string[];
    soundEnabled: boolean;
}

export interface GrinchModeSession {
    isActive: boolean;
    isStudyTime: boolean; // true = study, false = break
    timeRemaining: number; // in seconds
    sessionsCompleted: number;
    startTime: string | null;
}

const STORAGE_KEY_SETTINGS = "grinch_mode_settings";
const STORAGE_KEY_SESSION = "grinch_mode_session";

// Default blocked websites
export const DEFAULT_BLOCKED_SITES = [
    "facebook.com",
    "twitter.com",
    "instagram.com",
    "youtube.com",
    "reddit.com",
    "tiktok.com",
    "netflix.com",
    "twitch.tv",
];

export const DEFAULT_SETTINGS: GrinchModeSettings = {
    isEnabled: false,
    studyDuration: 25, // Pomodoro default
    breakDuration: 5,
    blockedWebsites: DEFAULT_BLOCKED_SITES,
    soundEnabled: true,
};

export const grinchModeStorage = {
    // Settings
    saveSettings: (settings: GrinchModeSettings): void => {
        try {
            localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
        } catch (error) {
            console.error("Failed to save Grinch Mode settings:", error);
        }
    },

    loadSettings: (): GrinchModeSettings => {
        try {
            const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
            if (!data) return DEFAULT_SETTINGS;
            return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
        } catch (error) {
            console.error("Failed to load Grinch Mode settings:", error);
            return DEFAULT_SETTINGS;
        }
    },

    // Session
    saveSession: (session: GrinchModeSession): void => {
        try {
            localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
        } catch (error) {
            console.error("Failed to save Grinch Mode session:", error);
        }
    },

    loadSession: (): GrinchModeSession | null => {
        try {
            const data = localStorage.getItem(STORAGE_KEY_SESSION);
            if (!data) return null;
            return JSON.parse(data);
        } catch (error) {
            console.error("Failed to load Grinch Mode session:", error);
            return null;
        }
    },

    clearSession: (): void => {
        try {
            localStorage.removeItem(STORAGE_KEY_SESSION);
        } catch (error) {
            console.error("Failed to clear Grinch Mode session:", error);
        }
    },
};

// Check if a URL is blocked
export const isUrlBlocked = (url: string, blockedSites: string[]): boolean => {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase().replace("www.", "");

        return blockedSites.some(blocked => {
            const blockedLower = blocked.toLowerCase().replace("www.", "");
            return hostname.includes(blockedLower) || blockedLower.includes(hostname);
        });
    } catch {
        return false;
    }
};

// Play Christmas bell sound
export const playChristmasBell = (): void => {
    try {
        // Using Web Audio API to create a simple bell sound
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800; // Bell-like frequency
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
    } catch (error) {
        console.error("Failed to play sound:", error);
    }
};
