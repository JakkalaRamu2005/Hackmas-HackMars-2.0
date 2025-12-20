# 🔐 Authentication & Supabase Integration Guide

## Overview
StudyAdvent.ai uses **NextAuth.js** for authentication with **Google Sign-In** and **Supabase** for cloud data persistence. This allows users to access their progress from any device.

## Setup Instructions

### 1. Environment Variables

Add the following to your `.env` or `.env.local` file:

```env
# NextAuth Configuration
AUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_SECRET=your_nextauth_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Generate AUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use this online tool: https://generate-secret.vercel.app/32

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy **Client ID** and **Client Secret** to `.env`

### 4. Supabase Setup

#### Create Supabase Project
1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Copy **Project URL** and **Anon Key** from Settings → API
4. Add to `.env` file

#### Run Database Schema
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `supabase-schema.sql`
3. Run the SQL script
4. Verify tables are created:
   - `users`
   - `user_progress`

#### Configure Row Level Security (RLS)
The schema includes RLS policies, but you can customize them:

```sql
-- Example: Stricter RLS for user_progress
CREATE POLICY "Users can only view own progress"
    ON user_progress
    FOR SELECT
    USING (auth.uid()::text = user_id);
```

**Note**: Since we're using NextAuth (not Supabase Auth), we handle authentication in the application layer.

## Features

### 1. **Google Sign-In**
- One-click authentication
- Secure OAuth 2.0 flow
- User profile data (name, email, image)

### 2. **Cloud Sync**
- Automatic progress backup to Supabase
- Access from any device
- Real-time sync status indicator

### 3. **User Management**
- Automatic user creation on first sign-in
- Profile updates on subsequent logins
- User data stored securely in Supabase

### 4. **Progress Persistence**
All user data is synced to cloud:
- ✅ Advent calendar tasks
- ✅ Completion status
- ✅ Gamification stats (points, streaks, achievements)
- ✅ Analytics data (study sessions, productivity)
- ✅ Syllabus text
- ✅ Grinch Mode settings

## How It Works

### Authentication Flow

```
1. User clicks "Sign in with Google"
   ↓
2. Redirected to Google OAuth consent
   ↓
3. User approves access
   ↓
4. Redirected back to app with auth token
   ↓
5. NextAuth creates session
   ↓
6. User data saved to Supabase (users table)
   ↓
7. Previous progress loaded (if exists)
   ↓
8. User is authenticated ✓
```

### Data Sync Flow

```
User completes task
   ↓
Local state updated
   ↓
Progress saved to localStorage (instant)
   ↓
Progress synced to Supabase (background)
   ↓
Sync status indicator updated ✓
```

## Usage

### In Components

```typescript
import { useSession } from "next-auth/react";
import { useSupabaseSync } from "@/lib/useSupabaseSync";

function MyComponent() {
  const { data: session } = useSession();
  const { 
    isAuthenticated, 
    isSyncing, 
    loadProgress, 
    saveProgress 
  } = useSupabaseSync();

  // Check if user is logged in
  if (isAuthenticated) {
    // Load progress from cloud
    const progress = await loadProgress();
    
    // Save progress to cloud
    await saveProgress(progressData);
  }
}
```

### API Routes

```typescript
import { auth } from "@/auth";

export async function GET(request: Request) {
  const session = await auth();
  
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  
  // User is authenticated
  const userId = session.user.id;
  // ... your logic
}
```

## Database Schema

### Users Table
```sql
users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### User Progress Table
```sql
user_progress (
  id UUID PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  tasks JSONB,
  completed_count INTEGER,
  syllabus_text TEXT,
  gamification JSONB,
  analytics JSONB,
  last_updated TIMESTAMP,
  created_at TIMESTAMP
)
```

## Security

### Best Practices Implemented
- ✅ Row Level Security (RLS) enabled
- ✅ Secure OAuth 2.0 flow
- ✅ Environment variables for secrets
- ✅ HTTPS required in production
- ✅ Session-based authentication
- ✅ CSRF protection (NextAuth built-in)

### Data Privacy
- User data encrypted in transit (HTTPS)
- Passwords never stored (OAuth only)
- User can delete all data anytime
- No third-party tracking

## Troubleshooting

### "Missing AUTH_SECRET" Error
- Generate a new secret: `openssl rand -base64 32`
- Add to `.env` file
- Restart dev server

### "Invalid Client" Error
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Verify redirect URIs in Google Console
- Ensure OAuth consent screen is configured

### "Supabase Connection Failed"
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check Supabase project is active
- Run database schema if tables don't exist

### "Progress Not Syncing"
- Check browser console for errors
- Verify user is authenticated
- Check Supabase RLS policies
- Ensure tables exist in database

## Testing

### Local Testing
1. Start dev server: `npm run dev`
2. Click "Sign in with Google"
3. Complete OAuth flow
4. Verify user created in Supabase (users table)
5. Complete a task
6. Check Supabase (user_progress table) for synced data

### Production Testing
1. Deploy to Vercel/Netlify
2. Add production redirect URI to Google Console
3. Update environment variables in hosting platform
4. Test authentication flow
5. Verify cloud sync works

## Future Enhancements

- [ ] Social login (GitHub, Twitter)
- [ ] Email/password authentication
- [ ] Two-factor authentication (2FA)
- [ ] Account linking (multiple providers)
- [ ] User profile customization
- [ ] Data export functionality
- [ ] Account deletion with confirmation
- [ ] Session management (view active sessions)
- [ ] Real-time collaboration features

## Support

For issues or questions:
1. Check Supabase logs (Dashboard → Logs)
2. Check browser console for errors
3. Verify environment variables
4. Review NextAuth documentation: https://next-auth.js.org/
5. Review Supabase documentation: https://supabase.com/docs

---

**Important**: Never commit `.env` files to Git! Add `.env` to `.gitignore`.
