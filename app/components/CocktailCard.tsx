import Image from 'next/image';

interface CocktailProps {
    id: string;
    name: string;
    image: string;
    glass: string;
    instructions: string;
    category?: string;
    alcoholic?: string;
    onClick?: () => void;
}

export default function CocktailCard({ name, image, glass, instructions, category, onClick }: CocktailProps) {
    return (
        <button
            onClick={onClick}
            className="group w-full text-left relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
            style={{
                borderRadius: 16,
                background: 'linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px) scale(1.01)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 36px rgba(236,72,153,0.2), 0 4px 16px rgba(0,0,0,0.4)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(236,72,153,0.35)';
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.25)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
            }}
        >
            {/* Image */}
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1', borderRadius: '15px 15px 0 0' }}>
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {/* Bottom gradient */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)' }} />

                {/* Category badge */}
                {category && (
                    <div style={{
                        position: 'absolute', top: 8, left: 8,
                        fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                        background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)',
                        color: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(4px)',
                        textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>
                        {category}
                    </div>
                )}

                {/* Hover overlay with "View Details" */}
                <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: 'rgba(0,0,0,0.35)' }}
                >
                    <span style={{
                        fontSize: 12, fontWeight: 700,
                        padding: '6px 14px', borderRadius: 99,
                        background: 'linear-gradient(135deg, #ec4899, #6366f1)',
                        color: 'white', letterSpacing: '0.03em',
                    }}>
                        View Details
                    </span>
                </div>
            </div>

            {/* Text content */}
            <div style={{ padding: '10px 12px 12px' }}>
                <h3 style={{
                    fontSize: 'clamp(12px, 2.5vw, 15px)',
                    fontWeight: 700, color: 'white',
                    lineHeight: 1.25, marginBottom: 3,
                    overflow: 'hidden', display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                }} title={name}>{name}</h3>

                <p style={{ fontSize: 11, color: 'rgba(236,72,153,0.8)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>
                    {glass}
                </p>

                <p style={{
                    fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5,
                    overflow: 'hidden', display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                }}>
                    {instructions}
                </p>
            </div>
        </button>
    );
}
