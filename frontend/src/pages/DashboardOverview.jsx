import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OfficerAssignmentModal from '../components/OfficerAssignmentModal';
import FilterChips from '../components/FilterChips';
import { useWebSocket } from '../context/WebSocketContext';
import { useFilter, applyFiltersAndSearch } from '../context/FilterContext';

export default function DashboardOverview() {
  const [stats, setStats] = useState(null);
  const [allSosCases, setAllSosCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCaseForAssign, setSelectedCaseForAssign] = useState(null);
  const [countdown, setCountdown] = useState('18h 38m 43s');
  const navigate = useNavigate();
  const { lastEvent } = useWebSocket();
  const { searchQuery, filters, clearAllFilters, activeFilterCount } = useFilter();

  const loadDashboardData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/analytics/dashboard-stats').then(res => res.json()).catch(() => null),
      fetch('/api/sos').then(res => res.json()).catch(() => [])
    ])
      .then(([statsData, casesData]) => {
        if (statsData) setStats(statsData);
        setAllSosCases(casesData || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(() => {
      const seconds = Math.floor(Math.random() * 60);
      setCountdown(`18h 38m ${seconds < 10 ? '0' + seconds : seconds}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Real-time listener: refresh triage feed instantly when a WebSocket or custom event arrives
  useEffect(() => {
    const handleNewSos = (e) => {
      if (e.detail) {
        const data = e.detail;
        setAllSosCases(prev => {
          if (prev.some(c => c.id === data.case_id)) return prev;
          const newCase = {
            id: data.case_id,
            citizen_name: data.citizen_name || 'Senior Citizen',
            citizen_age: data.citizen_age || 72,
            citizen_mobile: data.citizen_mobile || '+91 98721-00214',
            emergency_type: data.emergency_type || 'Emergency Alarm',
            location_address: data.location || data.location_address || 'Model Town Ward',
            created_at: data.sos_time || 'Just Now',
            status: 'ACTIVE'
          };
          return [newCase, ...prev];
        });
        setStats(prev => prev ? { ...prev, active_sos: (prev.active_sos || 0) + 1 } : prev);
      }
    };

    window.addEventListener('anubhavi_new_sos_alert', handleNewSos);

    if (lastEvent) {
      if (lastEvent.event === 'NEW_SOS_ALERT') {
        setAllSosCases(prev => {
          if (prev.some(c => c.id === lastEvent.case_id)) return prev;
          const newCase = {
            id: lastEvent.case_id,
            citizen_name: lastEvent.citizen_name,
            citizen_age: lastEvent.citizen_age || 72,
            citizen_mobile: lastEvent.citizen_mobile,
            emergency_type: lastEvent.emergency_type,
            location_address: lastEvent.location,
            created_at: lastEvent.sos_time || lastEvent.created_at,
            status: 'NEW',
            priority: lastEvent.priority || 'HIGH'
          };
          return [newCase, ...prev];
        });
        setStats(prev => prev ? { ...prev, active_sos: (prev.active_sos || 0) + 1 } : prev);
      } else {
        loadDashboardData();
      }
    }

    return () => window.removeEventListener('anubhavi_new_sos_alert', handleNewSos);
  }, [lastEvent]);

  const handleAcceptCase = async (caseId) => {
    try {
      const res = await fetch(`/api/sos/${caseId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('anubhavi_token')}`
        }
      });
      if (res.ok) {
        loadDashboardData();
      }
    } catch (e) {
      console.error(e);
      setAllSosCases(prev => prev.map(c => c.id === caseId ? { ...c, status: 'ACKNOWLEDGED' } : c));
    }
  };

  // Compute filtered SOS cases using AND filter logic
  const filteredCases = applyFiltersAndSearch(allSosCases, searchQuery, filters);
  const activeCasesCount = allSosCases.filter(c => c.status !== 'CLOSED' && c.status !== 'RESOLVED').length;

  return (
    <div className="flex flex-col gap-spacing-lg w-full">
      {/* BANNER STRIP WITH CCTNS SYNC & STATION STATUS */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg border border-surface-container-highest flex flex-col md:flex-row items-start md:items-center justify-between gap-spacing-md relative overflow-hidden text-left">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-spacing-xs">
            <span className="px-spacing-xs py-spacing-3xs rounded bg-primary-container text-on-primary font-label-sm uppercase font-bold tracking-wider">
              CCTNS ERSS-112 DIRECT PIPE
            </span>
            <span className="font-code-md text-on-surface-variant font-bold">MODEL TOWN POLICE STATION</span>
          </div>
          <h1 className="font-headline-lg text-on-surface font-extrabold tracking-tight mt-1">
            Station House Officer Command & Triage Console
          </h1>
          <p className="font-body-sm text-on-surface-variant">
            Suraksha. Saath. Samman • Real-time emergency dispatch, senior citizens registry, and 24h statutory SLA watchdog.
          </p>
        </div>

        <div className="flex items-center gap-spacing-sm">
          <button
            onClick={() => navigate('/sho/citizens')}
            className="px-spacing-md py-spacing-xs rounded bg-primary text-on-primary font-label-lg shadow hover:bg-on-surface transition-all flex items-center gap-spacing-xs font-bold"
          >
            <span className="material-symbols-outlined text-[18px]">elderly</span>
            SENIOR REGISTRY (1,248)
          </button>
        </div>
      </div>

      {/* STATISTICAL METRIC CARDS (4 CARDS) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-spacing-sm text-left">
        <div className="bg-surface-container-lowest p-spacing-md rounded-xl shadow-sm border border-surface-container-highest flex flex-col justify-between">
          <span className="font-label-sm text-on-surface-variant uppercase font-semibold">Total Citizens</span>
          <span className="font-headline-xl text-primary font-extrabold mt-1">{stats?.total_citizens || 1248}</span>
          <span className="font-label-sm text-secondary mt-1 font-bold">Model Town Ward</span>
        </div>

        <div className="bg-error-container/20 p-spacing-md rounded-xl shadow-sm border border-error-container flex flex-col justify-between">
          <span className="font-label-sm text-error uppercase font-extrabold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-error animate-ping"></span> Active SOS
          </span>
          <span className="font-headline-xl text-error font-extrabold mt-1">{activeCasesCount}</span>
          <span className="font-label-sm text-error font-bold mt-1">Requires Triage</span>
        </div>

        <div className="bg-surface-container-lowest p-spacing-md rounded-xl shadow-sm border border-surface-container-highest flex flex-col justify-between">
          <span className="font-label-sm text-on-surface-variant uppercase font-semibold">Missed Check-ins</span>
          <span className="font-headline-xl text-on-surface font-extrabold mt-1">{stats?.missed_checkins || 5}</span>
          <span className="font-label-sm text-on-surface-variant font-semibold mt-1">Unresponsive pings</span>
        </div>

        <div className="bg-surface-container-lowest p-spacing-md rounded-xl shadow-sm border border-surface-container-highest flex flex-col justify-between">
          <span className="font-label-sm text-on-surface-variant uppercase font-semibold">Avg Response</span>
          <span className="font-headline-xl text-primary font-extrabold mt-1">{stats?.avg_response_time || '8 min'}</span>
          <span className="font-label-sm text-secondary font-semibold mt-1">Target &lt;15m</span>
        </div>
      </div>

      {/* ACTIVE FILTER CHIPS DISPLAY */}
      <FilterChips />

      {/* ACTIVE SOS & EMERGENCY TRIAGE QUEUE */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg border border-surface-container-highest flex flex-col gap-spacing-md text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-surface-container-highest pb-spacing-xs gap-2">
          <div className="flex items-center gap-spacing-xs">
            <span className="material-symbols-outlined text-error text-[24px]">fmd_bad</span>
            <h2 className="font-headline-sm text-on-surface font-bold uppercase tracking-wider">
              Priority SOS Emergency Triage Feed
            </h2>
          </div>

          {/* DYNAMIC RESULT COUNT */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-surface-container-high text-on-surface font-label-md font-bold rounded-lg border border-surface-container-highest">
              Showing {filteredCases.length} of {allSosCases.length} cases
            </span>
          </div>
        </div>

        {/* NO RESULTS MATCHING FILTER EMPTY STATE */}
        {filteredCases.length === 0 ? (
          <div className="py-12 px-4 text-center flex flex-col items-center justify-center gap-3 bg-slate-50 rounded-2xl border border-slate-200 my-2">
            <div className="w-16 h-16 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-500 text-3xl">
              🔍
            </div>
            <h3 className="text-lg font-black text-slate-900">No cases found</h3>
            <p className="text-xs font-semibold text-slate-500 max-w-sm">
              Try changing your search or filters. No incident records match your active selection.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-2 px-5 py-2.5 bg-[#2e5746] hover:bg-[#244638] text-white font-extrabold text-xs rounded-xl shadow-md transition-all uppercase tracking-wider"
            >
              CLEAR FILTERS
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-spacing-md">
            {filteredCases.map((c) => {
              const assignment = c.assignment_details || {};
              const officerName = assignment.officer_name || c.assigned_officer_name || c.assignedOfficer || null;
              const officerRank = assignment.officer_rank || c.assigned_officer_rank || '';
              const stationName = assignment.police_station || c.police_station || c.policeStation || 'Model Town Police Station';
              const stationCode = assignment.station_code || c.stationCode || 'MTP-PS-01';

              return (
                <div
                  key={c.id}
                  className={`p-spacing-md rounded-xl border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-spacing-md transition-all ${
                    c.status === 'NEW' || c.status === 'ACTIVE'
                      ? 'bg-error-container/10 border-error shadow-sm'
                      : 'bg-surface-container-low border-surface-container-highest'
                  }`}
                >
                  <div className="flex flex-col gap-spacing-2xs flex-1 text-left">
                    <div className="flex flex-wrap items-center gap-spacing-xs">
                      <span className="font-code-md text-on-surface font-extrabold">{c.id}</span>
                      
                      {/* STATUS BADGE */}
                      <span className={`px-spacing-xs py-spacing-3xs rounded font-label-sm font-bold uppercase ${
                        c.status === 'NEW' || c.status === 'ACTIVE' ? 'bg-error text-on-error animate-pulse' :
                        c.status === 'ACKNOWLEDGED' || c.status === 'ACCEPTED' ? 'bg-secondary-container text-on-secondary-container' :
                        c.status === 'RESOLVED' ? 'bg-emerald-700 text-white' :
                        c.status === 'CANCELLED' ? 'bg-slate-300 text-slate-700' :
                        'bg-primary-container text-on-primary'
                      }`}>
                        {c.status}
                      </span>
                    </div>

                    <span className="font-headline-sm text-on-surface font-bold mt-1">
                      Senior Citizen: {c.citizen_name || c.citizenName} ({c.citizen_age || c.citizenAge || 72} Yrs)
                    </span>

                    {/* POLICE STATION STRIP */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-700 font-semibold my-1">
                      <span className="flex items-center gap-1 text-emerald-900 font-bold">
                        <span className="material-symbols-outlined text-[15px] text-[#2e5746]">domain</span>
                        {stationName} ({stationCode})
                      </span>
                      {officerName && (
                        <span className="flex items-center gap-1 text-slate-800 font-extrabold">
                          <span className="material-symbols-outlined text-[15px] text-primary">local_police</span>
                          Officer: {officerRank} {officerName}
                        </span>
                      )}
                    </div>

                    <span className="font-body-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                      {c.location_address || c.address}
                    </span>

                    <span className="font-code-md text-primary font-bold">
                      Mobile: {c.citizen_mobile || c.phone} • Triggered At: {c.created_at || c.createdAt}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-spacing-xs w-full lg:w-auto justify-end">
                    {(c.status === 'NEW' || c.status === 'ACTIVE') && (
                      <button
                        onClick={() => handleAcceptCase(c.id)}
                        className="py-spacing-xs px-spacing-md bg-error text-on-error font-label-sm font-bold rounded shadow hover:bg-error-container hover:text-on-error-container transition-all flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        ACCEPT CASE
                      </button>
                    )}

                    {(c.status === 'ACKNOWLEDGED' || c.status === 'ACCEPTED' || c.status === 'ASSIGNED') && (
                      <button
                        onClick={() => setSelectedCaseForAssign(c.id)}
                        className="py-spacing-xs px-spacing-md bg-primary text-on-primary font-label-sm font-bold rounded shadow hover:bg-on-surface transition-all flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">person_add</span>
                        {c.status === 'ASSIGNED' ? 'REASSIGN OFFICER' : 'ASSIGN OFFICER'}
                      </button>
                    )}

                    <button
                      onClick={() => navigate(`/sho/cases/${c.id}`)}
                      className="py-spacing-xs px-spacing-md bg-surface-container-high text-on-surface font-label-sm font-bold rounded hover:bg-surface-container-highest transition-all flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      VIEW FULL CASE
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* OFFICER DISPATCH MODAL IF TRIGGERED */}
      {selectedCaseForAssign && (
        <OfficerAssignmentModal
          caseId={selectedCaseForAssign}
          onClose={() => setSelectedCaseForAssign(null)}
          onAssigned={() => loadDashboardData()}
        />
      )}
    </div>
  );
}
