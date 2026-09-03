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
        
        {/* TOP EMBLEM ICON */}
        <div className="w-14 h-14 rounded-2xl bg-[#2e5746] flex items-center justify-center shadow-md shadow-[#2e5746]/20 text-white">
          <span className="material-symbols-outlined text-[28px]">
            adjust
          </span>
        </div>

        {/* BRAND & WELCOME HEADER */}
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-4 text-center">
          Anubhavi
        </h1>
        <p className="text-[11px] font-extrabold tracking-widest text-slate-400 uppercase text-center mt-1">
          WELCOME TO YOUR EXPERIENCE
        </p>

        {/* LOGIN FORM */}
        <form onSubmit={(e) => handleLogin(e)} className="w-full mt-7 flex flex-col gap-4">
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
              <span className="material-symbols-outlined absolute left-4 text-slate-400 text-[18px]">
                mail
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@mobile"
                className="w-full h-12 pl-11 pr-4 bg-white border border-slate-200/90 rounded-xl text-slate-800 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#2e5746] focus:ring-2 focus:ring-[#2e5746]/15 transition-all shadow-xs"
              />
            </div>
          </div>

          {/* PASSWORD INPUT */}
          <div className="flex flex-col">
            <label className="text-[11px] font-extrabold tracking-wider uppercase text-slate-400 mb-1.5 block">
              PASSWORD
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-slate-400 text-[18px]">
                key
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 pl-11 pr-4 bg-white border border-slate-200/90 rounded-xl text-slate-800 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#2e5746] focus:ring-2 focus:ring-[#2e5746]/15 transition-all shadow-xs"
              />
            </div>
          </div>

          {/* REMEMBER ME CHECKBOX */}
          <div className="flex items-center gap-2.5 mt-1">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-[#2e5746] focus:ring-[#2e5746] cursor-pointer accent-[#2e5746]"
            />
            <label htmlFor="remember" className="text-xs font-semibold text-slate-500 cursor-pointer select-none">
              Remember me / Save credentials
            </label>
          </div>

          {/* SIGN IN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#2e5746] hover:bg-[#244638] text-white font-extrabold rounded-xl shadow-lg shadow-[#2e5746]/20 transition-all text-base mt-2 active:scale-[0.99] flex items-center justify-center"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
