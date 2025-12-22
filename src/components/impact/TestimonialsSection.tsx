"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface Testimonial {
    id: string;
    name: string;
    role: string;
    university: string;
    avatar: string;
    rating: number;
    text: string;
    achievement: string;
}

const TESTIMONIALS: Testimonial[] = [
    {
        id: "1",
        name: "Sarah Chen",
        role: "Computer Science Student",
        university: "MIT",
        avatar: "👩‍💻",
        rating: 5,
        text: "StudyAdvent.ai completely transformed how I prepare for exams! Breaking down my syllabus into daily tasks made everything so much more manageable. I went from feeling overwhelmed to confident in just 2 weeks!",
        achievement: "Improved grade from B to A+",
    },
    {
        id: "2",
        name: "Marcus Johnson",
        role: "Engineering Major",
        university: "Stanford",
        avatar: "👨‍🎓",
        rating: 5,
        text: "The AI-powered task breakdown is a game-changer! Instead of staring at a massive syllabus, I now have bite-sized 10-minute chunks. I completed my entire Data Structures course 3 days before the exam!",
        achievement: "Finished studying 3 days early",
    },
    {
        id: "3",
        name: "Priya Patel",
        role: "Medical Student",
        university: "Johns Hopkins",
        avatar: "👩‍⚕️",
        rating: 5,
        text: "As a med student, I have SO much to study. StudyAdvent's progress predictions kept me motivated - seeing 'You'll finish 2 days early!' was exactly the encouragement I needed. Plus, the Christmas theme made studying actually fun!",
        achievement: "Completed 24 topics in 20 days",
    },
    {
        id: "4",
        name: "Alex Rivera",
        role: "Business Analytics",
        university: "Harvard",
        avatar: "👨‍💼",
        rating: 5,
        text: "The study session timer helped me realize I was only studying 20 minutes at a time. Now I do focused 45-minute sessions and I'm 40% more productive! The analytics dashboard is incredibly insightful.",
        achievement: "40% productivity increase",
    },
    {
        id: "5",
        name: "Emma Thompson",
        role: "Psychology Major",
        university: "Oxford",
        avatar: "👩‍🔬",
        rating: 5,
        text: "I love how the AI Study Buddy learns my patterns! It told me I'm most productive in the evening, so I rescheduled my study time and my retention improved dramatically. This app knows me better than I know myself!",
        achievement: "Better retention & understanding",
    },
    {
        id: "6",
        name: "David Kim",
        role: "Software Engineering",
        university: "UC Berkeley",
        avatar: "👨‍💻",
        rating: 5,
        text: "The Focus Mode saved my finals! Blocking social media during study sessions helped me stay on track. I went from constantly distracted to laser-focused. My study time is now 2x more effective!",
        achievement: "2x study effectiveness",
    },
];

export const TestimonialsSection = () => {
    return (
        <div className="w-full bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-purple-900/20 py-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        🎓 What Students Are Saying
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Join thousands of students who've transformed their study habits with StudyAdvent.ai
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-6">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className="w-6 h-6 fill-yellow-400 text-yellow-400"
                                />
                            ))}
                        </div>
                        <span className="text-white font-bold text-lg">5.0</span>
                        <span className="text-gray-400">from 2,847 students</span>
                    </div>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all hover:scale-105"
                        >
                            {/* Quote Icon */}
                            <Quote className="w-8 h-8 text-christmas-gold mb-4 opacity-50" />

                            {/* Rating */}
                            <div className="flex mb-3">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                    />
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <p className="text-gray-200 text-sm mb-4 leading-relaxed">
                                "{testimonial.text}"
                            </p>

                            {/* Achievement Badge */}
                            <div className="bg-green-500/20 border border-green-500/30 rounded-lg px-3 py-2 mb-4">
                                <p className="text-green-300 text-xs font-bold">
                                    ✅ {testimonial.achievement}
                                </p>
                            </div>

                            {/* Student Info */}
                            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                                <div className="text-4xl">{testimonial.avatar}</div>
                                <div>
                                    <p className="text-white font-bold text-sm">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-gray-400 text-xs">{testimonial.role}</p>
                                    <p className="text-christmas-gold text-xs font-semibold">
                                        {testimonial.university}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <p className="text-gray-300 text-lg mb-4">
                        Ready to join them? Start your study journey today! 🎄
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
                        <span>✅ 2,847+ students</span>
                        <span>✅ 15,000+ tasks completed</span>
                        <span>✅ 95% success rate</span>
                        <span>✅ Average grade improvement: 1.2 GPA</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// Compact version for homepage
export const TestimonialsCompact = () => {
    const featured = TESTIMONIALS.slice(0, 3);

    return (
        <div className="w-full py-8">
            <h3 className="text-2xl font-bold text-white text-center mb-6">
                💬 Student Success Stories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {featured.map((testimonial) => (
                    <div
                        key={testimonial.id}
                        className="bg-white/5 rounded-xl p-4 border border-white/10"
                    >
                        <div className="flex mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className="w-3 h-3 fill-yellow-400 text-yellow-400"
                                />
                            ))}
                        </div>
                        <p className="text-gray-300 text-xs mb-3 line-clamp-3">
                            "{testimonial.text}"
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">{testimonial.avatar}</span>
                            <div>
                                <p className="text-white text-xs font-bold">
                                    {testimonial.name}
                                </p>
                                <p className="text-gray-400 text-xs">
                                    {testimonial.university}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
