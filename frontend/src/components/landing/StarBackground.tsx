'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export const StarBackground = ({
    children,
    className,
}: {
    children?: React.ReactNode
    className?: string
}) => {
    const [stars, setStars] = useState<{ x: number; y: number; size: number; opacity: number; duration: number }[]>([])

    useEffect(() => {
        const generateStars = () => {
            const newStars = []
            for (let i = 0; i < 150; i++) {
                newStars.push({
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 1.5 + 0.5, // Smaller, sharper stars
                    opacity: Math.random() * 0.7 + 0.3,
                    duration: Math.random() * 4 + 3,
                })
            }
            setStars(newStars)
        }
        generateStars()
    }, [])

    return (
        <div className={cn("relative w-full min-h-screen overflow-hidden bg-black", className)}>
            {/* Cosmic Gradient Background - The 'Glow' */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full bg-indigo-500/20 blur-[100px] opacity-50 pointer-events-none z-0"
            />
            <div
                className="absolute bottom-0 right-0 w-[800px] h-[600px] rounded-full bg-rose-500/10 blur-[120px] opacity-30 pointer-events-none z-0"
            />

            <div className="absolute inset-0 z-0">
                {stars.map((star, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: star.size,
                            height: star.size,
                            opacity: star.opacity,
                        }}
                        animate={{
                            opacity: [star.opacity, star.opacity * 0.2, star.opacity],
                        }}
                        transition={{
                            duration: star.duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: Math.random() * 5
                        }}
                    />
                ))}
            </div>
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    )
}
