import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e, customEmail, customPassword) => {
    if (e) e.preventDefault();
    setError(null);
    const targetEmail = customEmail !== undefined ? customEmail : email;
    const targetPassword = customPassword !== undefined ? customPassword : password;

    if (!targetEmail || !targetPassword) {
      setError('Please enter username / email and password.');
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
      setError(err.message || 'Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2eb] flex items-center justify-center p-4 selection:bg-[#2e5746] selection:text-white font-sans">
      {/* CENTERED LOGIN CARD */}
      <div className="w-full max-w-[420px] bg-white rounded-[32px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100 flex flex-col items-center">
        
        {/* TOP EMBLEM ICON (RESTORED OLD GREEN ADJUST ICON LOGO) */}
        <div className="w-14 h-14 rounded-2xl bg-[#2e5746] flex items-center justify-center shadow-md shadow-[#2e5746]/20 text-white mb-1">
          <span className="material-symbols-outlined text-[28px]">
            adjust
          </span>
        </div>

        {/* BRAND & WELCOME HEADER */}
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-3 text-center">
          Anubhavi
        </h1>
        <p className="text-[11px] font-extrabold tracking-widest text-slate-400 uppercase text-center mt-1">
          WELCOME TO YOUR EXPERIENCE
        </p>

        {/* LOGIN FORM */}
        <form onSubmit={(e) => handleLogin(e)} className="w-full mt-7 flex flex-col gap-4 text-left">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-red-500">error</span>
              {error}
            </div>
          )}

          {/* USERNAME / EMAIL INPUT */}
          <div className="flex flex-col">
            <label className="text-[11px] font-extrabold tracking-wider uppercase text-slate-400 mb-1.5 block">
              USERNAME
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sho@anubhavi.com or POL-SHO-041"
                className="w-full h-12 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-semibold focus:outline-none focus:border-[#2e5746] focus:bg-white transition-all"
              />
              <span className="material-symbols-outlined absolute right-3.5 text-slate-400 text-[20px] pointer-events-none">
                person
              </span>
            </div>
          </div>

          {/* PASSWORD INPUT */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-extrabold tracking-wider uppercase text-slate-400">
                PASSWORD
              </label>
            </div>
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

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full h-12 bg-[#2e5746] hover:bg-[#244638] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-[#2e5746]/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>AUTHENTICATING...</span>
            ) : (
              <>
                <span>STATION CONSOLE LOGIN</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>

          {/* QUICK DEMO PRESETS */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 text-center">
              QUICK ONE-CLICK DEMO LOGINS
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={(e) => handleLogin(e, 'sho@anubhavi.com', 'sho@123')}
                className="py-2.5 px-3 bg-slate-100 hover:bg-emerald-50 hover:text-[#2e5746] hover:border-emerald-200 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all text-center"
              >
                👮 SHO Console Login
              </button>
              <button
                type="button"
                onClick={(e) => handleLogin(e, 'rajesh.sharma@demo.com', 'CIT@123')}
                className="py-2.5 px-3 bg-slate-100 hover:bg-emerald-50 hover:text-[#2e5746] hover:border-emerald-200 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all text-center"
              >
                👵 Senior Citizen Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
