'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Cocktail {
    id: string;
    name: string;
    image: string;
    glass: string;
    instructions: string;
    category?: string;
    alcoholic?: string;
}

interface Ingredient {
    item: string;
    amount: string;
    unit: string;
}

interface Details {
    origin: string;
    history: string;
    nameHeritage: string;
    funFact: string;
    ingredients: Ingredient[];
    abv: string | number;
    flavourProfile: string[];
}

interface Props {
    cocktail: Cocktail;
    onClose: () => void;
}

const FLAVOUR_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    sweet: { bg: 'rgba(236,72,153,0.15)', text: '#f9a8d4', border: 'rgba(236,72,153,0.4)' },
    sour: { bg: 'rgba(234,179,8,0.15)', text: '#fde047', border: 'rgba(234,179,8,0.4)' },
    bitter: { bg: 'rgba(34,197,94,0.15)', text: '#86efac', border: 'rgba(34,197,94,0.4)' },
    strong: { bg: 'rgba(239,68,68,0.15)', text: '#fca5a5', border: 'rgba(239,68,68,0.4)' },
    fruity: { bg: 'rgba(249,115,22,0.15)', text: '#fdba74', border: 'rgba(249,115,22,0.4)' },
    smoky: { bg: 'rgba(107,114,128,0.15)', text: '#d1d5db', border: 'rgba(107,114,128,0.4)' },
    refreshing: { bg: 'rgba(6,182,212,0.15)', text: '#67e8f9', border: 'rgba(6,182,212,0.4)' },
    creamy: { bg: 'rgba(139,92,246,0.15)', text: '#c4b5fd', border: 'rgba(139,92,246,0.4)' },
    spicy: { bg: 'rgba(220,38,38,0.15)', text: '#fca5a5', border: 'rgba(220,38,38,0.4)' },
    herbal: { bg: 'rgba(22,163,74,0.15)', text: '#86efac', border: 'rgba(22,163,74,0.4)' },
};

