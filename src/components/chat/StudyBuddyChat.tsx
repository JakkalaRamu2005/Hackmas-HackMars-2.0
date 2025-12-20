"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Sparkles, Loader2, MessageCircle } from "lucide-react";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

interface StudyBuddyChatProps {
    syllabusContext?: string;
    onClose: () => void;
}

export const StudyBuddyChat = ({ syllabusContext, onClose }: StudyBuddyChatProps) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "🎅 Ho ho ho! I'm Santa's Study Helper! I'm here to help you with your studies. Ask me anything about your syllabus, study tips, or explanations of topics!",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: input.trim(),
                    syllabusContext,
                    conversationHistory: messages.slice(-5), // Last 5 messages for context
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to get response");
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.response,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "🎄 Oops! Something went wrong. Please try again!",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const suggestedQuestions = [
        "Explain this topic in simple terms",
        "Give me study tips for this subject",
        "Create a quiz question",
        "How should I approach this topic?",
    ];

    const handleSuggestionClick = (question: string) => {
        setInput(question);
        inputRef.current?.focus();
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-christmas-green/20 to-christmas-red/20 backdrop-blur-xl border border-white/20 rounded-3xl w-full max-w-2xl h-[600px] flex flex-col overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="bg-white/10 backdrop-blur-md border-b border-white/20 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-christmas-red to-red-700 rounded-full flex items-center justify-center text-2xl">
                            🎅
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white font-[family-name:var(--font-christmas)]">
                                Santa's Study Helper
                            </h3>
                            <p className="text-xs text-gray-300 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                AI-Powered Study Buddy
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === "user"
                                        ? "bg-christmas-gold text-christmas-green"
                                        : "bg-white/10 text-white border border-white/20"
                                    }`}
                            >
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                <p className="text-xs opacity-60 mt-1">
                                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </p>
                            </div>
                        </motion.div>
                    ))}

                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                        >
                            <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-christmas-gold" />
                                <p className="text-sm text-gray-300">Santa is thinking...</p>
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Suggested Questions */}
                {messages.length === 1 && (
                    <div className="px-6 pb-4">
                        <p className="text-xs text-gray-300 mb-2">Try asking:</p>
                        <div className="flex flex-wrap gap-2">
                            {suggestedQuestions.map((question, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(question)}
                                    className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-full text-gray-300 hover:text-white transition-all"
                                >
                                    {question}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <div className="bg-white/10 backdrop-blur-md border-t border-white/20 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me anything about your studies..."
                            disabled={isLoading}
                            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-christmas-gold disabled:opacity-50"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="bg-christmas-gold hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-christmas-green p-3 rounded-xl transition-all"
                        >
                            <Send className="w-5 h-5" />
                        </motion.button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-center">
                        🎄 Powered by Google Gemini AI
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Floating Chat Button Component
export const StudyBuddyButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-br from-christmas-red to-red-700 rounded-full shadow-2xl flex items-center justify-center text-3xl hover:shadow-christmas-gold/50 transition-all"
            title="Chat with Santa's Study Helper"
        >
            <span className="animate-bounce">🎅</span>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-christmas-gold rounded-full animate-pulse"></div>
        </motion.button>
    );
};
