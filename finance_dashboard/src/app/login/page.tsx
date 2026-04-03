'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { useFinanceStore } from '@/store/useStore';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useFinanceStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let user;
      if (isSignUp) {
        user = await authService.register(name, email, password);
        toast.success(`Account created! Welcome, ${user.name}!`);
      } else {
        user = await authService.login(email, password);
        toast.success(`Welcome back, ${user.name}!`);
      }
      setUser(user);
      router.push('/');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || (isSignUp ? 'Warning: Registration failed. Use a valid name and email.' : 'Invalid email or password'));
    } finally {
      setLoading(false);
    }
  };

  const autofill = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#eef2f6] flex flex-col items-center justify-center p-4 font-sans">
      
      {/* 3D Isometric Floating Dashboard Cards Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none perspective-[1000px]">
        <div className="absolute top-1/2 left-1/2 w-[150vw] h-[150vh] -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] rotate-x-[10deg] scale-100 flex gap-6 justify-center items-center">
           
           {/* Column 1 */}
           <div className="flex flex-col gap-6 w-72 animate-in slide-in-from-bottom-24 duration-1000 mt-[-200px]">
              <div className="h-40 rounded-3xl bg-white shadow-2xl border border-white/50 p-6 flex flex-col gap-4">
                 <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><div className="w-4 h-4 bg-blue-500 rounded-full"></div></div>
                 <div className="h-4 w-2/3 bg-slate-100 rounded-full"></div>
                 <div className="h-4 w-1/3 bg-slate-100 rounded-full"></div>
              </div>
              <div className="h-64 rounded-3xl bg-blue-600 shadow-[0_20px_40px_-15px_rgba(37,99,235,0.5)] p-6">
                 <div className="h-6 w-1/2 bg-white/20 rounded-full mb-4"></div>
                 <div className="text-white font-bold text-3xl">14.9K</div>
              </div>
              <div className="h-48 rounded-3xl bg-white shadow-2xl border border-white/50"></div>
           </div>
           
           {/* Column 2 */}
           <div className="flex flex-col gap-6 w-96 animate-in slide-in-from-top-24 duration-1000">
              <div className="h-24 rounded-3xl bg-white shadow-xl flex items-center p-4 gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl"></div>
                   <div className="flex-1 space-y-2">
                       <div className="h-3 w-1/2 bg-slate-200 rounded-full"></div>
                       <div className="h-3 w-full bg-slate-100 rounded-full"></div>
                   </div>
              </div>
              <div className="h-72 rounded-3xl bg-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] p-8 flex flex-col justify-end gap-2 border border-white/50">
                 <div className="text-xl font-bold text-slate-800 mb-4">$13,890</div>
                 <div className="flex items-end gap-3 h-32">
                    <div className="w-6 h-12 bg-blue-500 rounded-t-sm"></div>
                    <div className="w-6 h-20 bg-blue-500 rounded-t-sm"></div>
                    <div className="w-6 h-16 bg-blue-500 rounded-t-sm"></div>
                    <div className="w-6 h-24 bg-blue-500 rounded-t-sm"></div>
                    <div className="w-6 h-10 bg-blue-500 rounded-t-sm"></div>
                    <div className="w-6 h-28 bg-blue-500 rounded-t-sm"></div>
                 </div>
              </div>
              <div className="h-32 rounded-3xl bg-indigo-500 shadow-xl p-6"></div>
           </div>

           {/* Column 3 */}
           <div className="flex flex-col gap-6 w-80 animate-in slide-in-from-bottom-24 duration-1000 mt-24">
              <div className="h-56 rounded-3xl bg-white shadow-2xl p-6 border border-white/50">
                 <div className="w-full h-24 border-b-2 border-slate-100 relative">
                    {/* Simulated SVG line chart */}
                    <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible stroke-indigo-500" strokeWidth="3" fill="none">
                       <path d="M0,40 Q20,20 40,30 T80,10 T100,5" strokeLinecap="round" />
                    </svg>
                 </div>
              </div>
              <div className="h-40 rounded-3xl bg-white shadow-xl flex items-center justify-center">
                 <div className="w-20 h-20 rounded-full border-[6px] border-emerald-400 border-t-transparent shadow-emerald-400/20"></div>
              </div>
              <div className="h-64 rounded-3xl bg-white shadow-2xl border border-white/50"></div>
           </div>

        </div>
      </div>

      {/* Light Overlay to maintain visibility but not wash out */}
      <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] z-0" />

      {/* High-Contrast Glassmorphic Light Container */}
      <div className="relative z-10 w-full max-w-md bg-white/40 backdrop-blur-3xl border border-white/70 rounded-[2rem] p-8 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.25)] animate-in slide-in-from-bottom-8 fade-in duration-1000">
        
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 mb-4 shadow-lg shadow-blue-500/30 rotate-3 transition-transform">
            <span className="text-2xl font-black text-white tracking-tighter">LF</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            LedgerFlow
          </h1>
          <p className="text-slate-600 mt-2 text-xs font-semibold">
            {isSignUp ? 'Join the future of finance' : 'Welcome back to your dashboard'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="animate-in slide-in-from-top-4 fade-in duration-500">
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest pl-1 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-white/60 backdrop-blur-md border border-white/80 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/90 transition-all placeholder-slate-500 font-semibold shadow-inner"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest pl-1 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white/60 backdrop-blur-md border border-white/80 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/90 transition-all placeholder-slate-500 font-semibold shadow-inner"
              placeholder="you@company.com"
            />
          </div>

          <div>
             <div className="flex justify-between items-center pl-1 mb-1.5">
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest">Password</label>
                {!isSignUp && <a href="#" className="text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors">Forgot?</a>}
             </div>
             <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/60 backdrop-blur-md border border-white/80 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/90 transition-all placeholder-slate-500 font-bold tracking-widest shadow-inner"
                placeholder="••••••••"
             />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center items-center bg-slate-900 text-white font-extrabold rounded-xl py-3 mt-4 transition-all active:scale-95 disabled:opacity-50 overflow-hidden shadow-lg shadow-slate-900/20 hover:shadow-blue-500/30"
          >
            <div className="absolute inset-0 w-0 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-[400ms] ease-out group-hover:w-full z-0"></div>
            <span className="relative z-10 text-white transition-colors duration-300 flex items-center text-sm">
               {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
               {isSignUp ? 'Create Account' : 'Secure Login'}
            </span>
          </button>
        </form>

        <div className="mt-5 text-center text-xs">
          <span className="text-slate-600 font-medium">
            {isSignUp ? 'Already have an account?' : "New to LedgerFlow?"}
          </span>{' '}
          <button 
            type="button" 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 font-extrabold hover:text-indigo-700 transition-colors"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>

        {!isSignUp && (
          <div className="mt-6 pt-5 border-t border-slate-300/30">
            <div className="text-center mb-4">
               <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] bg-white/60 border border-white/80 px-3 py-1 rounded-full shadow-sm backdrop-blur-md">Quick Access Demos</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <button 
                type="button" 
                onClick={() => autofill('admin@finance.com', 'admin1')} 
                className="group flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/40 border border-white/60 hover:bg-white/80 transition-all shadow-sm backdrop-blur-md"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mb-1.5 group-hover:shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all"></div>
                <span className="text-[10px] font-bold text-slate-600 group-hover:text-blue-700">Admin</span>
              </button>
              <button 
                type="button" 
                onClick={() => autofill('analyst@finance.com', 'analyst2')} 
                className="group flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/40 border border-white/60 hover:bg-white/80 transition-all shadow-sm backdrop-blur-md"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mb-1.5 group-hover:shadow-[0_0_8px_rgba(99,102,241,0.6)] transition-all"></div>
                <span className="text-[10px] font-bold text-slate-600 group-hover:text-indigo-700">Analyst</span>
              </button>
              <button 
                type="button" 
                onClick={() => autofill('viewer@finance.com', 'viewer3')} 
                className="group flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/40 border border-white/60 hover:bg-white/80 transition-all shadow-sm backdrop-blur-md"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mb-1.5 group-hover:shadow-[0_0_8px_rgba(16,185,129,0.6)] transition-all"></div>
                <span className="text-[10px] font-bold text-slate-600 group-hover:text-emerald-700">Viewer</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
