"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Loader2, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface VoiceInputProps {
    onTranscript: (text: string) => void;
    onError?: (error: string) => void;
    placeholder?: string;
}

export const VoiceInput = ({
    onTranscript,
    onError,
    placeholder = "Click the mic and speak your syllabus...",
}: VoiceInputProps) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [interimTranscript, setInterimTranscript] = useState("");
    const [isSupported, setIsSupported] = useState(true);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Check if browser supports Web Speech API
        if (typeof window !== "undefined") {
            const SpeechRecognition =
                (window as any).SpeechRecognition ||
                (window as any).webkitSpeechRecognition;

            if (!SpeechRecognition) {
                setIsSupported(false);
                return;
            }

            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = "en-US";

            recognition.onresult = (event: any) => {
                let interim = "";
                let final = "";

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcriptPart = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        final += transcriptPart + " ";
                    } else {
                        interim += transcriptPart;
                    }
                }

                setInterimTranscript(interim);
                if (final) {
                    setTranscript((prev) => prev + final);
                }
            };

            recognition.onerror = (event: any) => {
                console.error("Speech recognition error:", event.error);
                setIsListening(false);
                if (onError) {
                    onError(`Voice recognition error: ${event.error}`);
                }
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [onError]);

    const startListening = () => {
        if (!recognitionRef.current) return;

        try {
            recognitionRef.current.start();
            setIsListening(true);
            setTranscript("");
            setInterimTranscript("");
        } catch (error) {
            console.error("Error starting recognition:", error);
            if (onError) {
                onError("Failed to start voice recognition");
            }
        }
    };

    const stopListening = () => {
        if (!recognitionRef.current) return;

        recognitionRef.current.stop();
        setIsListening(false);

        // Send final transcript to parent
        if (transcript || interimTranscript) {
            const finalText = transcript + interimTranscript;
            onTranscript(finalText);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    if (!isSupported) {
        return (
            <div className="text-center p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-red-300 text-sm">
                    ⚠️ Voice input is not supported in your browser. Please use Chrome, Edge, or Safari.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Voice Input Button */}
            <div className="flex flex-col items-center gap-4">
                <motion.button
                    onClick={toggleListening}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative p-8 rounded-full transition-all ${isListening
                            ? "bg-gradient-to-br from-red-500 to-pink-500 shadow-[0_0_40px_rgba(239,68,68,0.6)]"
                            : "bg-gradient-to-br from-purple-500 to-blue-500 shadow-[0_0_40px_rgba(139,92,246,0.4)]"
                        }`}
                >
                    <AnimatePresence mode="wait">
                        {isListening ? (
                            <motion.div
                                key="listening"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                            >
                                <MicOff className="w-12 h-12 text-white" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="idle"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                            >
                                <Mic className="w-12 h-12 text-white" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Pulse animation when listening */}
                    {isListening && (
                        <>
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 rounded-full bg-red-500"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                className="absolute inset-0 rounded-full bg-red-500"
                            />
                        </>
                    )}
                </motion.button>

                <div className="text-center">
                    <p className="text-white font-bold text-lg">
                        {isListening ? "🎤 Listening..." : "🎅 Ready to Listen"}
                    </p>
                    <p className="text-gray-300 text-sm">
                        {isListening
                            ? "Speak your syllabus clearly"
                            : "Click the mic to start speaking"}
                    </p>
                </div>
            </div>

            {/* Transcript Display */}
            {(transcript || interimTranscript || isListening) && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 min-h-[200px]"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                        <h3 className="text-white font-bold">Your Syllabus</h3>
                    </div>

                    <div className="text-white space-y-2">
                        {transcript && <p className="text-white">{transcript}</p>}
                        {interimTranscript && (
                            <p className="text-gray-400 italic">{interimTranscript}</p>
                        )}
                        {isListening && !transcript && !interimTranscript && (
                            <p className="text-gray-400 italic flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Waiting for your voice...
                            </p>
                        )}
                    </div>

                    {transcript && !isListening && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 pt-4 border-t border-white/20"
                        >
                            <p className="text-green-300 text-sm flex items-center gap-2">
                                ✅ Transcript captured! Click "Generate Calendar" to continue.
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            )}

            {/* Instructions */}
            {!isListening && !transcript && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <h4 className="text-blue-300 font-bold mb-2 flex items-center gap-2">
                        💡 Pro Tips for Voice Input
                    </h4>
                    <ul className="text-blue-200 text-sm space-y-1">
                        <li>• Speak clearly and at a moderate pace</li>
                        <li>• List topics one by one: "Topic 1: Data Structures..."</li>
                        <li>• Pause briefly between topics</li>
                        <li>• Click the mic again when you're done</li>
                        <li>• Works best in a quiet environment</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

// Voice Input Modal
interface VoiceInputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (text: string) => void;
}

export const VoiceInputModal = ({
    isOpen,
    onClose,
    onSubmit,
}: VoiceInputModalProps) => {
    const [voiceText, setVoiceText] = useState("");

    const handleTranscript = (text: string) => {
        setVoiceText(text);
    };

    const handleSubmit = () => {
        if (voiceText.trim()) {
            onSubmit(voiceText);
            setVoiceText("");
            onClose();
        }
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
                    className="bg-gradient-to-br from-christmas-green/95 via-christmas-red/95 to-purple-900/95 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full border-2 border-white/20 shadow-2xl"
                >
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                            🎤 Voice Input
                            <span className="text-lg font-normal text-gray-300">
                                (Experimental)
                            </span>
                        </h2>
                        <p className="text-gray-200">
                            Speak your syllabus instead of typing! Perfect for hands-free input.
                        </p>
                    </div>

                    <VoiceInput onTranscript={handleTranscript} />

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!voiceText.trim()}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-christmas-gold to-yellow-500 hover:from-yellow-500 hover:to-christmas-gold text-christmas-green rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Generate Calendar 🎄
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
