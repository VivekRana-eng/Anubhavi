import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OfficerAssignmentModal from '../components/OfficerAssignmentModal';

export default function CaseDetails() {
  const { caseId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const navigate = useNavigate();

  const loadCaseDetails = () => {
    setLoading(true);
    fetch(`/api/sos/${caseId}`)
      .then(res => {
        if (!res.ok) throw new Error("Case not found");
        return res.json();
      })
      .then(d => {
        setData(d);
        setSelectedStatus(d.case.status);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCaseDetails();
  }, [caseId]);

  const handleUpdateStatus = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/sos/${caseId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('anubhavi_token')}`
        },
        body: JSON.stringify({ status: selectedStatus })
      });
      if (res.ok) {
        loadCaseDetails();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-spacing-3xl text-center font-headline-sm text-on-surface-variant">
        Loading operational case file {caseId}...
      </div>
    );
  }

  if (!data || !data.case) {
    return (
      <div className="py-spacing-3xl text-center flex flex-col items-center gap-spacing-md">
        <span className="material-symbols-outlined text-[48px] text-error">error</span>
        <h2 className="font-headline-md font-bold">Case File Not Found</h2>
        <button
          onClick={() => navigate('/sho/dashboard')}
          className="px-spacing-md py-spacing-xs bg-primary text-on-primary rounded font-label-lg"
        >
          RETURN TO DASHBOARD
        </button>
      </div>
    );
  }

  const { case: c, citizen, emergency_contacts, assigned_officer, timeline } = data;
  const assignment = c.assignment_details || {};
  const activeOfficer = assigned_officer || (c.status === 'ASSIGNED' || assignment.officer_name ? {
    id: assignment.officer_id || 'POL-1025',
    name: assignment.officer_name || 'ASI Amit Singh',
    rank: assignment.officer_rank || 'Assistant Sub-Inspector',
    police_id: assignment.police_id || 'POL-1025',
    mobile: '+91 98721-44102',
    current_vehicle: assignment.vehicle || 'PCR Bike #12',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzZPFuUAA-GjuqoDc0ROMs6dF5KTfabqTVwmZNnY0YDGQ9ceS9un43-t50gBNKIJ4FWwDanXcLlOf3uQ5hE6oF4TjJMUg01bZqIsuDr_TucayV1CUZ0p9svKyoLK9bOq5KNLlmLW_ibbjW1j5gl_SufTcWTSXmmRk8Bl6TuVDgTpWdBrch9ZX1PYhBhZDN0gycUWhzsrGo_k6Lrcij-yVjYLVqigwCWcvqJnVGg0nhy4lGx0JiBO'
  } : null);

  return (
    <div className="flex flex-col gap-spacing-lg w-full">
      {/* TOP NAVIGATION BACK BAR */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="px-spacing-md py-spacing-xs bg-surface-container-lowest hover:bg-surface-container-high text-on-surface rounded-lg font-label-lg font-bold shadow-sm border border-surface-container-highest flex items-center gap-spacing-xs transition-all"
        >
          <span className="material-symbols-outlined text-[20px] text-primary">arrow_back</span>
          ← BACK TO DASHBOARD
        </button>

        <span className="font-code-md text-on-surface-variant font-bold">
          INCIDENT DOSSIER • {c.id}
        </span>
      </div>

      {/* CASE HEADER & STATUS MODIFIER */}
      <div className="relative bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg overflow-hidden border border-surface-container-highest">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-spacing-md relative z-10">
          <div className="flex flex-col gap-spacing-2xs">
            <div className="flex flex-wrap items-center gap-spacing-xs">
              <span className="px-spacing-xs py-spacing-3xs rounded bg-primary-container text-on-primary font-label-sm uppercase tracking-wider font-bold">
                CCTNS RECORD SYNCHRONIZED
              </span>
              <span className="font-code-md text-on-surface-variant font-bold">CASE ID: {c.id}</span>
              <span className="px-spacing-xs py-spacing-3xs rounded bg-tertiary-container text-on-tertiary font-label-sm font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">e911_emergency</span>
                LEVEL 1 SEVERE
              </span>
            </div>
            <div className="flex items-center gap-spacing-sm">
              <h1 className="font-headline-lg text-on-surface font-bold tracking-tight">
                {c.emergency_type} ({citizen.name || c.citizen_name})
              </h1>
            </div>
            <p className="font-body-sm text-on-surface-variant flex items-center gap-spacing-xs">
              <span className="material-symbols-outlined text-[16px] text-secondary">domain</span>
              Model Town PS, Central District, Ludhiana • Recorded via National ERSS-112 Ingestion Pipe
            </p>
          </div>

          {/* STATUS MODIFIER & DISPATCH TRIGGER */}
          <div className="flex flex-wrap items-center gap-spacing-sm bg-surface-container-low p-spacing-xs rounded-lg shadow-sm border border-surface-container-highest">
            <div className="flex flex-col px-spacing-xs">
              <span className="font-label-sm text-on-surface-variant uppercase font-bold">Current Status</span>
              <div className="flex items-center gap-spacing-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping"></span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-transparent font-headline-sm text-on-surface font-bold focus:outline-none cursor-pointer"
                >
                  <option value="ACTIVE">🔴 ACTIVE</option>
                  <option value="ACKNOWLEDGED">🔵 ACKNOWLEDGED</option>
                  <option value="ASSIGNED">🟣 ASSIGNED</option>
                  <option value="OFFICER_DISPATCHED">🚔 OFFICER DISPATCHED</option>
                  <option value="ON_THE_WAY">🚓 EN ROUTE</option>
                  <option value="OFFICER_AT_LOCATION">📍 OFFICER AT LOCATION</option>
                  <option value="ARRIVED">📍 ARRIVED</option>
                  <option value="RESOLVED">🟢 RESOLVED</option>
                  <option value="CLOSED">🔒 CLOSED</option>
                  <option value="CANCELLED">❌ CANCELLED</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleUpdateStatus}
              disabled={updating}
              className="px-spacing-md py-spacing-xs rounded bg-primary text-on-primary font-label-lg shadow-sm hover:bg-on-surface transition-all flex items-center gap-spacing-xs font-bold"
            >
              <span className="material-symbols-outlined text-[18px]">published_with_changes</span>
              {updating ? 'SAVING...' : 'UPDATE CASE STATUS'}
            </button>
          </div>
        </div>

        {/* 24-HOUR WATCHDOG SLA STRIP */}
        <div className="mt-spacing-lg pt-spacing-md bg-surface-container-high/40 -mx-spacing-lg -mb-spacing-lg p-spacing-lg rounded-b-xl flex flex-col gap-spacing-md border-t border-surface-container-highest">
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-spacing-md">
            <div className="flex items-center gap-spacing-md">
              <div className="w-12 h-12 rounded-xl bg-error-container text-on-error-container flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[28px] animate-pulse">save_as</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-spacing-xs">
                  <span className="font-headline-sm text-on-surface font-bold">24-Hour Statutory Station SLA Countdown</span>
                  <span className="px-spacing-xs py-spacing-3xs rounded-full bg-secondary text-on-secondary font-label-sm uppercase font-bold">
                    Active Watchdog Running
                  </span>
                </div>
                <p className="font-body-sm text-on-surface-variant">
                  Automatic district escalation triggers if SHO resolution or signed rationale is not logged within mandatory regulatory cycle.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-spacing-lg bg-surface-container-lowest px-spacing-lg py-spacing-xs rounded-xl shadow-sm border border-surface-container-highest">
              <div className="flex flex-col">
                <span className="font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Time Before Auto-Escalation</span>
                <div className="flex items-baseline gap-spacing-2xs">
                  <span className="font-headline-xl text-error font-extrabold tracking-tight">18h 38m 43s</span>
                  <span className="font-label-sm text-on-surface-variant">remaining</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN OPERATIONAL GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-spacing-lg items-start">
        {/* LEFT & CENTER (8 COLS) */}
        <div className="xl:col-span-8 flex flex-col gap-spacing-lg">
          {/* SECTION A: SENIOR CITIZEN PROFILE */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg relative overflow-hidden border border-surface-container-highest">
            <div className="flex items-center justify-between pb-spacing-sm mb-spacing-md border-b border-surface-container-highest">
              <div className="flex items-center gap-spacing-xs">
                <span className="material-symbols-outlined text-primary text-[22px]">elderly</span>
                <h2 className="font-headline-sm text-on-surface font-bold uppercase tracking-wider">
                  Section A: Senior Citizen Registry Profile
                </h2>
              </div>
              <button
                onClick={() => navigate(`/sho/citizens/${c.citizen_id}`)}
                className="px-spacing-xs py-spacing-3xs rounded bg-surface-container-highest text-on-surface font-label-sm font-bold hover:bg-primary hover:text-on-primary transition-all"
              >
                VIEW ONLY →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-spacing-md items-center">
              <div className="md:col-span-4 flex flex-col items-center sm:flex-row gap-spacing-md">
                <img
                  src={citizen.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD"}
                  alt={citizen.name || c.citizen_name}
                  className="w-24 h-24 rounded-full object-cover shadow-sm bg-surface-container flex-shrink-0"
                />
                <div className="flex flex-col text-center sm:text-left">
                  <span className="font-headline-md text-on-surface font-bold">{citizen.name || c.citizen_name}</span>
                  <span className="font-label-md text-on-surface-variant">{citizen.age || c.citizen_age} Yrs • {citizen.gender || 'Male'} • {citizen.living_status || 'LIVES_ALONE'}</span>
                  <span className="font-code-md text-primary font-bold mt-spacing-2xs">{citizen.mobile || c.citizen_mobile}</span>
                  <span className="text-[11px] text-secondary mt-1">Aadhaar: {citizen.aadhaar_masked || 'XXXX-XXXX-4912'}</span>
                </div>
              </div>

              <div className="md:col-span-8 bg-surface-container-low p-spacing-md rounded-lg flex flex-col gap-spacing-xs border border-surface-container-highest">
                <span className="font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Registered Residence</span>
                <span className="font-body-sm text-on-surface font-semibold">{c.location_address}</span>

                <span className="font-label-sm text-error font-bold uppercase tracking-wider flex items-center gap-1 mt-spacing-xs">
                  <span className="material-symbols-outlined text-[14px]">medical_services</span> Medical Dossier (Critical)
                </span>
                <div className="flex flex-wrap gap-spacing-3xs mt-spacing-2xs">
                  <span className="px-spacing-xs py-spacing-3xs rounded bg-error-container text-on-error-container font-label-sm font-bold">
                    {citizen.medical_conditions || 'Severe Cardiac History, Pacemaker Fitted (2023)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION B: SOS TELEMETRY */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg flex flex-col gap-spacing-md border border-surface-container-highest">
            <div className="flex items-center justify-between pb-spacing-xs border-b border-surface-container-highest">
              <div className="flex items-center gap-spacing-xs">
                <span className="material-symbols-outlined text-secondary text-[22px]">satellite_alt</span>
                <h2 className="font-headline-sm text-on-surface font-bold uppercase tracking-wider">
                  Section B: SOS Alert Telemetry & Tactical Map
                </h2>
              </div>
              <span className="font-label-sm text-on-surface-variant font-semibold">Cell Tower Triangulation + GPS Active</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-spacing-md bg-surface-container-low p-spacing-md rounded-xl">
              <div className="flex flex-col bg-surface-container-lowest p-spacing-sm rounded-lg shadow-sm border border-surface-container-highest">
                <span className="font-label-sm text-on-surface-variant uppercase font-semibold">Triggered At</span>
                <span className="font-code-md text-on-surface font-bold mt-0.5">{c.created_at}</span>
              </div>
              <div className="flex flex-col bg-surface-container-lowest p-spacing-sm rounded-lg shadow-sm border border-surface-container-highest">
                <span className="font-label-sm text-on-surface-variant uppercase font-semibold">Beat Sector</span>
                <span className="font-label-md text-on-surface font-bold mt-0.5">Model Town Sector 3</span>
              </div>
              <div className="flex flex-col bg-surface-container-lowest p-spacing-sm rounded-lg shadow-sm border border-surface-container-highest">
                <span className="font-label-sm text-on-surface-variant uppercase font-semibold">GPS Coordinates</span>
                <span className="font-code-md text-primary font-bold mt-0.5">{c.latitude || 30.9010}° N, {c.longitude || 75.8573}° E</span>
              </div>
            </div>
          </div>

          {/* SECTION C: ASSIGNED POLICE OFFICER & POLICE STATION */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg flex flex-col gap-spacing-md border border-surface-container-highest">
            <div className="flex items-center justify-between pb-spacing-xs border-b border-surface-container-highest">
              <div className="flex items-center gap-spacing-xs">
                <span className="material-symbols-outlined text-primary text-[22px]">local_police</span>
                <h2 className="font-headline-sm text-on-surface font-bold uppercase tracking-wider">
                  Section C: Assigned Response & Police Station Dispatch
                </h2>
              </div>

              {!activeOfficer ? (
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="px-spacing-md py-spacing-xs bg-primary text-on-primary font-label-sm font-bold rounded shadow hover:bg-on-surface"
                >
                  ASSIGN RESPONSE NOW
                </button>
              ) : (
                <span className="px-spacing-xs py-spacing-3xs rounded bg-secondary-container text-on-secondary-container font-label-sm font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span> RESPONSE ASSIGNED
                </span>
              )}
            </div>

            {activeOfficer ? (
              <div className="flex flex-col gap-spacing-md">
                {/* POLICE STATION STRIP */}
                <div className="bg-surface-container-low p-spacing-md rounded-lg border border-surface-container-highest flex flex-col sm:flex-row items-start sm:items-center justify-between gap-spacing-sm">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-on-surface-variant uppercase font-bold tracking-wider">Assigned From Police Station</span>
                    <span className="font-headline-sm text-on-surface font-extrabold">{assignment.police_station || 'MODEL TOWN POLICE STATION'}</span>
                    <span className="font-body-sm text-on-surface-variant">Station Code: <strong className="text-on-surface">{assignment.station_code || 'MTP-PS-01'}</strong> • Jurisdiction: {assignment.jurisdiction || 'Model Town • District Central • Zone 1'}</span>
                  </div>
                  <div className="flex flex-col items-start sm:items-end">
                    <span className="px-spacing-xs py-spacing-3xs rounded bg-primary-container text-on-primary font-label-sm font-bold uppercase">
                      Status: {c.status}
                    </span>
                    <span className="text-[12px] text-on-surface-variant font-semibold mt-1">Assigned By: {assignment.assigned_by || 'Insp. Raj Kumar'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-spacing-md items-center">
                  <div className="md:col-span-3 flex flex-col items-center text-center">
                    <img
                      src={activeOfficer.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzZPFuUAA-GjuqoDc0ROMs6dF5KTfabqTVwmZNnY0YDGQ9ceS9un43-t50gBNKIJ4FWwDanXcLlOf3uQ5hE6oF4TjJMUg01bZqIsuDr_TucayV1CUZ0p9svKyoLK9bOq5KNLlmLW_ibbjW1j5gl_SufTcWTSXmmRk8Bl6TuVDgTpWdBrch9ZX1PYhBhZDN0gycUWhzsrGo_k6Lrcij-yVjYLVqigwCWcvqJnVGg0nhy4lGx0JiBO"}
                      alt={activeOfficer.name}
                      className="w-20 h-20 rounded-full object-cover shadow-sm bg-surface-container"
                    />
                    <span className="font-headline-sm text-on-surface font-bold mt-spacing-xs">{activeOfficer.name}</span>
                    <span className="font-label-sm text-on-surface-variant">Police ID: {activeOfficer.police_id}</span>
                  </div>

                  <div className="md:col-span-5 grid grid-cols-2 gap-spacing-xs bg-surface-container-low p-spacing-md rounded-lg border border-surface-container-highest">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-on-surface-variant uppercase font-semibold">Rank</span>
                      <span className="font-label-md text-on-surface font-bold">{activeOfficer.rank}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-on-surface-variant uppercase font-semibold">Vehicle Unit</span>
                      <span className="font-label-md text-on-surface font-bold">{assignment.vehicle || activeOfficer.current_vehicle || 'PCR Bike #12'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-on-surface-variant uppercase font-semibold">Response Type</span>
                      <span className="font-body-sm text-primary font-bold">{assignment.response_type || 'Police Emergency Response'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-on-surface-variant uppercase font-semibold">ETA</span>
                      <span className="font-body-sm text-error font-bold">{assignment.estimated_response_time || '10 minutes'}</span>
                    </div>
                  </div>

                  <div className="md:col-span-4 flex flex-col gap-spacing-xs">
                    <button
                      onClick={() => alert(`📻 CALLING OFFICER VIA POLICE RADIO CHANNEL: Dispatching to ${activeOfficer.name}...`)}
                      className="w-full py-spacing-xs px-spacing-sm bg-primary text-on-primary rounded font-label-sm font-bold shadow-sm hover:bg-on-surface transition-all flex items-center justify-center gap-spacing-xs"
                    >
                      <span className="material-symbols-outlined text-[18px]">radio</span>
                      CALL OFFICER VIA POLICE RADIO
                    </button>
                    <button
                      onClick={() => setShowAssignModal(true)}
                      className="w-full py-spacing-xs px-spacing-sm bg-surface-container-high text-on-surface rounded font-label-sm font-bold hover:bg-surface-container-highest transition-all flex items-center justify-center gap-spacing-xs"
                    >
                      <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                      REASSIGN OFFICER
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-spacing-lg text-center font-label-md text-on-surface-variant bg-surface-container-low rounded-lg">
                No police officer currently assigned. Click "ASSIGN RESPONSE NOW" to dispatch available beat patrol.
              </div>
            )}
          </div>

          {/* SECTION D: EMERGENCY CONTACTS */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg flex flex-col gap-spacing-md border border-surface-container-highest">
            <div className="flex items-center justify-between pb-spacing-xs border-b border-surface-container-highest">
              <div className="flex items-center gap-spacing-xs">
                <span className="material-symbols-outlined text-secondary text-[22px]">contact_phone</span>
                <h2 className="font-headline-sm text-on-surface font-bold uppercase tracking-wider">
                  Section D: Registered Family & Emergency Keyholders
                </h2>
              </div>
              <span className="font-label-sm text-on-surface-variant font-semibold">Instant ERSS Dial & SMS Relay</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-spacing-md">
              {emergency_contacts.map((contact) => (
                <div key={contact.id} className="bg-surface-container-low p-spacing-md rounded-lg flex flex-col justify-between gap-spacing-sm border border-surface-container-highest">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-spacing-xs">
                        <span className="font-headline-sm text-on-surface font-bold">{contact.name}</span>
                        <span className="px-spacing-xs py-spacing-3xs rounded bg-surface-container-highest text-on-surface-variant font-label-sm">
                          {contact.relationship}
                        </span>
                      </div>
                      <span className="font-body-sm text-on-surface-variant">{contact.location}</span>
                      <span className="font-code-md text-primary font-bold mt-1">{contact.mobile}</span>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest p-spacing-xs rounded flex items-center justify-between border border-surface-container-highest">
                    <span className="font-label-sm text-secondary font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span> {contact.notify_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: MASTER CASE TIMELINE (SECTION E) (4 COLS) */}
        <div className="xl:col-span-4 flex flex-col gap-spacing-lg">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg flex flex-col border border-surface-container-highest">
            <div className="flex items-center justify-between pb-spacing-sm mb-spacing-md border-b border-surface-container-highest">
              <div className="flex items-center gap-spacing-xs">
                <span className="material-symbols-outlined text-primary text-[22px]">history_toggle_off</span>
                <h2 className="font-headline-sm text-on-surface font-bold uppercase tracking-wider">
                  Section E: Master Case Timeline
                </h2>
              </div>
              <span className="font-label-sm text-secondary font-bold">LIVE TELEMETRY</span>
            </div>

            <div className="relative pl-6 flex flex-col gap-spacing-md before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container-highest">
              {timeline.map((ev) => (
                <div key={ev.id} className="relative flex items-start gap-spacing-sm">
                  <span className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${
                    ev.badge_type === 'DANGER' ? 'bg-error' :
                    ev.badge_type === 'SUCCESS' ? 'bg-secondary' :
                    ev.badge_type === 'PRIMARY' ? 'bg-primary' : 'bg-outline'
                  }`}>
                    •
                  </span>
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-spacing-xs">
                      <span className="font-code-md text-on-surface font-bold">{ev.event_time}</span>
                      <span className="font-label-sm px-spacing-2xs rounded bg-surface-container-highest text-on-surface uppercase font-semibold">
                        {ev.actor_role}
                      </span>
                    </div>
                    <span className="font-body-sm text-on-surface font-semibold mt-0.5">{ev.title}</span>
                    <span className="text-[12px] text-on-surface-variant">{ev.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showAssignModal && (
        <OfficerAssignmentModal
          caseId={c.id}
          emergencyType={c.emergency_type}
          location={c.location_address}
          onClose={() => setShowAssignModal(false)}
          onAssigned={loadCaseDetails}
        />
      )}
    </div>
  );
}
