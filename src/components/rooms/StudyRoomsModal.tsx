"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Plus, Search, Filter } from "lucide-react";
import { StudyRoomCard, MemberCard } from "./StudyRoomCard";
import { GroupChallengeCard } from "./GroupChallengeCard";
import { CreateRoomModal } from "./CreateRoomModal";
import { studyRoomStorage, DEMO_ROOMS, DEMO_CHALLENGES, StudyRoom } from "@/lib/studyRooms";

interface StudyRoomsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const StudyRoomsModal = ({ isOpen, onClose }: StudyRoomsModalProps) => {
    const [activeTab, setActiveTab] = useState<'my-rooms' | 'discover' | 'challenges'>('my-rooms');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<StudyRoom | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [rooms] = useState(DEMO_ROOMS);
    const [myRoomIds] = useState(['room-1']);

    const myRooms = rooms.filter(room => myRoomIds.includes(room.id));
    const discoverRooms = rooms.filter(room => !myRoomIds.includes(room.id));
    const challenges = DEMO_CHALLENGES;

    const handleJoinRoom = (roomId: string) => {
        studyRoomStorage.joinRoom(roomId);
        // In a real app, this would update the state
        alert('🎉 Joined room successfully!');
    };

    const handleViewRoom = (room: StudyRoom) => {
        setSelectedRoom(room);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gradient-to-br from-christmas-green/10 to-christmas-red/10 backdrop-blur-xl border border-white/20 rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/20">
                            <div>
                                <h2 className="text-3xl font-bold text-white font-[family-name:var(--font-christmas)] flex items-center gap-2">
                                    🎄 Study Rooms
                                </h2>
                                <p className="text-gray-300 text-sm mt-1">
                                    Collaborate with friends and crush your goals together!
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center gap-2 px-6 pt-4 border-b border-white/10">
                            <TabButton
                                active={activeTab === 'my-rooms'}
                                onClick={() => setActiveTab('my-rooms')}
                                icon={<Users className="w-4 h-4" />}
                                label="My Rooms"
                                count={myRooms.length}
                            />
                            <TabButton
                                active={activeTab === 'discover'}
                                onClick={() => setActiveTab('discover')}
                                icon={<Search className="w-4 h-4" />}
                                label="Discover"
                                count={discoverRooms.length}
                            />
                            <TabButton
                                active={activeTab === 'challenges'}
                                onClick={() => setActiveTab('challenges')}
                                icon={<Filter className="w-4 h-4" />}
                                label="Challenges"
                                count={challenges.length}
                            />
                            <div className="flex-1" />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowCreateModal(true)}
                                className="flex items-center gap-2 bg-christmas-gold text-christmas-green px-4 py-2 rounded-xl font-bold hover:bg-yellow-500 transition-all mb-2"
                            >
                                <Plus className="w-4 h-4" />
                                Create Room
                            </motion.button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* Room Details View */}
                            {selectedRoom ? (
                                <RoomDetailsView
                                    room={selectedRoom}
                                    onBack={() => setSelectedRoom(null)}
                                    challenges={challenges.filter(c => c.roomId === selectedRoom.id)}
                                />
                            ) : (
                                <>
                                    {/* My Rooms Tab */}
                                    {activeTab === 'my-rooms' && (
                                        <div className="space-y-4">
                                            {myRooms.length === 0 ? (
                                                <EmptyState
                                                    icon="🎄"
                                                    title="No rooms yet"
                                                    description="Create or join a study room to get started!"
                                                    action="Create Room"
                                                    onAction={() => setShowCreateModal(true)}
                                                />
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {myRooms.map(room => (
                                                        <StudyRoomCard
                                                            key={room.id}
                                                            room={room}
                                                            onView={() => handleViewRoom(room)}
                                                            isMember={true}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Discover Tab */}
                                    {activeTab === 'discover' && (
                                        <div className="space-y-4">
                                            {discoverRooms.length === 0 ? (
                                                <EmptyState
                                                    icon="🔍"
                                                    title="No rooms available"
                                                    description="Be the first to create a study room!"
                                                    action="Create Room"
                                                    onAction={() => setShowCreateModal(true)}
                                                />
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {discoverRooms.map(room => (
                                                        <StudyRoomCard
                                                            key={room.id}
                                                            room={room}
                                                            onJoin={() => handleJoinRoom(room.id)}
                                                            onView={() => handleViewRoom(room)}
                                                            isMember={false}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Challenges Tab */}
                                    {activeTab === 'challenges' && (
                                        <div className="space-y-4">
                                            {challenges.length === 0 ? (
                                                <EmptyState
                                                    icon="🏆"
                                                    title="No active challenges"
                                                    description="Join a room to participate in group challenges!"
                                                />
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {challenges.map(challenge => (
                                                        <GroupChallengeCard
                                                            key={challenge.id}
                                                            challenge={challenge}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>

                    {/* Create Room Modal */}
                    <CreateRoomModal
                        isOpen={showCreateModal}
                        onClose={() => setShowCreateModal(false)}
                        onCreate={(room) => {
                            studyRoomStorage.createRoom(room);
                            setShowCreateModal(false);
                            alert('🎉 Room created successfully!');
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Tab Button Component
interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    count?: number;
}

const TabButton = ({ active, onClick, icon, label, count }: TabButtonProps) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-t-xl font-bold transition-all ${active
                ? 'bg-white/10 text-white border-b-2 border-christmas-gold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
    >
        {icon}
        <span>{label}</span>
        {count !== undefined && (
            <span className="text-xs bg-christmas-gold/20 text-christmas-gold px-2 py-0.5 rounded-full">
                {count}
            </span>
        )}
    </button>
);

// Empty State Component
interface EmptyStateProps {
    icon: string;
    title: string;
    description: string;
    action?: string;
    onAction?: () => void;
}

const EmptyState = ({ icon, title, description, action, onAction }: EmptyStateProps) => (
    <div className="text-center py-12">
        <div className="text-6xl mb-4">{icon}</div>
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 mb-6">{description}</p>
        {action && onAction && (
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAction}
                className="bg-christmas-gold text-christmas-green px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-all"
            >
                {action}
            </motion.button>
        )}
    </div>
);

// Room Details View Component
interface RoomDetailsViewProps {
    room: StudyRoom;
    onBack: () => void;
    challenges: typeof DEMO_CHALLENGES;
}

const RoomDetailsView = ({ room, onBack, challenges }: RoomDetailsViewProps) => (
    <div className="space-y-6">
        <button
            onClick={onBack}
            className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
        >
            ← Back to Rooms
        </button>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{room.name}</h3>
                    <p className="text-gray-300">{room.description}</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm mb-1">Members</p>
                    <p className="text-2xl font-bold text-white">{room.members.length}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm mb-1">Progress</p>
                    <p className="text-2xl font-bold text-christmas-gold">
                        {Math.round((room.groupProgress / room.groupGoal) * 100)}%
                    </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm mb-1">Tasks Done</p>
                    <p className="text-2xl font-bold text-white">{room.groupProgress}</p>
                </div>
            </div>
        </div>

        {/* Members */}
        <div>
            <h4 className="text-xl font-bold text-white mb-4">Members ({room.members.length})</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {room.members.map(member => (
                    <MemberCard
                        key={member.id}
                        member={member}
                        isCurrentUser={member.name === 'You'}
                    />
                ))}
            </div>
        </div>

        {/* Active Challenges */}
        {challenges.length > 0 && (
            <div>
                <h4 className="text-xl font-bold text-white mb-4">Active Challenges</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {challenges.map(challenge => (
                        <GroupChallengeCard key={challenge.id} challenge={challenge} />
                    ))}
                </div>
            </div>
        )}
    </div>
);
