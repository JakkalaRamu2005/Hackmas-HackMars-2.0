"use client";

import { motion } from "framer-motion";
import { Send, UploadCloud } from "lucide-react";
import { useState } from "react";

interface SyllabusInputProps {
    onGenerate: (text: string) => void;
    isGenerating: boolean;
}

export const SyllabusInput = ({ onGenerate, isGenerating }: SyllabusInputProps) => {
    const [text, setText] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onGenerate(text);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
        >
            {/* Decorative Lights */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 via-green-500 to-red-500 opacity-50" />

            <h3 className="text-2xl text-white font-bold mb-4 font-[family-name:var(--font-christmas)] tracking-wide">
                🎅 Paste your Exam Syllabus
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Example: Physics Final on Jan 10 covering Newton's Laws, Thermodynamics, and Wave Motion..."
                    className="w-full h-40 bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-christmas-gold resize-none transition-all"
                />

                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        <UploadCloud className="w-4 h-4" />
                        <span>Or upload PDF (Coming Soon)</span>
                    </button>

                    <button
                        type="submit"
                        disabled={!text.trim() || isGenerating}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${text.trim() && !isGenerating
                                ? "bg-christmas-gold text-christmas-green hover:shadow-[0_0_20px_rgba(248,178,41,0.5)] transform hover:-translate-y-1"
                                : "bg-gray-600 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        {isGenerating ? (
                            <>
                                <span className="animate-spin">❄️</span> Building Workshop...
                            </>
                        ) : (
                            <>
                                Generate Calendar <Send className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};
