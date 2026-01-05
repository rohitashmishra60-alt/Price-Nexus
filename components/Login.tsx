import React, { useState, useEffect } from 'react';
import { Loader2, Chrome, Mail, Lock, User, ArrowRight, AlertTriangle } from 'lucide-react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from '../services/firebase';

interface LoginProps {
  onLogin: () => void;
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDomainError, setIsDomainError] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Helper to parse Firebase errors
  const handleFirebaseError = (err: any) => {
    console.error("Auth Error Full Object:", err);
    let msg = "An unexpected error occurred.";
    
    if (err.code === 'auth/unauthorized-domain') {
        msg = `Domain "${window.location.hostname}" is not authorized in Firebase.`;
        setIsDomainError(true);
    } else if (err.code === 'auth/popup-closed-by-user') {
        msg = "Sign-in cancelled.";
    } else if (err.code === 'auth/popup-blocked') {
        msg = "Popup blocked. Please allow popups.";
    } else if (err.code === 'auth/email-already-in-use') {
        msg = "Email already in use. Try signing in.";
    } else if (err.code === 'auth/invalid-credential') {
        msg = "Invalid credentials provided.";
    } else {
        msg = err.message || "Authentication failed.";
    }
    
    setError(msg);
  };

  const handleAuth = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);
    setIsDomainError(false);

    if (!auth) {
        setTimeout(() => { onLogin(); setIsLoading(false); }, 1000);
        return;
    }

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await updateProfile(userCredential.user, { displayName: formData.name });
        if (db) {
            await setDoc(doc(db, "users", userCredential.user.uid), {
                uid: userCredential.user.uid,
                name: formData.name,
                email: formData.email,
                createdAt: new Date().toISOString()
            });
        }
      } else {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      }
      onLogin();
    } catch (err: any) {
      handleFirebaseError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: any) => {
    setIsLoading(true);
    setError(null);
    setIsDomainError(false);

    if (!auth || !provider) {
        setTimeout(() => { onLogin(); setIsLoading(false); }, 1000);
        return;
    }

    try {
      await signInWithPopup(auth, provider);
      onLogin();
    } catch (err: any) {
      handleFirebaseError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground dot-bg relative overflow-hidden px-4">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-gray-800 to-transparent opacity-50"></div>
        <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-gray-800 to-transparent opacity-50"></div>
        
        <button onClick={onBack} className="absolute top-8 left-8 text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-2 group z-20">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back
        </button>

      <div className="w-full max-w-[400px] animate-slide-up relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-gray-100 to-gray-400 rounded-xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.15)] ring-1 ring-white/20">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-black" stroke="currentColor" strokeWidth="3">
               <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
            {isSignUp ? "Create an account" : "Welcome back"}
          </h2>
        </div>

        <div className="p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent shadow-2xl">
          <div className="bg-[#050505] rounded-xl border border-white/5 p-6 md:p-8 backdrop-blur-xl">
            
            {isDomainError && (
                <div className="mb-6 p-4 rounded-xl bg-amber-900/20 border border-amber-900/50">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        <span className="text-sm font-bold text-amber-200">Unauthorized Domain</span>
                    </div>
                    <p className="text-xs text-amber-200/60 mb-4">Firebase Auth is restricted. You can continue using a demo session.</p>
                    <button 
                        onClick={onLogin}
                        className="w-full py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-bold rounded-lg border border-amber-500/30 transition-all"
                    >
                        ENTER DEMO MODE
                    </button>
                </div>
            )}
            
            {!isDomainError && (
                <>
                    <button 
                        type="button"
                        onClick={() => handleSocialLogin(googleProvider)}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-[#111] hover:bg-[#1a1a1a] text-white py-2.5 px-4 rounded-lg border border-gray-800 transition-all group disabled:opacity-50"
                    >
                        <Chrome className="w-4 h-4 text-gray-400 group-hover:text-white" />
                        <span className="text-sm font-medium">Continue with Google</span>
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#050505] px-2 text-gray-600">Or email</span></div>
                    </div>

                    {error && !isDomainError && <div className="mb-4 p-3 rounded-lg bg-red-900/20 border border-red-900/50 text-red-200 text-xs text-center font-mono">{error}</div>}

                    <form onSubmit={handleAuth} className="space-y-4">
                        {isSignUp && (
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400 ml-1">Username</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="johndoe" className="w-full bg-[#111] text-sm py-2.5 px-4 rounded-lg border border-gray-800 text-white outline-none focus:border-white/20" />
                            </div>
                        )}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 ml-1">Email</label>
                            <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="name@example.com" className="w-full bg-[#111] text-sm py-2.5 px-4 rounded-lg border border-gray-800 text-white outline-none focus:border-white/20" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 ml-1">Password</label>
                            <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" className="w-full bg-[#111] text-sm py-2.5 px-4 rounded-lg border border-gray-800 text-white outline-none focus:border-white/20" />
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full bg-white text-black font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 group shadow-xl">
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{isSignUp ? "Create Account" : "Sign In"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1" /></>}
                        </button>
                    </form>
                </>
            )}

            <div className="mt-4 text-center">
                <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;