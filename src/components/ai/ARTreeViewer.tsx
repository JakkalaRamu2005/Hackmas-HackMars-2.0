"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, RotateCcw, Download, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ARTreeViewerProps {
    completedCount: number;
    totalTasks: number;
    isOpen: boolean;
    onClose: () => void;
}

export const ARTreeViewer = ({
    completedCount,
    totalTasks,
    isOpen,
    onClose,
}: ARTreeViewerProps) => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string>("");
    const [isCapturing, setIsCapturing] = useState(false);
    const [treePosition, setTreePosition] = useState({ x: 50, y: 50 });
    const [treeScale, setTreeScale] = useState(1);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (isOpen) {
            startCamera();
        } else {
            stopCamera();
        }

        return () => {
            stopCamera();
        };
    }, [isOpen]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment", width: 1280, height: 720 },
                audio: false,
            });

            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setError("");
        } catch (err) {
            console.error("Camera error:", err);
            setError(
                "Unable to access camera. Please grant camera permissions and try again."
            );
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (!context) return;

        // Set canvas size to video size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Download the image
        canvas.toBlob((blob) => {
            if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `StudyAdvent-AR-Tree-${new Date().getTime()}.png`;
                link.click();
                URL.revokeObjectURL(url);
            }
        });

        setIsCapturing(true);
        setTimeout(() => setIsCapturing(false), 500);
    };

    const resetPosition = () => {
        setTreePosition({ x: 50, y: 50 });
        setTreeScale(1);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-50"
            >
                {/* Camera View */}
                <div className="relative w-full h-full">
                    {error ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center p-8 bg-red-500/20 border border-red-500/50 rounded-2xl max-w-md">
                                <p className="text-red-300 mb-4">{error}</p>
                                <button
                                    onClick={startCamera}
                                    className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Video Stream */}
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />

                            {/* AR Christmas Tree Overlay */}
                            <div
                                className="absolute pointer-events-none"
                                style={{
                                    left: `${treePosition.x}%`,
                                    top: `${treePosition.y}%`,
                                    transform: `translate(-50%, -50%) scale(${treeScale})`,
                                }}
                            >
                                <ARChristmasTree
                                    completedCount={completedCount}
                                    totalTasks={totalTasks}
                                />
                            </div>

                            {/* AR Instructions */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
                                <p className="text-white text-sm flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-yellow-400" />
                                    Point your camera at a flat surface
                                </p>
                            </div>

                            {/* Stats Overlay */}
                            <div className="absolute top-20 left-4 bg-black/60 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20">
                                <p className="text-white text-sm font-bold">
                                    🎄 {completedCount}/{totalTasks} Ornaments
                                </p>
                                <p className="text-green-300 text-xs">
                                    {Math.round((completedCount / totalTasks) * 100)}% Complete
                                </p>
                            </div>

                            {/* Controls */}
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
                                {/* Reset Position */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={resetPosition}
                                    className="p-4 bg-white/20 backdrop-blur-md rounded-full border border-white/30 hover:bg-white/30 transition-colors"
                                >
                                    <RotateCcw className="w-6 h-6 text-white" />
                                </motion.button>

                                {/* Capture Photo */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={capturePhoto}
                                    className={`p-6 rounded-full border-4 transition-all ${isCapturing
                                            ? "bg-white border-white"
                                            : "bg-white/20 backdrop-blur-md border-white/50 hover:bg-white/30"
                                        }`}
                                >
                                    <Camera className="w-8 h-8 text-white" />
                                </motion.button>

                                {/* Close */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="p-4 bg-red-500/80 backdrop-blur-md rounded-full border border-red-400 hover:bg-red-500 transition-colors"
                                >
                                    <X className="w-6 h-6 text-white" />
                                </motion.button>
                            </div>

                            {/* Scale Controls */}
                            <div className="absolute bottom-8 right-4 bg-black/60 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20">
                                <p className="text-white text-xs mb-2 text-center">Tree Size</p>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="2"
                                    step="0.1"
                                    value={treeScale}
                                    onChange={(e) => setTreeScale(parseFloat(e.target.value))}
                                    className="w-32"
                                />
                            </div>

                            {/* Hidden canvas for photo capture */}
                            <canvas ref={canvasRef} className="hidden" />
                        </>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

// AR Christmas Tree Component
const ARChristmasTree = ({
    completedCount,
    totalTasks,
}: {
    completedCount: number;
    totalTasks: number;
}) => {
    const ornamentPositions = [
        { top: "15%", left: "50%" },
        { top: "25%", left: "35%" },
        { top: "25%", left: "65%" },
        { top: "35%", left: "25%" },
        { top: "35%", left: "50%" },
        { top: "35%", left: "75%" },
        { top: "45%", left: "20%" },
        { top: "45%", left: "45%" },
        { top: "45%", left: "55%" },
        { top: "45%", left: "80%" },
        { top: "55%", left: "15%" },
        { top: "55%", left: "35%" },
        { top: "55%", left: "50%" },
        { top: "55%", left: "65%" },
        { top: "55%", left: "85%" },
        { top: "65%", left: "25%" },
        { top: "65%", left: "45%" },
        { top: "65%", left: "55%" },
        { top: "65%", left: "75%" },
        { top: "75%", left: "20%" },
        { top: "75%", left: "40%" },
        { top: "75%", left: "60%" },
        { top: "75%", left: "80%" },
        { top: "85%", left: "50%" },
    ];

    return (
        <div className="relative w-64 h-80 drop-shadow-2xl">
            {/* Tree */}
            <div className="absolute inset-0 flex flex-col items-center">
                {/* Star */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="text-6xl mb-2 drop-shadow-lg"
                >
                    ⭐
                </motion.div>

                {/* Tree Body */}
                <div className="relative">
                    <div className="text-9xl drop-shadow-lg">🎄</div>

                    {/* Ornaments */}
                    {ornamentPositions.slice(0, completedCount).map((pos, index) => (
                        <motion.div
                            key={index}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="absolute text-3xl drop-shadow-lg"
                            style={{ top: pos.top, left: pos.left, transform: "translate(-50%, -50%)" }}
                        >
                            {["🔴", "🟡", "🔵", "🟢", "🟣", "🟠"][index % 6]}
                        </motion.div>
                    ))}
                </div>

                {/* Trunk */}
                <div className="text-4xl drop-shadow-lg">🟫</div>
            </div>

            {/* Glow Effect */}
            <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-b from-yellow-400/20 via-green-400/20 to-transparent rounded-full blur-2xl"
            />
        </div>
    );
};

// AR Tree Button
export const ARTreeButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className="fixed bottom-24 left-6 z-40 p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-2xl hover:shadow-green-500/50 transition-all group"
        >
            <Camera className="w-6 h-6 text-white" />
            <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white"
            />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                AR Christmas Tree
            </div>
        </motion.button>
    );
};
