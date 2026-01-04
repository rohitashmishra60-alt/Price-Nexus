import React, { useState, useEffect } from 'react';
import { Loader2, Chrome, Mail, Lock, User, ArrowRight, AlertTriangle } from 'lucide-react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile,
  AuthError
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    console.log("Current Hostname for Firebase Auth:", window.location.hostname);
  }, []);

  // Helper to parse Firebase errors
  const handleFirebaseError = (err: any) => {
    console.error("Auth Error Full Object:", err);
    let msg = "An unexpected error occurred.";
    
    if (err.code === 'auth/unauthorized-domain') {
        msg = `Domain "${window.location.hostname}" is not authorized. In Firebase Console -> Authentication -> Settings -> Authorized Domains, add this domain.`;
    } else if (err.code === 'auth/popup-closed-by-user') {
        msg = "Sign-in cancelled.";
    } else if (err.code === 'auth/popup-blocked') {
        msg = "Popup blocked. Please allow popups for this site.";
    } else if (err.code === 'auth/invalid-api-key') {
        msg = "Invalid API Key. Please check your Firebase config.";
    } else if (err.code === 'auth/email-already-in-use') {
        msg = "Email already in use. Try signing in instead.";
    } else if (err.code === 'auth/invalid-credential') {
        msg = "Invalid credentials provided.";
    } else if (err.code === 'auth/network-request-failed') {
        msg = "Network error. Check your internet connection or firewall.";
    } else if (err.message && err.message.includes("iframe")) {
        msg = "Google Sign-In may be blocked by this preview environment. Please use email/password.";
    } else if (err.message) {
        msg = `${err.message} (${err.code})`;
    }
    
    setError(msg);
  };

  // Handle Email/Password Auth
  const handleAuth = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);

    // FALLBACK: If Firebase keys are missing, use Mock Login
    if (!auth) {
        setTimeout(() => {
            onLogin();
            setIsLoading(false);
        }, 1500);
        return;
    }

    try {
      if (isSignUp) {
        // Sign Up Logic
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          formData.email, 
          formData.password
        );
        
        const user = userCredential.user;

        // Update Display Name
        await updateProfile(user, {
          displayName: formData.name
        });

        // Create User Document in Firestore
        if (db) {
            await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: formData.name,
            email: formData.email,
            createdAt: new Date().toISOString(),
            provider: 'email'
            });
        }

      } else {
        // Login Logic
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      }
      
      onLogin();
    } catch (err: any) {
      handleFirebaseError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Social Login (Google)
  const handleSocialLogin = async (provider: any, providerName: string) => {
    setIsLoading(true);
    setError(null);

    // FALLBACK: If Firebase keys are missing, use Mock Login
    if (!auth) {
        setTimeout(() => {
            onLogin();
            setIsLoading(false);
        }, 1500);
        return;
    }

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save/Update user in Firestore (merge: true avoids overwriting existing data)
      if (db) {
        try {
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name: user.displayName || "Unknown User",
                email: user.email,
                lastLogin: new Date().toISOString(),
                provider: providerName
            }, { merge: true });
        } catch (dbError) {
             console.warn("Firestore write failed, but auth succeeded.", dbError);
        }
      }

      onLogin();
      setIsLoading(false);
    } catch (err: any) {
      console.error("Auth Error:", err);

      // --- SMART FALLBACK FOR PREVIEW ENVIRONMENTS ---
      // If we hit common environment restrictions (unauthorized domain, popup blocked, iframe issues),
      // we gracefully fall back to "Demo Mode" so the user is not locked out of the app.
      const isEnvironmentIssue = 
        err.code === 'auth/unauthorized-domain' || 
        err.code === 'auth/popup-blocked' || 
        err.code === 'auth/operation-not-allowed' ||
        (err.message && err.message.includes("iframe"));

      if (isEnvironmentIssue) {
          const reason = err.code === 'auth/unauthorized-domain' ? 'Domain not authorized' : 'Popup blocked';
          setError(`${reason}. Enabling Demo Access...`);
          
          setTimeout(() => {
              onLogin();
              setIsLoading(false);
          }, 1500);
          return;
      }

      handleFirebaseError(err);
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ name: '', email: '', password: '' });
    setError(null);
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
            
            {/* Mock Mode Warning */}
            {!auth && (
                <div className="mb-6 p-3 rounded-lg bg-amber-900/20 border border-amber-900/50 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                    <div className="text-xs text-amber-200/80">
                        <strong className="block text-amber-100 mb-1">Demo Mode Active</strong>
                        Firebase is not connected. Login will be simulated.
                    </div>
                </div>
            )}
            
            {/* Social Auth */}
            <div className="mb-6">
                <button 
                    type="button"
                    onClick={() => handleSocialLogin(googleProvider, 'Google')}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-[#111] hover:bg-[#1a1a1a] text-white py-2.5 px-4 rounded-lg border border-gray-800 transition-all duration-200 hover:border-gray-600 group disabled:opacity-50"
                >
                    <Chrome className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    <span className="text-sm font-medium">Continue with Google</span>
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

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-900/20 border border-red-900/50 text-red-200 text-xs text-center break-words font-mono">
                    {error}
                </div>
            )}

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
                              disabled={isLoading}
                              className="w-full bg-[#111] text-sm py-2.5 pl-10 pr-4 rounded-lg border border-gray-800 focus:bg-[#0a0a0a] focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-white placeholder:text-gray-700 disabled:opacity-50"
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
                            disabled={isLoading}
                            className="w-full bg-[#111] text-sm py-2.5 pl-10 pr-4 rounded-lg border border-gray-800 focus:bg-[#0a0a0a] focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-white placeholder:text-gray-700 disabled:opacity-50"
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
                            disabled={isLoading}
                            className="w-full bg-[#111] text-sm py-2.5 pl-10 pr-4 rounded-lg border border-gray-800 focus:bg-[#0a0a0a] focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-white placeholder:text-gray-700 disabled:opacity-50"
                        />
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2 relative overflow-hidden group shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] disabled:opacity-70 disabled:cursor-not-allowed"
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

            <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button 
                        onClick={toggleMode}
                        disabled={isLoading}
                        className="text-white font-medium hover:underline hover:text-gray-200 transition-colors ml-1 focus:outline-none disabled:opacity-50"
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