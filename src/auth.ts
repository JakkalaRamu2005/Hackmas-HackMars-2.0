import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { userService } from "@/lib/supabase";

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            // When user signs in, create/update user in Supabase
            if (user.email && user.name) {
                try {
                    await userService.upsertUser({
                        id: user.id || account?.providerAccountId || '',
                        email: user.email,
                        name: user.name,
                        image: user.image || undefined,
                    });
                } catch (error) {
                    console.error('Error creating user in Supabase:', error);
                    // Continue with sign-in even if Supabase fails
                }
            }
            return true;
        },
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.sub = user.id || account?.providerAccountId;
            }
            return token;
        },
    },
    pages: {
        signIn: "/",
    },
});

export const { GET, POST } = handlers;
