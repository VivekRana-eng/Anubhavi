import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AssignmentToastNotification() {
  const { user } = useAuth();
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleNotificationEvent = (e) => {
      const notif = e.detail;
      if (!notif) return;

      const userRole = user?.role || 'SHO';
      const userStationCode = user?.police_station_id || 'MTP-PS-01';

      // Check if notification is relevant to current logged-in user
      if (userRole === 'SHO') {
        if (notif.recipientRole && notif.recipientRole !== 'SHO') return;
        if (notif.stationId && notif.stationId !== userStationCode && !notif.police_station?.includes('Model Town')) {
          return;
        }
      }

      // Display Toast Popup
      setToast(notif);

      // Play audio chime
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } catch (err) {}
    };

    const handleStorageEvent = (e) => {
      if (e.key === 'anubhavi_shared_notifications' && e.newValue) {
        try {
          const list = JSON.parse(e.newValue);
          if (list && list.length > 0) {
            const latest = list[0];
            if (latest && (latest.type === 'OFFICER_ASSIGNED' || latest.type === 'OFFICER_REASSIGNED')) {
              handleNotificationEvent({ detail: latest });
            }
          }
        } catch (err) {}
      }
    };

    window.addEventListener('anubhavi_new_toast_notification', handleNotificationEvent);
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('anubhavi_new_toast_notification', handleNotificationEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [user]);

  // Auto-dismiss after 7 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!toast) return null;

  const isReassignment = toast.type === 'OFFICER_REASSIGNED';

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-md w-full animate-in slide-in-from-top-4 duration-300 pointer-events-auto">
      <div className={`p-4 rounded-2xl shadow-2xl border flex flex-col gap-2 relative overflow-hidden backdrop-blur-md text-left ${
        isReassignment
          ? 'bg-amber-950/90 border-amber-500 text-amber-50 shadow-amber-950/40'
          : 'bg-[#1b3d30]/95 border-emerald-500 text-emerald-50 shadow-[#1b3d30]/40'
      }`}>
        
        {/* CLOSE BUTTON */}
        <button
          onClick={() => setToast(null)}
          className="absolute top-3 right-3 text-slate-300 hover:text-white text-base p-1 rounded-lg transition-all"
          title="Dismiss Popup"
        >
          ✕
        </button>

        {/* HEADER BADGE STRIP */}
        <div className="flex items-center gap-2 pr-6">
          <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs ${
            isReassignment ? 'bg-amber-600' : 'bg-emerald-600'
          }`}>
            <span className="material-symbols-outlined text-[20px]">
              {isReassignment ? 'swap_horiz' : 'local_police'}
            </span>
          </span>

          <div className="flex flex-col">
            <span className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>{isReassignment ? '🟠 OFFICER REASSIGNED' : '👮 OFFICER ASSIGNED'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </span>
            <span className="text-[10px] opacity-80 font-bold">
              {toast.police_station || 'Model Town Police Station'} • Just Now
            </span>
          </div>
        </div>

        {/* NOTIFICATION MESSAGE */}
        <p className="font-bold text-xs leading-relaxed text-white mt-1">
          {toast.message}
        </p>

        {/* REASSIGNMENT HIGHLIGHT STRIP */}
        {isReassignment && (
          <div className="p-2.5 rounded-xl bg-amber-900/80 border border-amber-600/80 text-[11px] font-extrabold flex items-center justify-between">
            <span>{toast.previousOfficer || 'Previous Officer'}</span>
            <span className="material-symbols-outlined text-amber-300 text-[16px]">arrow_forward</span>
            <span className="text-emerald-300">{toast.newOfficer || toast.officer_name}</span>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="mt-1 pt-2 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => {
              setToast(null);
              if (toast.caseId) {
                navigate(`/sho/cases/${toast.caseId}`);
              } else {
                navigate('/sho/dashboard');
              }
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1 shadow-sm ${
              isReassignment ? 'bg-amber-500 hover:bg-amber-600 text-slate-950' : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
            }`}
          >
            <span>VIEW CASE</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>

          <button
            onClick={() => setToast(null)}
            className="text-[11px] font-bold opacity-75 hover:opacity-100 transition-opacity"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
}
