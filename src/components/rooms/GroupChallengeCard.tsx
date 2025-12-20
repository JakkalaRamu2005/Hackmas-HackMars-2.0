"use client";

import { motion } from "framer-motion";
import { Trophy, Calendar, Target, Gift } from "lucide-react";
import { GroupChallenge } from "@/lib/studyRooms";

interface GroupChallengeCardProps {
    challenge: GroupChallenge;
}

export const GroupChallengeCard = ({ challenge }: GroupChallengeCardProps) => {
    const progressPercentage = Math.round((challenge.progress / challenge.goal) * 100);
    const daysLeft = Math.ceil((new Date(challenge.deadline).getTime() - Date.now()) / 86400000);

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-5 h-5 text-christmas-gold" />
                        <h3 className="text-lg font-bold text-white">{challenge.title}</h3>
                    </div>
                    <p className="text-sm text-gray-300">{challenge.description}</p>
                </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-300">Progress</span>
                    <span className="text-christmas-gold font-bold">
                        {challenge.progress}/{challenge.goal}
                    </span>
                </div>
                <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-400">Time Left</span>
                    </div>
                    <p className="text-sm font-bold text-white">
                        {daysLeft > 0 ? `${daysLeft} days` : 'Expired'}
                    </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                        <Target className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-400">Participants</span>
                    </div>
                    <p className="text-sm font-bold text-white">{challenge.participants.length}</p>
                </div>
            </div>

            {/* Reward */}
            <div className="bg-gradient-to-r from-christmas-gold/20 to-yellow-500/20 border border-christmas-gold/30 rounded-xl p-3">
                <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-christmas-gold" />
                    <div className="flex-1">
                        <p className="text-xs text-gray-300">Reward</p>
                        <p className="text-sm font-bold text-christmas-gold">{challenge.reward}</p>
                    </div>
                </div>
            </div>

            {/* Status Badge */}
            {challenge.isCompleted && (
                <div className="mt-3 text-center">
                    <span className="inline-block bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">
                        ✓ Completed
                    </span>
                </div>
            )}
        </motion.div>
    );
};
