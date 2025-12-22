"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Music, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface ChristmasCarolTimerProps {
    streak: number;
    onSessionComplete?: () => void;
}

const CHRISTMAS_CAROLS = [
    { name: "Jingle Bells", emoji: "🔔", color: "from-red-500 to-green-500" },
    { name: "Silent Night", emoji: "🌙", color: "from-blue-500 to-purple-500" },
    { name: "Deck the Halls", emoji: "🎄", color: "from-green-500 to-emerald-600" },
    { name: "Joy to the World", emoji: "🌟", color: "from-yellow-500 to-orange-500" },
    { name: "We Wish You", emoji: "🎅", color: "from-red-600 to-pink-500" },
];

export const ChristmasCarolTimer = ({
    streak,
    onSessionComplete,
}: ChristmasCarolTimerProps) => {
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Select carol based on streak
    const currentCarol = CHRISTMAS_CAROLS[Math.min(streak, CHRISTMAS_CAROLS.length - 1)];

    useEffect(() => {
        if (isActive && (minutes > 0 || seconds > 0)) {
            intervalRef.current = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        // Timer complete
                        handleTimerComplete();
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                } else {
                    setSeconds(seconds - 1);
                }
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive, minutes, seconds]);

    const handleTimerComplete = () => {
        setIsActive(false);

        if (!isBreak) {
            // Work session complete
            setSessionsCompleted(sessionsCompleted + 1);
            if (onSessionComplete) {
                onSessionComplete();
            }

            // Start break
            setIsBreak(true);
            setMinutes(5);
            setSeconds(0);

            // Show celebration
            playChristmasSound();
        } else {
            // Break complete
            setIsBreak(false);
            setMinutes(25);
            setSeconds(0);
        }
    };

    const playChristmasSound = () => {
        // Play a success sound (you can add actual audio later)
        console.log("🎄 Session complete! Playing:", currentCarol.name);
    };

    const toggleTimer = () => {
        setIsActive(!isActive);
        if (!isActive && !isMusicPlaying) {
            setIsMusicPlaying(true);
        }
    };

    const resetTimer = () => {
        setIsActive(false);
        setIsBreak(false);
        setMinutes(25);
        setSeconds(0);
        setIsMusicPlaying(false);
    };

    const toggleMusic = () => {
        setIsMusicPlaying(!isMusicPlaying);
    };

    const progress = isBreak
        ? ((5 * 60 - (minutes * 60 + seconds)) / (5 * 60)) * 100
        : ((25 * 60 - (minutes * 60 + seconds)) / (25 * 60)) * 100;

    return (
        <div className="bg-gradient-to-br from-christmas-green/20 via-christmas-red/20 to-purple-900/20 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Music className="w-6 h-6 text-christmas-gold" />
                        Christmas Carol Timer
                    </h3>
                    <p className="text-gray-300 text-sm">
                        {isBreak ? "Break Time! 🎁" : "Focus Time 🎄"}
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleMusic}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                    {isMusicPlaying ? (
                        <Volume2 className="w-5 h-5 text-christmas-gold" />
                    ) : (
                        <VolumeX className="w-5 h-5 text-gray-400" />
                    )}
                </motion.button>
            </div>

            {/* Current Carol Display */}
            <motion.div
                animate={{ scale: isMusicPlaying ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 2, repeat: isMusicPlaying ? Infinity : 0 }}
                className={`bg-gradient-to-r ${currentCarol.color} rounded-xl p-4 mb-4 text-center`}
            >
                <div className="text-4xl mb-2">{currentCarol.emoji}</div>
                <p className="text-white font-bold">
                    {isMusicPlaying ? `♪ ${currentCarol.name} ♪` : currentCarol.name}
                </p>
                <p className="text-white/80 text-xs mt-1">
                    Streak Level {streak} Carol
                </p>
            </motion.div>

            {/* Timer Display */}
            <div className="relative mb-6">
                {/* Progress Ring */}
                <svg className="w-full h-48" viewBox="0 0 200 200">
                    {/* Background circle */}
                    <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="12"
                    />
                    {/* Progress circle */}
                    <motion.circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 80}`}
                        strokeDashoffset={`${2 * Math.PI * 80 * (1 - progress / 100)}`}
                        transform="rotate(-90 100 100)"
                        initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 80 * (1 - progress / 100) }}
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#D42426" />
                            <stop offset="50%" stopColor="#F8B229" />
                            <stop offset="100%" stopColor="#165B33" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Time Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                        key={`${minutes}:${seconds}`}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        className="text-6xl font-bold text-white"
                    >
                        {minutes.toString().padStart(2, "0")}:
                        {seconds.toString().padStart(2, "0")}
                    </motion.div>
                    <p className="text-gray-300 text-sm mt-2">
                        {isBreak ? "Enjoy your break!" : "Stay focused!"}
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3 mb-4">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTimer}
                    className={`flex-1 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${isActive
                            ? "bg-gradient-to-r from-red-500 to-red-600"
                            : "bg-gradient-to-r from-christmas-green to-emerald-600"
                        }`}
                >
                    {isActive ? (
                        <>
                            <Pause className="w-5 h-5 inline mr-2" />
                            Pause
                        </>
                    ) : (
                        <>
                            <Play className="w-5 h-5 inline mr-2" />
                            Start
                        </>
                    )}
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetTimer}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-white border border-white/30 transition-all"
                >
                    <RotateCcw className="w-5 h-5" />
                </motion.button>
            </div>

            {/* Sessions Completed */}
            <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                <p className="text-gray-300 text-sm">Sessions Today</p>
                <p className="text-2xl font-bold text-christmas-gold">
                    {sessionsCompleted} 🎄
                </p>
            </div>

            {/* Streak Bonus Info */}
            {streak > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-3 border border-yellow-500/30"
                >
                    <p className="text-yellow-300 text-sm text-center">
                        🔥 {streak}-day streak! Carol unlocked: {currentCarol.name}
                    </p>
                </motion.div>
            )}
        </div>
    );
};
