import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function CitizenProfile() {
  const { citizenId } = useParams();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/citizens/${citizenId}`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [citizenId]);

  if (loading) {
    return (
      <div className="py-spacing-3xl text-center font-headline-sm text-on-surface-variant flex flex-col items-center gap-spacing-md">
        <span className="material-symbols-outlined text-[36px] animate-spin text-primary">sync</span>
        Loading 360 Citizen Dossier ({citizenId})...
      </div>
    );
  }

  if (!data || !data.citizen) {
    return (
      <div className="py-spacing-3xl text-center flex flex-col items-center gap-spacing-md">
        <span className="material-symbols-outlined text-[48px] text-error">error</span>
        <h2 className="font-headline-md font-bold text-on-surface">Senior Citizen Profile Not Found</h2>
        <button
          onClick={() => navigate('/sho/citizens')}
          className="px-spacing-md py-spacing-xs bg-primary text-on-primary rounded font-label-lg font-bold shadow flex items-center gap-spacing-xs"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          BACK TO SENIOR REGISTRY
        </button>
      </div>
    );
  }

  const { citizen: c, emergency_contacts = [], sos_history = [], assistance_requests = [], welfare_checks = [], audit_trail = [] } = data;

  const tabs = [
    'Overview', 'Emergency Contacts', 'SOS History', 'Assistance Requests',
    'Welfare Checks', 'Communication History', 'Assigned Officers', 'Audit Trail'
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

        <span className="font-code-md text-on-surface-variant font-bold">
          CCTNS 360 DOSSIER • {c.id}
        </span>
      </div>

      {/* CITIZEN HEADER CARD */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg border border-surface-container-highest flex flex-col md:flex-row items-start md:items-center justify-between gap-spacing-md">
        <div className="flex items-center gap-spacing-md">
          <img src={c.avatar_url} alt={c.name} className="w-20 h-20 rounded-full object-cover shadow-sm bg-surface-container border-2 border-primary" />
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
                {c.status}
              </span>
            </div>
            <span className="font-body-sm text-on-surface-variant mt-0.5">
              {c.age} Yrs • {c.gender} • Living Status: <strong className="text-on-surface">{c.living_status}</strong> • Aadhaar: {c.aadhaar_masked}
            </span>
            <span className="font-code-md text-primary font-bold mt-1">Mobile: {c.mobile}</span>
          </div>
        </div>

        <div className="flex items-center gap-spacing-sm">
          <button
            onClick={() => navigate('/sho/welfare-checks')}
            className="px-spacing-md py-spacing-xs bg-primary text-on-primary font-label-lg rounded-lg font-bold shadow hover:bg-on-surface flex items-center gap-spacing-xs"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            SCHEDULE WELFARE CHECK
          </button>
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

      {/* TAB CONTENTS WITH GUARANTEED MOCK DATA */}
      <div className="bg-surface-container-lowest p-spacing-lg rounded-b-xl shadow-sm border border-surface-container-highest min-h-[320px]">
        {/* OVERVIEW TAB */}
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-spacing-md">
            <div className="flex flex-col gap-spacing-xs bg-surface-container-low p-spacing-md rounded-lg border border-surface-container-highest">
              <span className="font-label-sm text-on-surface-variant uppercase font-bold tracking-wider">Registered Residence</span>
              <span className="font-body-sm text-on-surface font-semibold">{c.address}</span>
              <span className="font-label-sm text-secondary">Landmark: {c.landmark || 'Near Community Park'}</span>
              <span className="font-code-md text-primary font-bold mt-1">Geo Position: {c.latitude || 30.9010}° N, {c.longitude || 75.8573}° E</span>
              <span className="text-[12px] text-on-surface-variant mt-1">Jurisdiction: Model Town PS • Sector 3</span>
            </div>

            <div className="flex flex-col gap-spacing-xs bg-surface-container-low p-spacing-md rounded-lg border border-surface-container-highest">
              <span className="font-label-sm text-error uppercase font-bold tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">medical_services</span> Medical Dossier (Critical)
              </span>
              <p className="font-body-sm text-on-surface font-semibold">{c.medical_conditions}</p>
              <div className="flex flex-wrap gap-spacing-xs mt-spacing-xs">
                <span className="px-spacing-xs py-spacing-3xs rounded bg-error-container text-on-error-container font-label-sm font-bold">
                  {c.risk_level} VULNERABILITY RISK
                </span>
                <span className="px-spacing-xs py-spacing-3xs rounded bg-surface-container-highest text-on-surface font-label-sm font-bold">
                  Last Active Check-in: {c.last_check_in || 'Today, 09:30 AM'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* EMERGENCY CONTACTS TAB */}
        {activeTab === 'Emergency Contacts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-spacing-md">
            {(emergency_contacts.length > 0 ? emergency_contacts : [
              { id: 'EC-DEF-1', name: 'Amit Sharma', relationship: 'Son / Primary Kin', mobile: '+91 98721-XXXX1', location: 'Model Town Phase 2', notify_status: 'NOTIFIED & VERIFIED', is_keyholder: 1 },
              { id: 'EC-DEF-2', name: 'Col. S. Dhillon', relationship: 'Neighbor & Keyholder', mobile: '+91 94172-XXXXX', location: 'Immediate Next Door', notify_status: 'KEYHOLDER ON FILE', is_keyholder: 1 }
            ]).map((ec) => (
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
                  <button onClick={() => alert(`Dialing emergency keyholder ${ec.name} (${ec.mobile})...`)} className="p-spacing-3xs rounded bg-primary text-on-primary hover:bg-on-surface">
                    <span className="material-symbols-outlined text-[16px]">call</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SOS HISTORY TAB */}
        {activeTab === 'SOS History' && (
          <div className="flex flex-col gap-spacing-sm">
            {(sos_history.length > 0 ? sos_history : [
              { id: 'ANB-SOS-2026-00124', emergency_type: 'Safety Emergency (Medical Fall)', created_at: 'Today, 02:34 PM', status: 'IN_PROGRESS', location_address: c.address },
              { id: 'ANB-SOS-2026-00088', emergency_type: 'Accidental Panic Button Ping', created_at: '15 Aug 2026', status: 'RESOLVED', location_address: c.address }
            ]).map(s => (
              <div key={s.id} className="p-spacing-md bg-surface-container-low rounded-lg border border-surface-container-highest flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-spacing-xs">
                    <span className="font-code-md text-primary font-bold">{s.id}</span>
                    <span className="font-headline-sm font-bold text-on-surface">{s.emergency_type}</span>
                  </div>
                  <span className="font-body-sm text-on-surface-variant">{s.location_address || c.address} • Logged: {s.created_at}</span>
                </div>
                <div className="flex items-center gap-spacing-sm">
                  <span className="font-label-sm font-bold uppercase px-spacing-xs py-spacing-3xs bg-primary-container text-on-primary rounded">{s.status}</span>
                  <button onClick={() => navigate(`/sho/cases/${s.id}`)} className="py-spacing-2xs px-spacing-sm bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-sm font-bold rounded">
                    VIEW CASE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ASSISTANCE REQUESTS TAB */}
        {activeTab === 'Assistance Requests' && (
          <div className="flex flex-col gap-spacing-sm">
            {(assistance_requests.length > 0 ? assistance_requests : [
              { id: 'AST-2026-042', request_type: 'Welfare Assistance & Lock Inspection', created_at: 'Yesterday, 04:00 PM', status: 'RESOLVED', description: 'Elder requested beat constable check front gate lock.' }
            ]).map(a => (
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
            ))}
          </div>
        )}

        {/* WELFARE CHECKS TAB */}
        {activeTab === 'Welfare Checks' && (
          <div className="flex flex-col gap-spacing-sm">
            {(welfare_checks.length > 0 ? welfare_checks : [
              { id: 'WEL-01', check_type: 'Periodic Beat Check-in', scheduled_date: 'Today', scheduled_time: '17:00', status: 'SCHEDULED', assigned_officer_name: 'HC Raj Kumar', purpose: 'Routine elder safety visit' }
            ]).map(w => (
              <div key={w.id} className="p-spacing-md bg-surface-container-low rounded-lg border border-surface-container-highest flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-headline-sm font-bold text-on-surface">{w.check_type}</span>
                  <span className="font-body-sm text-on-surface-variant">{w.purpose} • Officer: {w.assigned_officer_name || 'HC Raj Kumar'}</span>
                  <span className="font-code-md text-primary font-bold mt-0.5">Scheduled: {w.scheduled_date} at {w.scheduled_time}</span>
                </div>
                <span className="font-label-sm font-bold uppercase px-spacing-xs py-spacing-3xs bg-surface-container-highest text-on-surface rounded">{w.status}</span>
              </div>
            ))}
          </div>
        )}

        {/* COMMUNICATION HISTORY TAB */}
        {activeTab === 'Communication History' && (
          <div className="flex flex-col gap-spacing-sm">
            <div className="p-spacing-md bg-surface-container-low rounded-lg border border-surface-container-highest flex flex-col gap-spacing-2xs">
              <span className="font-headline-sm font-bold text-on-surface">Automated ERSS Push & WhatsApp Relay Logs</span>
              <ul className="list-disc pl-5 text-body-sm text-on-surface-variant space-y-1 mt-1">
                <li><strong className="text-on-surface">02:35 PM:</strong> WhatsApp tracking link dispatched to registered kin Amit Sharma (+1 416-555-0198).</li>
                <li><strong className="text-on-surface">02:36 PM:</strong> Station SMS confirmation sent to senior phone ({c.mobile}).</li>
                <li><strong className="text-on-surface">02:38 PM:</strong> Officer dispatch SMS sent to keyholder Col. S. Dhillon (+91 94172-XXXXX).</li>
              </ul>
            </div>
          </div>
        )}

        {/* ASSIGNED OFFICERS TAB */}
        {activeTab === 'Assigned Officers' && (
          <div className="p-spacing-md bg-surface-container-low rounded-lg border border-surface-container-highest flex items-center gap-spacing-md">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzZPFuUAA-GjuqoDc0ROMs6dF5KTfabqTVwmZNnY0YDGQ9ceS9un43-t50gBNKIJ4FWwDanXcLlOf3uQ5hE6oF4TjJMUg01bZqIsuDr_TucayV1CUZ0p9svKyoLK9bOq5KNLlmLW_ibbjW1j5gl_SufTcWTSXmmRk8Bl6TuVDgTpWdBrch9ZX1PYhBhZDN0gycUWhzsrGo_k6Lrcij-yVjYLVqigwCWcvqJnVGg0nhy4lGx0JiBO" alt="Officer" className="w-16 h-16 rounded-full object-cover shadow border border-primary" />
            <div className="flex flex-col">
              <span className="font-headline-sm font-bold text-on-surface">Head Constable Raj Kumar (POL-1024)</span>
              <span className="font-body-sm text-on-surface-variant">Primary Beat Patrol Officer • PCR Van #04</span>
              <span className="font-code-md text-primary font-bold">+91 98112-XXXX2</span>
            </div>
          </div>
        )}

        {/* AUDIT TRAIL TAB */}
        {activeTab === 'Audit Trail' && (
          <div className="flex flex-col gap-spacing-xs">
            {(audit_trail.length > 0 ? audit_trail : [
              { id: 'AUD-01', action: 'CITIZEN PROFILE VIEWED', description: `SHO Insp. Raj Kumar viewed 360 profile for ${c.name} (${c.id})`, timestamp: 'Today, 02:36 PM' },
              { id: 'AUD-02', action: 'SOS ALERT INGESTED', description: `Panic alert ingested from cell tower triangulation for ${c.name}`, timestamp: 'Today, 02:34 PM' }
            ]).map(au => (
              <div key={au.id} className="p-spacing-sm bg-surface-container-low rounded border border-surface-container-highest flex items-center justify-between text-xs">
                <span className="text-on-surface"><strong>{au.action}:</strong> {au.description}</span>
                <span className="font-code-md text-on-surface-variant font-semibold">{au.timestamp}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
