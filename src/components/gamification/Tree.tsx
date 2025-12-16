"use client";

import { motion } from "framer-motion";

interface TreeProps {
    completedCount: number;
    totalTasks: number;
}

export const Tree = ({ completedCount, totalTasks }: TreeProps) => {
    // Generate ornament positions deterministically based on totalTasks
    // This ensures ornaments appear in the same spot for the same index
    const getOrnamentPosition = (index: number) => {
        // Simple logic to distribute ornaments on a triangle
        // Top is narrow, bottom is wide
        const row = Math.floor(Math.sqrt(index * 2)); // Approximate row
        const y = 20 + (row * 15); // Top 20%, going down
        const spread = row * 10;
        const x = 50 + ((index % (row + 1)) - row / 2) * (spread / (row + 1)) * 2; // Distribute horizontally

        // Fallback/Clamp
        return {
            top: `${Math.min(Math.max(y, 15), 85)}%`,
            left: `${Math.min(Math.max(x, 20), 80)}%`
        };
    };

    return (
        <div className="relative w-64 h-80 mx-auto flex items-center justify-center">
            {/* 🎄 The Tree SVG */}
            <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xl">
                {/* Trunk */}
                <path d="M45 100 h10 v20 h-10 z" fill="#4a2c0f" />

                {/* Layers of leaves */}
                <motion.path
                    d="M50 10 L20 40 L40 40 L15 70 L35 70 L10 100 L90 100 L65 70 L85 70 L60 40 L80 40 Z"
                    fill="#165B33"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                />

                {/* Star */}
                <motion.path
                    d="M50 0 L53 8 L62 8 L55 14 L58 22 L50 17 L42 22 L45 14 L38 8 L47 8 Z"
                    fill="#F8B229"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
            </svg>

            {/* 🎁 Ornaments */}
            {Array.from({ length: completedCount }).map((_, i) => {
                const pos = getOrnamentPosition(i);
                return (
                    <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute w-4 h-4 rounded-full shadow-md border border-white/20"
                        style={{
                            top: pos.top,
                            left: pos.left,
                            backgroundColor: ["#D42426", "#F8B229", "#3B82F6", "#FFFFFF"][i % 4], // Random festive colors
                        }}
                    />
                );
            })}
        </div>
    );
};
