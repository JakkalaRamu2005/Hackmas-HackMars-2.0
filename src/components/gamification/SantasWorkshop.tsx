"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Gift, Star, Send, ThumbsUp } from "lucide-react";
import { useState, useEffect } from "react";

interface SantasWorkshopProps {
    isOpen: boolean;
    onClose: () => void;
    completedCount: number;
    totalTasks: number;
}

interface HelpRequest {
    id: string;
    studentName: string;
    topic: string;
    question: string;
    timestamp: string;
    helpfulCount: number;
}

export const SantasWorkshop = ({
    isOpen,
    onClose,
    completedCount,
    totalTasks,
}: SantasWorkshopProps) => {
    const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(null);
    const [response, setResponse] = useState("");
    const [helpedCount, setHelpedCount] = useState(0);

    const isUnlocked = completedCount === totalTasks;

    useEffect(() => {
        if (isOpen && isUnlocked) {
            // Load sample help requests
            setHelpRequests([
                {
                    id: "1",
                    studentName: "Emma S.",
                    topic: "Data Structures",
                    question: "Can someone explain how binary search trees work? I'm confused about the insertion process.",
                    timestamp: "2 hours ago",
                    helpfulCount: 3,
                },
                {
                    id: "2",
                    studentName: "John D.",
                    topic: "Algorithms",
                    question: "Need help understanding dynamic programming. What's the difference between memoization and tabulation?",
                    timestamp: "4 hours ago",
                    helpfulCount: 5,
                },
                {
                    id: "3",
                    studentName: "Sarah M.",
                    topic: "OOP Concepts",
                    question: "How do I implement polymorphism in JavaScript? Looking for practical examples.",
                    timestamp: "1 day ago",
                    helpfulCount: 2,
                },
            ]);

            // Load helped count from localStorage
            const saved = localStorage.getItem("santas-workshop-helped");
            if (saved) {
                setHelpedCount(parseInt(saved));
            }
        }
    }, [isOpen, isUnlocked]);

    const handleSendHelp = () => {
        if (response.trim() && selectedRequest) {
            // Increment helped count
            const newCount = helpedCount + 1;
            setHelpedCount(newCount);
            localStorage.setItem("santas-workshop-helped", newCount.toString());

            // Show success message
            alert(`🎅 Thank you for helping ${selectedRequest.studentName}! You've earned 50 bonus points!`);

            // Clear response and close
            setResponse("");
            setSelectedRequest(null);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-gradient-to-br from-red-900/95 via-green-900/95 to-red-900/95 backdrop-blur-xl rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-christmas-gold/30 shadow-2xl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-christmas-gold to-yellow-500 rounded-xl">
                                <Users className="w-8 h-8 text-christmas-green" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                                    🎅 Santa's Workshop
                                    {isUnlocked && (
                                        <span className="text-sm bg-christmas-gold text-christmas-green px-3 py-1 rounded-full">
                                            UNLOCKED
                                        </span>
                                    )}
                                </h2>
                                <p className="text-gray-200 text-sm">
                                    Help fellow students and earn bonus points!
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>
                    </div>

                    {!isUnlocked ? (
                        /* Locked State */
                        <div className="text-center py-12">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-8xl mb-6"
                            >
                                🔒
                            </motion.div>
                            <h3 className="text-2xl font-bold text-white mb-3">
                                Workshop Locked!
                            </h3>
                            <p className="text-gray-300 mb-2">
                                Complete all 24 tasks to unlock Santa's Workshop
                            </p>
                            <p className="text-christmas-gold font-bold text-lg">
                                Progress: {completedCount}/{totalTasks} tasks
                            </p>
                            <div className="mt-6 max-w-md mx-auto bg-white/10 rounded-full h-4 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(completedCount / totalTasks) * 100}%` }}
                                    className="h-full bg-gradient-to-r from-christmas-gold to-yellow-500"
                                />
                            </div>
                        </div>
                    ) : (
                        /* Unlocked State */
                        <div className="space-y-6">
                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/10 rounded-xl p-4 text-center border border-white/20">
                                    <Gift className="w-8 h-8 text-christmas-gold mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-white">{helpedCount}</p>
                                    <p className="text-gray-300 text-sm">Students Helped</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4 text-center border border-white/20">
                                    <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-white">{helpedCount * 50}</p>
                                    <p className="text-gray-300 text-sm">Bonus Points Earned</p>
                                </div>
                            </div>

                            {/* Help Requests */}
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4">
                                    📬 Help Requests
                                </h3>
                                <div className="space-y-3">
                                    {helpRequests.map((request) => (
                                        <motion.div
                                            key={request.id}
                                            whileHover={{ scale: 1.02 }}
                                            onClick={() => setSelectedRequest(request)}
                                            className={`bg-white/10 rounded-xl p-4 border cursor-pointer transition-all ${selectedRequest?.id === request.id
                                                    ? "border-christmas-gold bg-white/20"
                                                    : "border-white/20 hover:border-white/40"
                                                }`}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <p className="text-white font-bold">{request.studentName}</p>
                                                    <p className="text-christmas-gold text-sm">{request.topic}</p>
                                                </div>
                                                <div className="flex items-center gap-1 text-gray-300 text-sm">
                                                    <ThumbsUp className="w-4 h-4" />
                                                    {request.helpfulCount}
                                                </div>
                                            </div>
                                            <p className="text-gray-200 text-sm mb-2">{request.question}</p>
                                            <p className="text-gray-400 text-xs">{request.timestamp}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Response Area */}
                            {selectedRequest && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 rounded-xl p-6 border-2 border-green-500/30"
                                >
                                    <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                                        <Send className="w-5 h-5 text-green-400" />
                                        Help {selectedRequest.studentName}
                                    </h4>
                                    <textarea
                                        value={response}
                                        onChange={(e) => setResponse(e.target.value)}
                                        placeholder="Share your knowledge and help a fellow student... 🎄"
                                        className="w-full h-32 bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-green-400 transition-colors"
                                    />
                                    <div className="flex gap-3 mt-4">
                                        <button
                                            onClick={handleSendHelp}
                                            disabled={!response.trim()}
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-christmas-green to-emerald-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                                        >
                                            🎁 Send Help (+50 points)
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedRequest(null);
                                                setResponse("");
                                            }}
                                            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Achievement Badge */}
                            {helpedCount >= 5 && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border-2 border-yellow-500/40 text-center"
                                >
                                    <div className="text-4xl mb-2">🏆</div>
                                    <p className="text-yellow-300 font-bold">
                                        Santa's Helper Achievement Unlocked!
                                    </p>
                                    <p className="text-gray-300 text-sm">
                                        You've helped 5+ students!
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Santa's Workshop Button
export const SantasWorkshopButton = ({
    onClick,
    isUnlocked,
}: {
    onClick: () => void;
    isUnlocked: boolean;
}) => {
    return (
        <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className={`fixed bottom-44 left-6 z-40 p-4 rounded-full shadow-2xl transition-all group ${isUnlocked
                    ? "bg-gradient-to-br from-christmas-gold to-yellow-500 hover:shadow-yellow-500/50"
                    : "bg-gradient-to-br from-gray-600 to-gray-700 hover:shadow-gray-500/50"
                }`}
        >
            <Users className="w-6 h-6 text-white" />
            {isUnlocked && (
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
                />
            )}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {isUnlocked ? "Santa's Workshop" : "Complete all tasks to unlock"}
            </div>
        </motion.button>
    );
};
