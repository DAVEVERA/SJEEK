import fs from 'fs';
import path from 'path';
import BackgroundVideo from './components/BackgroundVideo';
import AIBartender from './components/AIBartender';
import CocktailGrid from './components/CocktailGrid';

const getData = () => {
  try {
    const filePath = path.join(process.cwd(), 'app/data/cocktails.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Error reading data", error);
    return [];
  }
};

export default function Home() {
  const cocktails = getData();

  return (
    <main className="min-h-screen relative">
      <BackgroundVideo />

      {/* Hero Header */}
      <div className="relative z-10 w-full px-4 pt-10 pb-6 text-center">
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-3 drop-shadow-2xl">
          SJEEK
        </h1>
        <p className="text-base sm:text-lg md:text-2xl text-white font-light tracking-wide bg-black/30 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 max-w-xl mx-auto">
          Discover the art of mixology with our curated collection of premium cocktails.
        </p>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full px-3 sm:px-6 md:px-8 pb-16 space-y-12 md:space-y-20 max-w-7xl mx-auto">

        {/* AI Bartender */}
        <section>
          <AIBartender />
        </section>

        {/* Cocktail Collection */}
        <section id="collection" className="scroll-mt-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 text-center drop-shadow-lg">
            Curated Collection
          </h2>
          <CocktailGrid cocktails={cocktails} />
        </section>

      </div>
    </main>
  );
}
