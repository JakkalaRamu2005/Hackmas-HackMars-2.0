"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lock, Gift, Check, X } from "lucide-react";
import { clsx } from "clsx";
import { useState } from "react";

interface DayTask {
    day: number;
    title: string;
    isUnlocked: boolean;
    isCompleted: boolean;
}

// Mock Data for Preview
const MOCK_TASKS_DATA: DayTask[] = Array.from({ length: 24 }).map((_, i) => ({
    day: i + 1,
    title: [
        "Review Newton's Second Law",
        "Practice React Hooks",
        "Solve 3 Calculus Problems",
        "Read Chapter 4 Summary"
    ][i % 4],
    isUnlocked: true, // For demo purposes, all are unlocked to show interaction
    isCompleted: false,
}));

interface AdventGridProps {
    onProgressUpdate: (count: number) => void;
}

export const AdventGrid = ({ onProgressUpdate }: AdventGridProps) => {
    const [tasks, setTasks] = useState(MOCK_TASKS_DATA);
    const [selectedTask, setSelectedTask] = useState<DayTask | null>(null);

    const handleTaskComplete = (day: number) => {
        const newTasks = tasks.map(t =>
            t.day === day ? { ...t, isCompleted: true } : t
        );
        setTasks(newTasks);
        // Count completed
        const count = newTasks.filter(t => t.isCompleted).length;
        onProgressUpdate(count);
        setSelectedTask(null); // Close modal
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4 relative">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {tasks.map((task) => (
                    <DayDoor key={task.day} task={task} onClick={() => setSelectedTask(task)} />
                ))}
            </div>

            {/* Task Modal */}
            <AnimatePresence>
                {selectedTask && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedTask(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 50 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border-4 border-christmas-gold relative overflow-hidden text-left"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedTask(null)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <h3 className="text-xl font-bold text-christmas-red font-[family-name:var(--font-christmas)]">
                                Day {selectedTask.day} Quest 📜
                            </h3>
                            <p className="text-gray-800 text-lg mt-2 font-medium">
                                {selectedTask.title}
                            </p>

                            <div className="mt-8 flex justify-end">
                                {selectedTask.isCompleted ? (
                                    <span className="inline-flex items-center gap-2 text-green-600 font-bold bg-green-100 px-4 py-2 rounded-full">
                                        <Check className="w-5 h-5" /> Completed!
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => handleTaskComplete(selectedTask.day)}
                                        className="inline-flex items-center gap-2 bg-christmas-green text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition-colors shadow-lg hover:shadow-xl transform active:scale-95"
                                    >
                                        Mark as Done <Gift className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const DayDoor = ({ task, onClick }: { task: DayTask; onClick: () => void }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05, rotateY: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={clsx(
                "aspect-square relative perspective-1000 cursor-pointer group rounded-xl shadow-md transition-all",
                task.isCompleted ? "brightness-110" : "hover:shadow-christmas-gold/50"
            )}
        >
            <div className={clsx(
                "absolute inset-0 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-300 overflow-hidden",
                task.isCompleted
                    ? "bg-green-100 border-green-500" // Open/Done Look
                    : "bg-gradient-to-br from-christmas-red to-red-900 border-red-400" // Closed Look
            )}>
                {task.isCompleted ? (
                    <Check className="w-12 h-12 text-green-600" />
                ) : (
                    <>
                        <span className="text-4xl font-bold font-[family-name:var(--font-christmas)] text-christmas-gold drop-shadow-md">
                            {task.day}
                        </span>
                        <Lock className="w-5 h-5 text-red-200 mt-2 opacity-70 group-hover:opacity-100" />
                    </>
                )}
            </div>

            {/* Snow Topper */}
            <div className="absolute -top-1 left-0 right-0 h-3 bg-white/90 rounded-t-xl" />
        </motion.div>
    );
};
