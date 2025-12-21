"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Clock, MessageSquare, Calendar } from "lucide-react";
import {
    notificationStorage,
    requestNotificationPermission,
    type NotificationSettings,
    DEFAULT_SETTINGS,
} from "@/lib/notifications";

interface NotificationSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NotificationSettingsModal = ({ isOpen, onClose }: NotificationSettingsModalProps) => {
    const [settings, setSettings] = useState<NotificationSettings>(
        notificationStorage.getSettings()
    );
    const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

    // Check notification permission on client side only
    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setPermissionStatus(Notification.permission);
        }
    }, []);

    const handleEnableNotifications = async () => {
        const granted = await requestNotificationPermission();
        if (granted) {
            setPermissionStatus('granted');
            setSettings({ ...settings, enabled: true });
        } else {
            alert('Please enable notifications in your browser settings to use this feature.');
        }
    };

    const handleSave = () => {
        notificationStorage.saveSettings(settings);
        onClose();
    };

    const handleToggle = (key: keyof NotificationSettings) => {
        if (key === 'enabled' && !settings.enabled) {
            handleEnableNotifications();
        } else {
            setSettings({ ...settings, [key]: !settings[key] });
        }
    };

    const handleTimeChange = (key: 'dailyTaskTime' | 'streakReminderTime', value: string) => {
        setSettings({ ...settings, [key]: value });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gradient-to-br from-christmas-green/10 to-christmas-red/10 backdrop-blur-xl border border-white/20 rounded-3xl w-full max-w-md p-6"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-christmas)]">
                                🔔 Notification Settings
                            </h3>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Settings */}
                        <div className="space-y-4">
                            {/* Enable Notifications */}
                            <SettingToggle
                                icon={<Bell className="w-5 h-5" />}
                                label="Enable Notifications"
                                description={
                                    permissionStatus === 'granted'
                                        ? 'Browser notifications enabled'
                                        : 'Allow browser notifications'
                                }
                                checked={settings.enabled}
                                onChange={() => handleToggle('enabled')}
                            />

                            {settings.enabled && (
                                <>
                                    {/* Daily Task Reminder */}
                                    <div className="bg-white/5 rounded-xl p-4 space-y-3">
                                        <SettingToggle
                                            icon={<Clock className="w-5 h-5" />}
                                            label="Daily Task Reminder"
                                            description="Get reminded to complete your daily task"
                                            checked={settings.dailyTaskReminder}
                                            onChange={() => handleToggle('dailyTaskReminder')}
                                        />
                                        {settings.dailyTaskReminder && (
                                            <div className="pl-10">
                                                <label className="block text-sm text-gray-400 mb-2">
                                                    Reminder Time
                                                </label>
                                                <input
                                                    type="time"
                                                    value={settings.dailyTaskTime}
                                                    onChange={(e) => handleTimeChange('dailyTaskTime', e.target.value)}
                                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-christmas-gold"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Streak Reminder */}
                                    <div className="bg-white/5 rounded-xl p-4 space-y-3">
                                        <SettingToggle
                                            icon={<span className="text-xl">🔥</span>}
                                            label="Streak Reminder"
                                            description="Don't break your study streak!"
                                            checked={settings.streakReminder}
                                            onChange={() => handleToggle('streakReminder')}
                                        />
                                        {settings.streakReminder && (
                                            <div className="pl-10">
                                                <label className="block text-sm text-gray-400 mb-2">
                                                    Reminder Time
                                                </label>
                                                <input
                                                    type="time"
                                                    value={settings.streakReminderTime}
                                                    onChange={(e) => handleTimeChange('streakReminderTime', e.target.value)}
                                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-christmas-gold"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Motivational Quotes */}
                                    <SettingToggle
                                        icon={<MessageSquare className="w-5 h-5" />}
                                        label="Motivational Quotes"
                                        description="Daily dose of Christmas-themed inspiration"
                                        checked={settings.motivationalQuotes}
                                        onChange={() => handleToggle('motivationalQuotes')}
                                    />

                                    {/* Christmas Countdown */}
                                    <SettingToggle
                                        icon={<Calendar className="w-5 h-5" />}
                                        label="Christmas Countdown"
                                        description="Track days until Christmas"
                                        checked={settings.christmasCountdown}
                                        onChange={() => handleToggle('christmasCountdown')}
                                    />

                                    {/* Sound */}
                                    <SettingToggle
                                        icon={<span className="text-xl">🔊</span>}
                                        label="Notification Sound"
                                        description="Play sound for notifications"
                                        checked={settings.soundEnabled}
                                        onChange={() => handleToggle('soundEnabled')}
                                    />
                                </>
                            )}
                        </div>

                        {/* Save Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSave}
                            className="w-full mt-6 bg-christmas-gold text-christmas-green px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-all"
                        >
                            Save Settings
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

interface SettingToggleProps {
    icon: React.ReactNode;
    label: string;
    description: string;
    checked: boolean;
    onChange: () => void;
}

const SettingToggle = ({ icon, label, description, checked, onChange }: SettingToggleProps) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-start gap-3 flex-1">
                <div className="text-christmas-gold mt-1">{icon}</div>
                <div>
                    <p className="text-white font-bold text-sm">{label}</p>
                    <p className="text-gray-400 text-xs">{description}</p>
                </div>
            </div>
            <button
                onClick={onChange}
                className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-christmas-green' : 'bg-gray-600'
                    }`}
            >
                <motion.div
                    animate={{ x: checked ? 24 : 0 }}
                    className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
                />
            </button>
        </div>
    );
};
