'use client';

import { useState } from 'react';
import CocktailCard from './CocktailCard';
import CocktailModal from './CocktailModal';

interface Cocktail {
    id: string;
    name: string;
    image: string;
    glass: string;
    instructions: string;
    category?: string;
    alcoholic?: string;
}

interface CocktailGridProps {
    cocktails: Cocktail[];
}

export default function CocktailGrid({ cocktails }: CocktailGridProps) {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<Cocktail | null>(null);

    const filteredCocktails = cocktails.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    // Empty search → top 16; active search → full filtered results
    const displayCocktails = search ? filteredCocktails : cocktails.slice(0, 16);

    return (
        <div className="w-full">

            {/* Search bar */}
            <div className="mb-8 flex flex-col items-center gap-2">
                <div className="relative w-full sm:max-w-md group">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="search"
                        placeholder="Search cocktails..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 rounded-full bg-black/30 border border-white/20 text-sm sm:text-base text-white placeholder-gray-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-black/50 transition-all shadow-xl"
                    />
                </div>
                {!search && (
                    <p className="text-gray-400 text-xs sm:text-sm text-center px-2">
                        Showing top 16 picks · Search to explore all {cocktails.length} drinks · Tap any card for full details
                    </p>
                )}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {displayCocktails.map((cocktail) => (
                    <CocktailCard
                        key={cocktail.id}
                        {...cocktail}
                        onClick={() => setSelected(cocktail)}
                    />
                ))}
            </div>

            {/* Empty state */}
            {displayCocktails.length === 0 && (
                <div className="text-center text-gray-400 mt-10 py-10 px-4 bg-black/20 rounded-xl backdrop-blur-sm">
                    <p className="text-base sm:text-xl mb-3">No cocktails found for &ldquo;{search}&rdquo;</p>
                    <button
                        onClick={() => setSearch('')}
                        className="text-pink-400 hover:text-pink-300 underline text-sm sm:text-base"
                    >
                        Clear search
                    </button>
                </div>
            )}

            {/* Detail modal */}
            {selected && (
                <CocktailModal
                    cocktail={selected}
                    onClose={() => setSelected(null)}
                />
            )}
        </div>
    );
}
