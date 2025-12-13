import React, { useEffect } from 'react';
import { useMotionValue, useMotionTemplate, motion } from 'framer-motion';

const MouseSpotlight = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const handleMouseMove = ({ clientX, clientY }) => {
            mouseX.set(clientX);
            mouseY.set(clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <motion.div
                className="absolute inset-0 opacity-40 dark:opacity-20"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            650px circle at ${mouseX}px ${mouseY}px,
                            rgba(59, 130, 246, 0.25),
                            transparent 80%
                        )
                    `,
                }}
            />
            <motion.div
                className="absolute inset-0 opacity-30 dark:opacity-10"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            400px circle at ${mouseX}px ${mouseY}px,
                            rgba(147, 51, 234, 0.3),
                            transparent 80%
                        )
                    `,
                }}
            />
        </div>
    );
};

export default MouseSpotlight;
