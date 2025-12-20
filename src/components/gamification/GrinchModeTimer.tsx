"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Play, Pause, RotateCcw, Settings, X } from "lucide-react";
import type {
    GrinchModeSettings,
    GrinchModeSession,
} from "@/lib/grinchMode";
import {
    grinchModeStorage,
    playChristmasBell,
    DEFAULT_SETTINGS,
} from "@/lib/grinchMode";

interface GrinchModeTimerProps {
    onSessionComplete?: () => void;
}

export const GrinchModeTimer = ({ onSessionComplete }: GrinchModeTimerProps) => {
    const [settings, setSettings] = useState<GrinchModeSettings>(DEFAULT_SETTINGS);
    const [session, setSession] = useState<GrinchModeSession>({
        isActive: false,
        isStudyTime: true,
        timeRemaining: 25 * 60,
        sessionsCompleted: 0,
        startTime: null,
    });
    const [showSettings, setShowSettings] = useState(false);

    // Load settings on mount
    useEffect(() => {
        const loadedSettings = grinchModeStorage.loadSettings();
        setSettings(loadedSettings);
        setSession(prev => ({
            ...prev,
            timeRemaining: loadedSettings.studyDuration * 60,
        }));
    }, []);

    // Timer countdown
    useEffect(() => {
        if (!session.isActive) return;

        const interval = setInterval(() => {
            setSession(prev => {
                if (prev.timeRemaining <= 1) {
                    // Session complete
                    if (settings.soundEnabled) {
                        playChristmasBell();
                    }

                    const newIsStudyTime = !prev.isStudyTime;
                    const newSessionsCompleted = prev.isStudyTime ? prev.sessionsCompleted + 1 : prev.sessionsCompleted;

                    if (prev.isStudyTime && onSessionComplete) {
                        onSessionComplete();
                    }

                    return {
                        ...prev,
                        isStudyTime: newIsStudyTime,
                        timeRemaining: newIsStudyTime
                            ? settings.studyDuration * 60
                            : settings.breakDuration * 60,
                        sessionsCompleted: newSessionsCompleted,
                    };
                }

                return {
                    ...prev,
                    timeRemaining: prev.timeRemaining - 1,
                };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [session.isActive, settings, onSessionComplete]);

    // Save session to localStorage
    useEffect(() => {
        grinchModeStorage.saveSession(session);
    }, [session]);

    const toggleTimer = () => {
        setSession(prev => ({
            ...prev,
            isActive: !prev.isActive,
            startTime: !prev.isActive ? new Date().toISOString() : prev.startTime,
        }));
    };

    const resetTimer = () => {
        setSession({
            isActive: false,
            isStudyTime: true,
            timeRemaining: settings.studyDuration * 60,
            sessionsCompleted: 0,
            startTime: null,
        });
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const progress = session.isStudyTime
        ? ((settings.studyDuration * 60 - session.timeRemaining) / (settings.studyDuration * 60)) * 100
        : ((settings.breakDuration * 60 - session.timeRemaining) / (settings.breakDuration * 60)) * 100;

    return (
        <div className="relative">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-christmas-red font-[family-name:var(--font-christmas)]">
                        🎅 Grinch Mode
                    </h3>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="text-gray-300 hover:text-white transition-colors"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                </div>

                {/* Mode Indicator */}
                <div className="mb-4">
                    <span
                        className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${session.isStudyTime
                            ? "bg-christmas-red/20 text-christmas-red"
                            : "bg-christmas-green/20 text-christmas-gold"
                            }`}
                    >
                        {session.isStudyTime ? "🎯 Focus Time" : "☕ Break Time"}
                    </span>
                </div>

                {/* Timer Display */}
                <div className="relative mb-6">
                    <svg className="w-48 h-48 mx-auto transform -rotate-90">
                        {/* Background circle */}
                        <circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="8"
                            fill="none"
                        />
                        {/* Progress circle */}
                        <motion.circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke={session.isStudyTime ? "#D42426" : "#F8B229"}
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 88}
                            strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
                            initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - progress / 100) }}
                            transition={{ duration: 0.5 }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold text-white font-mono">
                            {formatTime(session.timeRemaining)}
                        </span>
                        <span className="text-sm text-gray-300 mt-2">
                            Session {session.sessionsCompleted + 1}
                        </span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleTimer}
                        className="flex items-center gap-2 bg-christmas-red hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-colors"
                    >
                        {session.isActive ? (
                            <>
                                <Pause className="w-5 h-5" /> Pause
                            </>
                        ) : (
                            <>
                                <Play className="w-5 h-5" /> Start
                            </>
                        )}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={resetTimer}
                        className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-colors"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </motion.button>
                </div>

                {/* Stats */}
                <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-sm text-gray-300">
                        Sessions completed today: <span className="font-bold text-christmas-gold">{session.sessionsCompleted}</span>
                    </p>
                </div>
            </motion.div>

            {/* Settings Modal */}
            <AnimatePresence>
                {showSettings && (
                    <GrinchModeSettings
                        settings={settings}
                        onSave={(newSettings) => {
                            setSettings(newSettings);
                            grinchModeStorage.saveSettings(newSettings);
                            setShowSettings(false);
                        }}
                        onClose={() => setShowSettings(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

interface GrinchModeSettingsProps {
    settings: GrinchModeSettings;
    onSave: (settings: GrinchModeSettings) => void;
    onClose: () => void;
}

const GrinchModeSettings = ({ settings, onSave, onClose }: GrinchModeSettingsProps) => {
    const [localSettings, setLocalSettings] = useState(settings);
    const [newWebsite, setNewWebsite] = useState("");

    const addWebsite = () => {
        if (newWebsite.trim() && !localSettings.blockedWebsites.includes(newWebsite.trim())) {
            setLocalSettings({
                ...localSettings,
                blockedWebsites: [...localSettings.blockedWebsites, newWebsite.trim()],
            });
            setNewWebsite("");
        }
    };

    const removeWebsite = (site: string) => {
        setLocalSettings({
            ...localSettings,
            blockedWebsites: localSettings.blockedWebsites.filter(s => s !== site),
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-christmas-red font-[family-name:var(--font-christmas)]">
                        ⚙️ Grinch Mode Settings
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Study Duration */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Study Duration (minutes)
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="120"
                            value={localSettings.studyDuration}
                            onChange={(e) =>
                                setLocalSettings({ ...localSettings, studyDuration: parseInt(e.target.value) || 25 })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-christmas-red"
                        />
                    </div>

                    {/* Break Duration */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Break Duration (minutes)
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="30"
                            value={localSettings.breakDuration}
                            onChange={(e) =>
                                setLocalSettings({ ...localSettings, breakDuration: parseInt(e.target.value) || 5 })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-christmas-red"
                        />
                    </div>

                    {/* Sound Toggle */}
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-gray-700">Christmas Bell Sound</label>
                        <button
                            onClick={() =>
                                setLocalSettings({ ...localSettings, soundEnabled: !localSettings.soundEnabled })
                            }
                            className={`relative w-12 h-6 rounded-full transition-colors ${localSettings.soundEnabled ? "bg-christmas-green" : "bg-gray-300"
                                }`}
                        >
                            <motion.div
                                animate={{ x: localSettings.soundEnabled ? 24 : 0 }}
                                className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
                            />
                        </button>
                    </div>

                    {/* Blocked Websites */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Blocked Websites (Don't let the Grinch steal your focus!)
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={newWebsite}
                                onChange={(e) => setNewWebsite(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && addWebsite()}
                                placeholder="e.g., facebook.com"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-christmas-red text-sm"
                            />
                            <button
                                onClick={addWebsite}
                                className="bg-christmas-green text-white px-4 py-2 rounded-lg font-bold hover:bg-green-800 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                            {localSettings.blockedWebsites.map((site) => (
                                <span
                                    key={site}
                                    className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                                >
                                    {site}
                                    <button
                                        onClick={() => removeWebsite(site)}
                                        className="hover:text-red-900 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={() => onSave(localSettings)}
                    className="w-full mt-6 bg-christmas-red text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors"
                >
                    Save Settings
                </button>
            </motion.div>
        </motion.div>
    );
};
