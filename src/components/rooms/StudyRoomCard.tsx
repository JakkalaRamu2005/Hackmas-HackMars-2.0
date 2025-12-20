"use client";

import { motion } from "framer-motion";
import { Users, Trophy, Flame, Target, Crown, Clock } from "lucide-react";
import { StudyRoom, RoomMember, getTopPerformer, formatTimeAgo } from "@/lib/studyRooms";

interface StudyRoomCardProps {
    room: StudyRoom;
    onJoin?: () => void;
    onView?: () => void;
    isMember?: boolean;
}

export const StudyRoomCard = ({ room, onJoin, onView, isMember = false }: StudyRoomCardProps) => {
    const progressPercentage = Math.round((room.groupProgress / room.groupGoal) * 100);
    const topPerformer = getTopPerformer(room.members);

    const themeColors = {
        winter: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
        christmas: 'from-christmas-red/20 to-christmas-green/20 border-christmas-gold/30',
        snowman: 'from-white/20 to-blue-300/20 border-white/30',
        gingerbread: 'from-orange-500/20 to-amber-700/20 border-orange-500/30',
    };

    const themeEmojis = {
        winter: '❄️',
        christmas: '🎄',
        snowman: '⛄',
        gingerbread: '🍪',
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className={`bg-gradient-to-br ${themeColors[room.theme]} backdrop-blur-md border rounded-2xl p-6 cursor-pointer`}
            onClick={onView}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{themeEmojis[room.theme]}</span>
                        <h3 className="text-xl font-bold text-white">{room.name}</h3>
                        {room.isPublic && (
                            <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full border border-green-500/30">
                                Public
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-300">{room.description}</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-300">Group Progress</span>
                    <span className="text-christmas-gold font-bold">
                        {room.groupProgress}/{room.groupGoal} tasks
                    </span>
                </div>
                <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-christmas-red to-christmas-gold rounded-full"
                    />
                </div>
                <p className="text-xs text-gray-400 mt-1 text-right">{progressPercentage}% complete</p>
            </div>

            {/* Members */}
            <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-300" />
                    <span className="text-sm text-gray-300">{room.members.length} members</span>
                </div>
                {topPerformer && (
                    <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-christmas-gold" />
                        <span className="text-sm text-christmas-gold">{topPerformer.name}</span>
                    </div>
                )}
            </div>

            {/* Member Avatars */}
            <div className="flex items-center gap-2 mb-4">
                {room.members.slice(0, 5).map((member, index) => (
                    <div
                        key={member.id}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-christmas-red to-christmas-gold flex items-center justify-center text-white text-xs font-bold border-2 border-white/20"
                        style={{ marginLeft: index > 0 ? '-8px' : '0', zIndex: 5 - index }}
                        title={member.name}
                    >
                        {member.name.charAt(0).toUpperCase()}
                    </div>
                ))}
                {room.members.length > 5 && (
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold border-2 border-white/20" style={{ marginLeft: '-8px' }}>
                        +{room.members.length - 5}
                    </div>
                )}
            </div>

            {/* Action Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                    e.stopPropagation();
                    if (isMember) {
                        onView?.();
                    } else {
                        onJoin?.();
                    }
                }}
                className={`w-full px-4 py-2 rounded-xl font-bold transition-all ${isMember
                        ? 'bg-christmas-green text-white hover:bg-green-800'
                        : 'bg-christmas-gold text-christmas-green hover:bg-yellow-500'
                    }`}
            >
                {isMember ? '📖 View Room' : '🎁 Join Room'}
            </motion.button>
        </motion.div>
    );
};

interface MemberCardProps {
    member: RoomMember;
    isCurrentUser?: boolean;
}

export const MemberCard = ({ member, isCurrentUser = false }: MemberCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4"
        >
            <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-christmas-red to-christmas-gold flex items-center justify-center text-white text-lg font-bold">
                    {member.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h4 className="text-white font-bold">{member.name}</h4>
                        {member.role === 'owner' && (
                            <Crown className="w-4 h-4 text-christmas-gold" />
                        )}
                        {isCurrentUser && (
                            <span className="text-xs bg-christmas-gold/20 text-christmas-gold px-2 py-0.5 rounded-full">
                                You
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(member.lastActive)}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/5 rounded-lg p-2 text-center">
                    <Target className="w-4 h-4 text-christmas-gold mx-auto mb-1" />
                    <p className="text-xs text-gray-400">Tasks</p>
                    <p className="text-sm font-bold text-white">{member.tasksCompleted}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2 text-center">
                    <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">Streak</p>
                    <p className="text-sm font-bold text-white">{member.streak}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2 text-center">
                    <Trophy className="w-4 h-4 text-christmas-gold mx-auto mb-1" />
                    <p className="text-xs text-gray-400">Points</p>
                    <p className="text-sm font-bold text-white">{member.points}</p>
                </div>
            </div>
        </motion.div>
    );
};
