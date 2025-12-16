"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Gift } from "lucide-react";
import { useState } from "react";
import { SyllabusInput } from "@/components/home/SyllabusInput";
import { AdventGrid } from "@/components/calendar/AdventGrid";
import { Tree } from "@/components/gamification/Tree";

export default function Home() {
  const [viewState, setViewState] = useState<"hero" | "input" | "calendar">("hero");
  const [isGenerating, setIsGenerating] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  const handleStart = () => setViewState("input");

  const handleGenerate = async (text: string) => {
    setIsGenerating(true);
    // Simulate AI Delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsGenerating(false);
    setViewState("calendar");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 text-center z-10 w-full">

      <AnimatePresence mode="wait">
        {/* 🎄 Hero Section */}
        {viewState === "hero" && (
          <motion.div
            key="hero"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-sm font-medium text-christmas-gold">
              <Sparkles className="w-4 h-4" />
              <span>The #1 Christmas Hackathon Project</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold text-white drop-shadow-lg leading-tight">
              Turn Exam Panic into <br />
              <span className="text-christmas-red drop-shadow-xl bg-white/90 px-4 rounded-xl rotate-[-2deg] inline-block mx-2 mt-2 text-gold-gradient">
                Holiday Magic
              </span>
            </h1>

            <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Don't let exams steal your Christmas spirit. Paste your syllabus, and our AI will turn it into a
              <span className="font-bold text-christmas-gold"> personalized Advent Calendar</span>.
              Unwrap a bite-sized study task every day! 🎁
            </p>

            {/* 🚀 CTA Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="pt-8"
            >
              <button
                onClick={handleStart}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-christmas-red text-white text-lg font-bold rounded-full shadow-[0_0_40px_-10px_rgba(212,36,38,0.6)] hover:shadow-[0_0_60px_-10px_rgba(212,36,38,0.8)] transition-all"
              >
                <Gift className="w-6 h-6 animate-bounce" />
                Build My Calendar
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* 📝 Syllabus Input Section */}
        {viewState === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full"
          >
            <SyllabusInput onGenerate={handleGenerate} isGenerating={isGenerating} />
          </motion.div>
        )}

        {/* 📅 Advent Calendar Section */}
        {viewState === "calendar" && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex flex-col xl:flex-row items-start justify-center gap-8 max-w-7xl mx-auto"
          >
            {/* Sidebar: Tree & Progress */}
            <div className="w-full xl:w-1/3 order-2 xl:order-1 sticky top-8">
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 text-center">
                <h3 className="text-2xl font-bold text-christmas-gold mb-2 font-[family-name:var(--font-christmas)]">
                  Your Christmas Tree
                </h3>
                <p className="text-gray-300 mb-6 text-sm">
                  Complete tasks to hang ornaments! <br />
                  <span className="text-christmas-red font-bold">{completedCount} / 24 Ornaments</span>
                </p>
                <Tree completedCount={completedCount} totalTasks={24} />
              </div>
            </div>

            {/* Main: Calendar Grid */}
            <div className="w-full xl:w-2/3 order-1 xl:order-2">
              <h2 className="text-4xl font-bold text-white mb-6 font-[family-name:var(--font-christmas)] text-left pl-4">
                Your Study Advent Calendar 🎄
              </h2>
              <AdventGrid onProgressUpdate={setCompletedCount} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎅 Footer Credit */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="fixed bottom-6 text-sm text-gray-400 pointer-events-none"
      >
        Built with ❤️ for <strong>Hackmas: HackMars 2.0</strong>
      </motion.div>

    </div>
  );
}
