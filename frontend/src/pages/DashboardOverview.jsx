import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OfficerAssignmentModal from '../components/OfficerAssignmentModal';
import FilterChips from '../components/FilterChips';
import { useAuth } from '../context/AuthContext';
import { useCommandStore } from '../context/CommandStoreContext';
import { useFilter, applyFiltersAndSearch } from '../context/FilterContext';

const FALLBACK_STATS = {
  total_citizens: 5,
  active_sos: 3,
  missed_checkins: 5,
  avg_response_time: '8 min'
};

export default function DashboardOverview() {
  const { user } = useAuth();
  const { cases, activityLogs, updateCaseStatus } = useCommandStore();
  const { searchQuery, filters, clearAllFilters } = useFilter();
  const navigate = useNavigate();

  const isDsp = user?.role === 'DSP';
  const userStationCode = user?.police_station_id || 'MTP-PS-01';

  const [selectedCaseForAssign, setSelectedCaseForAssign] = useState(null);
  const [feedView, setFeedView] = useState('list');
  const [stationFilterMode, setStationFilterMode] = useState(isDsp ? 'all' : 'my_station');
  const [statusUpdateCaseId, setStatusUpdateCaseId] = useState(null);
  const [statusNote, setStatusNote] = useState('');
  const [stats, setStats] = useState(FALLBACK_STATS);

  useEffect(() => {
    let cancelled = false;
    const loadStats = () => {
      fetch('/api/analytics/dashboard-stats')
        .then(res => {
          if (!res.ok) throw new Error('Unable to load dashboard stats');
          return res.json();
        })
        .then(data => {
          if (!cancelled) setStats(data);
        })
        .catch(() => {
          if (!cancelled) setStats(FALLBACK_STATS);
        });
    };

    loadStats();
    const refreshTimer = window.setInterval(loadStats, 30000);
    return () => {
      cancelled = true;
      window.clearInterval(refreshTimer);
    };
  }, []);

  // Station Filter logic
  const stationFilteredCases = cases.filter(c => {
    if (isDsp) {
      if (stationFilterMode === 'all') return true;
      return c.station_code === stationFilterMode;
    } else {
      if (stationFilterMode === 'my_station') {
        return c.station_code === userStationCode || c.police_station?.includes('Model Town');
      }
      return true; // All stations mode
    }
  });

  // Search & FilterChips logic
  const filteredCases = applyFiltersAndSearch(stationFilteredCases, searchQuery, filters);
  const activeCasesCount = cases.filter(c => c.status !== 'CLOSED' && c.status !== 'RESOLVED').length;

  const handleStatusChangeSubmit = (caseId, newStatus) => {
    updateCaseStatus({
      caseId: caseId,
      newStatus: newStatus,
      notes: statusNote || `Status updated to ${newStatus}`,
      updatedByRole: isDsp ? 'DSP' : 'SHO',
      updatedByName: user?.name || (isDsp ? 'DSP Harpreet Singh' : 'Insp. Raj Kumar')
    });
    setStatusUpdateCaseId(null);
    setStatusNote('');
  };

  return (
    <div className="flex flex-col gap-spacing-lg w-full text-left font-sans">
      
      {/* ROLE COMMAND HEADER BANNER */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${
            isDsp ? 'bg-amber-800 shadow-amber-900/20' : 'bg-[#2e5746] shadow-[#2e5746]/20'
          }`}>
            <span className="material-symbols-outlined text-[26px]">
              {isDsp ? 'security' : 'local_police'}
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {isDsp ? 'DSP Sub-Divisional Command Console' : 'SHO Station Operations Command'}
              </h1>
              {isDsp && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase border border-amber-300">
                  DISTRICT OVERSIGHT
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-semibold">
              {isDsp
                ? 'Monitoring real-time assignments & status updates across all 6 Police Stations'
                : 'Model Town Police Station • Ward 1 Emergency Response Console'}
            </p>
          </div>
        </div>

        {/* STATION TOGGLE BUTTONS REMOVED AS REQUESTED */}
      </div>

      {/* METRIC CARDS (4 CARDS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-spacing-sm text-left">
        <div className="bg-surface-container-lowest p-3 sm:p-spacing-md rounded-xl shadow-sm border border-surface-container-highest flex flex-col justify-between">
          <span className="text-[11px] sm:font-label-sm text-on-surface-variant uppercase font-semibold">Total Registered Seniors</span>
          <span className="text-xl sm:font-headline-xl text-primary font-extrabold mt-1">{stats?.total_citizens ?? '—'}</span>
          <span className="text-[10px] sm:font-label-sm text-secondary mt-1 font-bold">
            {isDsp ? 'Sub-Division Total' : 'Model Town Ward'}
          </span>
        </div>

        <div className="bg-error-container/20 p-3 sm:p-spacing-md rounded-xl shadow-sm border border-error-container flex flex-col justify-between">
          <span className="text-[11px] sm:font-label-sm text-error uppercase font-extrabold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-error animate-ping"></span> Active SOS Cases
          </span>
          <span className="text-xl sm:font-headline-xl text-error font-extrabold mt-1">{stats?.active_sos ?? '—'}</span>
          <span className="text-[10px] sm:font-label-sm text-error font-bold mt-1">Requires Triage</span>
        </div>

        <div className="bg-surface-container-lowest p-3 sm:p-spacing-md rounded-xl shadow-sm border border-surface-container-highest flex flex-col justify-between">
          <span className="text-[11px] sm:font-label-sm text-on-surface-variant uppercase font-semibold">Missed Check-ins</span>
          <span className="text-xl sm:font-headline-xl text-on-surface font-extrabold mt-1">{stats?.missed_checkins ?? '—'}</span>
          <span className="text-[10px] sm:font-label-sm text-on-surface-variant font-semibold mt-1">Unresponsive pings</span>
        </div>

        <div className="bg-surface-container-lowest p-3 sm:p-spacing-md rounded-xl shadow-sm border border-surface-container-highest flex flex-col justify-between">
          <span className="text-[11px] sm:font-label-sm text-on-surface-variant uppercase font-semibold">Avg Response Time</span>
          <span className="text-xl sm:font-headline-xl text-primary font-extrabold mt-1">{stats?.avg_response_time ?? '—'}</span>
          <span className="text-[10px] sm:font-label-sm text-secondary font-semibold mt-1">Target &lt;15m</span>
        </div>
      </div>

      <FilterChips />

      {/* DSP ACTIVITY & MONITORING STREAM LOG (VISIBLE FOR DSP ROLE) */}
      {isDsp && (
        <div className="bg-amber-50/60 rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-amber-200 pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-800 text-[22px]">history</span>
              <h3 className="font-extrabold text-sm text-amber-950 uppercase tracking-wider">
                DSP Real-Time Activity & Officer Assignment Log
              </h3>
            </div>
            <span className="text-[10px] font-extrabold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full">
              LIVE MONITORING STREAM
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-white border border-amber-200 text-xs flex flex-col gap-1 shadow-2xs"
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                  <span className="uppercase text-amber-900 font-extrabold">{log.type || 'ACTIVITY'}</span>
                  <span>{log.dateText} at {log.timestamp}</span>
                </div>
                <p className="font-bold text-slate-800 text-xs">{log.message}</p>
                <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 pt-1 border-t border-slate-100">
                  <span>Case: <strong className="text-slate-800">{log.caseId}</strong></span>
                  <span>Station: <strong className="text-[#2e5746]">{log.stationName}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CASES OVERSIGHT FEED & TABLE */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-3 sm:p-spacing-lg border border-surface-container-highest flex flex-col gap-spacing-md text-left w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-surface-container-highest pb-spacing-xs gap-2">
          <div className="flex items-center gap-spacing-xs">
            <span className="material-symbols-outlined text-error text-[24px]">fmd_bad</span>
            <h2 className="font-headline-sm text-on-surface font-bold uppercase tracking-wider text-sm sm:text-base">
              {isDsp ? 'District-Wide Emergency Triage Feed' : 'Station Priority SOS Emergency Feed'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <div className="flex items-center rounded-lg border border-surface-container-highest bg-surface-container-low p-1" role="group">
              <button
                type="button"
                onClick={() => setFeedView('grid')}
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold transition ${feedView === 'grid' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                title="Grid view"
              >
                <span className="material-symbols-outlined text-[16px]">grid_view</span>
              </button>
              <button
                type="button"
                onClick={() => setFeedView('list')}
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold transition ${feedView === 'list' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                title="List view"
              >
                <span className="material-symbols-outlined text-[16px]">view_list</span>
              </button>
            </div>
            <span className="px-3 py-1 bg-surface-container-high text-on-surface text-xs font-bold rounded-lg border border-surface-container-highest">
              Showing {filteredCases.length} of {cases.length} cases
            </span>
          </div>
        </div>

        {filteredCases.length === 0 ? (
          <div className="py-12 px-4 text-center flex flex-col items-center justify-center gap-3 bg-slate-50 rounded-2xl border border-slate-200 my-2">
            <div className="w-16 h-16 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-500 text-3xl">
              🔍
            </div>
            <h3 className="text-lg font-black text-slate-900">No matching cases found</h3>
            <p className="text-xs font-semibold text-slate-500 max-w-sm">
              Try changing search or filters. No incident records match active selection.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 rounded-xl bg-[#2e5746] text-white font-extrabold text-xs shadow hover:bg-[#244638] transition-all cursor-pointer"
            >
              CLEAR ALL FILTERS
            </button>
          </div>
        ) : (
          <div className={feedView === 'grid' ? 'grid grid-cols-1 xl:grid-cols-2 gap-spacing-md w-full' : 'flex flex-col gap-spacing-md w-full'}>
            {filteredCases.map((c) => {
              const assignment = c.assignment_details || {};
              const officerName = assignment.officer_name || c.assigned_officer_name || c.assignedOfficer;
              const officerRank = assignment.officer_rank || c.assigned_officer_rank || 'Officer';
              const stationName = assignment.police_station || c.police_station || 'Model Town Police Station';
              const stationCode = assignment.station_code || c.station_code || 'MTP-PS-01';
              const vehicle = assignment.vehicle || 'Patrol Unit';
              const isAssigned = !!officerName;

              return (
                <div
                  key={c.id}
                  className={`p-3.5 sm:p-spacing-md rounded-2xl border flex flex-col ${feedView === 'list' ? 'lg:flex-row lg:items-center' : ''} items-start justify-between gap-spacing-md transition-all w-full overflow-hidden ${
                    c.status === 'NEW' || c.status === 'ACTIVE'
                      ? 'bg-error-container/10 border-error shadow-sm'
                      : 'bg-surface-container-low border-surface-container-highest'
                  }`}
                >
                  <div className="flex flex-col gap-spacing-2xs flex-1 text-left w-full min-w-0">
                    <div className="flex flex-wrap items-center gap-spacing-xs">
                      <span className="font-code-md text-on-surface font-extrabold text-xs sm:text-sm">{c.id}</span>
                      
                      <span className={`px-spacing-xs py-spacing-3xs rounded font-label-sm font-bold uppercase text-[11px] ${
                        c.status === 'NEW' || c.status === 'ACTIVE' ? 'bg-error text-on-error animate-pulse' :
                        c.status === 'ACKNOWLEDGED' || c.status === 'ACCEPTED' ? 'bg-secondary-container text-on-secondary-container' :
                        c.status === 'RESOLVED' ? 'bg-emerald-700 text-white' :
                        c.status === 'CANCELLED' ? 'bg-slate-300 text-slate-700' :
                        'bg-primary-container text-on-primary'
                      }`}>
                        {c.status}
                      </span>
                    </div>

                    <span className="font-headline-sm text-on-surface font-bold mt-1 text-sm sm:text-base">
                      Senior Citizen: {c.citizen_name} ({c.citizen_age || 72} Yrs)
                    </span>

                    {/* POLICE STATION & ASSIGNED OFFICER STRIP */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-700 font-semibold my-1">
                      <span className="flex items-center gap-1 text-emerald-900 font-bold">
                        <span className="material-symbols-outlined text-[15px] text-[#2e5746] flex-shrink-0">domain</span>
                        {stationName} ({stationCode})
                      </span>

                      {isAssigned ? (
                        <span className="flex items-center gap-1 text-slate-900 font-extrabold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <span className="material-symbols-outlined text-[15px] text-primary flex-shrink-0">local_police</span>
                          Assigned Officer: <strong className="text-emerald-900">{officerRank} {officerName}</strong> ({vehicle})
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                          <span className="material-symbols-outlined text-[14px]">warning</span>
                          No Officer Assigned
                        </span>
                      )}
                    </div>

                    <span className="font-body-sm text-on-surface-variant flex items-start gap-1 text-xs">
                      <span className="material-symbols-outlined text-[16px] text-secondary flex-shrink-0 mt-0.5">location_on</span>
                      <span>{c.location_address || 'Model Town Ward'}</span>
                    </span>

                    <span className="font-code-md text-primary font-bold text-xs mt-1">
                      Mobile: {c.citizen_mobile || '+91 98721-00214'} • Triggered: {c.created_at || '15:45 PM'}
                    </span>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex flex-wrap items-center gap-spacing-xs w-full lg:w-auto justify-end">
                    
                    {/* ASSIGN / REASSIGN OFFICER BUTTON (DSP & SHO) */}
                    <button
                      onClick={() => setSelectedCaseForAssign(c.id)}
                      className={`py-spacing-xs px-spacing-md font-label-sm font-extrabold rounded shadow transition-all flex items-center gap-1 cursor-pointer ${
                        isAssigned
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'bg-[#2e5746] hover:bg-[#244638] text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isAssigned ? 'swap_horiz' : 'person_add'}
                      </span>
                      <span>{isAssigned ? 'REASSIGN OFFICER' : 'ASSIGN OFFICER'}</span>
                    </button>



                    <button
                      onClick={() => navigate(`/sho/cases/${c.id}`, { state: { caseData: c } })}
                      className="py-spacing-xs px-spacing-md bg-surface-container-high text-on-surface font-label-sm font-bold rounded hover:bg-surface-container-highest transition-all flex items-center gap-1 cursor-pointer text-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>FULL CASE</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DSP / SHO OFFICER ASSIGNMENT MODAL */}
      {selectedCaseForAssign && (
        <OfficerAssignmentModal
          caseId={selectedCaseForAssign}
          onClose={() => setSelectedCaseForAssign(null)}
        />
      )}
    </div>
  );
}
