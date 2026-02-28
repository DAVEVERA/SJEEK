'use client';

import { motion } from 'framer-motion';

export default function TypingIndicator() {
    return (
        <div className="flex items-center space-x-1 p-2 bg-white/10 rounded-2xl w-fit">
            {[0, 1, 2].map((dot) => (
                <motion.div
                    key={dot}
                    className="w-2 h-2 bg-pink-400 rounded-full"
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        delay: dot * 0.2,
                    }}
                />
            ))}
        </div>
    );
}
