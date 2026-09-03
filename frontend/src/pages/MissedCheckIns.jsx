import React, { useEffect, useState } from 'react';

export default function MissedCheckIns() {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/welfare/missed-checkins')
      .then(res => res.json())
      .then(data => {
        setCheckins(data);
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
            <span className="px-spacing-xs py-spacing-3xs rounded bg-error-container text-on-error-container font-label-sm uppercase font-bold">
              UNRESPONSIVE PING MONITOR
            </span>
            <span className="font-code-md text-on-surface-variant font-bold">MISSED CHECK-INS</span>
          </div>
          <h1 className="font-headline-lg text-on-surface font-bold tracking-tight mt-1">
            Senior Citizen Missed Check-ins Desk
          </h1>
          <p className="font-body-sm text-on-surface-variant">
            Automated welfare check-in pings that did not receive elder confirmation within window.
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-highest overflow-hidden">
        {loading ? (
          <div className="py-spacing-2xl text-center font-label-md text-on-surface-variant">Loading missed check-ins...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-surface-container-highest text-on-surface-variant font-label-sm uppercase">
                  <th className="p-spacing-md">Citizen Name</th>
                  <th className="p-spacing-md">Scheduled Time</th>
                  <th className="p-spacing-md">Last Known Location</th>
                  <th className="p-spacing-md">Family Notified</th>
                  <th className="p-spacing-md">Police Notified</th>
                  <th className="p-spacing-md">Status</th>
                  <th className="p-spacing-md text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest">
                {checkins.map((chk) => (
                  <tr key={chk.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-spacing-md font-headline-sm font-bold text-on-surface">{chk.citizen_name}</td>
                    <td className="p-spacing-md font-code-md text-error font-bold">{chk.scheduled_time}</td>
                    <td className="p-spacing-md font-body-sm text-on-surface-variant">{chk.last_known_location}</td>
                    <td className="p-spacing-md font-label-sm font-bold text-secondary">{chk.family_notified ? 'YES (SMS SENT)' : 'NO'}</td>
                    <td className="p-spacing-md font-label-sm font-bold text-error">{chk.police_notified ? 'YES (ALERT INGESTED)' : 'NO'}</td>
                    <td className="p-spacing-md">
                      <span className="px-spacing-xs py-spacing-3xs rounded font-label-sm font-bold uppercase bg-error-container text-on-error-container">
                        {chk.status}
                      </span>
                    </td>
                    <td className="p-spacing-md text-right">
                      <button
                        onClick={() => alert(`Initiating priority welfare verification call for ${chk.citizen_name}...`)}
                        className="py-spacing-2xs px-spacing-sm bg-primary text-on-primary font-label-sm font-bold rounded shadow-sm hover:bg-on-surface"
                      >
                        INITIATE WELFARE CALL
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
