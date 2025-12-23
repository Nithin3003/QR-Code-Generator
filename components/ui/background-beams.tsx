"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [beams, setBeams] = useState<{ left: string; duration: number; delay: number }[]>([]);

    useEffect(() => {
        setIsMounted(true);
        setBeams(
            [...Array(20)].map(() => ({
                left: `${Math.random() * 100}%`,
                duration: Math.random() * 5 + 5,
                delay: Math.random() * 5,
            }))
        );
    }, []);

    return (
        <div
            className={cn(
                "absolute h-full w-full inset-0 bg-neutral-950 overflow-hidden",
                className
            )}
        >
            <div className="absolute h-full w-full inset-0 z-0 opacity-30">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="h-full w-full bg-gradient-to-b from-neutral-900 to-neutral-950"
                />
                {isMounted && beams.map((beam, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-neutral-800/20 w-[1px] h-full"
                        style={{
                            left: beam.left,
                        }}
                        animate={{
                            opacity: [0.1, 0.5, 0.1],
                            height: ["0%", "100%", "0%"],
                            top: ["0%", "0%", "100%"],
                        }}
                        transition={{
                            duration: beam.duration,
                            repeat: Infinity,
                            ease: "linear",
                            delay: beam.delay,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

