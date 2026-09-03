import React, { useState, useEffect } from 'react';

export default function OfficerAssignmentModal({ caseId, onClose, onAssigned }) {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);

  useEffect(() => {
    fetch('/api/officers')
      .then(res => res.json())
      .then(data => {
        setOfficers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleAssign = async (officerId) => {
    setAssigningId(officerId);
    try {
      const res = await fetch(`/api/sos/${caseId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('anubhavi_token')}`
        },
        body: JSON.stringify({ officer_id: officerId })
      });
      if (res.ok) {
        onAssigned();
        onClose();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 backdrop-blur-sm p-spacing-md">
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-xl shadow-xl overflow-hidden flex flex-col border border-surface-container-highest">
        {/* HEADER */}
        <div className="p-spacing-md bg-surface-container flex items-center justify-between border-b border-surface-container-highest">
          <div className="flex items-center gap-spacing-xs">
            <span className="material-symbols-outlined text-primary text-[24px]">local_police</span>
            <div className="flex flex-col">
              <span className="font-headline-sm text-on-surface font-bold">Assign Responding Police Officer</span>
              <span className="font-label-sm text-on-surface-variant">Dispatching for Case: {caseId}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* BODY */}
        <div className="p-spacing-lg max-h-[60vh] overflow-y-auto flex flex-col gap-spacing-md">
          {loading ? (
            <div className="py-spacing-2xl text-center font-label-md text-on-surface-variant">
              Loading available duty officers...
            </div>
          ) : (
            <div className="flex flex-col gap-spacing-sm">
              {officers.map((off) => (
                <div
                  key={off.id}
                  className={`p-spacing-md rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-spacing-md transition-all ${
                    off.status === 'AVAILABLE'
                      ? 'bg-surface-container-low border-surface-container-highest hover:border-primary'
                      : 'bg-surface-container-lowest border-outline-variant/30 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-spacing-md">
                    <img
                      src={off.avatar_url}
                      alt={off.name}
                      className="w-12 h-12 rounded-full object-cover bg-surface-container"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-spacing-xs">
                        <span className="font-headline-sm text-on-surface font-bold">{off.name}</span>
                        <span className="px-spacing-xs py-spacing-3xs rounded bg-surface-container-highest font-label-sm text-on-surface-variant font-bold">
                          {off.rank}
                        </span>
                      </div>
                      <span className="font-code-md text-primary font-semibold">
                        Badge: {off.police_id} • {off.current_vehicle || 'Patrol Unit'}
                      </span>
                      <span className="font-label-sm text-on-surface-variant">
                        Mobile: {off.mobile} • Active Cases: {off.active_cases_count}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-spacing-sm w-full sm:w-auto justify-between sm:justify-end">
                    <span
                      className={`px-spacing-xs py-spacing-3xs rounded font-label-sm font-bold uppercase ${
                        off.status === 'AVAILABLE'
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'bg-surface-container-highest text-on-surface-variant'
                      }`}
                    >
                      {off.status}
                    </span>

                    <button
                      onClick={() => handleAssign(off.id)}
                      disabled={assigningId === off.id || off.status !== 'AVAILABLE'}
                      className={`py-spacing-xs px-spacing-md rounded font-label-sm font-bold shadow-sm transition-all ${
                        off.status === 'AVAILABLE'
                          ? 'bg-primary text-on-primary hover:bg-on-surface'
                          : 'bg-surface-container text-outline cursor-not-allowed'
                      }`}
                    >
                      {assigningId === off.id ? 'ASSIGNING...' : 'ASSIGN OFFICER'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
