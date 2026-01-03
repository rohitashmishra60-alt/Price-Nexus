import React, { useState } from 'react';
import { Loader2, Github, Chrome } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSimulatedLogin = () => {
    setIsLoading(true);
    // Simulate Firebase delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground dot-bg relative overflow-hidden">
        {/* Subtle background beams */}
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-gray-800 to-transparent"></div>
        <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-gray-800 to-transparent"></div>

        <button onClick={onBack} className="absolute top-8 left-8 text-sm text-gray-500 hover:text-white transition-colors">
            ← Back
        </button>

      <div className="w-full max-w-md p-8 rounded-2xl border border-gray-800 bg-black/80 backdrop-blur-xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-black" stroke="currentColor" strokeWidth="3">
               <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-gray-500 mt-2 text-sm">Sign in to access your price intelligence dashboard.</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleSimulatedLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white py-3 px-4 rounded-lg border border-gray-700 transition-all duration-200 group relative overflow-hidden"
          >
             {/* Micro-interaction beam on hover */}
             <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-beam"></div>
             
             {isLoading ? (
               <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
             ) : (
               <>
                <Chrome className="w-5 h-5 text-gray-300" />
                <span className="font-medium">Continue with Google</span>
               </>
             )}
          </button>

          <button 
             disabled={isLoading}
             className="w-full flex items-center justify-center gap-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white py-3 px-4 rounded-lg border border-gray-700 transition-all duration-200"
          >
             <Github className="w-5 h-5 text-gray-300" />
             <span className="font-medium">Continue with GitHub</span>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
             <p className="text-xs text-gray-600">
                By clicking continue, you agree to our <span className="underline cursor-pointer hover:text-white">Terms of Service</span> and <span className="underline cursor-pointer hover:text-white">Privacy Policy</span>.
             </p>
        </div>
      </div>
    </div>
  );
};

export default Login;