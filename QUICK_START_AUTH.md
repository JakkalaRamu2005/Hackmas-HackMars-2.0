# 🚀 Quick Start Guide - Authentication Setup

## ✅ What You Need

1. **Google OAuth Credentials** (Client ID + Secret)
2. **Supabase Project** (URL + Anon Key)
3. **NextAuth Secret** (Random string)

---

## 📋 Step-by-Step Setup (5 minutes)

### Step 1: Run Supabase Schema (2 min)

1. Open your Supabase project dashboard
2. Go to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the entire contents of `supabase-schema.sql`
5. Paste and click **Run**
6. ✅ Verify tables created: Go to **Table Editor** → You should see `users` and `user_progress`

### Step 2: Get Supabase Credentials (1 min)

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy **Project URL** → Add to `.env` as `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **anon/public key** → Add to `.env` as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 3: Verify Google OAuth (Already Done? ✓)

Since you mentioned you already added Client ID and Secret to `.env`, verify:

```env
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
```

**Important**: Make sure redirect URI is configured in Google Console:
- Development: `http://localhost:3000/api/auth/callback/google`
- Production: `https://yourdomain.com/api/auth/callback/google`

### Step 4: Generate AUTH_SECRET (30 sec)

Run this command in terminal:

```bash
openssl rand -base64 32
```

Copy the output and add to `.env`:

```env
AUTH_SECRET=the_generated_secret_here
NEXTAUTH_SECRET=the_generated_secret_here
```

*(Use the same value for both)*

### Step 5: Restart Dev Server (30 sec)

```bash
# Stop current server (Ctrl+C)
npm run dev
```

---

## 🧪 Test Authentication

1. Open `http://localhost:3000`
2. Click **"Sign in with Google"** button (top right)
3. Select your Google account
4. Approve access
5. ✅ You should be redirected back and see your profile picture + "Synced to cloud"

### Verify Database

1. Go to Supabase → **Table Editor** → **users**
2. You should see your user record with email, name, and image
3. Complete a task in the app
4. Check **user_progress** table → Your progress should be saved!

---

## ✅ Your .env File Should Look Like:

```env
# NextAuth
AUTH_SECRET=abc123xyz789... (32+ characters)
NEXTAUTH_SECRET=abc123xyz789... (same as above)

# Google OAuth
GOOGLE_CLIENT_ID=123456789.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Gemini AI (already configured)
GEMINI_KEY=AIzaSy...
```

---

## 🎯 What's Working Now

✅ **Google Sign-In** - One-click authentication  
✅ **User Creation** - Automatic user record in Supabase  
✅ **Cloud Sync** - Progress saved to database  
✅ **Multi-Device** - Access from anywhere  
✅ **Sync Indicator** - Green dot shows "Synced to cloud"  

---

## 🐛 Troubleshooting

### "Missing AUTH_SECRET" Error
```bash
# Generate new secret
openssl rand -base64 32

# Add to .env
AUTH_SECRET=your_generated_secret
NEXTAUTH_SECRET=your_generated_secret

# Restart server
npm run dev
```

### "Invalid Client" Error
- Check Google Client ID and Secret are correct
- Verify redirect URI in Google Console matches exactly
- Make sure OAuth consent screen is configured

### "Supabase Error"
- Verify URL and Anon Key are correct
- Check if schema was run successfully
- Look at Supabase logs: Dashboard → Logs

### Progress Not Saving
- Open browser console (F12)
- Look for errors
- Check Supabase Table Editor → user_progress
- Verify RLS policies are enabled

---

## 📚 Next Steps

1. ✅ Test authentication
2. ✅ Complete a task and verify cloud sync
3. ✅ Sign out and sign in again - progress should load
4. 🎄 Continue building features!

---

## 💡 Pro Tips

- **Development**: Use `localhost:3000` for testing
- **Production**: Update redirect URIs before deploying
- **Security**: Never commit `.env` file to Git
- **Backup**: Export Supabase database regularly
- **Testing**: Use incognito mode to test fresh user flow

---

**Need Help?** Check `docs/AUTHENTICATION_SETUP.md` for detailed documentation!
