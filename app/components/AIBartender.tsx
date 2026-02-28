'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import TypingIndicator from './TypingIndicator';
import CocktailCard from './CocktailCard';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    cocktail?: any;
}

export default function AIBartender() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hi! I'm SJEEK's AI Bartender. Tell me your mood, favourite flavours, or ingredients and I'll craft a bespoke cocktail just for you. 🍸" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsTyping(true);

        try {
            const res = await fetch('/api/generate-cocktail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: userMessage })
            });

            const data = await res.json();

            if (data.success) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.message,
                    cocktail: data.cocktail
                }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: "I'm having a moment. Try again?" }]);
            }
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: "Oops, something went wrong. Please try again." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">

            {/* ── Branding header ── */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 px-1">
                {/* Logo */}
                <div className="shrink-0">
                    <Image
                        src="/sjeek-logo.svg"
                        alt="SJEEK"
                        width={72}
                        height={72}
                        priority
                        className="drop-shadow-[0_0_16px_rgba(236,72,153,0.6)]"
                    />
                </div>

                <div className="text-center sm:text-left">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                            AI Bartender
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-medium">
                            SJEEK
                        </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-0.5">
                        Describe your mood or favourite flavours — I'll craft something bespoke.
                    </p>
                </div>
            </div>

            {/* ── Chat panel ── */}
            <div
                className="backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex"
                style={{
                    background: 'linear-gradient(160deg, rgba(30,16,60,0.95) 0%, rgba(13,7,26,0.97) 100%)',
                    minHeight: 'clamp(420px, 60vh, 620px)',
                }}
            >
                {/* Bartender illustration sidebar — hidden on very small screens */}
                <div
                    className="hidden sm:flex flex-col items-center justify-end shrink-0 relative overflow-hidden"
                    style={{ width: 130, background: 'linear-gradient(180deg, rgba(99,102,241,0.06) 0%, rgba(236,72,153,0.04) 100%)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
                >
                    {/* Ambient glow */}
                    <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
                        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(99,102,241,0.2) 0%, transparent 70%)' }} />

                    <Image
                        src="/bartender.svg"
                        alt="AI Bartender"
                        width={120}
                        height={168}
                        className="relative z-10 select-none"
                        style={{ marginBottom: -4 }}
                    />
                </div>

                {/* Chat area */}
                <div className="flex flex-col flex-1 min-w-0">

                    {/* Chat messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 scroll-smooth">
                        <AnimatePresence initial={false}>
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className="max-w-[85%] rounded-2xl px-3 py-2.5 text-white shadow-md"
                                        style={{
                                            background: msg.role === 'user'
                                                ? 'linear-gradient(135deg, #4f46e5, #6366f1)'
                                                : 'rgba(255,255,255,0.07)',
                                            border: msg.role === 'assistant' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                                        }}
                                    >
                                        <p className="text-sm sm:text-base leading-relaxed">{msg.content}</p>

                                        {msg.cocktail && (
                                            <div className="mt-3">
                                                <CocktailCard
                                                    id={msg.cocktail.id || 'ai'}
                                                    name={msg.cocktail.name}
                                                    image={msg.cocktail.image}
                                                    glass={msg.cocktail.glass}
                                                    instructions={msg.cocktail.description}
                                                />
                                                <div className="mt-2 text-xs text-gray-300 bg-black/20 p-2 rounded-lg">
                                                    <strong>Recipe:</strong> {msg.cocktail.instructions}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <TypingIndicator />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Input */}
                    <form
                        onSubmit={handleSubmit}
                        className="p-3 sm:p-4 flex gap-2 shrink-0"
                        style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.2)' }}
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Something sour with gin..."
                            className="flex-1 min-w-0 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}
                            disabled={isTyping}
                        />
                        <button
                            type="submit"
                            disabled={isTyping || !input.trim()}
                            className="shrink-0 rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-bold text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg"
                            style={{ background: 'linear-gradient(135deg, #ec4899, #6366f1)' }}
                        >
                            Ask
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
