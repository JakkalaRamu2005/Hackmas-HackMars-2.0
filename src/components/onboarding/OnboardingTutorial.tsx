"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Sparkles, Gift, Calendar, TreePine, Target, Users, Bell, MessageSquare } from "lucide-react";
import confetti from "canvas-confetti";

interface OnboardingStep {
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    image?: string;
    action?: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
    {
        id: 1,
        title: "🎅 Welcome to Santa's Workshop!",
        description: "Ho ho ho! Santa needs your help! The elves are overwhelmed with organizing study schedules for students worldwide. Can you help turn exam stress into holiday magic?",
        icon: <Sparkles className="w-12 h-12" />,
        action: "Let's Begin!"
    },
    {
        id: 2,
        title: "📚 The Problem",
        description: "December is tough - exams clash with the holiday spirit! Students procrastinate, stress builds up, and the festive joy disappears. But not anymore!",
        icon: <Gift className="w-12 h-12" />,
        action: "Show Me the Solution"
    },
    {
        id: 3,
        title: "🎄 Your Magic Advent Calendar",
        description: "Paste your syllabus, and our AI elves will transform it into 24 bite-sized study gifts! Open one door each day, complete your task, and watch your Christmas tree grow!",
        icon: <Calendar className="w-12 h-12" />,
        action: "That's Amazing!"
    },
    {
        id: 4,
        title: "🎁 Earn Rewards & Ornaments",
        description: "Complete tasks to earn points and unlock beautiful ornaments for your tree! The more you study, the more festive your tree becomes. Collect achievements and build your streak!",
        icon: <TreePine className="w-12 h-12" />,
        action: "I Love It!"
    },
    {
        id: 5,
        title: "🎯 Grinch Mode - Stay Focused!",
        description: "Don't let the Grinch steal your focus! Activate Grinch Mode to block distracting websites during study sessions. Use the Pomodoro timer with festive bells!",
        icon: <Target className="w-12 h-12" />,
        action: "Keep Going"
    },
    {
        id: 6,
        title: "👥 Study with Friends",
        description: "Join Study Rooms to collaborate with friends! Share progress, compete on leaderboards, and decorate the class tree together. Learning is better together!",
        icon: <Users className="w-12 h-12" />,
        action: "Awesome!"
    },
    {
        id: 7,
        title: "🤖 Meet Santa's AI Study Buddy",
        description: "Stuck on a topic? Chat with Santa's AI helper! Get explanations, quiz yourself, and receive motivational messages. Your personal study elf is always ready!",
        icon: <MessageSquare className="w-12 h-12" />,
        action: "So Cool!"
    },
    {
        id: 8,
        title: "🔔 Smart Reminders",
        description: "Never miss a day! Get festive notifications to maintain your streak, complete daily tasks, and count down to Christmas. Stay motivated all December long!",
        icon: <Bell className="w-12 h-12" />,
        action: "Perfect!"
    },
    {
        id: 9,
        title: "🎉 Ready to Start Your Journey?",
        description: "You're all set! Transform your exam panic into holiday magic. Let's build your personalized Study Advent Calendar and make this December your most productive yet!",
        icon: <Sparkles className="w-12 h-12" />,
        action: "Start My Calendar! 🎄"
    }
];

interface OnboardingTutorialProps {
    onComplete: () => void;
    onSkip: () => void;
}

export const OnboardingTutorial = ({ onComplete, onSkip }: OnboardingTutorialProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [showSnow, setShowSnow] = useState(false);

    const step = ONBOARDING_STEPS[currentStep];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

    // Trigger confetti on first and last step
    useEffect(() => {
        if (currentStep === 0 || currentStep === ONBOARDING_STEPS.length - 1) {
            triggerConfetti();
        }
    }, [currentStep]);

    const triggerConfetti = () => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

        const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
        };

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#D42426', '#165B33', '#F8B229', '#FFFFFF']
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#D42426', '#165B33', '#F8B229', '#FFFFFF']
            });
        }, 250);
    };

    const handleNext = () => {
        if (isLastStep) {
            triggerConfetti();
            setTimeout(() => {
                onComplete();
            }, 500);
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (!isFirstStep) {
            setCurrentStep(prev => prev - 1);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
            {/* Snow Effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white rounded-full opacity-70"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: -20,
                        }}
                        animate={{
                            y: window.innerHeight + 20,
                            x: Math.random() * window.innerWidth,
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 5,
                        }}
                    />
                ))}
            </div>

            {/* Main Modal */}
            <motion.div
                key={currentStep}
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: -20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative bg-gradient-to-br from-christmas-green/20 via-christmas-red/10 to-christmas-gold/20 backdrop-blur-xl border-2 border-white/30 rounded-3xl w-full max-w-2xl p-8 shadow-2xl"
            >
                {/* Skip Button */}
                <button
                    onClick={onSkip}
                    className="absolute top-4 right-4 p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Progress Indicator */}
                <div className="flex gap-2 mb-8">
                    {ONBOARDING_STEPS.map((_, index) => (
                        <div
                            key={index}
                            className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${index <= currentStep
                                    ? 'bg-christmas-gold shadow-[0_0_10px_rgba(248,178,41,0.5)]'
                                    : 'bg-white/20'
                                }`}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="text-center space-y-6">
                    {/* Icon */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.1 }}
                        className="flex justify-center"
                    >
                        <div className="p-6 bg-gradient-to-br from-christmas-gold/30 to-christmas-red/30 rounded-full border-2 border-white/30 text-christmas-gold">
                            {step.icon}
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-christmas)]"
                    >
                        {step.title}
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg text-gray-200 max-w-xl mx-auto leading-relaxed"
                    >
                        {step.description}
                    </motion.p>

                    {/* Step Counter */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-sm text-christmas-gold font-bold"
                    >
                        Step {currentStep + 1} of {ONBOARDING_STEPS.length}
                    </motion.p>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-8">
                    {!isFirstStep && (
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handlePrevious}
                            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl text-white font-bold transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back
                        </motion.button>
                    )}

                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNext}
                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${isLastStep
                                ? 'bg-christmas-gold text-christmas-green shadow-[0_0_30px_rgba(248,178,41,0.5)] hover:shadow-[0_0_40px_rgba(248,178,41,0.7)]'
                                : 'bg-christmas-red text-white shadow-[0_0_20px_rgba(212,36,38,0.4)] hover:shadow-[0_0_30px_rgba(212,36,38,0.6)]'
                            }`}
                    >
                        {step.action || "Next"}
                        {!isLastStep && <ArrowRight className="w-5 h-5" />}
                    </motion.button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-6 -left-6 text-6xl animate-bounce">🎅</div>
                <div className="absolute -bottom-6 -right-6 text-6xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎄</div>
            </motion.div>
        </motion.div>
    );
};

// Hook to manage onboarding state
export const useOnboarding = () => {
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true);

    useEffect(() => {
        const seen = localStorage.getItem('hasSeenOnboarding');
        setHasSeenOnboarding(seen === 'true');
    }, []);

    const completeOnboarding = () => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        setHasSeenOnboarding(true);
    };

    const resetOnboarding = () => {
        localStorage.removeItem('hasSeenOnboarding');
        setHasSeenOnboarding(false);
    };

    return {
        hasSeenOnboarding,
        completeOnboarding,
        resetOnboarding,
    };
};
