"use client";

import { useEffect } from "react";

interface ThemeProviderProps {
    themeId: string | null;
    children: React.ReactNode;
}

const THEME_STYLES: Record<string, {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
}> = {
    'theme-hanukkah': {
        primary: '#0047AB', // Blue
        secondary: '#FFFFFF', // White
        accent: '#C0C0C0', // Silver
        background: 'linear-gradient(135deg, #0047AB 0%, #1E90FF 100%)',
    },
    'theme-kwanzaa': {
        primary: '#DC143C', // Red
        secondary: '#000000', // Black
        accent: '#228B22', // Green
        background: 'linear-gradient(135deg, #DC143C 0%, #000000 50%, #228B22 100%)',
    },
    'theme-winter-wonderland': {
        primary: '#87CEEB', // Sky Blue
        secondary: '#FFFFFF', // White
        accent: '#B0E0E6', // Powder Blue
        background: 'linear-gradient(135deg, #87CEEB 0%, #E0F6FF 100%)',
    },
    'theme-new-year': {
        primary: '#FFD700', // Gold
        secondary: '#C0C0C0', // Silver
        accent: '#FFFFFF', // White
        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #C0C0C0 100%)',
    },
};

export const ThemeProvider = ({ themeId, children }: ThemeProviderProps) => {
    useEffect(() => {
        if (!themeId || !THEME_STYLES[themeId]) {
            // Reset to default Christmas theme
            document.documentElement.style.removeProperty('--theme-primary');
            document.documentElement.style.removeProperty('--theme-secondary');
            document.documentElement.style.removeProperty('--theme-accent');
            document.documentElement.style.removeProperty('--theme-background');
            return;
        }

        const theme = THEME_STYLES[themeId];
        document.documentElement.style.setProperty('--theme-primary', theme.primary);
        document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
        document.documentElement.style.setProperty('--theme-accent', theme.accent);
        document.documentElement.style.setProperty('--theme-background', theme.background);
    }, [themeId]);

    return <>{children}</>;
};

// Theme overlay component for visual effect
export const ThemeOverlay = ({ themeId }: { themeId: string | null }) => {
    if (!themeId || !THEME_STYLES[themeId]) return null;

    const theme = THEME_STYLES[themeId];

    return (
        <div
            className="fixed inset-0 pointer-events-none z-[1] opacity-10"
            style={{
                background: theme.background,
            }}
        />
    );
};
