"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SnowEffectProps {
    type: 'default' | 'sparkle' | 'heavy' | 'rainbow' | 'gentle';
}

export const SnowEffect = ({ type = 'default' }: SnowEffectProps) => {
    const [snowflakes, setSnowflakes] = useState<Array<{ id: number; x: number; delay: number; duration: number; size: number }>>([]);

    useEffect(() => {
        const count = type === 'heavy' ? 100 : type === 'gentle' ? 30 : 50;
        const flakes = Array.from({ length: count }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            delay: Math.random() * 5,
            duration: type === 'heavy' ? Math.random() * 3 + 3 : Math.random() * 5 + 5,
            size: type === 'heavy' ? Math.random() * 6 + 2 : Math.random() * 4 + 2,
        }));
        setSnowflakes(flakes);
    }, [type]);

    const getSnowflakeColor = (index: number) => {
        if (type === 'rainbow') {
            const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
            return colors[index % colors.length];
        }
        if (type === 'sparkle') {
            return index % 2 === 0 ? '#FFFFFF' : '#F8B229';
        }
        return '#FFFFFF';
    };

    const getSnowflakeOpacity = () => {
        if (type === 'sparkle') return 0.9;
        if (type === 'gentle') return 0.5;
        return 0.7;
    };

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-[5]">
            {snowflakes.map((flake, index) => (
                <motion.div
                    key={flake.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${flake.x}%`,
                        width: `${flake.size}px`,
                        height: `${flake.size}px`,
                        backgroundColor: getSnowflakeColor(index),
                        opacity: getSnowflakeOpacity(),
                        boxShadow: type === 'sparkle' ? '0 0 10px currentColor' : 'none',
                    }}
                    initial={{ y: -20 }}
                    animate={{
                        y: window.innerHeight + 20,
                        x: [0, Math.random() * 100 - 50, 0],
                    }}
                    transition={{
                        duration: flake.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: flake.delay,
                    }}
                />
            ))}
        </div>
    );
};
