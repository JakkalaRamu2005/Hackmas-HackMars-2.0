"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Calendar, FileText, CheckCircle } from "lucide-react";
import { useState } from "react";
import { exportStudyPlan, type ExportOptions } from "@/lib/exportStudyPlan";

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    tasks: any[];
    syllabusTitle: string;
    completedCount: number;
}

export const ExportModal = ({
    isOpen,
    onClose,
    tasks,
    syllabusTitle,
    completedCount,
}: ExportModalProps) => {
    const [selectedFormat, setSelectedFormat] = useState<"pdf" | "google-calendar" | "ical">("pdf");
    const [includeCompleted, setIncludeCompleted] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [exportSuccess, setExportSuccess] = useState(false);

    const formats = [
        {
            id: "pdf" as const,
            name: "PDF Document",
            icon: <FileText className="w-6 h-6" />,
            description: "Download as a printable PDF file",
            emoji: "📄",
        },
        {
            id: "google-calendar" as const,
            name: "Google Calendar",
            icon: <Calendar className="w-6 h-6" />,
            description: "Add to your Google Calendar",
            emoji: "📅",
        },
        {
            id: "ical" as const,
            name: "iCal/Outlook",
            icon: <Calendar className="w-6 h-6" />,
            description: "Download .ics file for any calendar app",
            emoji: "📆",
        },
    ];

    const handleExport = () => {
        setIsExporting(true);

        const options: ExportOptions = {
            format: selectedFormat,
            includeCompleted,
            includeSubtasks: false,
            includeNotes: false,
        };

        setTimeout(() => {
            exportStudyPlan(tasks, syllabusTitle, completedCount, options);
            setIsExporting(false);
            setExportSuccess(true);

            setTimeout(() => {
                setExportSuccess(false);
                onClose();
            }, 2000);
        }, 500);
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
                    onClick={(e) => e.stopPropagation()}
                    className="bg-gradient-to-br from-blue-900/95 via-purple-900/95 to-blue-900/95 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full border-2 border-blue-500/30 shadow-2xl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                                <Download className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white">
                                    Export Study Plan
                                </h2>
                                <p className="text-gray-200 text-sm">
                                    Download or share your calendar
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

                    {exportSuccess ? (
                        /* Success State */
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-center py-12"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.5 }}
                                className="inline-block p-6 bg-green-500/20 rounded-full mb-4"
                            >
                                <CheckCircle className="w-16 h-16 text-green-400" />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                                Export Successful! 🎉
                            </h3>
                            <p className="text-gray-300">
                                Your study plan has been exported successfully!
                            </p>
                        </motion.div>
                    ) : (
                        <>
                            {/* Format Selection */}
                            <div className="mb-6">
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-400" />
                                    Choose Export Format:
                                </h3>
                                <div className="space-y-3">
                                    {formats.map((format) => (
                                        <motion.button
                                            key={format.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setSelectedFormat(format.id)}
                                            className={`w-full p-4 rounded-xl transition-all text-left ${selectedFormat === format.id
                                                    ? "bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-blue-400"
                                                    : "bg-white/10 border-2 border-white/20 hover:bg-white/20"
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="text-4xl">{format.emoji}</div>
                                                <div className="flex-1">
                                                    <p className="text-white font-bold">{format.name}</p>
                                                    <p className="text-gray-300 text-sm">
                                                        {format.description}
                                                    </p>
                                                </div>
                                                {selectedFormat === format.id && (
                                                    <CheckCircle className="w-6 h-6 text-white" />
                                                )}
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Options */}
                            <div className="mb-6 bg-white/5 rounded-xl p-4 border border-white/10">
                                <h4 className="text-white font-bold mb-3">Export Options:</h4>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={includeCompleted}
                                        onChange={(e) => setIncludeCompleted(e.target.checked)}
                                        className="w-5 h-5 rounded border-2 border-white/30 bg-white/10 checked:bg-blue-500"
                                    />
                                    <span className="text-gray-200">
                                        Include completed tasks ({completedCount} tasks)
                                    </span>
                                </label>
                            </div>

                            {/* Preview Info */}
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                                <h4 className="text-blue-300 font-bold mb-2">
                                    📊 Export Preview:
                                </h4>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-gray-400">Total Tasks:</p>
                                        <p className="text-white font-bold">{tasks.length}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Completed:</p>
                                        <p className="text-white font-bold">{completedCount}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">To Export:</p>
                                        <p className="text-white font-bold">
                                            {includeCompleted ? tasks.length : tasks.length - completedCount}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Format:</p>
                                        <p className="text-white font-bold uppercase">
                                            {selectedFormat === "google-calendar" ? "GCAL" : selectedFormat}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleExport}
                                    disabled={isExporting}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isExporting ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                            />
                                            Exporting...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-5 h-5" />
                                            Export Now
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Help Text */}
                            <p className="text-gray-400 text-xs text-center mt-4">
                                💡 Tip: Share your study plan with friends or import it into your favorite calendar app!
                            </p>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Export Button Component
export const ExportButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
            <Download className="w-5 h-5" />
            Export Study Plan
        </motion.button>
    );
};
