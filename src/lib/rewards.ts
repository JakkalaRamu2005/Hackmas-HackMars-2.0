// Reward Shop System

export type RewardCategory = 'decorations' | 'snowEffects' | 'music' | 'themes';

export interface Reward {
    id: string;
    name: string;
    description: string;
    category: RewardCategory;
    cost: number;
    icon: string;
    preview?: string;
    unlocked: boolean;
    equipped?: boolean;
}

export interface RewardShopState {
    unlockedRewards: string[];
    equippedRewards: {
        decoration?: string;
        snowEffect?: string;
        music?: string;
        theme?: string;
    };
}

// Available Rewards
export const REWARDS: Reward[] = [
    // Tree Decorations
    {
        id: 'decoration-candy-cane',
        name: 'Candy Cane Ornaments',
        description: 'Classic red and white striped candy canes',
        category: 'decorations',
        cost: 50,
        icon: '🍬',
        unlocked: false,
    },
    {
        id: 'decoration-star',
        name: 'Golden Stars',
        description: 'Shimmering golden star ornaments',
        category: 'decorations',
        cost: 75,
        icon: '⭐',
        unlocked: false,
    },
    {
        id: 'decoration-gingerbread',
        name: 'Gingerbread Cookies',
        description: 'Adorable gingerbread man decorations',
        category: 'decorations',
        cost: 100,
        icon: '🍪',
        unlocked: false,
    },
    {
        id: 'decoration-snowflake',
        name: 'Crystal Snowflakes',
        description: 'Delicate crystal snowflake ornaments',
        category: 'decorations',
        cost: 125,
        icon: '❄️',
        unlocked: false,
    },
    {
        id: 'decoration-bells',
        name: 'Jingle Bells',
        description: 'Festive golden bells that jingle',
        category: 'decorations',
        cost: 150,
        icon: '🔔',
        unlocked: false,
    },

    // Snow Effects
    {
        id: 'snow-sparkle',
        name: 'Sparkle Snow',
        description: 'Magical sparkling snowflakes',
        category: 'snowEffects',
        cost: 100,
        icon: '✨',
        unlocked: false,
    },
    {
        id: 'snow-heavy',
        name: 'Heavy Snowfall',
        description: 'Intense winter blizzard effect',
        category: 'snowEffects',
        cost: 150,
        icon: '🌨️',
        unlocked: false,
    },
    {
        id: 'snow-rainbow',
        name: 'Rainbow Snow',
        description: 'Colorful magical snowflakes',
        category: 'snowEffects',
        cost: 200,
        icon: '🌈',
        unlocked: false,
    },
    {
        id: 'snow-gentle',
        name: 'Gentle Flurries',
        description: 'Soft, peaceful snowfall',
        category: 'snowEffects',
        cost: 75,
        icon: '❄️',
        unlocked: false,
    },

    // Background Music
    {
        id: 'music-jingle-bells',
        name: 'Jingle Bells',
        description: 'Classic Christmas tune',
        category: 'music',
        cost: 150,
        icon: '🎵',
        unlocked: false,
    },
    {
        id: 'music-silent-night',
        name: 'Silent Night',
        description: 'Peaceful Christmas carol',
        category: 'music',
        cost: 150,
        icon: '🎶',
        unlocked: false,
    },
    {
        id: 'music-lofi-christmas',
        name: 'Lo-fi Christmas',
        description: 'Chill Christmas beats for studying',
        category: 'music',
        cost: 200,
        icon: '🎧',
        unlocked: false,
    },
    {
        id: 'music-deck-the-halls',
        name: 'Deck the Halls',
        description: 'Upbeat festive melody',
        category: 'music',
        cost: 150,
        icon: '🎼',
        unlocked: false,
    },

    // Themes (Inclusive)
    {
        id: 'theme-hanukkah',
        name: 'Hanukkah Theme',
        description: 'Blue and white Festival of Lights',
        category: 'themes',
        cost: 250,
        icon: '🕎',
        unlocked: false,
    },
    {
        id: 'theme-kwanzaa',
        name: 'Kwanzaa Theme',
        description: 'Red, black, and green celebration',
        category: 'themes',
        cost: 250,
        icon: '🕯️',
        unlocked: false,
    },
    {
        id: 'theme-winter-wonderland',
        name: 'Winter Wonderland',
        description: 'Icy blue winter theme',
        category: 'themes',
        cost: 200,
        icon: '⛄',
        unlocked: false,
    },
    {
        id: 'theme-new-year',
        name: 'New Year Theme',
        description: 'Sparkling gold and silver',
        category: 'themes',
        cost: 300,
        icon: '🎊',
        unlocked: false,
    },
];

// Storage functions
const STORAGE_KEY = 'studyadvent_rewards';

export const rewardStorage = {
    load: (): RewardShopState => {
        if (typeof window === 'undefined') {
            return {
                unlockedRewards: [],
                equippedRewards: {},
            };
        }

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse rewards:', e);
            }
        }

        return {
            unlockedRewards: [],
            equippedRewards: {},
        };
    },

    save: (state: RewardShopState) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },

    unlockReward: (rewardId: string) => {
        const state = rewardStorage.load();
        if (!state.unlockedRewards.includes(rewardId)) {
            state.unlockedRewards.push(rewardId);
            rewardStorage.save(state);
        }
        return state;
    },

    equipReward: (rewardId: string, category: RewardCategory) => {
        const state = rewardStorage.load();

        // Map category to equipped key
        const categoryMap: Record<RewardCategory, keyof RewardShopState['equippedRewards']> = {
            decorations: 'decoration',
            snowEffects: 'snowEffect',
            music: 'music',
            themes: 'theme',
        };

        const key = categoryMap[category];
        state.equippedRewards[key] = rewardId;
        rewardStorage.save(state);
        return state;
    },

    unequipReward: (category: RewardCategory) => {
        const state = rewardStorage.load();

        const categoryMap: Record<RewardCategory, keyof RewardShopState['equippedRewards']> = {
            decorations: 'decoration',
            snowEffects: 'snowEffect',
            music: 'music',
            themes: 'theme',
        };

        const key = categoryMap[category];
        delete state.equippedRewards[key];
        rewardStorage.save(state);
        return state;
    },
};

// Helper functions
export const getRewardsByCategory = (category: RewardCategory): Reward[] => {
    return REWARDS.filter(r => r.category === category);
};

export const getRewardById = (id: string): Reward | undefined => {
    return REWARDS.find(r => r.id === id);
};

export const canAffordReward = (reward: Reward, currentPoints: number): boolean => {
    return currentPoints >= reward.cost;
};

export const getRewardsWithState = (shopState: RewardShopState): Reward[] => {
    return REWARDS.map(reward => ({
        ...reward,
        unlocked: shopState.unlockedRewards.includes(reward.id),
        equipped: Object.values(shopState.equippedRewards).includes(reward.id),
    }));
};
