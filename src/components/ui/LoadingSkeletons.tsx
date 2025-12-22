"use client";

import { motion } from "framer-motion";

// Generic Skeleton Component
export const Skeleton = ({
    className = "",
    variant = "rectangular",
}: {
    className?: string;
    variant?: "rectangular" | "circular" | "text";
}) => {
    const baseClasses = "bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-pulse";
    const variantClasses = {
        rectangular: "rounded-xl",
        circular: "rounded-full",
        text: "rounded h-4",
    };

    return (
        <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
    );
};

// Calendar Grid Skeleton
export const CalendarSkeleton = () => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 24 }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="aspect-square"
                >
                    <Skeleton className="w-full h-full" />
                </motion.div>
            ))}
        </div>
    );
};

// Tree Skeleton
export const TreeSkeleton = () => {
    return (
        <div className="flex flex-col items-center gap-4">
            <Skeleton variant="circular" className="w-16 h-16" />
            <Skeleton className="w-32 h-48" />
            <Skeleton className="w-24 h-12" />
        </div>
    );
};

// Stats Skeleton
export const StatsSkeleton = () => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton className="w-24 h-6" />
                <Skeleton className="w-16 h-8" />
            </div>
            <div className="flex items-center justify-between">
                <Skeleton className="w-20 h-6" />
                <Skeleton className="w-12 h-8" />
            </div>
            <div className="flex items-center justify-between">
                <Skeleton className="w-28 h-6" />
                <Skeleton className="w-20 h-8" />
            </div>
        </div>
    );
};

// Analytics Dashboard Skeleton
export const AnalyticsSkeleton = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Skeleton className="w-48 h-10" />
                <Skeleton className="w-32 h-10" />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-6 space-y-3">
                        <Skeleton className="w-32 h-6" />
                        <Skeleton className="w-20 h-12" />
                        <Skeleton className="w-full h-2" />
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div className="bg-white/5 rounded-xl p-6">
                <Skeleton className="w-40 h-8 mb-4" />
                <Skeleton className="w-full h-64" />
            </div>

            {/* Table */}
            <div className="bg-white/5 rounded-xl p-6 space-y-3">
                <Skeleton className="w-32 h-8 mb-4" />
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="w-3/4 h-4" />
                            <Skeleton className="w-1/2 h-3" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Full Page Loading
export const PageLoading = ({ message = "Loading..." }: { message?: string }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-christmas-green via-christmas-red to-purple-900 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                {/* Animated Christmas Tree */}
                <motion.div
                    animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="text-8xl mb-6"
                >
                    🎄
                </motion.div>

                {/* Loading Text */}
                <h2 className="text-2xl font-bold text-white mb-4">{message}</h2>

                {/* Loading Dots */}
                <div className="flex items-center justify-center gap-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                            className="w-3 h-3 bg-christmas-gold rounded-full"
                        />
                    ))}
                </div>

                {/* Helpful Tip */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-gray-300 text-sm mt-6"
                >
                    🎅 Preparing your study calendar...
                </motion.p>
            </motion.div>
        </div>
    );
};

// Inline Loading Spinner
export const LoadingSpinner = ({
    size = "md",
    color = "christmas-gold",
}: {
    size?: "sm" | "md" | "lg";
    color?: string;
}) => {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12",
    };

    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={`border-4 border-${color}/20 border-t-${color} rounded-full ${sizeClasses[size]}`}
        />
    );
};

// Content Loading State
export const ContentLoading = ({ text = "Loading content..." }: { text?: string }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <p className="text-white mt-4">{text}</p>
        </div>
    );
};
