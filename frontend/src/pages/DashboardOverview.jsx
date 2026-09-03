import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OfficerAssignmentModal from '../components/OfficerAssignmentModal';

export default function DashboardOverview() {
  const [stats, setStats] = useState(null);
  const [activeSosCases, setActiveSosCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCaseForAssign, setSelectedCaseForAssign] = useState(null);
  const [countdown, setCountdown] = useState('18h 38m 43s');
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
    const interval = setInterval(() => {
      const seconds = Math.floor(Math.random() * 60);
      setCountdown(`18h 38m ${seconds < 10 ? '0' + seconds : seconds}s`);
    }, 1000);
    return () => clearInterval(interval);
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
      {/* BANNER STRIP WITH CCTNS SYNC & STATION STATUS */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg border border-surface-container-highest flex flex-col md:flex-row items-start md:items-center justify-between gap-spacing-md relative overflow-hidden">
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
            className="px-spacing-md py-spacing-xs rounded bg-primary text-on-primary font-label-lg shadow hover:bg-on-surface transition-all flex items-center gap-spacing-xs"
          >
            <span className="material-symbols-outlined text-[18px]">elderly</span>
            SENIOR REGISTRY (1,248)
          </button>
        </div>
      </div>

      {/* 24-HOUR STATUTORY SLA COUNTDOWN WATCHDOG STRIP */}
      <div className="bg-surface-container-high/40 p-spacing-md rounded-xl border border-surface-container-highest flex flex-col lg:flex-row items-center justify-between gap-spacing-md">
        <div className="flex items-center gap-spacing-md">
          <div className="w-10 h-10 rounded-xl bg-error-container text-on-error-container flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[24px] animate-pulse">security</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-spacing-xs">
              <span className="font-headline-sm text-on-surface font-bold">24-Hour Statutory Station SLA Watchdog</span>
              <span className="px-spacing-xs py-spacing-3xs rounded bg-secondary text-on-secondary font-label-sm uppercase">Active Regulation</span>
            </div>
            <p className="font-body-sm text-on-surface-variant">Automatic district escalation triggers if SHO resolution or signed rationale is not logged within mandatory 24h window.</p>
          </div>
        </div>

        <div className="flex items-center gap-spacing-md bg-surface-container-lowest px-spacing-lg py-spacing-xs rounded-xl shadow-sm border border-surface-container-highest">
          <div className="flex flex-col">
            <span className="font-label-sm text-on-surface-variant uppercase tracking-wider">Next Auto-Escalation</span>
            <div className="flex items-baseline gap-spacing-2xs">
              <span className="font-headline-xl text-error font-bold tracking-tight">{countdown}</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-error text-[28px] animate-bounce">alarm</span>
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

      {/* WORKFLOW PROTOCOL DIAGRAM STRIP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-spacing-md">
        <div className="bg-surface-container-lowest p-spacing-md rounded-xl shadow-sm border border-surface-container-highest flex flex-col gap-spacing-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-secondary font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">verified</span> Normal Resolution Protocol
            </span>
            <span className="font-label-sm text-on-surface-variant">Target SLA &lt; 45 Mins</span>
          </div>
          <div className="flex items-center justify-between text-center pt-spacing-xs gap-1">
            <div className="flex-1 bg-surface-container-low p-2 rounded">
              <span className="font-label-sm text-on-surface block font-bold">1. Citizen</span>
              <span className="text-[10px] text-on-surface-variant uppercase">SOS Trigger</span>
            </div>
            <span className="material-symbols-outlined text-outline-variant text-[16px]">arrow_forward</span>
            <div className="flex-1 bg-surface-container-low p-2 rounded">
              <span className="font-label-sm text-on-surface block font-bold">2. SHO Desk</span>
              <span className="text-[10px] text-on-surface-variant uppercase">Accept Alert</span>
            </div>
            <span className="material-symbols-outlined text-outline-variant text-[16px]">arrow_forward</span>
            <div className="flex-1 bg-surface-container-low p-2 rounded">
              <span className="font-label-sm text-on-surface block font-bold">3. Patrol</span>
              <span className="text-[10px] text-on-surface-variant uppercase">Assign Beat</span>
            </div>
            <span className="material-symbols-outlined text-outline-variant text-[16px]">arrow_forward</span>
            <div className="flex-1 bg-secondary-container/40 p-2 rounded">
              <span className="font-label-sm text-on-secondary-container block font-bold">4. Safe Closure</span>
              <span className="text-[10px] text-on-secondary-container uppercase font-bold">FIR/Log Saved</span>
            </div>
          </div>
        </div>

        <div className="bg-error-container/20 p-spacing-md rounded-xl shadow-sm border border-error-container flex flex-col gap-spacing-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-error font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">crisis_alert</span> Escalation Fail-Safe Chain
            </span>
            <span className="px-spacing-xs py-spacing-3xs rounded bg-error text-on-error font-label-sm">Auto-Trigger at 24h:00m</span>
          </div>
          <div className="flex items-center justify-between text-center pt-spacing-xs gap-1">
            <div className="flex-1 bg-surface-container-lowest p-2 rounded border border-error-container">
              <span className="font-label-sm text-on-surface block font-bold">Citizen SOS</span>
              <span className="text-[10px] text-on-surface-variant uppercase">02:34 PM</span>
            </div>
            <span className="material-symbols-outlined text-error text-[16px]">arrow_forward</span>
            <div className="flex-1 bg-surface-container-lowest p-2 rounded border border-error-container">
              <span className="font-label-sm text-error block font-bold">No Action</span>
              <span className="text-[10px] text-error font-bold uppercase">24 Hours Over</span>
            </div>
            <span className="material-symbols-outlined text-error text-[16px]">priority_high</span>
            <div className="flex-1 bg-error text-on-error p-2 rounded shadow-sm">
              <span className="font-label-sm block font-bold">DSP ESCALATED</span>
              <span className="text-[10px] text-on-error uppercase font-semibold">HQ Override</span>
            </div>
          </div>
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
