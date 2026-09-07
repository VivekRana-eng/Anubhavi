import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DspLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subDivision, setSubDivision] = useState('Central Sub-Division (Model Town & Sec 17)');
  const [error, setError] = useState(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e, customEmail, customPassword) => {
    if (e) e.preventDefault();
    setError(null);
    const targetEmail = customEmail !== undefined ? customEmail : email;
    const targetPassword = customPassword !== undefined ? customPassword : password;

    if (!targetEmail || !targetPassword) {
      setError('Please enter DSP Official Email / ID and Security Key.');
      return;
    }

    try {
      const loggedUser = await login(targetEmail, targetPassword);
      if (loggedUser && (loggedUser.role === 'SENIOR_CITIZEN' || loggedUser.role === 'CITIZEN')) {
        navigate('/');
      } else {
        navigate('/sho/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid DSP credentials or security key');
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2eb] flex items-center justify-center p-4 selection:bg-[#2e5746] selection:text-white font-sans relative overflow-hidden">
      {/* SUBTLE BACKGROUND EMBLEM ACCENT */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#2e5746]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* CENTERED DSP EXECUTIVE LOGIN CARD */}
      <div className="w-full max-w-[440px] bg-white rounded-[32px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100 flex flex-col items-center relative z-10">
        
        {/* EXECUTIVE EMBLEM WITH GOLDEN RANK STAR */}
        <div className="relative mb-2">
          <div className="w-16 h-16 rounded-2xl bg-[#2e5746] flex items-center justify-center shadow-lg shadow-[#2e5746]/25 text-white">
            <span className="material-symbols-outlined text-[32px]">
              security
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-sm" title="Class-I Officer Rank">
            <span className="material-symbols-outlined text-[13px] font-black">star</span>
          </div>
        </div>

        {/* BRAND & DSP WELCOME HEADER */}
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2 text-center flex items-center justify-center gap-2">
          Anubhavi
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
            DSP PORTAL
          </span>
        </h1>
        <p className="text-[11px] font-extrabold tracking-widest text-slate-400 uppercase text-center mt-1">
          SUB-DIVISIONAL COMMAND & OVERSIGHT PORTAL
        </p>

        {/* EXECUTIVE BADGE BANNER */}
        <div className="mt-4 w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-amber-600">verified_user</span>
          <span>Deputy Superintendent of Police Access</span>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={(e) => handleLogin(e)} className="w-full mt-6 flex flex-col gap-4 text-left">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
              <span className="material-symbols-outlined text-[18px] text-red-500">error</span>
              {error}
            </div>
          )}

          {/* DSP OFFICIAL EMAIL / ID INPUT */}
          <div className="flex flex-col">
            <label className="text-[11px] font-extrabold tracking-wider uppercase text-slate-400 mb-1.5 block">
              DSP OFFICIAL EMAIL / POLICE ID
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dsp@anubhavi.demo or POL-DSP-009"
                className="w-full h-12 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-semibold focus:outline-none focus:border-[#2e5746] focus:bg-white transition-all"
              />
              <span className="material-symbols-outlined absolute right-3.5 text-slate-400 text-[20px] pointer-events-none">
                badge
              </span>
            </div>
          </div>

          {/* SECURITY KEY / PASSWORD INPUT */}
          <div className="flex flex-col">
            <label className="text-[11px] font-extrabold tracking-wider uppercase text-slate-400 mb-1.5 block">
              SECURITY KEY / PASSWORD
            </label>
            <div className="relative flex items-center">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-semibold focus:outline-none focus:border-[#2e5746] focus:bg-white transition-all"
              />
              <span className="material-symbols-outlined absolute right-3.5 text-slate-400 text-[20px] pointer-events-none">
                lock
              </span>
            </div>
          </div>

          {/* SUB-DIVISION JURISDICTION SELECTOR */}
          <div className="flex flex-col">
            <label className="text-[11px] font-extrabold tracking-wider uppercase text-slate-400 mb-1.5 block">
              SUB-DIVISION JURISDICTION
            </label>
            <div className="relative flex items-center">
              <select
                value={subDivision}
                onChange={(e) => setSubDivision(e.target.value)}
                className="w-full h-12 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-bold focus:outline-none focus:border-[#2e5746] focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="Central Sub-Division (Model Town & Sec 17)">Central Sub-Division (Model Town & Sec 17)</option>
                <option value="Mohali & Phase 8 Sub-Division">Mohali & Phase 8 Sub-Division</option>
                <option value="North & South Zone Command">North & South Zone Command</option>
              </select>
              <span className="material-symbols-outlined absolute right-3.5 text-slate-400 text-[20px] pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full h-12 bg-[#2e5746] hover:bg-[#244638] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-[#2e5746]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span>AUTHENTICATING DSP CREDENTIALS...</span>
            ) : (
              <>
                <span>DSP COMMAND ACCESS</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>

          {/* QUICK DSP DEMO ACCESS */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 text-center">
              QUICK ONE-CLICK DEMO LOGIN
            </span>
            <button
              type="button"
              onClick={(e) => handleLogin(e, 'dsp@anubhavi.demo', 'DSP@123')}
              className="py-2.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-extrabold rounded-xl text-xs transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>👮‍♂️ DSP Harpreet Singh (Demo Access)</span>
              <span className="material-symbols-outlined text-[16px] text-amber-700">bolt</span>
            </button>
          </div>

          {/* PORTAL NAVIGATION SWITCHER LINKS */}
          <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link to="/login" className="font-bold text-[#2e5746] hover:underline flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">local_police</span>
              <span>SHO Station Login</span>
            </Link>

            <Link to="/login" className="font-bold text-slate-500 hover:underline flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">elderly</span>
              <span>Senior Citizen App</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
