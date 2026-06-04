"use client";

import { useState } from "react";
// FIX: Imported the User icon for the new Name field
import { Mail, Lock, ArrowRight, User, Dumbbell } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // FIX: Added 'name' to the state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      if (!isLogin) {
        // --- SIGN UP LOGIC ---
        // 1. Send the new user data to your registration API route
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to create account.");
        }
        // If registration is successful, it drops down to log them in automatically!
      }

      // --- LOGIN LOGIC ---
      // 2. Log the user in (works for both existing users and brand new sign-ups)
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setErrorMessage("Invalid email or password. Please try again.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-11 pr-4 py-3.5 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-sm";

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-zinc-950 overflow-hidden font-sans selection:bg-emerald-500/30 p-4">
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-900/20 blur-[128px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-800/20 blur-[128px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-4">
            <Dumbbell className="w-8 h-8 text-zinc-950" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
            AI<span className="text-emerald-500">thlete</span>
          </h1>
          <p className="text-zinc-400 mt-2 text-sm text-center">
            {isLogin ? "Welcome back to your AI Fitness Trainer." : "Start optimizing your fitness journey."}
          </p>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* FIX: Conditionally render the Name field ONLY during Sign Up */}
            {!isLogin && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Full Name"
                  required={!isLogin} // Only required if signing up
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputClasses}
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="email" 
                placeholder="Email address"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputClasses}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="password" 
                placeholder="Password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={inputClasses}
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="group cursor-pointer relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-zinc-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <span className="flex items-center gap-2">
                {isLoading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
                {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>
          </form>

          
        </div>

        <p className="mt-8 text-center text-sm text-zinc-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMessage(""); // Clear any errors when switching modes
            }}
            className="font-semibold cursor-pointer text-emerald-400 hover:text-emerald-300 hover:underline transition-all focus:outline-none"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>

      </div>
    </div>
  );
}