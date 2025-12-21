"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Settings, Check } from "lucide-react";
import {
    notificationStorage,
    formatNotificationTime,
    type Notification,
} from "@/lib/notifications";

interface NotificationCenterProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenSettings: () => void;
}

export const NotificationCenter = ({ isOpen, onClose, onOpenSettings }: NotificationCenterProps) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    useEffect(() => {
        if (isOpen) {
            loadNotifications();
        }
    }, [isOpen]);

    const loadNotifications = () => {
        const allNotifications = notificationStorage.getNotifications();
        setNotifications(allNotifications);
    };

    const handleMarkAsRead = (id: string) => {
        notificationStorage.markAsRead(id);
        loadNotifications();
    };

    const handleClearAll = () => {
        notificationStorage.clearAll();
        setNotifications([]);
    };

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.read)
        : notifications;

    const unreadCount = notifications.filter(n => !n.read).length;

    const getNotificationIcon = (type: Notification['type']) => {
        const icons = {
            task: '📝',
            streak: '🔥',
            quote: '💡',
            countdown: '🎄',
            achievement: '🏆',
        };
        return icons[type] || '🔔';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-start justify-end p-4 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ x: 400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 400, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gradient-to-br from-christmas-green/10 to-christmas-red/10 backdrop-blur-xl border border-white/20 rounded-3xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col mt-16"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/20">
                            <div>
                                <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-christmas)] flex items-center gap-2">
                                    🔔 Notifications
                                    {unreadCount > 0 && (
                                        <span className="text-xs bg-christmas-red text-white px-2 py-1 rounded-full">
                                            {unreadCount}
                                        </span>
                                    )}
                                </h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={onOpenSettings}
                                    className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                    title="Settings"
                                >
                                    <Settings className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-2 px-6 py-3 border-b border-white/10">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg font-bold transition-all ${filter === 'all'
                                        ? 'bg-christmas-gold text-christmas-green'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                All ({notifications.length})
                            </button>
                            <button
                                onClick={() => setFilter('unread')}
                                className={`px-4 py-2 rounded-lg font-bold transition-all ${filter === 'unread'
                                        ? 'bg-christmas-gold text-christmas-green'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                Unread ({unreadCount})
                            </button>
                            <div className="flex-1" />
                            {notifications.length > 0 && (
                                <button
                                    onClick={handleClearAll}
                                    className="text-xs text-gray-400 hover:text-white transition-colors"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {filteredNotifications.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🔔</div>
                                    <h4 className="text-xl font-bold text-white mb-2">No notifications</h4>
                                    <p className="text-gray-400">
                                        {filter === 'unread' ? "You're all caught up!" : "You'll see notifications here"}
                                    </p>
                                </div>
                            ) : (
                                filteredNotifications.map((notification) => (
                                    <NotificationCard
                                        key={notification.id}
                                        notification={notification}
                                        onMarkAsRead={handleMarkAsRead}
                                        icon={getNotificationIcon(notification.type)}
                                    />
                                ))
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

interface NotificationCardProps {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
    icon: string;
}

const NotificationCard = ({ notification, onMarkAsRead, icon }: NotificationCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border transition-all ${notification.read
                    ? 'bg-white/5 border-white/10'
                    : 'bg-white/10 border-christmas-gold/30'
                }`}
        >
            <div className="flex items-start gap-3">
                <div className="text-2xl">{icon}</div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-white font-bold text-sm">{notification.title}</h4>
                        {!notification.read && (
                            <button
                                onClick={() => onMarkAsRead(notification.id)}
                                className="p-1 text-christmas-gold hover:text-yellow-300 transition-colors flex-shrink-0"
                                title="Mark as read"
                            >
                                <Check className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{notification.message}</p>
                    <p className="text-xs text-gray-500">
                        {formatNotificationTime(notification.timestamp)}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

// Floating Notification Bell Button
interface NotificationBellProps {
    onClick: () => void;
    unreadCount: number;
}

export const NotificationBell = ({ onClick, unreadCount }: NotificationBellProps) => {
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className="relative p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all"
            title="Notifications"
        >
            <Bell className="w-5 h-5 text-white" />
            {unreadCount > 0 && (
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-christmas-red text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                >
                    {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
            )}
        </motion.button>
    );
};
