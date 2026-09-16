import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getResidentById } from '../data/mockResidents';

export default function CitizenProfile() {
  const { citizenId, residentId, id } = useParams();
  const targetId = citizenId || residentId || id;
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const navigate = useNavigate();

  // 1. Resolve resident strictly from centralized mock store
  const resident = getResidentById(targetId);

  // 2. Optional API enrichment if backend has live data for this ID
  useEffect(() => {
    if (targetId) {
      fetch(`/api/citizens/${targetId}`)
        .then(res => {
          if (!res.ok) throw new Error('API offline');
          return res.json();
        })
        .then(d => {
          if (d && d.citizen && d.citizen.id === targetId) {
            setData(d);
          }
        })
        .catch(() => {
          // Backend is optional; purely rely on centralized mock data
        });
    }
  }, [targetId]);

  // 3. Invalid ID Handling - Render clean "Resident Not Found" state
  if (!resident && (!data || !data.citizen)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[420px] bg-surface-container-lowest rounded-xl p-spacing-xl border border-surface-container-highest shadow-sm text-center gap-spacing-md my-spacing-lg">
        <span className="material-symbols-outlined text-[64px] text-error">person_off</span>
        <h1 className="font-headline-lg font-bold text-on-surface">Resident Not Found</h1>
        <p className="font-body-md text-on-surface-variant max-w-md">
          No senior citizen record exists for ID <strong className="font-code-md text-on-surface font-bold">"{targetId || 'UNKNOWN'}"</strong>.
        </p>
        <button
          onClick={() => navigate('/sho/citizens')}
          className="mt-spacing-sm px-spacing-lg py-spacing-sm bg-primary hover:bg-primary/90 text-on-primary rounded-lg font-label-lg font-bold shadow transition flex items-center gap-spacing-xs"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back to Residents
        </button>
      </div>
    );
  }

  // 4. Bound Resident Object (Guaranteed 100% consistent across all tabs)
  const c = (data && data.citizen && data.citizen.id === targetId) ? data.citizen : resident;
  const emergency_contacts = (data && data.emergency_contacts && data.emergency_contacts.length > 0)
    ? data.emergency_contacts
    : (c.emergency_contacts || []);

  const sos_history = (data && data.sos_history && data.sos_history.length > 0)
    ? data.sos_history
    : (c.sos_history || []);

  const assistance_requests = (data && data.assistance_requests && data.assistance_requests.length > 0)
    ? data.assistance_requests
    : (c.assistance_requests || []);

  const welfare_checks = (data && data.welfare_checks && data.welfare_checks.length > 0)
    ? data.welfare_checks
    : (c.welfare_checks || []);

  const assignedOfficer = c.assigned_officer || {
    id: 'POL-1024',
    name: 'Head Constable Raj Kumar (POL-1024)',
    designation: 'Head Constable',
    role: 'Primary Beat Patrol Officer • PCR Van #04',
    mobile: '+91 98140-99812',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzZPFuUAA-GjuqoDc0ROMs6dF5KTfabqTVwmZNnY0YDGQ9ceS9un43-t50gBNKIJ4FWwDanXcLlOf3uQ5hE6oF4TjJMUg01bZqIsuDr_TucayV1CUZ0p9svKyoLK9bOq5KNLlmLW_ibbjW1j5gl_SufTcWTSXmmRk8Bl6TuVDgTpWdBrch9ZX1PYhBhZDN0gycUWhzsrGo_k6Lrcij-yVjYLVqigwCWcvqJnVGg0nhy4lGx0JiBO'
  };

  const tabs = [
    'Overview', 'Emergency Contacts', 'SOS History', 'Assistance Requests',
    'Welfare Checks', 'Assigned Officers'
  ];

  return (
    <div className="flex flex-col gap-spacing-lg w-full">
      {/* TOP NAVIGATION BACK BAR */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/sho/citizens')}
          className="px-spacing-md py-spacing-xs bg-surface-container-lowest hover:bg-surface-container-high text-on-surface rounded-lg font-label-lg font-bold shadow-sm border border-surface-container-highest flex items-center gap-spacing-xs transition-all"
        >
          <span className="material-symbols-outlined text-[20px] text-primary">arrow_back</span>
          ← BACK TO SENIOR REGISTRY
        </button>

        <div className="flex items-center gap-spacing-xs">
          <span className="px-spacing-xs py-spacing-3xs rounded bg-surface-container-highest text-on-surface font-label-sm font-bold uppercase">
            VIEW ONLY MODE
          </span>
          <span className="font-code-md text-on-surface-variant font-bold">
            CCTNS 360 DOSSIER • {c.id}
          </span>
        </div>
      </div>

      {/* CITIZEN HEADER CARD */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg border border-surface-container-highest flex flex-col md:flex-row items-start md:items-center justify-between gap-spacing-md">
        <div className="flex items-center gap-spacing-md">
          <img
            src={c.avatar_url}
            alt={c.name}
            className="w-20 h-20 rounded-full object-cover shadow-sm bg-surface-container border-2 border-primary flex-shrink-0"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-spacing-xs">
              <h1 className="font-headline-lg text-on-surface font-extrabold">{c.name}</h1>
              <span className="px-spacing-xs py-spacing-3xs rounded bg-primary-container text-on-primary font-label-sm font-bold">
                {c.id}
              </span>
              <span className={`px-spacing-xs py-spacing-3xs rounded font-label-sm font-bold uppercase ${
                c.status === 'SOS_ACTIVE' ? 'bg-error text-on-error animate-pulse' :
                c.status === 'MISSED_CHECKIN' ? 'bg-error-container text-on-error-container' :
                'bg-secondary-container text-on-secondary-container'
              }`}>
                {c.status || 'SAFE'}
              </span>
            </div>
            <span className="font-body-sm text-on-surface-variant mt-0.5">
              {c.age} Yrs • {c.gender} • Living Status: <strong className="text-on-surface">{c.living_status || c.livingStatus}</strong> • Aadhaar: {c.aadhaar_masked}
            </span>
            <span className="font-code-md text-primary font-bold mt-1">Mobile: {c.mobile}</span>
          </div>
        </div>

        <div className="flex items-center gap-spacing-sm">
          <span className="px-spacing-md py-spacing-xs bg-surface-container-high text-on-surface font-label-md rounded-lg font-bold border border-surface-container-highest">
            📄 VIEW ONLY READ-ONLY DOSSIER
          </span>
        </div>
      </div>

      {/* TABS HEADER */}
      <div className="flex overflow-x-auto border-b border-surface-container-highest bg-surface-container-low px-spacing-md rounded-t-xl gap-spacing-xs">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`py-spacing-sm px-spacing-md font-label-md font-bold whitespace-nowrap transition-all border-b-2 ${
              activeTab === t
                ? 'border-primary text-primary bg-surface-container-lowest shadow-sm'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* TAB CONTENTS WITH GUARANTEED PERSON-SPECIFIC DATA */}
      <div className="bg-surface-container-lowest p-spacing-lg rounded-b-xl shadow-sm border border-surface-container-highest min-h-[320px]">
        {/* OVERVIEW TAB */}
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-spacing-md">
            <div className="flex flex-col gap-spacing-xs bg-surface-container-low p-spacing-md rounded-lg border border-surface-container-highest">
              <span className="font-label-sm text-on-surface-variant uppercase font-bold tracking-wider">Registered Residence</span>
              <span className="font-body-sm text-on-surface font-semibold">{c.address || c.residence}</span>
              <span className="font-label-sm text-secondary">Landmark: {c.landmark || 'Near Community Park'}</span>
              <span className="font-code-md text-primary font-bold mt-1">Geo Position: {c.latitude || 30.9010}° N, {c.longitude || 75.8573}° E</span>
              <span className="text-[12px] text-on-surface-variant mt-1">Jurisdiction: Model Town PS • Sector 3</span>
            </div>

            <div className="flex flex-col gap-spacing-xs bg-surface-container-low p-spacing-md rounded-lg border border-surface-container-highest">
              <span className="font-label-sm text-error uppercase font-bold tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">medical_services</span> Medical Dossier (Critical)
              </span>
              <p className="font-body-sm text-on-surface font-semibold">{c.medical_conditions || c.medicalConditions || 'No chronic conditions on record'}</p>
              <div className="flex flex-wrap gap-spacing-xs mt-spacing-xs">
                <span className="px-spacing-xs py-spacing-3xs rounded bg-surface-container-highest text-on-surface font-label-sm font-bold">
                  Last Active Check-in: Today, 09:30 AM
                </span>
              </div>
            </div>
          </div>
        )}

        {/* EMERGENCY CONTACTS TAB */}
        {activeTab === 'Emergency Contacts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-spacing-md">
            {emergency_contacts.length === 0 ? (
              <div className="col-span-2 text-center py-spacing-lg text-on-surface-variant font-body-sm">
                No emergency contacts on file.
              </div>
            ) : (
              emergency_contacts.map((ec) => (
                <div key={ec.id} className="p-spacing-md bg-surface-container-low rounded-lg border border-surface-container-highest flex flex-col justify-between gap-spacing-xs">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-spacing-xs">
                        <span className="font-headline-sm text-on-surface font-bold">{ec.name}</span>
                        <span className="px-spacing-xs py-spacing-3xs rounded bg-surface-container-highest font-label-sm font-bold text-on-surface-variant">
                          {ec.relationship}
                        </span>
                      </div>
                      <span className="font-body-sm text-on-surface-variant">{ec.location}</span>
                      <span className="font-code-md text-primary font-bold mt-1">{ec.mobile}</span>
                    </div>
                    {ec.is_keyholder ? (
                      <span className="px-spacing-xs py-spacing-3xs rounded bg-secondary-container text-on-secondary-container font-label-sm font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">key</span> KEYHOLDER
                      </span>
                    ) : null}
                  </div>
                  <div className="bg-surface-container-lowest p-spacing-xs rounded border border-surface-container-highest flex items-center justify-between">
                    <span className="font-label-sm text-secondary font-bold">Status: {ec.notify_status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* SOS HISTORY TAB */}
        {activeTab === 'SOS History' && (
          <div className="flex flex-col gap-spacing-sm">
            {sos_history.length === 0 ? (
              <div className="text-center py-spacing-lg text-on-surface-variant font-body-sm">
                No SOS emergency alerts logged for this resident.
              </div>
            ) : (
              sos_history.map((s) => (
                <div key={s.id} className="p-spacing-md bg-surface-container-low rounded-lg border border-surface-container-highest flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-spacing-xs">
                      <span className="font-code-md text-primary font-bold">{s.id}</span>
                      <span className="font-headline-sm font-bold text-on-surface">{s.emergency_type}</span>
                    </div>
                    <span className="font-body-sm text-on-surface-variant">{s.location_address || c.address || c.residence} • Logged: {s.created_at}</span>
                  </div>
                  <div className="flex items-center gap-spacing-sm">
                    <span className="font-label-sm font-bold uppercase px-spacing-xs py-spacing-3xs bg-primary-container text-on-primary rounded">{s.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ASSISTANCE REQUESTS TAB */}
        {activeTab === 'Assistance Requests' && (
          <div className="flex flex-col gap-spacing-sm">
            {assistance_requests.length === 0 ? (
              <div className="text-center py-spacing-lg text-on-surface-variant font-body-sm">
                No active or past assistance requests found.
              </div>
            ) : (
              assistance_requests.map((a) => (
                <div key={a.id} className="p-spacing-md bg-surface-container-low rounded-lg border border-surface-container-highest flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-spacing-xs">
                      <span className="font-code-md text-primary font-bold">{a.id}</span>
                      <span className="font-headline-sm font-bold text-on-surface">{a.request_type}</span>
                    </div>
                    <span className="font-body-sm text-on-surface-variant">{a.description} • {a.created_at}</span>
                  </div>
                  <span className="font-label-sm font-bold uppercase px-spacing-xs py-spacing-3xs bg-secondary-container text-on-secondary-container rounded">{a.status}</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* WELFARE CHECKS TAB */}
        {activeTab === 'Welfare Checks' && (
          <div className="flex flex-col gap-spacing-sm">
            {welfare_checks.length === 0 ? (
              <div className="text-center py-spacing-lg text-on-surface-variant font-body-sm">
                No scheduled welfare checks found.
              </div>
            ) : (
              welfare_checks.map((w) => (
                <div key={w.id} className="p-spacing-md bg-surface-container-low rounded-lg border border-surface-container-highest flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-headline-sm font-bold text-on-surface">{w.check_type}</span>
                    <span className="font-body-sm text-on-surface-variant">{w.purpose} • Officer: {w.assigned_officer_name || 'HC Raj Kumar'}</span>
                    <span className="font-code-md text-primary font-bold mt-0.5">Scheduled: {w.scheduled_date} at {w.scheduled_time}</span>
                  </div>
                  <span className="font-label-sm font-bold uppercase px-spacing-xs py-spacing-3xs bg-surface-container-highest text-on-surface rounded">{w.status}</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* ASSIGNED OFFICERS TAB */}
        {activeTab === 'Assigned Officers' && (
          <div className="p-spacing-md bg-surface-container-low rounded-lg border border-surface-container-highest flex items-center gap-spacing-md">
            <img
              src={assignedOfficer.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"}
              alt="Officer"
              className="w-16 h-16 rounded-full object-cover shadow border border-primary flex-shrink-0"
            />
            <div className="flex flex-col">
              <span className="font-headline-sm font-bold text-on-surface">{assignedOfficer.name}</span>
              <span className="font-body-sm text-on-surface-variant">{assignedOfficer.role || assignedOfficer.designation}</span>
              <span className="font-code-md text-primary font-bold">{assignedOfficer.mobile}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
