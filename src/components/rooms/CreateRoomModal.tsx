"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { StudyRoom } from "@/lib/studyRooms";

interface CreateRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (room: Omit<StudyRoom, 'id' | 'createdAt'>) => void;
}

export const CreateRoomModal = ({ isOpen, onClose, onCreate }: CreateRoomModalProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [theme, setTheme] = useState<StudyRoom['theme']>('christmas');
    const [isPublic, setIsPublic] = useState(false);

    const themes: { value: StudyRoom['theme']; label: string; emoji: string; color: string }[] = [
        { value: 'christmas', label: 'Christmas', emoji: '🎄', color: 'from-christmas-red/20 to-christmas-green/20' },
        { value: 'winter', label: 'Winter', emoji: '❄️', color: 'from-blue-500/20 to-cyan-500/20' },
        { value: 'snowman', label: 'Snowman', emoji: '⛄', color: 'from-white/20 to-blue-300/20' },
        { value: 'gingerbread', label: 'Gingerbread', emoji: '🍪', color: 'from-orange-500/20 to-amber-700/20' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        onCreate({
            name: name.trim(),
            description: description.trim() || 'A festive study group!',
            createdBy: 'current-user',
            members: [{
                id: 'current-user',
                name: 'You',
                tasksCompleted: 0,
                streak: 0,
                points: 0,
                lastActive: new Date().toISOString(),
                role: 'owner',
            }],
            groupProgress: 0,
            groupGoal: 24,
            theme,
            isPublic,
        });

        // Reset form
        setName('');
        setDescription('');
        setTheme('christmas');
        setIsPublic(false);
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
                                🎁 Create Study Room
                            </h3>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Room Name */}
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">
                                    Room Name *
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Santa's Study Squad"
                                    required
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-christmas-gold"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Tell others what this room is about..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-christmas-gold resize-none"
                                />
                            </div>

                            {/* Theme Selection */}
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">
                                    Theme
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {themes.map((t) => (
                                        <button
                                            key={t.value}
                                            type="button"
                                            onClick={() => setTheme(t.value)}
                                            className={`p-3 rounded-xl border-2 transition-all ${theme === t.value
                                                    ? 'border-christmas-gold bg-gradient-to-br ' + t.color
                                                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="text-2xl mb-1">{t.emoji}</div>
                                            <div className="text-sm font-bold text-white">{t.label}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Privacy Toggle */}
                            <div className="flex items-center justify-between bg-white/5 rounded-xl p-4">
                                <div>
                                    <p className="text-sm font-bold text-white">Public Room</p>
                                    <p className="text-xs text-gray-400">Anyone can discover and join</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsPublic(!isPublic)}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${isPublic ? 'bg-christmas-green' : 'bg-gray-600'
                                        }`}
                                >
                                    <motion.div
                                        animate={{ x: isPublic ? 24 : 0 }}
                                        className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
                                    />
                                </button>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={!name.trim()}
                                className="w-full bg-christmas-gold text-christmas-green px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                🎄 Create Room
                            </motion.button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
