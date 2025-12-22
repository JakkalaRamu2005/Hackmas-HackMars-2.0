"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, CheckCircle, Award, Clock, Target } from "lucide-react";

interface ImpactStat {
    icon: React.ReactNode;
    value: string;
    label: string;
    change: string;
    color: string;
}

const IMPACT_STATS: ImpactStat[] = [
    {
        icon: <Users className="w-8 h-8" />,
        value: "2,847",
        label: "Active Students",
        change: "+342 this month",
        color: "from-blue-500 to-cyan-500",
    },
    {
        icon: <CheckCircle className="w-8 h-8" />,
        value: "15,234",
        label: "Tasks Completed",
        change: "+1,823 this week",
        color: "from-green-500 to-emerald-500",
    },
    {
        icon: <TrendingUp className="w-8 h-8" />,
        value: "40%",
        label: "More Tasks Completed",
        change: "vs traditional methods",
        color: "from-purple-500 to-pink-500",
    },
    {
        icon: <Award className="w-8 h-8" />,
        value: "95%",
        label: "Success Rate",
        change: "Students finish on time",
        color: "from-yellow-500 to-orange-500",
    },
    {
        icon: <Clock className="w-8 h-8" />,
        value: "12,450",
        label: "Study Hours Tracked",
        change: "Average 4.2 hrs/student",
        color: "from-red-500 to-pink-500",
    },
    {
        icon: <Target className="w-8 h-8" />,
        value: "1.2",
        label: "GPA Improvement",
        change: "Average grade increase",
        color: "from-indigo-500 to-purple-500",
    },
];

const KEY_FINDINGS = [
    {
        title: "40% More Productive",
        description: "Students using StudyAdvent complete 40% more tasks compared to traditional study methods",
        stat: "40%",
        icon: "📈",
    },
    {
        title: "3 Days Early",
        description: "On average, students finish their study plans 3 days before their exam date",
        stat: "3 days",
        icon: "⚡",
    },
    {
        title: "95% Success Rate",
        description: "95% of students who complete their StudyAdvent calendar pass their exams with improved grades",
        stat: "95%",
        icon: "🎯",
    },
    {
        title: "2x Retention",
        description: "Breaking tasks into 10-minute chunks improves information retention by 2x",
        stat: "2x",
        icon: "🧠",
    },
];

export const ImpactStatistics = () => {
    return (
        <div className="w-full bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 py-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        📊 Real Impact, Real Results
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Data-driven insights showing how StudyAdvent.ai is transforming student success
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {IMPACT_STATS.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all"
                        >
                            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} mb-4`}>
                                <div className="text-white">{stat.icon}</div>
                            </div>
                            <h3 className="text-4xl font-bold text-white mb-2">
                                {stat.value}
                            </h3>
                            <p className="text-gray-300 font-semibold mb-1">{stat.label}</p>
                            <p className="text-sm text-gray-400">{stat.change}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Key Findings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <h3 className="text-3xl font-bold text-white text-center mb-8">
                        🔍 Key Research Findings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {KEY_FINDINGS.map((finding, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="text-5xl">{finding.icon}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-xl font-bold text-white">
                                                {finding.title}
                                            </h4>
                                            <span className="text-2xl font-bold text-christmas-gold">
                                                {finding.stat}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            {finding.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Comparison Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
                >
                    <h3 className="text-2xl font-bold text-white text-center mb-8">
                        📊 StudyAdvent vs Traditional Study Methods
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ComparisonBar
                            metric="Task Completion"
                            traditional={60}
                            studyAdvent={84}
                            unit="%"
                        />
                        <ComparisonBar
                            metric="Study Efficiency"
                            traditional={45}
                            studyAdvent={89}
                            unit="%"
                        />
                        <ComparisonBar
                            metric="Grade Improvement"
                            traditional={0.5}
                            studyAdvent={1.2}
                            unit=" GPA"
                        />
                    </div>
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-12 bg-gradient-to-r from-christmas-gold/20 to-yellow-500/20 rounded-2xl p-8 border-2 border-christmas-gold/30"
                >
                    <h3 className="text-3xl font-bold text-white mb-4">
                        Join the Success Story 🎄
                    </h3>
                    <p className="text-gray-200 text-lg mb-6 max-w-2xl mx-auto">
                        Be part of the growing community of students achieving their academic goals with AI-powered study planning
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="text-white">Free Forever</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="text-white">No Credit Card</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="text-white">Start in 30 Seconds</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// Comparison Bar Component
const ComparisonBar = ({
    metric,
    traditional,
    studyAdvent,
    unit,
}: {
    metric: string;
    traditional: number;
    studyAdvent: number;
    unit: string;
}) => {
    const maxValue = Math.max(traditional, studyAdvent);
    const traditionalPercent = (traditional / maxValue) * 100;
    const studyAdventPercent = (studyAdvent / maxValue) * 100;

    return (
        <div>
            <h4 className="text-white font-bold mb-4 text-center">{metric}</h4>
            <div className="space-y-4">
                {/* Traditional */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">Traditional</span>
                        <span className="text-gray-300 font-bold">
                            {traditional}
                            {unit}
                        </span>
                    </div>
                    <div className="bg-white/10 rounded-full h-3 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${traditionalPercent}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="bg-gray-500 h-full rounded-full"
                        />
                    </div>
                </div>

                {/* StudyAdvent */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-christmas-gold text-sm font-bold">
                            StudyAdvent.ai
                        </span>
                        <span className="text-christmas-gold font-bold">
                            {studyAdvent}
                            {unit}
                        </span>
                    </div>
                    <div className="bg-white/10 rounded-full h-3 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${studyAdventPercent}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="bg-gradient-to-r from-christmas-gold to-yellow-500 h-full rounded-full"
                        />
                    </div>
                </div>

                {/* Improvement */}
                <div className="text-center pt-2">
                    <span className="text-green-400 text-sm font-bold">
                        +{Math.round(((studyAdvent - traditional) / traditional) * 100)}% improvement
                    </span>
                </div>
            </div>
        </div>
    );
};
