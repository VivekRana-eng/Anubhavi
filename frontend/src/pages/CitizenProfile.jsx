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
    return <div className="py-spacing-3xl text-center font-headline-sm text-on-surface-variant">Loading 360 Citizen Dossier {citizenId}...</div>;
  }

  if (!data || !data.citizen) {
    return <div className="py-spacing-3xl text-center font-headline-md text-error">Citizen record not found.</div>;
  }

  const { citizen: c, emergency_contacts, sos_history, assistance_requests, welfare_checks, audit_trail } = data;

  const tabs = [
    'Overview', 'Emergency Contacts', 'SOS History', 'Assistance Requests',
    'Welfare Checks', 'Communication History', 'Assigned Officers', 'Audit Trail'
  ];

  return (
    <div className="flex flex-col gap-spacing-lg w-full">
      {/* CITIZEN HEADER CARD */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg border border-surface-container-highest flex flex-col md:flex-row items-start md:items-center justify-between gap-spacing-md">
        <div className="flex items-center gap-spacing-md">
          <img src={c.avatar_url} alt={c.name} className="w-20 h-20 rounded-full object-cover shadow-sm bg-surface-container" />
          <div className="flex flex-col">
            <div className="flex items-center gap-spacing-xs">
              <h1 className="font-headline-lg text-on-surface font-extrabold">{c.name}</h1>
              <span className="px-spacing-xs py-spacing-3xs rounded bg-primary-container text-on-primary font-label-sm font-bold">
                {c.id}
              </span>
            </div>
            <span className="font-body-sm text-on-surface-variant">
              {c.age} Yrs • {c.gender} • {c.living_status} • Aadhaar: {c.aadhaar_masked}
            </span>
            <span className="font-code-md text-primary font-bold">{c.mobile}</span>
          </div>
        </div>

        <div className="flex items-center gap-spacing-sm">
          <button
            onClick={() => navigate('/sho/welfare-checks')}
            className="px-spacing-md py-spacing-xs bg-primary text-on-primary font-label-lg rounded font-bold shadow hover:bg-on-surface"
          >
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
                ? 'border-primary text-primary bg-surface-container-lowest'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* TAB CONTENTS */}
      <div className="bg-surface-container-lowest p-spacing-lg rounded-b-xl shadow-sm border border-surface-container-highest min-h-[300px]">
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-spacing-md">
            <div className="flex flex-col gap-spacing-xs bg-surface-container-low p-spacing-md rounded-lg">
              <span className="font-label-sm text-on-surface-variant uppercase font-bold">Registered Address</span>
              <span className="font-body-sm text-on-surface font-semibold">{c.address}</span>
              <span className="font-label-sm text-secondary">Landmark: {c.landmark}</span>
              <span className="font-code-md text-primary font-bold mt-1">Geo: {c.latitude}° N, {c.longitude}° E</span>
            </div>

            <div className="flex flex-col gap-spacing-xs bg-surface-container-low p-spacing-md rounded-lg">
              <span className="font-label-sm text-error uppercase font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">medical_services</span> Medical Dossier
              </span>
              <p className="font-body-sm text-on-surface font-semibold">{c.medical_conditions}</p>
              <span className="font-label-sm text-on-surface-variant mt-1">Risk Classification: {c.risk_level} RISK</span>
            </div>
          </div>
        )}

        {activeTab === 'Emergency Contacts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-spacing-md">
            {emergency_contacts.map((ec) => (
              <div key={ec.id} className="p-spacing-md bg-surface-container-low rounded-lg border border-surface-container-highest flex flex-col gap-spacing-xs">
                <span className="font-headline-sm text-on-surface font-bold">{ec.name} ({ec.relationship})</span>
                <span className="font-body-sm text-on-surface-variant">{ec.location}</span>
                <span className="font-code-md text-primary font-bold">{ec.mobile}</span>
                <span className="font-label-sm text-secondary">{ec.notify_status}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'SOS History' && (
          <div className="flex flex-col gap-spacing-sm">
            {sos_history.length === 0 ? <div className="text-on-surface-variant">No previous SOS alerts logged.</div> : sos_history.map(s => (
              <div key={s.id} className="p-spacing-sm bg-surface-container-low rounded border flex items-center justify-between">
                <div>
                  <span className="font-code-md text-on-surface font-bold">{s.id}</span> • <span className="font-body-sm">{s.emergency_type}</span>
                </div>
                <span className="font-label-sm font-bold uppercase px-spacing-xs py-spacing-3xs bg-primary-container text-on-primary rounded">{s.status}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Assistance Requests' && (
          <div className="flex flex-col gap-spacing-sm">
            {assistance_requests.length === 0 ? <div className="text-on-surface-variant">No assistance requests logged.</div> : assistance_requests.map(a => (
              <div key={a.id} className="p-spacing-sm bg-surface-container-low rounded border flex items-center justify-between">
                <div>
                  <span className="font-code-md text-on-surface font-bold">{a.id}</span> • {a.request_type}
                </div>
                <span className="font-label-sm font-bold uppercase">{a.status}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Welfare Checks' && (
          <div className="flex flex-col gap-spacing-sm">
            {welfare_checks.length === 0 ? <div className="text-on-surface-variant">No scheduled welfare checks.</div> : welfare_checks.map(w => (
              <div key={w.id} className="p-spacing-sm bg-surface-container-low rounded border flex items-center justify-between">
                <div>
                  <span className="font-headline-sm font-bold">{w.check_type}</span> • Scheduled {w.scheduled_date} at {w.scheduled_time}
                </div>
                <span className="font-label-sm font-bold uppercase">{w.status}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Communication History' && (
          <div className="font-body-sm text-on-surface-variant">
            Recorded Automated SMS & WhatsApp ERSS push dispatch logs:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>02:35 PM: WhatsApp ERSS alert link transmitted to Kin (Amit Sharma).</li>
              <li>02:36 PM: Police Station SMS confirmation sent to elder phone.</li>
            </ul>
          </div>
        )}

        {activeTab === 'Assigned Officers' && (
          <div className="font-body-sm text-on-surface font-semibold">
            Primary Beat Unit Assigned: HC Raj Kumar (POL-1024 • Model Town PCR Van #04)
          </div>
        )}

        {activeTab === 'Audit Trail' && (
          <div className="flex flex-col gap-spacing-xs">
            {audit_trail.map(au => (
              <div key={au.id} className="p-spacing-xs bg-surface-container-low rounded text-xs flex justify-between">
                <span><strong>{au.action}:</strong> {au.description}</span>
                <span className="text-on-surface-variant">{au.timestamp}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
