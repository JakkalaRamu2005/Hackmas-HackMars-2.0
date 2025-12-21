"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

interface BackgroundMusicProps {
    musicId: string | null;
}

// Note: In a real implementation, you would have actual audio files
// For demo purposes, we'll use placeholder URLs or Web Audio API
const MUSIC_URLS: Record<string, string> = {
    'music-jingle-bells': '/music/jingle-bells.mp3',
    'music-silent-night': '/music/silent-night.mp3',
    'music-lofi-christmas': '/music/lofi-christmas.mp3',
    'music-deck-the-halls': '/music/deck-the-halls.mp3',
};

const MUSIC_NAMES: Record<string, string> = {
    'music-jingle-bells': 'Jingle Bells',
    'music-silent-night': 'Silent Night',
    'music-lofi-christmas': 'Lo-fi Christmas',
    'music-deck-the-halls': 'Deck the Halls',
};

export const BackgroundMusic = ({ musicId }: BackgroundMusicProps) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.3);

    useEffect(() => {
        if (!musicId) {
            if (audioRef.current) {
                audioRef.current.pause();
                setIsPlaying(false);
            }
            return;
        }

        // Create audio element
        const audio = new Audio(MUSIC_URLS[musicId]);
        audio.loop = true;
        audio.volume = volume;
        audioRef.current = audio;

        // Auto-play (with user interaction requirement in mind)
        const playAudio = () => {
            audio.play().then(() => {
                setIsPlaying(true);
            }).catch((error) => {
                console.log('Auto-play prevented:', error);
                setIsPlaying(false);
            });
        };

        playAudio();

        return () => {
            audio.pause();
            audio.src = '';
        };
    }, [musicId]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch((error) => {
                console.error('Playback error:', error);
            });
        }
    };

    if (!musicId) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 z-40 bg-gradient-to-br from-christmas-green/80 to-christmas-red/80 backdrop-blur-md border border-white/30 rounded-2xl p-4 shadow-lg"
        >
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🎵</span>
                    <div>
                        <p className="text-xs text-gray-200">Now Playing</p>
                        <p className="text-sm font-bold text-white">{MUSIC_NAMES[musicId]}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleMute}
                        className="p-2 hover:bg-white/20 rounded-lg transition-all"
                    >
                        {isMuted ? (
                            <VolumeX className="w-4 h-4 text-white" />
                        ) : (
                            <Volume2 className="w-4 h-4 text-white" />
                        )}
                    </button>

                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume * 100}
                        onChange={(e) => setVolume(parseInt(e.target.value) / 100)}
                        className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, #F8B229 0%, #F8B229 ${volume * 100}%, rgba(255,255,255,0.3) ${volume * 100}%, rgba(255,255,255,0.3) 100%)`
                        }}
                    />
                </div>
            </div>

            {/* Visualizer Animation */}
            {isPlaying && !isMuted && (
                <div className="flex items-end gap-1 mt-2 justify-center h-8">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-1 bg-christmas-gold rounded-full"
                            animate={{
                                height: ['20%', '100%', '20%'],
                            }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.1,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
};
