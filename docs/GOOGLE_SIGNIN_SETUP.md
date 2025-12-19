# Google Sign-In Setup

## Environment Variables Required

Add these to your `.env` or `.env.local` file:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## How to Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure the OAuth consent screen
6. Set Application type to "Web application"
7. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
8. Copy the Client ID and Client Secret

## Generate NEXTAUTH_SECRET

Run this command in your terminal:

```bash
openssl rand -base64 32
```

Or use this online: https://generate-secret.vercel.app/32

## Features Implemented

✅ Google Sign-In button in top-right corner
✅ User profile display with avatar
✅ Sign out functionality
✅ Session persistence across page refreshes
✅ Protected routes (optional)

## Usage

The auth button automatically appears in the top-right corner of every page. Users can:

1. Click "Sign in with Google"
2. Authenticate with their Google account
3. See their profile picture and name
4. Sign out when done

## Integration with User Progress

Currently, user progress is stored in localStorage. In the future, you can extend this to:

- Save progress to a database linked to user ID
- Sync progress across devices
- Share calendars with other users
- Implement leaderboards

## Files Created

- `src/auth.ts` - NextAuth configuration
- `src/app/api/auth/[...nextauth]/route.ts` - API route handler
- `src/components/auth/AuthButton.tsx` - Sign-in button component
- `src/components/auth/AuthProvider.tsx` - Session provider wrapper
- `src/middleware.ts` - Auth middleware
