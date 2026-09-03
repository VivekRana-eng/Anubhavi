import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OfficerAssignmentModal from '../components/OfficerAssignmentModal';

export default function DashboardOverview() {
  const [stats, setStats] = useState(null);
  const [activeSosCases, setActiveSosCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCaseForAssign, setSelectedCaseForAssign] = useState(null);
  const navigate = useNavigate();

  const loadDashboardData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/analytics/dashboard-stats').then(res => res.json()),
      fetch('/api/sos').then(res => res.json())
    ])
      .then(([statsData, casesData]) => {
        setStats(statsData);
        setActiveSosCases(casesData.filter(c => c.status !== 'CLOSED'));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

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
    }
  };

  return (
    <div className="flex flex-col gap-spacing-lg w-full">
      {/* BANNER STRIP */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg border border-surface-container-highest flex flex-col md:flex-row items-start md:items-center justify-between gap-spacing-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-spacing-xs">
            <span className="px-spacing-xs py-spacing-3xs rounded bg-primary-container text-on-primary font-label-sm uppercase font-bold">
              COMMAND OVERVIEW
            </span>
            <span className="font-code-md text-on-surface-variant font-bold">MODEL TOWN POLICE STATION</span>
          </div>
          <h1 className="font-headline-lg text-on-surface font-bold tracking-tight mt-1">
            Station House Officer Triage & Dispatch Console
          </h1>
          <p className="font-body-sm text-on-surface-variant">
            Live operational status monitoring senior citizens, emergency pings, and field officer dispatches.
          </p>
        </div>

        <div className="flex items-center gap-spacing-sm">
          <button
            onClick={() => navigate('/sho/citizens')}
            className="px-spacing-md py-spacing-xs rounded bg-primary text-on-primary font-label-lg shadow hover:bg-on-surface transition-all flex items-center gap-spacing-xs"
          >
            <span className="material-symbols-outlined text-[18px]">elderly</span>
            SENIOR CITIZENS REGISTRY
          </button>
        </div>
      </div>

      {/* STATISTICAL METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-spacing-sm">
        <div className="bg-surface-container-lowest p-spacing-md rounded-xl shadow-sm border border-surface-container-highest flex flex-col justify-between">
          <span className="font-label-sm text-on-surface-variant uppercase font-semibold">Total Citizens</span>
          <span className="font-headline-xl text-primary font-extrabold mt-1">{stats?.total_citizens || 1248}</span>
          <span className="font-label-sm text-secondary mt-1">Model Town Ward</span>
        </div>

        <div className="bg-error-container/20 p-spacing-md rounded-xl shadow-sm border border-error-container flex flex-col justify-between">
          <span className="font-label-sm text-error uppercase font-extrabold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-error animate-ping"></span> Active SOS
          </span>
          <span className="font-headline-xl text-error font-extrabold mt-1">{stats?.active_sos || 3}</span>
          <span className="font-label-sm text-error font-semibold mt-1">Requires Priority Triage</span>
        </div>

        <div className="bg-surface-container-lowest p-spacing-md rounded-xl shadow-sm border border-surface-container-highest flex flex-col justify-between">
          <span className="font-label-sm text-on-surface-variant uppercase font-semibold">Pending Assistance</span>
          <span className="font-headline-xl text-on-surface font-extrabold mt-1">{stats?.pending_assistance || 8}</span>
          <span className="font-label-sm text-secondary mt-1">Non-emergency queue</span>
        </div>

        <div className="bg-surface-container-lowest p-spacing-md rounded-xl shadow-sm border border-surface-container-highest flex flex-col justify-between">
          <span className="font-label-sm text-on-surface-variant uppercase font-semibold">Missed Check-ins</span>
          <span className="font-headline-xl text-on-surface font-extrabold mt-1">{stats?.missed_checkins || 5}</span>
          <span className="font-label-sm text-on-surface-variant mt-1">Unresponsive daily pings</span>
        </div>

        <div className="bg-surface-container-lowest p-spacing-md rounded-xl shadow-sm border border-surface-container-highest flex flex-col justify-between">
          <span className="font-label-sm text-on-surface-variant uppercase font-semibold">Active Cases</span>
          <span className="font-headline-xl text-on-surface font-extrabold mt-1">{stats?.active_cases || 17}</span>
          <span className="font-label-sm text-secondary mt-1">In progress / Assigned</span>
        </div>

        <div className="bg-surface-container-lowest p-spacing-md rounded-xl shadow-sm border border-surface-container-highest flex flex-col justify-between">
          <span className="font-label-sm text-on-surface-variant uppercase font-semibold">Resolved Cases</span>
          <span className="font-headline-xl text-secondary font-extrabold mt-1">{stats?.resolved_cases || 126}</span>
          <span className="font-label-sm text-secondary mt-1">Safely closed</span>
        </div>

        <div className="bg-surface-container-lowest p-spacing-md rounded-xl shadow-sm border border-surface-container-highest flex flex-col justify-between">
          <span className="font-label-sm text-on-surface-variant uppercase font-semibold">Avg Response Time</span>
          <span className="font-headline-xl text-primary font-extrabold mt-1">{stats?.avg_response_time || '8 min'}</span>
          <span className="font-label-sm text-secondary mt-1">Station SLA Target &lt;15m</span>
        </div>
      </div>

      {/* ACTIVE SOS & EMERGENCY TRIAGE QUEUE */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg border border-surface-container-highest flex flex-col gap-spacing-md">
        <div className="flex items-center justify-between border-b border-surface-container-highest pb-spacing-xs">
          <div className="flex items-center gap-spacing-xs">
            <span className="material-symbols-outlined text-error text-[24px]">fmd_bad</span>
            <h2 className="font-headline-sm text-on-surface font-bold uppercase tracking-wider">
              Priority SOS Emergency Triage Feed
            </h2>
          </div>
          <span className="font-label-sm text-on-surface-variant font-semibold">
            {activeSosCases.length} Cases Requiring Action
          </span>
        </div>

        {activeSosCases.length === 0 ? (
          <div className="py-spacing-2xl text-center font-label-md text-on-surface-variant">
            🟢 No active emergency SOS alerts currently pending. Station operates in steady-state monitoring.
          </div>
        ) : (
          <div className="flex flex-col gap-spacing-md">
            {activeSosCases.map((c) => (
              <div
                key={c.id}
                className={`p-spacing-md rounded-xl border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-spacing-md transition-all ${
                  c.status === 'NEW'
                    ? 'bg-error-container/10 border-error shadow-sm'
                    : 'bg-surface-container-low border-surface-container-highest'
                }`}
              >
                <div className="flex flex-col gap-spacing-2xs flex-1">
                  <div className="flex flex-wrap items-center gap-spacing-xs">
                    <span className="font-code-md text-on-surface font-bold">{c.id}</span>
                    <span className={`px-spacing-xs py-spacing-3xs rounded font-label-sm font-bold uppercase ${
                      c.status === 'NEW' ? 'bg-error text-on-error animate-pulse' :
                      c.status === 'ACCEPTED' ? 'bg-secondary-container text-on-secondary-container' :
                      'bg-primary-container text-on-primary'
                    }`}>
                      {c.status}
                    </span>
                    <span className="font-label-sm text-error font-bold">{c.emergency_type}</span>
                  </div>

                  <span className="font-headline-sm text-on-surface font-bold">
                    Senior Citizen: {c.citizen_name} ({c.citizen_age} Yrs)
                  </span>

                  <span className="font-body-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                    {c.location_address}
                  </span>

                  <span className="font-code-md text-primary font-bold">
                    Mobile: {c.citizen_mobile} • Triggered At: {c.created_at}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-spacing-xs w-full lg:w-auto justify-end">
                  {c.status === 'NEW' && (
                    <button
                      onClick={() => handleAcceptCase(c.id)}
                      className="py-spacing-xs px-spacing-md bg-error text-on-error font-label-sm font-bold rounded shadow hover:bg-error-container hover:text-on-error-container transition-all flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      ACCEPT CASE
                    </button>
                  )}

                  {c.status === 'ACCEPTED' && (
                    <button
                      onClick={() => setSelectedCaseForAssign(c.id)}
                      className="py-spacing-xs px-spacing-md bg-primary text-on-primary font-label-sm font-bold rounded shadow hover:bg-on-surface transition-all flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">person_add</span>
                      ASSIGN OFFICER
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
            ))}
          </div>
        )}
      </div>

      {/* OFFICER DISPATCH MODAL IF TRIGGERED */}
      {selectedCaseForAssign && (
        <OfficerAssignmentModal
          caseId={selectedCaseForAssign}
          onClose={() => setSelectedCaseForAssign(null)}
          onAssigned={loadDashboardData}
        />
      )}
    </div>
  );
}
