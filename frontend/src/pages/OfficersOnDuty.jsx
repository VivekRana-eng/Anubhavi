import React, { useEffect, useState } from 'react';

export default function OfficersOnDuty() {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="flex flex-col gap-spacing-lg w-full">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg border border-surface-container-highest flex flex-col md:flex-row items-start md:items-center justify-between gap-spacing-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-spacing-xs">
            <span className="px-spacing-xs py-spacing-3xs rounded bg-primary-container text-on-primary font-label-sm uppercase font-bold">
              POLICE FORCE ROSTER
            </span>
            <span className="font-code-md text-on-surface-variant font-bold">MODEL TOWN BEAT UNITS</span>
          </div>
          <h1 className="font-headline-lg text-on-surface font-bold tracking-tight mt-1">
            Police Officers on Duty Roster
          </h1>
          <p className="font-body-sm text-on-surface-variant">
            Available Head Constables, ASIs, Constables, and SIs deployed in Model Town Police Station.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-spacing-md">
        {loading ? (
          <div className="col-span-full py-spacing-2xl text-center font-label-md text-on-surface-variant">
            Loading officer roster...
          </div>
        ) : (
          officers.map((off) => (
            <div key={off.id} className="bg-surface-container-lowest p-spacing-lg rounded-xl shadow-sm border border-surface-container-highest flex flex-col items-center text-center gap-spacing-xs">
              <img src={off.avatar_url} alt={off.name} className="w-24 h-24 rounded-full object-cover shadow-sm bg-surface-container mb-spacing-xs" />
              <span className="font-headline-sm text-on-surface font-bold">{off.name}</span>
              <span className="font-label-sm px-spacing-xs py-spacing-3xs rounded bg-surface-container-highest text-on-surface font-bold">
                {off.rank}
              </span>
              <span className="font-code-md text-primary font-bold">{off.police_id}</span>
              <span className="font-body-sm text-on-surface-variant">{off.current_vehicle || 'Patrol Unit'}</span>
              <span className="font-code-md text-on-surface font-semibold">{off.mobile}</span>

              <div className="mt-spacing-xs pt-spacing-xs border-t border-surface-container-highest w-full flex items-center justify-between">
                <span className="font-label-sm text-on-surface-variant">Active Cases: {off.active_cases_count}</span>
                <span className={`px-spacing-xs py-spacing-3xs rounded font-label-sm font-bold uppercase ${
                  off.status === 'AVAILABLE' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-highest text-on-surface'
                }`}>
                  {off.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
