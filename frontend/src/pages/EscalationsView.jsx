import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EscalationsView() {
  const [escalations, setEscalations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const navigate = useNavigate();

  const loadEscalations = () => {
    setLoading(true);
    fetch('/api/escalations')
      .then(res => res.json())
      .then(data => {
        setEscalations(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadEscalations();
  }, []);

  const handleTestFastForward = async () => {
    setTriggering(true);
    try {
      const res = await fetch('/api/escalations/trigger-fastforward', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('anubhavi_token')}`
        }
      });
      const data = await res.json();
      alert(`⚠️ ${data.message}`);
      loadEscalations();
    } catch (e) {
      console.error(e);
    } finally {
      setTriggering(false);
    }
  };

  return (
    <div className="flex flex-col gap-spacing-lg w-full">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg border border-surface-container-highest flex flex-col md:flex-row items-start md:items-center justify-between gap-spacing-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-spacing-xs">
            <span className="px-spacing-xs py-spacing-3xs rounded bg-error-container text-on-error-container font-label-sm uppercase font-bold">
              STATUTORY SLA MONITOR
            </span>
            <span className="font-code-md text-on-surface-variant font-bold">24H DISTRICT OVERRIDE</span>
          </div>
          <h1 className="font-headline-lg text-on-surface font-bold tracking-tight mt-1">
            24-Hour Statutory Escalations to DSP
          </h1>
          <p className="font-body-sm text-on-surface-variant">
            Cases exceeding statutory 24-hour response cycles automatically escalated to Deputy Superintendent of Police (DSP).
          </p>
        </div>

        <button
          onClick={handleTestFastForward}
          disabled={triggering}
          className="px-spacing-md py-spacing-xs bg-error text-on-error font-label-lg font-bold rounded shadow hover:bg-error-container hover:text-on-error-container transition-all flex items-center gap-spacing-xs"
        >
          <span className="material-symbols-outlined text-[18px]">running_with_errors</span>
          {triggering ? 'TRIGGERING...' : '⚡ TEST FAST-FORWARD SLA ESCALATION'}
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-highest p-spacing-lg flex flex-col gap-spacing-md">
        <h2 className="font-headline-sm font-bold text-on-surface uppercase">Escalated SOS Emergency Cases</h2>

        {loading ? (
          <div className="py-spacing-xl text-center font-label-md text-on-surface-variant">Checking escalation watchdog...</div>
        ) : (
          <div className="flex flex-col gap-spacing-sm">
            {escalations?.escalated_sos.length === 0 ? (
              <div className="p-spacing-md bg-surface-container-low text-on-surface-variant rounded-lg font-body-sm">
                🟢 No cases currently breached 24-hour statutory limits.
              </div>
            ) : (
              escalations?.escalated_sos.map(c => (
                <div key={c.id} className="p-spacing-md bg-error-container/20 rounded-lg border border-error flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-code-md text-error font-bold">{c.id} • {c.citizen_name} ({c.citizen_age}y)</span>
                    <span className="font-body-sm text-on-surface font-semibold">{c.emergency_type} - {c.location_address}</span>
                    <span className="font-label-sm text-on-surface-variant">Created: {c.created_at} • Deadline Expired: {c.escalation_deadline}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/sho/cases/${c.id}`)}
                    className="py-spacing-2xs px-spacing-sm bg-error text-on-error font-label-sm font-bold rounded shadow"
                  >
                    INSPECT CASE FILE
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
