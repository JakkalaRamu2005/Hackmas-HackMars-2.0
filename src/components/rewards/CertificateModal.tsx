"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Share2, Award } from "lucide-react";
import { useRef } from "react";
import html2canvas from "html2canvas";

interface CertificateModalProps {
    isOpen: boolean;
    onClose: () => void;
    userName: string;
    completionDate: string;
    totalPoints: number;
    streak: number;
    totalTasks: number;
}

export const CertificateModal = ({
    isOpen,
    onClose,
    userName,
    completionDate,
    totalPoints,
    streak,
    totalTasks,
}: CertificateModalProps) => {
    const certificateRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!certificateRef.current) return;

        try {
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2,
                backgroundColor: "#ffffff",
            });

            const link = document.createElement("a");
            link.download = `StudyAdvent-Certificate-${userName.replace(/\s+/g, "-")}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (error) {
            console.error("Failed to download certificate:", error);
        }
    };

    const handleShare = async () => {
        const shareText = `🎄 I just completed all 24 tasks on StudyAdvent.ai! 🏆\n\n✨ ${totalPoints} points earned\n🔥 ${streak}-day streak\n\nTurn exam panic into holiday magic! #StudyAdvent`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: "StudyAdvent.ai Certificate",
                    text: shareText,
                });
            } catch (error) {
                console.log("Share cancelled");
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText);
            alert("Share text copied to clipboard!");
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>

                    {/* Certificate Content */}
                    <div className="p-8">
                        <div
                            ref={certificateRef}
                            className="relative bg-gradient-to-br from-red-50 via-white to-green-50 rounded-2xl p-12 border-8 border-christmas-gold shadow-2xl"
                        >
                            {/* Decorative Snowflakes */}
                            <div className="absolute top-4 left-4 text-4xl opacity-20">❄️</div>
                            <div className="absolute top-4 right-4 text-4xl opacity-20">❄️</div>
                            <div className="absolute bottom-4 left-4 text-4xl opacity-20">❄️</div>
                            <div className="absolute bottom-4 right-4 text-4xl opacity-20">❄️</div>

                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="text-6xl mb-4">🎄</div>
                                <h1 className="text-5xl font-bold text-christmas-red mb-2 font-[family-name:var(--font-christmas)]">
                                    Certificate of Achievement
                                </h1>
                                <p className="text-xl text-gray-600">StudyAdvent.ai</p>
                            </div>

                            {/* Main Content */}
                            <div className="text-center mb-8">
                                <p className="text-lg text-gray-700 mb-4">This certifies that</p>
                                <h2 className="text-4xl font-bold text-christmas-green mb-6 px-8 py-4 bg-white/50 rounded-xl inline-block">
                                    {userName || "Study Champion"}
                                </h2>
                                <p className="text-lg text-gray-700 mb-6">
                                    has successfully completed all <span className="font-bold text-christmas-red">{totalTasks} tasks</span>
                                    <br />
                                    of the Christmas Study Advent Calendar
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                                <div className="bg-white/70 rounded-xl p-4 text-center border-2 border-christmas-gold/30">
                                    <div className="text-3xl mb-2">🏆</div>
                                    <div className="text-2xl font-bold text-christmas-red">{totalPoints}</div>
                                    <div className="text-sm text-gray-600">Total Points</div>
                                </div>
                                <div className="bg-white/70 rounded-xl p-4 text-center border-2 border-christmas-gold/30">
                                    <div className="text-3xl mb-2">🔥</div>
                                    <div className="text-2xl font-bold text-orange-600">{streak}</div>
                                    <div className="text-sm text-gray-600">Day Streak</div>
                                </div>
                                <div className="bg-white/70 rounded-xl p-4 text-center border-2 border-christmas-gold/30">
                                    <div className="text-3xl mb-2">✅</div>
                                    <div className="text-2xl font-bold text-green-600">{totalTasks}/{totalTasks}</div>
                                    <div className="text-sm text-gray-600">Tasks Done</div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="text-center">
                                <p className="text-gray-600 mb-2">Completed on</p>
                                <p className="text-xl font-semibold text-christmas-green mb-6">
                                    {new Date(completionDate).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                                <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
                                    <div>
                                        <div className="text-2xl mb-1">🎅</div>
                                        <div className="font-semibold">StudyAdvent.ai</div>
                                    </div>
                                    <div className="text-4xl text-christmas-gold">
                                        <Award className="w-12 h-12" />
                                    </div>
                                    <div>
                                        <div className="text-2xl mb-1">🎄</div>
                                        <div className="font-semibold">HackMas 2024</div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Border Pattern */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green opacity-50"></div>
                                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-christmas-green via-christmas-gold to-christmas-red opacity-50"></div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 mt-8 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleDownload}
                                className="flex items-center gap-2 px-6 py-3 bg-christmas-green text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
                            >
                                <Download className="w-5 h-5" />
                                Download Certificate
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleShare}
                                className="flex items-center gap-2 px-6 py-3 bg-christmas-red text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
                            >
                                <Share2 className="w-5 h-5" />
                                Share Achievement
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Button to trigger certificate modal
interface CertificateButtonProps {
    onClick: () => void;
    completedCount: number;
    totalTasks: number;
}

export const CertificateButton = ({
    onClick,
    completedCount,
    totalTasks,
}: CertificateButtonProps) => {
    if (completedCount < totalTasks) return null;

    return (
        <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className="fixed bottom-24 left-6 z-40 p-4 bg-gradient-to-r from-christmas-gold to-yellow-500 text-white rounded-full shadow-2xl hover:shadow-christmas-gold/50 transition-all"
            title="Get Your Certificate!"
        >
            <Award className="w-8 h-8" />
        </motion.button>
    );
};
