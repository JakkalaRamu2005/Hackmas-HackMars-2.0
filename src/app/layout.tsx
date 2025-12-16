import type { Metadata } from "next";
import { Mountains_of_Christmas, Inter } from "next/font/google";
import "./globals.css";
import { SnowEffect } from "@/components/ui/SnowEffect";

const christmasFont = Mountains_of_Christmas({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-christmas",
});

const interFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "StudyAdvent.ai | The Syllabus Advent Calendar",
  description: "Turn your boring exam syllabus into a festive, gamified advent calendar!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${christmasFont.variable} ${interFont.variable} antialiased relative min-h-screen bg-[var(--background)] text-[var(--foreground)]`}
      >
        <SnowEffect />
        <main className="relative z-10 w-full min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
