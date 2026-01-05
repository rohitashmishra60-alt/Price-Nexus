import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Sparkles, ShoppingBag, Star, Heart, Menu, User, ArrowRight, Loader2, Zap, TrendingUp, X, Globe, Server, Database } from 'lucide-react';
import { Product, SearchState } from '../types';
import { searchMockProducts } from '../services/mockData';
import { searchProducts, analyzeProductValue, generateProductImage } from '../services/geminiService';
import ChatBot from './ChatBot';

interface DashboardProps {
  onLogout: () => void;
}

const DISCOVERY_TILES = [
    { id: 1, title: "Audio", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80" },
    { id: 2, title: "Fashion", img: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80" },
    { id: 3, title: "Tech", img: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80" },
    { id: 4, title: "Gaming", img: "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=600&q=80" },
    { id: 5, title: "Sneakers", img: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&q=80" },
];

const getSafeHostname = (url: string): string => {
    try {
        if (!url) return 'google.com';
        return new URL(url).hostname;
    } catch (e) {
        return 'google.com';
    }
};

// --- Footer Component ---
const Footer = () => (
    <footer className="w-full border-t border-white/5 bg-black/40 backdrop-blur-md py-8 mt-auto shrink-0 z-20 relative">
        <div className="max-w-[1800px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-shop-purple to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-900/20">
                        <span className="font-bold text-white text-xs">P</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-200 text-sm tracking-tight">PriceNexus</span>
                        <span className="text-[10px] text-gray-500">© 2025 All rights reserved.</span>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-8 text-xs font-medium text-gray-500">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">API Documentation</a>
                <div className="h-4 w-px bg-white/10 hidden md:block"></div>
                <div className="flex items-center gap-2 text-green-500/80 bg-green-500/5 px-3 py-1.5 rounded-full border border-green-500/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Systems Operational
                </div>
            </div>
        </div>
    </footer>
);

// --- Spotlight Card Component ---
const SpotlightCard: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = "", onClick }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      onClick={onClick}
      className={`relative overflow-hidden rounded-3xl border border-white/5 bg-[#0A0A0A] transition-all duration-300 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.08), transparent 40%)`,
        }}
      />
      <div className="relative z-20 h-full">{children}</div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    results: [],
    isLoading: false,
    hasSearched: false,
  });
  
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [displayedAnalysis, setDisplayedAnalysis] = useState('');
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(new Set());
  const [loadingStatus, setLoadingStatus] = useState("Initializing connection...");
  
  // Image Generation State
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});
  const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());

  // Typing effect for analysis
  useEffect(() => {
    if (analysis) {
        setDisplayedAnalysis('');
        let i = 0;
        const timer = setInterval(() => {
            setDisplayedAnalysis(analysis.substring(0, i + 1));
            i++;
            if (i === analysis.length) clearInterval(timer);
        }, 15);
        return () => clearInterval(timer);
    }
  }, [analysis]);

  // Loading Status Cycler
  useEffect(() => {
      if (searchState.isLoading) {
          const statuses = [
              "Handshaking with Amazon.in API...",
              "Querying Flipkart inventory...",
              "Fetching prices from Croma...",
              "Checking Reliance Digital stock...",
              "Aggregating cross-platform data...",
              "Gemini AI validating deals..."
          ];
          let i = 0;
          setLoadingStatus(statuses[0]);
          const interval = setInterval(() => {
              i = (i + 1) % statuses.length;
              setLoadingStatus(statuses[i]);
          }, 800); 
          return () => clearInterval(interval);
      }
  }, [searchState.isLoading]);

  // Handle automatic image generation for products with no images
  useEffect(() => {
    searchState.results.forEach(product => {
        if (!product.image) {
            triggerImageGeneration(product.id, product.name);
        }
    });
  }, [searchState.results]);

  const triggerImageGeneration = async (id: string, name: string) => {
    if (generatingIds.has(id) || generatedImages[id]) return;
    
    setGeneratingIds(prev => new Set(prev).add(id));
    
    // Call Gemini 2.5 Flash Image via service
    const imgData = await generateProductImage(name);
    
    if (imgData) {
        setGeneratedImages(prev => ({ ...prev, [id]: imgData }));
        // Also remove from failed IDs if it was there
        setFailedImageIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    }
    
    setGeneratingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
    });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchState.query.trim()) return;

    setSearchState(prev => ({ ...prev, isLoading: true, hasSearched: true, results: [] }));
    setUsedFallback(false);
    setAnalysis(null); 
    setFailedImageIds(new Set());
    setGeneratedImages({}); // Reset generated images
    setGeneratingIds(new Set());
    
    try {
        let products = await searchProducts(searchState.query);
        
        if (!products || products.length === 0) {
            products = await searchMockProducts(searchState.query);
            if (products.length > 0) {
               setUsedFallback(true);
            }
        }
        setSearchState(prev => ({ 
            ...prev, 
            isLoading: false, 
            results: products 
        }));
    } catch (error) {
        console.error("Search failed completely", error);
        setSearchState(prev => ({ ...prev, isLoading: false, results: [] }));
    }
  };

  const handleAnalyze = async (product: Product) => {
    setAnalyzingId(product.id);
    const result = await analyzeProductValue(product);
    setAnalysis(result);
    setAnalyzingId(null);
  };

  const resetDashboard = () => {
    setSearchState({
        query: '',
        results: [],
        isLoading: false,
        hasSearched: false,
    });
    setAnalysis(null);
    setUsedFallback(false);
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'INR') {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    }
    return `${currency} ${amount}`;
  };

  const sortedResults = useMemo(() => {
    return [...searchState.results]
        .sort((a, b) => {
            const pricesA = a.offers.map(o => o.price).filter(p => typeof p === 'number' && p > 0);
            const minA = pricesA.length > 0 ? Math.min(...pricesA) : Infinity;
            const pricesB = b.offers.map(o => o.price).filter(p => typeof p === 'number' && p > 0);
            const minB = pricesB.length > 0 ? Math.min(...pricesB) : Infinity;
            
            if (minA === Infinity && minB === Infinity) return 0;
            if (minA === Infinity) return 1;
            if (minB === Infinity) return -1;
            
            return minA - minB;
    });
  }, [searchState.results]);

  return (
    <div className="h-screen bg-[#000] text-white font-sans selection:bg-shop-purple/30 flex flex-col overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         <div className="absolute top-[-20%] left-[20%] w-[800px] h-[800px] bg-shop-purple/5 rounded-full blur-[150px] animate-pulse-slow"></div>
         <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 h-16 shrink-0 transition-all duration-300">
        <div className="max-w-[1800px] mx-auto px-4 md:px-6 h-full flex items-center justify-between">
            <div className="flex items-center gap-4">
                 <Menu className="w-5 h-5 text-gray-400 md:hidden hover:text-white cursor-pointer" />
                 <div onClick={resetDashboard} className="cursor-pointer flex items-center gap-2 group">
                     <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-shop-purple to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-900/20 group-hover:scale-105 transition-transform duration-300">
                         <span className="font-bold text-white text-lg">P</span>
                     </div>
                     <span className="text-lg font-bold tracking-tight text-white hidden md:block group-hover:text-gray-200 transition-colors">PriceNexus</span>
                 </div>
            </div>

            {searchState.hasSearched && (
                 <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4 animate-fade-in hidden md:block">
                     <div className="relative group">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-shop-purple transition-colors" />
                         <input 
                             type="text" 
                             value={searchState.query}
                             onChange={(e) => setSearchState(prev => ({...prev, query: e.target.value}))}
                             placeholder="Search products..."
                             className="w-full bg-[#111] text-sm py-2.5 pl-10 pr-4 rounded-full border border-white/10 focus:bg-[#151515] focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all outline-none text-white placeholder:text-gray-600"
                         />
                     </div>
                 </form>
            )}

            <div className="flex items-center gap-3 md:gap-6">
                <ChatBot />
                <button className="p-2 rounded-full hover:bg-white/5 transition-colors text-gray-400 hover:text-white">
                    <TrendingUp className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full hover:bg-white/5 transition-colors text-gray-400 hover:text-white relative">
                    <ShoppingBag className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-shop-purple rounded-full ring-2 ring-black"></span>
                </button>
                <div onClick={onLogout} className="w-9 h-9 rounded-full bg-gradient-to-br from-[#222] to-[#111] border border-white/10 flex items-center justify-center cursor-pointer transition-all hover:border-white/30 group">
                    <User className="w-4 h-4 text-gray-400 group-hover:text-white" />
                </div>
            </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col w-full h-full overflow-hidden">
        
        {/* State 0: Discovery Grid */}
        {!searchState.hasSearched && (
            <div className="flex flex-col h-full w-full overflow-y-auto scrollbar-hide">
                <div className="flex-1 flex flex-col w-full max-w-[1600px] mx-auto px-4 md:px-6 pb-6 min-h-[700px]">
                    <div className="flex-1 flex flex-col items-center justify-center w-full z-10 relative">
                        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                            <div className="absolute top-[10%] left-[5%] md:left-[10%] w-[180px] h-[240px] md:w-[240px] md:h-[320px] rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/5 rotate-[-12deg] opacity-40 blur-[1px] animate-pulse-slow">
                                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80" alt="" className="w-full h-full object-cover rounded-[2rem] opacity-70 mix-blend-luminosity" />
                            </div>
                            <div className="absolute top-[15%] right-[5%] md:right-[10%] w-[200px] h-[260px] md:w-[260px] md:h-[340px] rounded-[2rem] bg-gradient-to-bl from-white/5 to-transparent border border-white/5 rotate-[12deg] opacity-40 blur-[1px] animate-pulse-slow" style={{ animationDelay: '2s' }}>
                                <img src="https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=600&q=80" alt="" className="w-full h-full object-cover rounded-[2rem] opacity-70 mix-blend-luminosity" />
                            </div>
                            <div className="absolute top-[40%] left-[2%] w-[120px] h-[120px] rounded-full border border-white/5 bg-white/5 blur-[2px] opacity-20 animate-bounce delay-700"></div>
                            <div className="absolute top-[20%] right-[20%] w-[80px] h-[80px] rounded-full border border-shop-purple/20 bg-shop-purple/10 blur-[20px] opacity-40"></div>
                        </div>

                        <div className="w-full max-w-2xl flex flex-col items-center animate-slide-up bg-black/60 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 shadow-2xl shadow-black/80 z-10">
                            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-10 text-center bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 drop-shadow-sm">
                                Shop <span className="text-shop-purple">Smart.</span>
                            </h1>
                            <form onSubmit={handleSearch} className="w-full relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-shop-purple via-blue-500 to-shop-purple rounded-full opacity-30 blur-md group-hover:opacity-60 transition-opacity duration-500"></div>
                                <div className="relative bg-black/80 backdrop-blur-2xl rounded-full flex items-center p-2 pl-6 shadow-2xl border border-white/10 group-hover:border-white/20 transition-all">
                                    <Search className="w-6 h-6 text-gray-400 mr-3 group-hover:text-white transition-colors" />
                                    <input 
                                        type="text"
                                        placeholder="Search brands, products, styles..."
                                        className="flex-1 bg-transparent text-lg py-4 outline-none placeholder:text-gray-600 text-white font-medium"
                                        value={searchState.query}
                                        onChange={(e) => setSearchState(prev => ({...prev, query: e.target.value}))}
                                        autoFocus
                                    />
                                    <button type="submit" className="bg-white text-black p-4 rounded-full hover:scale-105 active:scale-95 transition-transform duration-200 shadow-lg shadow-white/10">
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>
                            <div className="mt-10 w-full overflow-hidden whitespace-nowrap mask-linear-fade">
                                <div className="inline-flex animate-scroll items-center gap-8 text-sm text-gray-500 font-mono">
                                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>LIVE:</span>
                                    <span>Sony WH-1000XM5 ₹19,999 (-18%)</span>
                                    <span>•</span>
                                    <span>iPhone 15 ₹65,000</span>
                                    <span>•</span>
                                    <span>Samsung S24 Ultra Low Stock</span>
                                    <span>•</span>
                                    <span>Nike Air Jordan 1 Restocked</span>
                                    <span>•</span>
                                    <span>PS5 Slim ₹39,990</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-48 md:h-64 shrink-0 grid grid-cols-5 gap-4 mt-4 animate-fade-in opacity-0" style={{ animationDelay: '0.3s' }}>
                        {DISCOVERY_TILES.map((tile) => (
                            <SpotlightCard key={tile.id} className="group cursor-pointer hover:border-white/20">
                                <img 
                                    src={tile.img} 
                                    alt={tile.title}
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-1000" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity"></div>
                                <div className="absolute inset-0 p-6 flex flex-col justify-end pointer-events-none">
                                    <h3 className="text-xl font-bold text-white tracking-tight translate-y-2 group-hover:translate-y-0 opacity-80 group-hover:opacity-100 transition-all duration-300">
                                        {tile.title}
                                    </h3>
                                    <div className="h-1 w-8 bg-white/50 mt-2 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
                                </div>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>
                <Footer />
            </div>
        )}

        {searchState.hasSearched && (
            <div className="flex-1 overflow-y-auto w-full scrollbar-hide flex flex-col">
            <div className="max-w-[1800px] mx-auto px-4 md:px-6 pt-8 pb-20 w-full flex-1">
                <div className="flex items-center justify-between mb-8 animate-fade-in">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        Results for <span className="text-shop-purple">"{searchState.query}"</span>
                        <span className="text-sm font-normal text-gray-500 bg-white/5 px-2 py-1 rounded-md">{sortedResults.length} items</span>
                    </h2>
                    <div className="flex gap-2">
                        <select className="bg-black border border-white/10 rounded-lg text-sm px-3 py-2 text-gray-400 focus:outline-none focus:border-white/30 cursor-pointer hover:bg-white/5 transition-colors">
                            <option>Best Match</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {searchState.isLoading && (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-shop-purple/20 blur-xl rounded-full animate-pulse"></div>
                            <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center relative animate-spin-slow">
                                <div className="absolute top-0 w-2 h-2 bg-shop-purple rounded-full shadow-[0_0_10px_#5A31F4]"></div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <h3 className="text-xl font-bold text-white tracking-tight animate-pulse">{loadingStatus}</h3>
                            <div className="flex items-center gap-4 text-xs font-mono text-gray-600 mt-2">
                                <span className="flex items-center gap-1"><Server className="w-3 h-3" /> CONNECTED</span>
                                <span className="flex items-center gap-1"><Database className="w-3 h-3" /> SYNCING</span>
                                <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> PROXY: ON</span>
                            </div>
                        </div>
                    </div>
                )}
                
                {sortedResults.length === 0 && !searchState.isLoading && (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500 animate-fade-in">
                        <Search className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-xl font-medium">No results found for "{searchState.query}"</p>
                        <p className="text-sm mt-2 text-gray-600">Try a different keyword or check your spelling.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-12 gap-x-8">
                    {sortedResults.map((product, index) => {
                         const isGeneratingImg = generatingIds.has(product.id);
                         const hasGeneratedImg = !!generatedImages[product.id];
                         const imageSrc = hasGeneratedImg ? generatedImages[product.id] : product.image;
                         
                         return (
                            <SpotlightCard key={product.id} className="group flex flex-col h-full animate-slide-up hover:border-white/20" >
                                <div style={{ animationDelay: `${index * 0.05}s` }} className="h-full flex flex-col">
                                <a 
                                    href={product.offers[0]?.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-[#0A0A0A] border-b border-white/5 group-hover:border-white/10 transition-all duration-300 m-1"
                                >
                                    <div className="absolute inset-0 w-full h-full p-8 flex items-center justify-center transition-colors duration-500 bg-gradient-to-b from-white/5 to-transparent">
                                        {isGeneratingImg ? (
                                            <div className="flex flex-col items-center justify-center text-shop-purple animate-pulse">
                                                <Sparkles className="w-8 h-8 mb-2" />
                                                <span className="text-xs font-mono font-bold tracking-widest uppercase">Generating Image...</span>
                                            </div>
                                        ) : (
                                            <img 
                                                src={imageSrc} 
                                                alt={product.name}
                                                className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-2xl"
                                                onError={() => {
                                                    if (!hasGeneratedImg) {
                                                        setFailedImageIds(prev => new Set(prev).add(product.id));
                                                        triggerImageGeneration(product.id, product.name);
                                                    }
                                                }}
                                            />
                                        )}
                                    </div>
                                    <div className="absolute top-4 right-4 z-20">
                                        <button className="bg-white/10 hover:bg-white text-white hover:text-black p-2.5 rounded-full backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                                            <Heart className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="absolute top-4 right-14 z-20 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-green-500/30 flex items-center gap-1 text-[10px] text-green-400 font-mono shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Globe className="w-3 h-3" /> LIVE IMG
                                    </div>
                                    <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 border border-white/10 text-white shadow-lg">
                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {product.rating}
                                    </div>
                                </a>

                                <div className="mt-4 flex-1 flex flex-col px-4 pb-4">
                                    <div className="flex justify-between items-start gap-4 mb-2">
                                        <h3 className="font-bold text-lg text-white leading-tight line-clamp-2 group-hover:text-shop-purple transition-colors">
                                            {product.name}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-4">{product.category}</p>
                                    <div className="mt-auto space-y-2 bg-[#111] rounded-xl p-3 border border-white/5">
                                        {product.offers.slice(0, 2).map((offer, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-5 h-5 rounded-md bg-white flex items-center justify-center overflow-hidden shrink-0">
                                                        <img src={`https://www.google.com/s2/favicons?domain=${getSafeHostname(offer.url)}&sz=32`} className="w-4 h-4" alt="" />
                                                    </div>
                                                    <span className="text-gray-400 truncate max-w-[100px]">{offer.store}</span>
                                                </div>
                                                <span className={`font-mono font-medium ${idx === 0 ? 'text-green-400' : 'text-gray-500'}`}>
                                                    {formatCurrency(offer.price, offer.currency)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-3">
                                        <button 
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAnalyze(product); }}
                                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white text-gray-300 hover:text-black font-medium text-sm transition-all border border-white/5 group-active:scale-[0.98] relative z-30"
                                            disabled={analyzingId === product.id}
                                        >
                                             {analyzingId === product.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" /> AI Analysis</>}
                                        </button>
                                    </div>
                                </div>
                                </div>
                            </SpotlightCard>
                         );
                    })}
                </div>
                {analysis && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => setAnalysis(null)}>
                        <div className="bg-[#0A0A0A] p-8 rounded-[2rem] shadow-2xl max-w-md w-full animate-slide-up border border-white/10 relative overflow-hidden" onClick={e => e.stopPropagation()}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-shop-purple/20 blur-[60px] rounded-full pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none"></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3 text-shop-purple font-bold text-lg">
                                        <div className="p-2 bg-shop-purple/10 rounded-lg">
                                            <Sparkles className="w-5 h-5" /> 
                                        </div>
                                        Gemini Insight
                                    </div>
                                    <button onClick={() => setAnalysis(null)} className="text-gray-500 hover:text-white transition-colors">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <div className="min-h-[100px] text-gray-200 text-lg leading-relaxed font-light mb-8 font-mono">
                                    {displayedAnalysis}
                                    <span className="inline-block w-2 h-5 bg-shop-purple ml-1 animate-pulse align-middle"></span>
                                </div>
                                <button 
                                    onClick={() => setAnalysis(null)}
                                    className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
                                >
                                    Close Analysis
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
            </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;