"use client";

import { useEffect, useState } from "react";

export const SnowEffect = () => {
    const [snowflakes, setSnowflakes] = useState<Array<{ id: number; left: string; animationDuration: string; opacity: number }>>([]);

    useEffect(() => {
        // Generate static snowflakes on mount to avoid hydration mismatch
        const flakes = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 3 + 10}s`, // slow falling
            opacity: Math.random() * 0.5 + 0.3,
        }));
        setSnowflakes(flakes);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
            {snowflakes.map((flake) => (
                <div
                    key={flake.id}
                    className="absolute top-[-10px] bg-white rounded-full animate-fall"
                    style={{
                        left: flake.left,
                        width: "8px",
                        height: "8px",
                        opacity: flake.opacity,
                        animation: `fall ${flake.animationDuration} linear infinite`,
                    }}
                />
            ))}
            <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) translateX(0px);
          }
          100% {
            transform: translateY(110vh) translateX(20px);
          }
        }
      `}</style>
        </div>
    );
};
