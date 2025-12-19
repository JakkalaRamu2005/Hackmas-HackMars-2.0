# Environment Variables Setup

## Required Variables

Add these to your `.env` file in the root directory:

```env
# Gemini API Key
# Get your key from: https://makersuite.google.com/app/apikey
GEMINI_KEY=your_gemini_api_key_here

# Google OAuth Credentials
# Get from: https://console.cloud.google.com/
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth Secret
# Generate with: openssl rand -base64 32
# Or use: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
AUTH_SECRET=XoU7hN4ZPEgsV6VNUhdDWWpF2d6dR6PZ6K4Q1vO+vG0=

# NextAuth URL (change for production)
NEXTAUTH_URL=http://localhost:3000
```

## Quick Setup

1. Copy the template above
2. Replace `your_gemini_api_key_here` with your actual Gemini API key
3. Replace `your_google_client_id_here` with your Google Client ID
4. Replace `your_google_client_secret_here` with your Google Client Secret
5. The `AUTH_SECRET` is already generated - you can use it or generate a new one
6. Save the file as `.env` in the project root

## Important Notes

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- Restart your dev server after adding/changing environment variables
