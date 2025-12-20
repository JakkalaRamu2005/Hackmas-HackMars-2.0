// Collaborative Study Rooms - Types and Utilities

export interface StudyRoom {
    id: string;
    name: string;
    description: string;
    createdBy: string;
    createdAt: string;
    members: RoomMember[];
    groupProgress: number; // Total tasks completed by all members
    groupGoal: number; // Total tasks goal (members * 24)
    theme: 'winter' | 'christmas' | 'snowman' | 'gingerbread';
    isPublic: boolean;
}

export interface RoomMember {
    id: string;
    name: string;
    avatar?: string;
    tasksCompleted: number;
    streak: number;
    points: number;
    lastActive: string;
    role: 'owner' | 'member';
}

export interface GroupChallenge {
    id: string;
    roomId: string;
    title: string;
    description: string;
    goal: number; // Total tasks to complete as a group
    progress: number; // Current progress
    reward: string;
    deadline: string;
    isCompleted: boolean;
    participants: string[]; // Member IDs
}

const STORAGE_KEY_ROOMS = 'study_rooms';
const STORAGE_KEY_MY_ROOMS = 'my_study_rooms';

// Mock data for demo purposes
export const DEMO_ROOMS: StudyRoom[] = [
    {
        id: 'room-1',
        name: "Santa's Study Squad",
        description: "Crushing finals together! 🎅",
        createdBy: 'user-1',
        createdAt: new Date().toISOString(),
        members: [
            {
                id: 'user-1',
                name: 'You',
                tasksCompleted: 12,
                streak: 5,
                points: 150,
                lastActive: new Date().toISOString(),
                role: 'owner',
            },
            {
                id: 'user-2',
                name: 'Study Buddy #1',
                tasksCompleted: 8,
                streak: 3,
                points: 95,
                lastActive: new Date(Date.now() - 3600000).toISOString(),
                role: 'member',
            },
            {
                id: 'user-3',
                name: 'Study Buddy #2',
                tasksCompleted: 15,
                streak: 7,
                points: 200,
                lastActive: new Date(Date.now() - 7200000).toISOString(),
                role: 'member',
            },
        ],
        groupProgress: 35,
        groupGoal: 72, // 3 members * 24 tasks
        theme: 'christmas',
        isPublic: false,
    },
    {
        id: 'room-2',
        name: "Winter Warriors",
        description: "Exam prep with a festive twist! ❄️",
        createdBy: 'user-4',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        members: [
            {
                id: 'user-4',
                name: 'Room Leader',
                tasksCompleted: 20,
                streak: 10,
                points: 280,
                lastActive: new Date().toISOString(),
                role: 'owner',
            },
            {
                id: 'user-5',
                name: 'Member A',
                tasksCompleted: 10,
                streak: 4,
                points: 120,
                lastActive: new Date(Date.now() - 1800000).toISOString(),
                role: 'member',
            },
        ],
        groupProgress: 30,
        groupGoal: 48,
        theme: 'winter',
        isPublic: true,
    },
];

export const DEMO_CHALLENGES: GroupChallenge[] = [
    {
        id: 'challenge-1',
        roomId: 'room-1',
        title: "Decorate the Class Tree Together",
        description: "Complete 50 tasks as a group to unlock a fully decorated Christmas tree!",
        goal: 50,
        progress: 35,
        reward: "🎄 Golden Christmas Tree Badge",
        deadline: new Date(Date.now() + 604800000).toISOString(), // 7 days
        isCompleted: false,
        participants: ['user-1', 'user-2', 'user-3'],
    },
    {
        id: 'challenge-2',
        roomId: 'room-1',
        title: "Week-Long Study Streak",
        description: "All members maintain a 7-day streak",
        goal: 7,
        progress: 5,
        reward: "🔥 Fire Squad Badge",
        deadline: new Date(Date.now() + 172800000).toISOString(), // 2 days
        isCompleted: false,
        participants: ['user-1', 'user-2', 'user-3'],
    },
];

// Storage functions
export const studyRoomStorage = {
    // Get all available rooms
    getRooms: (): StudyRoom[] => {
        try {
            const data = localStorage.getItem(STORAGE_KEY_ROOMS);
            return data ? JSON.parse(data) : DEMO_ROOMS;
        } catch (error) {
            console.error('Failed to load rooms:', error);
            return DEMO_ROOMS;
        }
    },

    // Get rooms user is a member of
    getMyRooms: (): string[] => {
        try {
            const data = localStorage.getItem(STORAGE_KEY_MY_ROOMS);
            return data ? JSON.parse(data) : ['room-1'];
        } catch (error) {
            console.error('Failed to load my rooms:', error);
            return ['room-1'];
        }
    },

    // Save rooms
    saveRooms: (rooms: StudyRoom[]): void => {
        try {
            localStorage.setItem(STORAGE_KEY_ROOMS, JSON.stringify(rooms));
        } catch (error) {
            console.error('Failed to save rooms:', error);
        }
    },

    // Join a room
    joinRoom: (roomId: string): boolean => {
        try {
            const myRooms = studyRoomStorage.getMyRooms();
            if (!myRooms.includes(roomId)) {
                myRooms.push(roomId);
                localStorage.setItem(STORAGE_KEY_MY_ROOMS, JSON.stringify(myRooms));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to join room:', error);
            return false;
        }
    },

    // Leave a room
    leaveRoom: (roomId: string): boolean => {
        try {
            const myRooms = studyRoomStorage.getMyRooms();
            const filtered = myRooms.filter(id => id !== roomId);
            localStorage.setItem(STORAGE_KEY_MY_ROOMS, JSON.stringify(filtered));
            return true;
        } catch (error) {
            console.error('Failed to leave room:', error);
            return false;
        }
    },

    // Create a new room
    createRoom: (room: Omit<StudyRoom, 'id' | 'createdAt'>): StudyRoom => {
        const newRoom: StudyRoom = {
            ...room,
            id: `room-${Date.now()}`,
            createdAt: new Date().toISOString(),
        };

        const rooms = studyRoomStorage.getRooms();
        rooms.push(newRoom);
        studyRoomStorage.saveRooms(rooms);
        studyRoomStorage.joinRoom(newRoom.id);

        return newRoom;
    },
};

// Helper functions
export const calculateGroupProgress = (members: RoomMember[]): number => {
    return members.reduce((sum, member) => sum + member.tasksCompleted, 0);
};

export const getTopPerformer = (members: RoomMember[]): RoomMember | null => {
    if (members.length === 0) return null;
    return members.reduce((top, member) =>
        member.tasksCompleted > top.tasksCompleted ? member : top
    );
};

export const getRoomThemeEmoji = (theme: StudyRoom['theme']): string => {
    const themes = {
        winter: '❄️',
        christmas: '🎄',
        snowman: '⛄',
        gingerbread: '🍪',
    };
    return themes[theme];
};

export const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
};
