import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ stats = {}, isOpenOnMobile = false, onCloseMobile }) {
  const navItemClass = ({ isActive }) =>
    `flex items-center justify-between px-spacing-sm py-spacing-xs rounded transition-all ${
      isActive
        ? 'bg-primary-container text-on-primary font-label-lg rounded shadow-sm'
        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
    }`;

  const handleNavClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* MOBILE BACKDROP OVERLAY */}
      {isOpenOnMobile && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 lg:hidden animate-in fade-in duration-200"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col justify-between overflow-y-auto shadow-xl lg:shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-transform duration-300 ease-in-out ${
        isOpenOnMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col">
          {/* JURISDICTION HEADER */}
          <div className="p-spacing-md bg-surface-container flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-on-surface-variant uppercase tracking-wider">Jurisdiction Ward</span>
              <span className="font-headline-sm text-on-surface truncate font-bold">Model Town PS</span>
              <span className="font-label-sm text-secondary">District Central • Zone 1</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-secondary hover:text-on-surface cursor-pointer" title="Ward Settings">
                tune
              </span>
              {/* MOBILE CLOSE BUTTON */}
              <button onClick={onCloseMobile} className="lg:hidden p-1 text-slate-500 hover:text-slate-800 text-lg">
                ✕
              </button>
            </div>
          </div>

          {/* NAVIGATION LINKS */}
          <nav className="flex flex-col p-spacing-xs gap-spacing-3xs">
            {/* SECTION 1 */}
            <div className="px-spacing-xs pt-spacing-sm pb-spacing-3xs">
              <span className="font-label-sm text-on-surface-variant uppercase tracking-wider">Command & Emergency</span>
            </div>

            <NavLink to="/sho/dashboard" className={navItemClass} onClick={handleNavClick}>
              <div className="flex items-center gap-spacing-xs">
                <span className="material-symbols-outlined text-[20px]">dashboard</span>
                <span className="font-label-lg">Dashboard</span>
              </div>
            </NavLink>

            <NavLink to="/sho/sos-alerts" className={navItemClass} onClick={handleNavClick}>
              <div className="flex items-center gap-spacing-xs">
                <span className="material-symbols-outlined text-[20px] text-error">fmd_bad</span>
                <span className="font-label-lg text-error font-bold">SOS Alerts</span>
              </div>
              <span className="flex items-center justify-center px-spacing-xs py-spacing-3xs rounded-full bg-error text-on-error font-label-sm animate-pulse">
                {stats.active_sos || 3}
              </span>
            </NavLink>

            <NavLink to="/sho/check-ins" className={navItemClass} onClick={handleNavClick}>
              <div className="flex items-center gap-spacing-xs">
                <span className="material-symbols-outlined text-[20px]">alarm_off</span>
                <span className="font-label-lg">Missed Check-ins</span>
              </div>
              <span className="flex items-center justify-center px-spacing-xs py-spacing-3xs rounded-full bg-surface-variant text-on-surface-variant font-label-sm font-bold">
                {stats.missed_checkins || 5}
              </span>
            </NavLink>

            {/* SECTION 2 */}
            <div className="px-spacing-xs pt-spacing-md pb-spacing-3xs">
              <span className="font-label-sm text-on-surface-variant uppercase tracking-wider">Operations & Response</span>
            </div>

            <NavLink to="/sho/citizens" className={navItemClass} onClick={handleNavClick}>
              <div className="flex items-center gap-spacing-xs">
                <span className="material-symbols-outlined text-[20px]">elderly</span>
                <span className="font-label-lg">Senior Citizens</span>
              </div>
              <span className="font-code-md text-on-surface-variant">{stats.total_citizens || '1,248'}</span>
            </NavLink>

            <NavLink to="/sho/welfare-checks" className={navItemClass} onClick={handleNavClick}>
              <div className="flex items-center gap-spacing-xs">
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                <span className="font-label-lg">Welfare Checks</span>
              </div>
            </NavLink>

            {/* SECTION 3 */}
            <div className="px-spacing-xs pt-spacing-md pb-spacing-3xs">
              <span className="font-label-sm text-on-surface-variant uppercase tracking-wider">Intelligence & Oversight</span>
            </div>

            <NavLink to="/sho/escalations" className={navItemClass} onClick={handleNavClick}>
              <div className="flex items-center gap-spacing-xs">
                <span className="material-symbols-outlined text-[20px] text-error">warning</span>
                <span className="font-label-lg font-semibold text-error">24h Escalations</span>
              </div>
              <span className="flex items-center justify-center px-spacing-xs py-spacing-3xs rounded-full bg-error-container text-on-error-container font-label-sm font-bold">
                {stats.escalated_cases || 1}
              </span>
            </NavLink>

            <NavLink to="/sho/reports" className={navItemClass} onClick={handleNavClick}>
              <div className="flex items-center gap-spacing-xs">
                <span className="material-symbols-outlined text-[20px]">description</span>
                <span className="font-label-lg font-semibold">Reports</span>
              </div>
            </NavLink>
          </nav>
        </div>
      </aside>
    </>
  );
}
