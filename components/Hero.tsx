import React from 'react';
import { ArrowRight, Box, Zap, ShoppingBag, Globe, Smartphone, Monitor } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-background text-foreground">
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 opacity-20 grid-bg"></div>
      
      {/* Animated Gradient Orb */}
      <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-purple-900/40 via-blue-900/20 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col items-center justify-center text-center pt-20">
        
        {/* Badge */}
        <div className="mb-8 animate-fade-in opacity-0" style={{ animationDelay: '0.1s' }}>
          <span className="px-3 py-1 rounded-full border border-gray-800 bg-gray-900/50 text-xs text-gray-400 font-mono flex items-center gap-2 backdrop-blur-md shadow-lg shadow-purple-900/10">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            POWERED BY GEMINI 2.0
          </span>
        </div>

        {/* Hero Text */}
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500 animate-slide-up opacity-0" style={{ animationDelay: '0.2s' }}>
          Price is <br className="hidden md:block" />
          <span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">everything.</span>
        </h1>

        <p className="max-w-2xl text-lg text-gray-400 mb-10 leading-relaxed animate-slide-up opacity-0" style={{ animationDelay: '0.3s' }}>
          The fastest price intelligence engine for savvy shoppers. 
          Real-time scraping, cross-platform comparison, and AI-driven 
          value analysis.
        </p>

        {/* CTA Button with Beam Effect */}
        <div className="group relative animate-slide-up opacity-0" style={{ animationDelay: '0.4s' }}>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <button 
            onClick={onGetStarted}
            className="relative flex items-center gap-2 px-8 py-4 bg-black rounded-lg leading-none border border-gray-800 text-white font-semibold tracking-wide hover:bg-gray-900 transition-all duration-300 shadow-xl"
          >
            GET STARTED
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
         {/* Feature Grid - Dotted Line Separator */}
        <div className="w-full max-w-6xl mt-24 border-t border-dashed border-gray-800 relative z-10 animate-fade-in opacity-0" style={{ animationDelay: '0.6s' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-dashed divide-gray-800">
            
            <div className="p-8 group cursor-default hover:bg-white/5 transition-colors duration-500">
                <div className="mb-4 p-3 bg-gray-900/50 w-fit rounded-lg border border-gray-800 group-hover:border-gray-600 transition-colors">
                <Zap className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-200">Real-time Sync</h3>
                <p className="text-sm text-gray-500">Live price updates from Amazon, Flipkart, and 50+ other retailers instantly.</p>
            </div>

            <div className="p-8 group cursor-default hover:bg-white/5 transition-colors duration-500">
                <div className="mb-4 p-3 bg-gray-900/50 w-fit rounded-lg border border-gray-800 group-hover:border-gray-600 transition-colors">
                <Box className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-200">AI Analysis</h3>
                <p className="text-sm text-gray-500">Gemini analyzes price history and product specs to tell you if it's a good buy.</p>
            </div>

            <div className="p-8 group cursor-default hover:bg-white/5 transition-colors duration-500">
                <div className="mb-4 p-3 bg-gray-900/50 w-fit rounded-lg border border-gray-800 group-hover:border-gray-600 transition-colors">
                <ShoppingBag className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-200">One-Click Cart</h3>
                <p className="text-sm text-gray-500">Unified shopping experience. Add to cart across platforms from a single dashboard.</p>
            </div>

            </div>
        </div>
      </div>

      {/* Infinite Brand Ticker */}
      <div className="relative w-full border-t border-white/5 bg-black/50 backdrop-blur-sm py-6 overflow-hidden mt-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none"></div>
          <div className="flex animate-scroll whitespace-nowrap hover:pause">
              {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-16 mx-8 items-center text-gray-600 font-bold text-lg uppercase tracking-widest opacity-60">
                      <span className="flex items-center gap-2 hover:text-white transition-colors"><Globe className="w-5 h-5" /> Amazon</span>
                      <span className="flex items-center gap-2 hover:text-white transition-colors"><Zap className="w-5 h-5" /> Flipkart</span>
                      <span className="flex items-center gap-2 hover:text-white transition-colors"><ShoppingBag className="w-5 h-5" /> Myntra</span>
                      <span className="flex items-center gap-2 hover:text-white transition-colors"><Box className="w-5 h-5" /> Shopify</span>
                      <span className="flex items-center gap-2 hover:text-white transition-colors"><Monitor className="w-5 h-5" /> BestBuy</span>
                      <span className="flex items-center gap-2 hover:text-white transition-colors"><Smartphone className="w-5 h-5" /> TataCliq</span>
                      <span className="flex items-center gap-2 hover:text-white transition-colors"><Globe className="w-5 h-5" /> Ajio</span>
                      <span className="flex items-center gap-2 hover:text-white transition-colors"><Zap className="w-5 h-5" /> eBay</span>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default Hero;