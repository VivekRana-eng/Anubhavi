import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/sho/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid police email or password');
    }
  };

  const autofillShoDemo = () => {
    setEmail('sho@anubhavi.com');
    setPassword('sho@123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#070d19] text-white font-body-md flex items-center justify-center p-spacing-md relative overflow-hidden selection:bg-blue-500 selection:text-white">
      {/* GLOWING TACTICAL BACKGROUND DECORATION */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#38bdf8 1.5px, transparent 1.5px)',
          backgroundSize: '32px 32px'
        }}
      ></div>

      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/15 rounded-full blur-[120px] pointer-events-none"></div>

      {/* MAIN CONTAINER SPLIT / DUAL CARD */}
      <div className="w-full max-w-4xl bg-[#0f1e36]/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-700/60 overflow-hidden grid grid-cols-1 lg:grid-cols-12 z-10">
        
        {/* LEFT PANEL: AUTHORITATIVE POLICE COMMAND BRANDING */}
        <div className="lg:col-span-5 p-spacing-2xl bg-gradient-to-br from-[#0c182c] via-[#0f1e36] to-[#152747] flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-slate-700/50">
          <div className="flex flex-col gap-spacing-md relative z-10">
            {/* BADGE ICON */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-500 p-0.5 shadow-lg shadow-blue-900/40 flex items-center justify-center">
              <div className="w-full h-full bg-[#0f1e36] rounded-[14px] flex items-center justify-center">
                <span className="material-symbols-outlined text-[36px] text-blue-400 animate-pulse">
                  shield_person
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="px-spacing-xs py-spacing-3xs rounded-md bg-blue-500/20 border border-blue-400/30 text-blue-300 font-label-sm uppercase font-bold tracking-widest self-start">
                POLICE DIRECTORATE
              </span>
              <h1 className="font-headline-xl text-white font-extrabold tracking-tight">ANUBHAVI</h1>
              <span className="font-headline-sm text-slate-300 font-medium">Senior Citizen Safety & Assistance Platform</span>
              <p className="font-body-sm text-blue-300/80 italic mt-1 font-semibold">"Suraksha. Saath. Samman."</p>
            </div>
          </div>

          <div className="flex flex-col gap-spacing-xs mt-spacing-2xl relative z-10 pt-spacing-md border-t border-slate-700/60">
            <div className="flex items-center gap-spacing-xs text-xs text-slate-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              CCTNS ERSS-112 Live Command Terminal
            </div>
            <span className="text-[11px] text-slate-400">
              Authorized personnel only. Station House Officer (SHO) Portal Access.
            </span>
          </div>
        </div>

        {/* RIGHT PANEL: HIGH-FIDELITY LOGIN FORM */}
        <div className="lg:col-span-7 p-spacing-2xl flex flex-col justify-center gap-spacing-lg bg-[#0a1222]/80">
          <div className="flex flex-col gap-spacing-3xs">
            <h2 className="font-headline-md text-white font-bold tracking-tight">SHO Portal Terminal Login</h2>
            <p className="font-body-sm text-slate-400">
              Enter official station credentials to access the command dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-spacing-md">
            {error && (
              <div className="p-spacing-sm rounded-lg bg-red-950/80 border border-red-500/50 text-red-200 font-label-sm font-semibold flex items-center gap-spacing-xs animate-shake">
                <span className="material-symbols-outlined text-[20px] text-red-400">error</span>
                {error}
              </div>
            )}

            {/* EMAIL INPUT */}
            <div className="flex flex-col gap-spacing-2xs">
              <label className="font-label-sm text-slate-300 uppercase font-semibold tracking-wider">
                Official Police Email / Station ID
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-spacing-sm top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                  badge
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sho@anubhavi.com"
                  className="w-full h-11 pl-10 pr-spacing-sm bg-[#132038] text-white font-body-sm rounded-lg border border-slate-600/80 placeholder:text-slate-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            {/* PASSWORD INPUT */}
            <div className="flex flex-col gap-spacing-2xs">
              <label className="font-label-sm text-slate-300 uppercase font-semibold tracking-wider">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-spacing-sm top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-10 bg-[#132038] text-white font-body-sm rounded-lg border border-slate-600/80 placeholder:text-slate-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-spacing-sm top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-label-lg font-bold rounded-lg shadow-lg shadow-blue-950/50 transition-all flex items-center justify-center gap-spacing-xs mt-spacing-xs active:scale-[0.99]"
            >
              {loading ? 'AUTHENTICATING COMMAND CREDENTIALS...' : 'SECURE POLICE TERMINAL LOGIN'}
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </form>

          {/* QUICK DEMO PRESET BUTTON */}
          <div className="pt-spacing-md border-t border-slate-800 flex flex-col gap-spacing-xs">
            <span className="font-label-sm text-slate-400 text-center uppercase tracking-wider">
              Demonstration Quick Access
            </span>
            <button
              type="button"
              onClick={autofillShoDemo}
              className="w-full py-spacing-sm bg-[#13223f] hover:bg-[#1c3057] text-blue-200 font-label-md font-bold rounded-lg border border-blue-500/30 transition-all flex items-center justify-center gap-spacing-xs shadow-sm hover:border-blue-400"
            >
              <span className="material-symbols-outlined text-[18px] text-blue-400">verified_user</span>
              Auto-fill SHO Demo Credentials (sho@anubhavi.com / sho@123)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