export default function CocktailModal({ cocktail, onClose }: Props) {
    const [details, setDetails] = useState<Details | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [servings, setServings] = useState(1);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    // Close on Escape key
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 320);
    };

    const loadDetails = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/enrich-cocktail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: cocktail.name,
                    glass: cocktail.glass,
                    category: cocktail.category || 'Cocktail',
                }),
            });
            const data = await res.json();
            if (data.success) {
                setDetails(data.details);
            } else {
                setError('Could not load details. Please try again.');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const scale = (amount: string, n: number) => {
        const num = parseFloat(amount);
        if (isNaN(num)) return amount;
        return (num * n).toFixed(1).replace(/\.0$/, '');
    };

    return (
        <>
            {/* ── Backdrop ── */}
            <div
                onClick={handleClose}
                style={{
                    position: 'fixed', inset: 0, zIndex: 50,
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(10px)',
                    transition: 'opacity 0.3s ease',
                    opacity: visible ? 1 : 0,
                }}
            />

            {/* ── Modal shell ── */}
            {/* Mobile: full-screen bottom sheet | Desktop: centered dialog */}
            <div
                style={{
                    position: 'fixed', zIndex: 51,
                    /* Mobile: pin to bottom, full width */
                    bottom: 0, left: 0, right: 0,
                    /* Desktop: override to centered */
                    transition: 'transform 0.35s cubic-bezier(0.32,0.72,0,1), opacity 0.3s ease',
                    transform: visible ? 'translateY(0)' : 'translateY(60px)',
                    opacity: visible ? 1 : 0,
                }}
                className="md:inset-0 md:flex md:items-center md:justify-center md:p-6"
            >
                <div
                    onClick={e => e.stopPropagation()}
                    className="
                        relative flex flex-col
                        w-full md:w-auto md:max-w-5xl md:min-w-[720px]
                        md:flex-row md:rounded-3xl
                        overflow-hidden
                    "
                    style={{
                        height: '92vh',
                        maxHeight: 860,
                        background: 'linear-gradient(150deg, #16092e 0%, #0a0715 100%)',
                        border: '1px solid rgba(255,255,255,0.09)',
                        boxShadow: '0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.08)',
                        borderRadius: '24px 24px 0 0',
                    }}
                >
                    {/* ── Close button ── */}
                    <button
                        onClick={handleClose}
                        aria-label="Close"
                        style={{
                            position: 'absolute', top: 14, right: 14, zIndex: 10,
                            width: 36, height: 36, borderRadius: '50%',
                            background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.14)',
                            color: 'white', fontSize: 15, cursor: 'pointer',
                            backdropFilter: 'blur(8px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(236,72,153,0.4)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.55)')}
                    >✕</button>

                    {/* Drag pill (mobile) */}
                    <div className="md:hidden absolute top-2.5 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/20 z-10" />

                    {/* ══════════════════════════════════════════
                        LEFT COLUMN — Cocktail image (desktop)
                        Mobile: image at top, fixed height
                    ══════════════════════════════════════════ */}
                    <div
                        className="relative shrink-0 md:w-[42%]"
                        style={{ height: 260, minHeight: 260 }}
                    // On desktop, this becomes full-height via flex
                    >
                        <style>{`
                            @media (min-width: 768px) {
                                .cocktail-img-col {
                                    height: 100% !important;
                                    min-height: unset !important;
                                }
                                .modal-shell { border-radius: 24px !important; }
                            }
                        `}</style>
                        <div className="cocktail-img-col absolute inset-0 w-full" style={{ height: 260 }}>
                            <Image
                                src={cocktail.image}
                                alt={cocktail.name}
                                fill
                                priority
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 42vw"
                            />

                            {/* Gradient overlay — fades to bg colour */}
                            <div style={{
                                position: 'absolute', inset: 0,
                                background: 'linear-gradient(to right, transparent 60%, #0a0715 100%), linear-gradient(to bottom, transparent 40%, #0a0715 100%)',
                            }} />
                        </div>

                        {/* Name + meta overlaid on image (visible on all sizes) */}
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 20px 16px', zIndex: 2 }}>
                            {/* Badges */}
                            <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                                {cocktail.alcoholic && (
                                    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, background: 'rgba(99,102,241,0.3)', border: '1px solid rgba(99,102,241,0.4)', color: '#c7d2fe', backdropFilter: 'blur(4px)', fontWeight: 600 }}>
                                        {cocktail.alcoholic}
                                    </span>
                                )}
                                {cocktail.category && (
                                    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, background: 'rgba(236,72,153,0.25)', border: '1px solid rgba(236,72,153,0.4)', color: '#fbcfe8', backdropFilter: 'blur(4px)', fontWeight: 600 }}>
                                        {cocktail.category}
                                    </span>
                                )}
                            </div>
                            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, textShadow: '0 2px 16px rgba(0,0,0,0.9)', marginBottom: 4 }}>
                                {cocktail.name}
                            </h2>
                            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                                🍶 {cocktail.glass}
                            </p>
                        </div>
                    </div>

                    {/* ══════════════════════════════════════════
                        RIGHT COLUMN — All details, scrollable
                    ══════════════════════════════════════════ */}
                    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(236,72,153,0.3) transparent' }}>
                        <div style={{ padding: '20px 20px 32px' }}>

                            {/* ── How to make it ── */}
                            <Section label="How to make it">
                                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.75 }}>
                                    {cocktail.instructions}
                                </p>
                            </Section>

                            {/* ── AI Enrichment trigger ── */}
                            {!details && !loading && !error && (
                                <div style={{ marginTop: 16 }}>
                                    <button
                                        onClick={loadDetails}
                                        style={{
                                            width: '100%', padding: '15px 20px',
                                            borderRadius: 16,
                                            background: 'linear-gradient(135deg, rgba(236,72,153,0.1) 0%, rgba(99,102,241,0.1) 100%)',
                                            border: '1px solid rgba(236,72,153,0.35)',
                                            color: '#f9a8d4', fontSize: 14, fontWeight: 700,
                                            cursor: 'pointer', letterSpacing: '0.02em',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(236,72,153,0.2) 0%, rgba(99,102,241,0.2) 100%)';
                                            e.currentTarget.style.borderColor = 'rgba(236,72,153,0.6)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(236,72,153,0.1) 0%, rgba(99,102,241,0.1) 100%)';
                                            e.currentTarget.style.borderColor = 'rgba(236,72,153,0.35)';
                                        }}
                                    >
                                        <span style={{ fontSize: 18 }}>✨</span>
                                        Discover Origin, Heritage & Full Recipe
                                    </button>
                                </div>
                            )}

                            {/* Loading */}
                            {loading && (
                                <div style={{ textAlign: 'center', padding: '28px 0', color: 'rgba(255,255,255,0.35)' }}>
                                    <div style={{ display: 'flex', gap: 7, justifyContent: 'center', marginBottom: 10 }}>
                                        {[0, 1, 2].map(i => (
                                            <div key={i} style={{
                                                width: 9, height: 9, borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #ec4899, #6366f1)',
                                                animation: `dotBounce 1.1s ${i * 0.18}s ease-in-out infinite`,
                                            }} />
                                        ))}
                                    </div>
                                    <style>{`@keyframes dotBounce{0%,80%,100%{transform:scale(0.6);opacity:0.4}40%{transform:scale(1);opacity:1}}`}</style>
                                    <span style={{ fontSize: 13 }}>Researching history, origin & recipe…</span>
                                </div>
                            )}

                            {/* Error */}
                            {error && (
                                <div style={{ marginTop: 12, padding: '12px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', textAlign: 'center' }}>
                                    <p style={{ color: '#f87171', fontSize: 13, marginBottom: 6 }}>{error}</p>
                                    <button onClick={loadDetails} style={{ color: '#f472b6', fontSize: 13, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
                                        Try again
                                    </button>
                                </div>
                            )}

                            {/* ── AI Details ── */}
                            {details && (
                                <>
                                    {/* Flavour profile + ABV */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 20, marginBottom: 4 }}>
                                        {details.flavourProfile?.map(f => {
                                            const c = FLAVOUR_COLORS[f.toLowerCase()] || { bg: 'rgba(255,255,255,0.1)', text: 'rgba(255,255,255,0.7)', border: 'rgba(255,255,255,0.15)' };
                                            return (
                                                <span key={f} style={{ fontSize: 12, padding: '5px 13px', borderRadius: 99, background: c.bg, color: c.text, border: `1px solid ${c.border}`, fontWeight: 600, textTransform: 'capitalize' }}>
                                                    {f}
                                                </span>
                                            );
                                        })}
                                        {details.abv && (
                                            <span style={{ fontSize: 12, padding: '5px 13px', borderRadius: 99, background: 'rgba(239,68,68,0.12)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)', fontWeight: 700 }}>
                                                ~{details.abv}% ABV
                                            </span>
                                        )}
                                    </div>

                                    <Divider />

                                    {/* Origin & History */}
                                    <Section label="📍 Origin & History">
                                        <div style={{ fontSize: 13, color: '#f9a8d4', fontWeight: 600, marginBottom: 8 }}>{details.origin}</div>
                                        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.75 }}>{details.history}</p>
                                    </Section>

                                    <Divider />

                                    {/* Name Heritage */}
                                    <Section label="📜 Name Heritage">
                                        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.75 }}>{details.nameHeritage}</p>
                                    </Section>

                                    {/* Fun Fact */}
                                    {details.funFact && (
                                        <>
                                            <Divider />
                                            <div style={{
                                                padding: '14px 16px', borderRadius: 14,
                                                background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.07))',
                                                border: '1px solid rgba(99,102,241,0.2)',
                                            }}>
                                                <p style={{ fontSize: 14, color: 'rgba(199,210,254,0.9)', lineHeight: 1.75 }}>
                                                    <strong style={{ color: '#a5b4fc' }}>💡 Did you know? </strong>
                                                    {details.funFact}
                                                </p>
                                            </div>
                                        </>
                                    )}

                                    <Divider />

                                    {/* Recipe + Servings Calculator */}
                                    {details.ingredients?.length > 0 && (
                                        <Section label="🍹 Recipe">
                                            {/* Servings row */}
                                            <div style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                padding: '10px 14px', borderRadius: 12, marginBottom: 12,
                                                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                                            }}>
                                                <div>
                                                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Servings</div>
                                                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Quantities scale automatically</div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <ServingBtn onClick={() => setServings(Math.max(1, servings - 1))}>−</ServingBtn>
                                                    <span style={{ color: '#f9a8d4', fontWeight: 800, fontSize: 22, minWidth: 28, textAlign: 'center', lineHeight: 1 }}>{servings}</span>
                                                    <ServingBtn onClick={() => setServings(Math.min(20, servings + 1))}>+</ServingBtn>
                                                </div>
                                            </div>

                                            {/* Ingredients */}
                                            <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
                                                {details.ingredients.map((ing, i) => (
                                                    <div
                                                        key={i}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                            padding: '13px 16px',
                                                            background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.015)',
                                                            borderBottom: i < details.ingredients.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                                        }}
                                                    >
                                                        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', textTransform: 'capitalize', fontWeight: 500 }}>
                                                            {ing.item}
                                                        </span>
                                                        <span style={{
                                                            fontSize: 13, fontWeight: 700, fontFamily: 'monospace',
                                                            color: '#f9a8d4',
                                                            background: 'rgba(236,72,153,0.12)',
                                                            border: '1px solid rgba(236,72,153,0.25)',
                                                            padding: '3px 12px', borderRadius: 8,
                                                            minWidth: 70, textAlign: 'right',
                                                        }}>
                                                            {scale(ing.amount, servings)}<span style={{ opacity: 0.6, marginLeft: 4 }}>{ing.unit}</span>
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </Section>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

/* ── Sub-components ── */
function Section({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>
                {label}
            </div>
            {children}
        </div>
    );
}

function Divider() {
    return <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '18px 0' }} />;
}

function ServingBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)',
                color: 'white', fontSize: 20, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
                transition: 'all 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(236,72,153,0.25)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
        >
            {children}
        </button>
    );
}
