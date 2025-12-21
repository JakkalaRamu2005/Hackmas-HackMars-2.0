"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Lock, Check, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import {
    REWARDS,
    Reward,
    RewardCategory,
    RewardShopState,
    rewardStorage,
    canAffordReward,
    getRewardsByCategory,
} from "@/lib/rewards";

interface RewardShopModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentPoints: number;
    onPurchase: (reward: Reward) => void;
}

const CATEGORY_LABELS: Record<RewardCategory, string> = {
    decorations: '🎄 Tree Decorations',
    snowEffects: '❄️ Snow Effects',
    music: '🎵 Background Music',
    themes: '🎨 Holiday Themes',
};

export const RewardShopModal = ({ isOpen, onClose, currentPoints, onPurchase }: RewardShopModalProps) => {
    const [selectedCategory, setSelectedCategory] = useState<RewardCategory>('decorations');
    const [shopState, setShopState] = useState<RewardShopState>(rewardStorage.load());
    const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
    const [showPurchaseConfirm, setShowPurchaseConfirm] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShopState(rewardStorage.load());
        }
    }, [isOpen]);

    const handlePurchase = (reward: Reward) => {
        if (!canAffordReward(reward, currentPoints)) {
            return;
        }

        // Unlock the reward
        const newState = rewardStorage.unlockReward(reward.id);
        setShopState(newState);

        // Trigger confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#D42426', '#165B33', '#F8B229', '#FFFFFF'],
        });

        // Call parent callback
        onPurchase(reward);

        // Close confirmation
        setShowPurchaseConfirm(false);
        setSelectedReward(null);
    };

    const handleEquip = (reward: Reward) => {
        const newState = rewardStorage.equipReward(reward.id, reward.category);
        setShopState(newState);
    };

    const handleUnequip = (reward: Reward) => {
        const newState = rewardStorage.unequipReward(reward.category);
        setShopState(newState);
    };

    const isRewardUnlocked = (rewardId: string) => {
        return shopState.unlockedRewards.includes(rewardId);
    };

    const isRewardEquipped = (rewardId: string) => {
        return Object.values(shopState.equippedRewards).includes(rewardId);
    };

    const categoryRewards = getRewardsByCategory(selectedCategory);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gradient-to-br from-christmas-green/10 to-christmas-red/10 backdrop-blur-xl border border-white/20 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/20">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-christmas-gold/20 rounded-xl">
                                    <ShoppingBag className="w-6 h-6 text-christmas-gold" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-christmas)]">
                                        🎁 Reward Shop
                                    </h3>
                                    <p className="text-sm text-gray-300">
                                        Your Points: <span className="text-christmas-gold font-bold">{currentPoints}</span> ⭐
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

                        {/* Category Tabs */}
                        <div className="flex gap-2 p-4 border-b border-white/20 overflow-x-auto">
                            {(Object.keys(CATEGORY_LABELS) as RewardCategory[]).map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${selectedCategory === category
                                            ? 'bg-christmas-gold text-christmas-green font-bold'
                                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                        }`}
                                >
                                    {CATEGORY_LABELS[category]}
                                </button>
                            ))}
                        </div>

                        {/* Rewards Grid */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {categoryRewards.map((reward) => {
                                    const unlocked = isRewardUnlocked(reward.id);
                                    const equipped = isRewardEquipped(reward.id);
                                    const canAfford = canAffordReward(reward, currentPoints);

                                    return (
                                        <motion.div
                                            key={reward.id}
                                            whileHover={{ scale: 1.02 }}
                                            className={`relative p-4 rounded-xl border-2 transition-all ${equipped
                                                    ? 'bg-christmas-gold/20 border-christmas-gold'
                                                    : unlocked
                                                        ? 'bg-white/10 border-white/30'
                                                        : 'bg-white/5 border-white/20'
                                                }`}
                                        >
                                            {/* Equipped Badge */}
                                            {equipped && (
                                                <div className="absolute top-2 right-2 px-2 py-1 bg-christmas-gold text-christmas-green text-xs font-bold rounded-full flex items-center gap-1">
                                                    <Check className="w-3 h-3" />
                                                    Equipped
                                                </div>
                                            )}

                                            {/* Icon */}
                                            <div className="text-5xl mb-3 text-center">{reward.icon}</div>

                                            {/* Name */}
                                            <h4 className="text-lg font-bold text-white mb-1 text-center">
                                                {reward.name}
                                            </h4>

                                            {/* Description */}
                                            <p className="text-sm text-gray-300 mb-3 text-center">
                                                {reward.description}
                                            </p>

                                            {/* Cost */}
                                            <div className="flex items-center justify-center gap-2 mb-3">
                                                <span className={`text-lg font-bold ${unlocked ? 'text-green-400' : canAfford ? 'text-christmas-gold' : 'text-red-400'
                                                    }`}>
                                                    {unlocked ? 'Unlocked!' : `${reward.cost} ⭐`}
                                                </span>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2">
                                                {!unlocked ? (
                                                    <button
                                                        onClick={() => {
                                                            if (canAfford) {
                                                                setSelectedReward(reward);
                                                                setShowPurchaseConfirm(true);
                                                            }
                                                        }}
                                                        disabled={!canAfford}
                                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${canAfford
                                                                ? 'bg-christmas-gold text-christmas-green hover:bg-yellow-500'
                                                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                            }`}
                                                    >
                                                        {canAfford ? (
                                                            <>
                                                                <ShoppingBag className="w-4 h-4" />
                                                                Purchase
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Lock className="w-4 h-4" />
                                                                Locked
                                                            </>
                                                        )}
                                                    </button>
                                                ) : equipped ? (
                                                    <button
                                                        onClick={() => handleUnequip(reward)}
                                                        className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-all"
                                                    >
                                                        Unequip
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleEquip(reward)}
                                                        className="flex-1 px-4 py-2 bg-christmas-green hover:bg-green-700 text-white rounded-lg font-bold transition-all"
                                                    >
                                                        Equip
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Purchase Confirmation Modal */}
                        <AnimatePresence>
                            {showPurchaseConfirm && selectedReward && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                                    onClick={() => setShowPurchaseConfirm(false)}
                                >
                                    <motion.div
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0.9 }}
                                        onClick={(e) => e.stopPropagation()}
                                        className="bg-gradient-to-br from-christmas-green/20 to-christmas-red/20 backdrop-blur-xl border-2 border-white/30 rounded-2xl p-6 max-w-md mx-4"
                                    >
                                        <div className="text-center">
                                            <div className="text-6xl mb-4">{selectedReward.icon}</div>
                                            <h3 className="text-2xl font-bold text-white mb-2">
                                                Purchase {selectedReward.name}?
                                            </h3>
                                            <p className="text-gray-300 mb-4">
                                                This will cost <span className="text-christmas-gold font-bold">{selectedReward.cost} ⭐</span>
                                            </p>
                                            <p className="text-sm text-gray-400 mb-6">
                                                You'll have <span className="text-white font-bold">{currentPoints - selectedReward.cost} ⭐</span> remaining
                                            </p>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setShowPurchaseConfirm(false)}
                                                    className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-all"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handlePurchase(selectedReward)}
                                                    className="flex-1 px-4 py-2 bg-christmas-gold hover:bg-yellow-500 text-christmas-green rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Sparkles className="w-4 h-4" />
                                                    Confirm
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Floating Shop Button
export const RewardShopButton = ({ onClick, unlockedCount }: { onClick: () => void; unlockedCount: number }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className="fixed bottom-6 left-6 z-40 p-4 bg-gradient-to-br from-christmas-gold to-yellow-600 text-christmas-green rounded-full shadow-[0_0_30px_rgba(248,178,41,0.5)] hover:shadow-[0_0_40px_rgba(248,178,41,0.7)] transition-all"
        >
            <ShoppingBag className="w-6 h-6" />
            {unlockedCount > 0 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-christmas-red text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {unlockedCount}
                </div>
            )}
        </motion.button>
    );
};
