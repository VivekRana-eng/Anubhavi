import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, logout } = useAuth();
  const { audioEnabled, toggleAudio, notificationsCount } = useWebSocket();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface/90 backdrop-blur-xl z-40 flex items-center justify-between px-spacing-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container-highest">
      {/* BRAND, BACK BUTTON & TAGLINE */}
      <div className="flex items-center gap-spacing-md">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-lg font-label-md font-bold flex items-center gap-1 border border-surface-container-highest shadow-sm transition-all text-primary"
          title="Go back to previous page"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back</span>
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-spacing-xs">
            <span className="font-headline-sm text-on-surface font-extrabold tracking-tight text-primary">ANUBHAVI</span>
          </div>
          <span className="font-label-sm text-on-surface-variant tracking-wider">
            "Suraksha. Saath. Samman." • Model Town PS
          </span>
        </div>
      </div>

      {/* GLOBAL SEARCH */}
      <div className="flex items-center gap-spacing-md flex-1 max-w-xl mx-spacing-lg">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-spacing-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search Case ID, Senior Name, Phone, Officer ID (Ctrl + K)..."
            className="w-full h-9 pl-10 pr-spacing-sm bg-surface-container-lowest text-on-surface font-body-sm rounded placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary shadow-sm border border-outline-variant/40"
          />
        </div>
      </div>

      {/* RIGHT UTILITIES & PROFILE */}
      <div className="flex items-center gap-spacing-md">

        {/* AUDIO & NOTIFICATIONS */}
        <div className="flex items-center gap-spacing-xs">
          <button
            onClick={toggleAudio}
            className={`w-9 h-9 flex items-center justify-center rounded transition-colors ${
              audioEnabled ? 'bg-surface-container hover:bg-surface-container-high text-on-surface' : 'bg-error-container text-on-error-container'
            }`}
            title={audioEnabled ? "Emergency Audio Siren Enabled" : "Emergency Audio Muted"}
          >
            <span className="material-symbols-outlined text-[20px]">
              {audioEnabled ? 'volume_up' : 'volume_off'}
            </span>
          </button>

          <button
            onClick={() => navigate('/sho/notifications')}
            className="relative w-9 h-9 flex items-center justify-center rounded bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
            title="Active Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {notificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-on-error font-label-sm text-[9px] font-bold">
                {notificationsCount}
              </span>
            )}
          </button>
        </div>

        <div className="h-6 w-px bg-surface-container-highest"></div>

        {/* SHO PROFILE SUMMARY */}
        <div className="flex items-center gap-spacing-sm">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>
          <div className="hidden md:flex flex-col text-left">
            <div className="flex items-center gap-spacing-2xs">
              <span className="font-label-md text-on-surface font-bold">
                {user?.name || 'Insp. Raj Kumar'}
              </span>
              <span className="w-2 h-2 rounded-full bg-secondary" title="Duty Active"></span>
            </div>
            <span className="font-label-sm text-on-surface-variant">
              {user?.police_id || 'POL-SHO-041'} • Model Town
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="p-spacing-2xs rounded text-on-surface-variant hover:text-error transition-colors"
            title="Station Duty Switch / Exit Console"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
