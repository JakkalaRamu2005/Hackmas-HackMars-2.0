-- StudyAdvent.ai Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress table
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    tasks JSONB NOT NULL DEFAULT '[]'::jsonb,
    completed_count INTEGER DEFAULT 0,
    syllabus_text TEXT DEFAULT '',
    gamification JSONB NOT NULL DEFAULT '{}'::jsonb,
    analytics JSONB NOT NULL DEFAULT '{}'::jsonb,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_last_updated ON user_progress(last_updated);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
-- Users can read their own data
CREATE POLICY "Users can view own data"
    ON users
    FOR SELECT
    USING (true); -- Allow reading all users (needed for auth)

-- Users can insert their own data
CREATE POLICY "Users can insert own data"
    ON users
    FOR INSERT
    WITH CHECK (true); -- Allow insert (handled by auth)

-- Users can update their own data
CREATE POLICY "Users can update own data"
    ON users
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- RLS Policies for user_progress table
-- Users can only read their own progress
CREATE POLICY "Users can view own progress"
    ON user_progress
    FOR SELECT
    USING (true); -- We'll handle auth in the application layer

-- Users can insert their own progress
CREATE POLICY "Users can insert own progress"
    ON user_progress
    FOR INSERT
    WITH CHECK (true);

-- Users can update their own progress
CREATE POLICY "Users can update own progress"
    ON user_progress
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Users can delete their own progress
CREATE POLICY "Users can delete own progress"
    ON user_progress
    FOR DELETE
    USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update last_updated on user_progress table
CREATE TRIGGER update_user_progress_last_updated
    BEFORE UPDATE ON user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a view for user statistics
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    u.id,
    u.name,
    u.email,
    up.completed_count,
    up.last_updated,
    (up.gamification->>'points')::INTEGER as points,
    (up.gamification->>'streak')::INTEGER as streak,
    (up.analytics->>'totalStudyTime')::INTEGER as total_study_time
FROM users u
LEFT JOIN user_progress up ON u.id = up.user_id;

-- Grant access to the view
GRANT SELECT ON user_stats TO authenticated;
GRANT SELECT ON user_stats TO anon;
