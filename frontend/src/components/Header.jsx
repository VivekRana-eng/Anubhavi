import React, { useRef, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import { useCommandStore } from '../context/CommandStoreContext';
import { useNavigate } from 'react-router-dom';
import {
  useFilter
} from '../context/FilterContext';

export default function Header({ onToggleMobileSidebar }) {
  const { user, logout } = useAuth();
  const { audioEnabled, toggleAudio } = useWebSocket();
  const {
    getFilteredNotifications,
    getUnreadNotificationCount,
    markNotificationRead,
    clearAllNotifications
  } = useCommandStore();
  
  const navigate = useNavigate();
  const popoverRef = useRef(null);
  const notifPopoverRef = useRef(null);
  const [isNotifPanelOpen, setIsNotifPanelOpen] = useState(false);

  const {
    searchQuery,
    setSearchQuery,
    setIsFilterPanelOpen
  } = useFilter();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Derive notifications list and unread badge count for current logged in user role & station
  const stationCode = user?.police_station_id || 'MTP-PS-01';
  const userRole = user?.role || 'SHO';
  const filteredNotifications = getFilteredNotifications(userRole, stationCode);
  const unreadCount = getUnreadNotificationCount(userRole, stationCode);

  // Close filter or notification popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsFilterPanelOpen(false);
      }
      if (notifPopoverRef.current && !notifPopoverRef.current.contains(event.target)) {
        setIsNotifPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsFilterPanelOpen]);

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface/90 backdrop-blur-xl z-40 flex items-center justify-between px-3 sm:px-spacing-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container-highest">
      {/* BRAND, BACK BUTTON, MOBILE MENU & TAGLINE */}
      <div className="flex items-center gap-2 sm:gap-spacing-md">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface border border-surface-container-highest shadow-sm"
          title="Toggle Navigation Menu"
        >
          <span className="material-symbols-outlined text-[22px] text-primary">menu</span>
        </button>

        <button
          onClick={() => navigate(-1)}
          className="hidden sm:flex px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-lg font-label-md font-bold items-center gap-1 border border-surface-container-highest shadow-sm transition-all text-primary"
          title="Go back to previous page"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back</span>
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-spacing-xs">
            <span className="font-headline-sm text-on-surface font-extrabold tracking-tight text-primary">ANUBHAVI</span>
            {userRole === 'DSP' && (
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                DSP DIRECTORATE
              </span>
            )}
          </div>
          <span className="hidden sm:block font-label-sm text-on-surface-variant tracking-wider">
            "Suraksha. Saath. Samman." • {userRole === 'DSP' ? 'Sub-Divisional Command' : 'Model Town PS'}
          </span>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="flex-1 max-w-xl mx-spacing-md relative" ref={popoverRef}>
        <div className="relative flex items-center w-full">
          <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none">
            search
          </span>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Case ID, Senior Name, Mobile, Location, Officer..."
            className="w-full h-10 pl-10 pr-4 bg-surface-container-low text-on-surface font-body-sm rounded-xl border border-surface-container-highest focus:outline-none focus:border-primary focus:bg-surface-container-lowest transition-all shadow-inner text-xs sm:text-sm font-semibold"
          />
        </div>
      </div>

      {/* RIGHT ACTION ITEMS: AUDIO, NOTIFICATIONS, USER PROFILE */}
      <div className="flex items-center gap-spacing-md">

        {/* AUDIO & NOTIFICATIONS */}
        <div className="flex items-center gap-spacing-xs relative" ref={notifPopoverRef}>
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

          {/* NOTIFICATION BELL BUTTON WITH LIVE BADGE */}
          <button
            onClick={() => setIsNotifPanelOpen(!isNotifPanelOpen)}
            className="relative w-9 h-9 flex items-center justify-center rounded bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer"
            title="Active Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-error text-on-error font-label-sm text-[9px] font-extrabold animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* INTERACTIVE NOTIFICATIONS DROPDOWN POPOVER */}
          {isNotifPanelOpen && (
            <div className="absolute top-12 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-600 text-[20px]">notifications_active</span>
                  <span className="font-extrabold text-sm text-slate-800">
                    {userRole === 'DSP' ? 'District Activity Notifications' : 'Station Notifications'} ({unreadCount} unread)
                  </span>
                </div>
                {filteredNotifications.length > 0 && (
                  <button
                    onClick={() => clearAllNotifications(userRole, stationCode)}
                    className="text-[11px] font-bold text-[#2e5746] hover:underline cursor-pointer"
                  >
                    Mark All Read
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
                {filteredNotifications.length === 0 ? (
                  <div className="py-6 text-center text-xs font-bold text-slate-400">
                    No notifications for your station
                  </div>
                ) : (
                  filteredNotifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => markNotificationRead(item.id)}
                      className={`p-3 rounded-xl border transition-all text-xs flex flex-col gap-1 cursor-pointer ${
                        !item.read ? 'bg-amber-50/70 border-amber-200 text-slate-900 shadow-2xs' : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-extrabold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded ${
                          item.type === 'OFFICER_ASSIGNED' ? 'bg-blue-100 text-blue-900' :
                          item.type === 'OFFICER_REASSIGNED' ? 'bg-amber-100 text-amber-900' :
                          item.type === 'STATUS_UPDATED' ? 'bg-emerald-100 text-emerald-900' :
                          'bg-red-100 text-red-900'
                        }`}>
                          {item.title || item.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{item.time}</span>
                      </div>
                      
                      <p className="font-bold text-slate-900 text-[12px] mt-0.5">{item.message}</p>
                      
                      {/* REASSIGNMENT PREVIOUS -> NEW HIGHLIGHT */}
                      {item.type === 'OFFICER_REASSIGNED' && (
                        <div className="mt-1 p-2 rounded-lg bg-amber-100/70 border border-amber-300/80 text-[11px] font-bold text-amber-950 flex flex-col gap-0.5">
                          <p>🔁 <strong>Reassigned:</strong> {item.previousOfficer || 'Previous Officer'} → <strong className="text-emerald-900">{item.newOfficer || item.officer_name}</strong></p>
                          <p>🏬 <strong>Station:</strong> {item.police_station || 'Model Town PS'}</p>
                        </div>
                      )}

                      {item.officer_name && item.type !== 'OFFICER_REASSIGNED' && (
                        <div className="mt-1 p-2 rounded-lg bg-white/90 border border-slate-200 text-[11px] font-medium text-slate-700 flex flex-col gap-0.5">
                          <p>👮 <strong>Officer:</strong> {item.officer_rank} {item.officer_name} ({item.police_id || 'POL-101'})</p>
                          <p>🏬 <strong>Station:</strong> {item.police_station || 'Model Town PS'}</p>
                        </div>
                      )}

                      <div className="mt-1 pt-1 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                        <span className="font-bold text-slate-400">Case ID: {item.caseId || 'SOS-Case'}</span>
                        {!item.read ? (
                          <span className="font-extrabold text-amber-700 flex items-center gap-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span> Unread
                          </span>
                        ) : (
                          <span className="text-slate-400 font-semibold">Read</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-surface-container-highest"></div>

        {/* USER PROFILE SUMMARY */}
        <div className="flex items-center gap-spacing-sm">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-black">
            {userRole === 'DSP' ? 'DSP' : 'SHO'}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <div className="flex items-center gap-spacing-2xs">
              <span className="font-label-md text-on-surface font-extrabold">
                {user?.name || (userRole === 'DSP' ? 'DSP Harpreet Singh' : 'Insp. Raj Kumar')}
              </span>
              <span className="w-2 h-2 rounded-full bg-secondary" title="Duty Active"></span>
            </div>
            <span className="font-label-sm text-on-surface-variant">
              {user?.police_id || (userRole === 'DSP' ? 'POL-DSP-009' : 'POL-SHO-041')} • {userRole === 'DSP' ? 'Sub-Divisional Command' : 'Model Town PS'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="p-spacing-2xs rounded text-on-surface-variant hover:text-error transition-colors cursor-pointer"
            title="Station Duty Switch / Exit Console"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
