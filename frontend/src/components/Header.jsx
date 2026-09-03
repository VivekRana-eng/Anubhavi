import React, { useRef, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import { useNavigate } from 'react-router-dom';
import {
  useFilter,
  POLICE_STATIONS_OPTIONS,
  OFFICERS_OPTIONS,
  STATUS_OPTIONS,
  CASE_TYPE_OPTIONS
} from '../context/FilterContext';

export default function Header() {
  const { user, logout } = useAuth();
  const {
    audioEnabled,
    toggleAudio,
    notificationsCount,
    notificationsList = [],
    clearNotifications,
    dismissNotificationItem,
    activeAlert,
    dismissAlert,
    userNotification,
    dismissUserNotification
  } = useWebSocket();
  
  const navigate = useNavigate();
  const popoverRef = useRef(null);
  const notifPopoverRef = useRef(null);
  const [isNotifPanelOpen, setIsNotifPanelOpen] = useState(false);

  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilter,
    clearAllFilters,
    activeFilterCount,
    isFilterPanelOpen,
    setIsFilterPanelOpen
  } = useFilter();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

      {/* SEARCH BAR & FILTER SYSTEM */}
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
            className="w-full h-10 pl-10 pr-28 bg-surface-container-low text-on-surface font-body-sm rounded-xl border border-surface-container-highest focus:outline-none focus:border-primary focus:bg-surface-container-lowest transition-all shadow-inner"
          />

          {/* FILTER BUTTON WITH ACTIVE BADGE */}
          <button
            type="button"
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className={`absolute right-1.5 h-7 px-2.5 rounded-lg text-xs font-black tracking-wider flex items-center gap-1.5 transition-all ${
              activeFilterCount > 0 || isFilterPanelOpen
                ? 'bg-[#2e5746] text-white shadow-sm'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>FILTERS</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* 4-FILTER POPOVER PANEL */}
        {isFilterPanelOpen && (
          <div className="absolute top-12 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2e5746] text-[20px]">tune</span>
                <span className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">
                  Filter Case Records
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterPanelOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* 1. POLICE STATION */}
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1 block">
                  POLICE STATION
                </label>
                <select
                  value={filters.policeStation === 'ALL' ? 'All Police Stations' : filters.policeStation}
                  onChange={(e) => setFilter('policeStation', e.target.value === 'All Police Stations' ? 'ALL' : e.target.value)}
                  className="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold text-xs focus:outline-none focus:border-[#2e5746]"
                >
                  {POLICE_STATIONS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* 2. ASSIGNED POLICE OFFICER */}
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1 block">
                  ASSIGNED OFFICER
                </label>
                <select
                  value={filters.assignedOfficer === 'ALL' ? 'All Officers' : filters.assignedOfficer}
                  onChange={(e) => setFilter('assignedOfficer', e.target.value === 'All Officers' ? 'ALL' : e.target.value)}
                  className="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold text-xs focus:outline-none focus:border-[#2e5746]"
                >
                  {OFFICERS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* 3. CASE STATUS */}
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1 block">
                  CASE STATUS
                </label>
                <select
                  value={filters.status === 'ALL' ? 'All Statuses' : filters.status}
                  onChange={(e) => setFilter('status', e.target.value === 'All Statuses' ? 'ALL' : e.target.value)}
                  className="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold text-xs focus:outline-none focus:border-[#2e5746]"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* 4. EMERGENCY / CASE TYPE */}
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1 block">
                  CASE TYPE
                </label>
                <select
                  value={filters.caseType === 'ALL' ? 'All Case Types' : filters.caseType}
                  onChange={(e) => setFilter('caseType', e.target.value === 'All Case Types' ? 'ALL' : e.target.value)}
                  className="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold text-xs focus:outline-none focus:border-[#2e5746]"
                >
                  {CASE_TYPE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* PANEL FOOTER BUTTONS */}
            <div className="flex items-center justify-between border-t border-slate-200 pt-3.5 mt-4">
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all text-xs"
              >
                CLEAR ALL
              </button>

              <button
                type="button"
                onClick={() => setIsFilterPanelOpen(false)}
                className="px-5 py-2 bg-[#2e5746] hover:bg-[#244638] text-white font-extrabold rounded-xl shadow-md transition-all text-xs"
              >
                APPLY FILTERS
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT ACTION ITEMS: AUDIO, NOTIFICATIONS, SHO PROFILE */}
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
            className="relative w-9 h-9 flex items-center justify-center rounded bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
            title="Active Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {notificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-on-error font-label-sm text-[9px] font-bold animate-pulse">
                {notificationsCount}
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
                    Control Room Alerts ({notificationsCount})
                  </span>
                </div>
                {notificationsCount > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="text-[11px] font-bold text-[#2e5746] hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
                {notificationsList.length === 0 ? (
                  <div className="py-6 text-center text-xs font-bold text-slate-400">
                    No active notifications
                  </div>
                ) : (
                  notificationsList.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border transition-all text-xs flex flex-col gap-1 ${
                        item.type === 'SOS'
                          ? 'bg-red-50/80 border-red-200 text-red-900'
                          : item.type === 'ASSISTANCE'
                          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                          : 'bg-amber-50/80 border-amber-200 text-amber-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold uppercase tracking-wider text-[10px]">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{item.time}</span>
                      </div>
                      <p className="font-bold text-slate-800 text-[12px]">{item.message}</p>
                      {item.location && (
                        <p className="text-[11px] text-slate-500 font-medium truncate">📍 {item.location}</p>
                      )}
                      
                      <div className="mt-1 pt-1 border-t border-slate-200/50 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setIsNotifPanelOpen(false);
                            if (item.type === 'SOS') {
                              navigate('/sho/dashboard');
                            } else if (item.type === 'ASSISTANCE') {
                              navigate('/sho/dashboard');
                            } else {
                              navigate('/sho/check-ins');
                            }
                          }}
                          className="px-2.5 py-1 bg-[#2e5746] hover:bg-[#244638] text-white font-extrabold rounded-md text-[10px] transition-all"
                        >
                          TAKE ACTION NOW →
                        </button>
                        <button
                          onClick={() => dismissNotificationItem(item.id)}
                          className="text-[10px] font-bold text-slate-400 hover:text-slate-700"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
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
