import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    created_at: string;
    updated_at: string;
}

export interface UserProgress {
    id: string;
    user_id: string;
    tasks: any;
    completed_count: number;
    syllabus_text: string;
    gamification: any;
    analytics: any;
    last_updated: string;
    created_at: string;
}

// User operations
export const userService = {
    // Create or update user
    async upsertUser(userData: {
        id: string;
        email: string;
        name: string;
        image?: string;
    }): Promise<User | null> {
        const { data, error } = await supabase
            .from('users')
            .upsert(
                {
                    id: userData.id,
                    email: userData.email,
                    name: userData.name,
                    image: userData.image,
                    updated_at: new Date().toISOString(),
                },
                {
                    onConflict: 'id',
                }
            )
            .select()
            .single();

        if (error) {
            console.error('Error upserting user:', error);
            return null;
        }

        return data;
    },

    // Get user by ID
    async getUser(userId: string): Promise<User | null> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching user:', error);
            return null;
        }

        return data;
    },

    // Save user progress
    async saveProgress(userId: string, progressData: {
        tasks: any;
        completed_count: number;
        syllabus_text: string;
        gamification: any;
        analytics: any;
    }): Promise<UserProgress | null> {
        const { data, error } = await supabase
            .from('user_progress')
            .upsert(
                {
                    user_id: userId,
                    tasks: progressData.tasks,
                    completed_count: progressData.completed_count,
                    syllabus_text: progressData.syllabus_text,
                    gamification: progressData.gamification,
                    analytics: progressData.analytics,
                    last_updated: new Date().toISOString(),
                },
                {
                    onConflict: 'user_id',
                }
            )
            .select()
            .single();

        if (error) {
            console.error('Error saving progress:', error);
            return null;
        }

        return data;
    },

    // Load user progress
    async loadProgress(userId: string): Promise<UserProgress | null> {
        const { data, error } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // No progress found, return null
                return null;
            }
            console.error('Error loading progress:', error);
            return null;
        }

        return data;
    },

    // Delete user progress
    async deleteProgress(userId: string): Promise<boolean> {
        const { error } = await supabase
            .from('user_progress')
            .delete()
            .eq('user_id', userId);

        if (error) {
            console.error('Error deleting progress:', error);
            return false;
        }

        return true;
    },
};
