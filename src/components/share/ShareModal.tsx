"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Download, Copy, X, Twitter, Linkedin, Facebook, MessageCircle, Check } from "lucide-react";
import { ProgressCard } from "./ProgressCard";
import { GamificationStats } from "@/lib/gamification";
import { AnalyticsData } from "@/lib/analytics";
import {
    shareToTwitter,
    shareToLinkedIn,
    shareToFacebook,
    shareToWhatsApp,
    copyToClipboard,
    downloadAsImage,
    ShareData,
} from "@/lib/shareUtils";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    completedCount: number;
    totalTasks: number;
    gamificationStats: GamificationStats;
    analytics: AnalyticsData;
}

export const ShareModal = ({
    isOpen,
    onClose,
    completedCount,
    totalTasks,
    gamificationStats,
    analytics,
}: ShareModalProps) => {
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);
    const [downloadSuccess, setDownloadSuccess] = useState(false);

    const shareData: ShareData = {
        completedCount,
        totalTasks,
        streak: gamificationStats.streak,
        points: gamificationStats.points,
        studyTime: analytics.totalStudyTime,
        achievements: gamificationStats.achievements.filter(a => a.unlocked).length,
    };

    const handleCopy = async () => {
        const success = await copyToClipboard(shareData);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDownload = async () => {
        setDownloading(true);
        setDownloadError(null);
        setDownloadSuccess(false);

        try {
            await downloadAsImage('progress-card', 'my-studyadvent-progress.png');
            setDownloadSuccess(true);
            setTimeout(() => setDownloadSuccess(false), 3000);
        } catch (error) {
            console.error('Download failed:', error);
            setDownloadError(error instanceof Error ? error.message : 'Download failed. Please try again.');
            setTimeout(() => setDownloadError(null), 5000);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gradient-to-br from-christmas-green/10 to-christmas-red/10 backdrop-blur-xl border border-white/20 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-white font-[family-name:var(--font-christmas)]">
                                    🎁 Share Your Progress
                                </h2>
                                <p className="text-gray-300 text-sm mt-1">
                                    Show off your amazing study journey!
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Progress Card Preview */}
                        <div className="mb-6">
                            <ProgressCard
                                completedCount={completedCount}
                                totalTasks={totalTasks}
                                gamificationStats={gamificationStats}
                                analytics={analytics}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            {/* Download Button */}
                            <motion.button
                                whileHover={{ scale: downloading ? 1 : 1.02 }}
                                whileTap={{ scale: downloading ? 1 : 0.98 }}
                                onClick={handleDownload}
                                disabled={downloading}
                                className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold transition-all shadow-lg disabled:opacity-50 ${downloadSuccess
                                        ? 'bg-green-500 text-white'
                                        : downloadError
                                            ? 'bg-red-500 text-white'
                                            : 'bg-gradient-to-r from-christmas-gold to-yellow-500 hover:from-yellow-500 hover:to-christmas-gold text-christmas-green'
                                    }`}
                            >
                                {downloading ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Download className="w-5 h-5" />
                                        </motion.div>
                                        Generating Image...
                                    </>
                                ) : downloadSuccess ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        Downloaded Successfully!
                                    </>
                                ) : downloadError ? (
                                    <>
                                        <X className="w-5 h-5" />
                                        {downloadError}
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-5 h-5" />
                                        Download as Image
                                    </>
                                )}
                            </motion.button>

                            {/* Error Message */}
                            {downloadError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center text-sm text-red-300 bg-red-500/20 border border-red-500/30 rounded-lg p-3"
                                >
                                    💡 Tip: Make sure pop-ups are allowed and try again
                                </motion.div>
                            )}

                            {/* Share to Social Media */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <ShareButton
                                    icon={<Twitter className="w-5 h-5" />}
                                    label="Twitter"
                                    onClick={() => shareToTwitter(shareData)}
                                    color="bg-[#1DA1F2] hover:bg-[#1a8cd8]"
                                />
                                <ShareButton
                                    icon={<Linkedin className="w-5 h-5" />}
                                    label="LinkedIn"
                                    onClick={() => shareToLinkedIn(shareData)}
                                    color="bg-[#0A66C2] hover:bg-[#004182]"
                                />
                                <ShareButton
                                    icon={<Facebook className="w-5 h-5" />}
                                    label="Facebook"
                                    onClick={() => shareToFacebook(shareData)}
                                    color="bg-[#1877F2] hover:bg-[#0c63d4]"
                                />
                                <ShareButton
                                    icon={<MessageCircle className="w-5 h-5" />}
                                    label="WhatsApp"
                                    onClick={() => shareToWhatsApp(shareData)}
                                    color="bg-[#25D366] hover:bg-[#1da851]"
                                />
                            </div>

                            {/* Copy to Clipboard */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleCopy}
                                className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-4 rounded-xl font-bold transition-all"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-5 h-5 text-green-400" />
                                        Copied to Clipboard!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-5 h-5" />
                                        Copy Progress Text
                                    </>
                                )}
                            </motion.button>
                        </div>

                        {/* Footer Note */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-400">
                                🎄 Share your success and inspire others to study smarter! 🎄
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

interface ShareButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    color: string;
}

const ShareButton = ({ icon, label, onClick, color }: ShareButtonProps) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`${color} text-white px-4 py-3 rounded-xl font-bold transition-all shadow-md flex flex-col items-center gap-2`}
        >
            {icon}
            <span className="text-xs">{label}</span>
        </motion.button>
    );
};

// Floating Share Button Component
interface ShareButtonFloatingProps {
    onClick: () => void;
}

export const ShareButtonFloating = ({ onClick }: ShareButtonFloatingProps) => {
    return (
        <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className="flex items-center gap-2 bg-gradient-to-r from-christmas-gold to-yellow-500 hover:from-yellow-500 hover:to-christmas-gold text-christmas-green px-6 py-3 rounded-full font-bold shadow-2xl transition-all"
            title="Share Your Progress"
        >
            <Share2 className="w-5 h-5" />
            <span className="hidden sm:inline">Share Progress</span>
        </motion.button>
    );
};
