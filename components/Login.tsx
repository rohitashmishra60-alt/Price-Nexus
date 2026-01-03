import React, { useState } from 'react';
import { Loader2, Chrome, Mail, Lock, User, ArrowRight, Github } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true); // Default to Registration per request
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleAuth = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    
    // Simulate API/Firebase delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground dot-bg relative overflow-hidden px-4">
        
        {/* Ambient Background Effects */}
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-gray-800 to-transparent opacity-50"></div>
        <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-gray-800 to-transparent opacity-50"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none"></div>

        <button onClick={onBack} className="absolute top-8 left-8 text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-2 group z-20">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back
        </button>

      <div className="w-full max-w-[400px] animate-slide-up relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-gray-100 to-gray-400 rounded-xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.15)] ring-1 ring-white/20">
            <div className="w-6 h-6 bg-black mask-icon"></div>
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-black" stroke="currentColor" strokeWidth="3">
               <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
            {isSignUp ? "Create an account" : "Welcome back"}
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            {isSignUp ? "Enter your details to get started." : "Enter your credentials to access your dashboard."}
          </p>
        </div>

        {/* Card */}
        <div className="p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent shadow-2xl">
          <div className="bg-[#050505] rounded-xl border border-white/5 p-6 md:p-8 backdrop-blur-xl">
            
            {/* Social Auth */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <button 
                    onClick={() => handleAuth()}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 bg-[#111] hover:bg-[#1a1a1a] text-white py-2.5 px-4 rounded-lg border border-gray-800 transition-all duration-200 hover:border-gray-600 group"
                >
                    <Chrome className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    <span className="text-sm font-medium">Google</span>
                </button>
                <button 
                    onClick={() => handleAuth()}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 bg-[#111] hover:bg-[#1a1a1a] text-white py-2.5 px-4 rounded-lg border border-gray-800 transition-all duration-200 hover:border-gray-600 group"
                >
                    <Github className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    <span className="text-sm font-medium">GitHub</span>
                </button>
            </div>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#050505] px-2 text-gray-600">Or continue with</span>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleAuth} className="space-y-4">
                
                {/* Username Field (Only for Sign Up) */}
                {isSignUp && (
                  <div className="space-y-1 animate-fade-in">
                      <label className="text-xs font-medium text-gray-400 ml-1">Username</label>
                      <div className="relative group">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-white transition-colors" />
                          <input 
                              type="text"
                              required={isSignUp}
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              placeholder="johndoe"
                              className="w-full bg-[#111] text-sm py-2.5 pl-10 pr-4 rounded-lg border border-gray-800 focus:bg-[#0a0a0a] focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-white placeholder:text-gray-700"
                          />
                      </div>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 ml-1">Email address</label>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-white transition-colors" />
                        <input 
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="name@example.com"
                            className="w-full bg-[#111] text-sm py-2.5 pl-10 pr-4 rounded-lg border border-gray-800 focus:bg-[#0a0a0a] focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-white placeholder:text-gray-700"
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 ml-1">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-white transition-colors" />
                        <input 
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            placeholder="••••••••"
                            className="w-full bg-[#111] text-sm py-2.5 pl-10 pr-4 rounded-lg border border-gray-800 focus:bg-[#0a0a0a] focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-white placeholder:text-gray-700"
                        />
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2 relative overflow-hidden group shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            {isSignUp ? "Create Account" : "Sign In"}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button 
                        onClick={toggleMode}
                        className="text-white font-medium hover:underline hover:text-gray-200 transition-colors ml-1 focus:outline-none"
                    >
                        {isSignUp ? "Sign in" : "Sign up"}
                    </button>
                </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center px-8">
             <p className="text-[10px] text-gray-600 leading-relaxed">
                By continuing, you agree to PriceNexus's <span className="underline cursor-pointer hover:text-gray-400">Terms of Service</span> and acknowledge you've read our <span className="underline cursor-pointer hover:text-gray-400">Privacy Policy</span>.
             </p>
        </div>
      </div>
    </div>
  );
};

export default Login;