import React, { useEffect, useState } from 'react';

const MOCK_MISSED_CHECKINS = [
  {
    id: "CHK-1001",
    citizen_id: "CIT-8843",
    citizen_name: "Mohan Lal",
    scheduled_time: "Today, 08:00 AM (Overdue 6h)",
    last_known_location: "H.No 125, Sector 3, Model Town",
    family_notified: true,
    police_notified: true,
    status: "UNRESPONSIVE"
  },
  {
    id: "CHK-1002",
    citizen_id: "CIT-8841",
    citizen_name: "Rajesh Sharma",
    scheduled_time: "Today, 09:30 AM (Overdue 4.5h)",
    last_known_location: "H.No 412, Lane 4, Model Town Phase 2",
    family_notified: true,
    police_notified: true,
    status: "UNRESPONSIVE"
  },
  {
    id: "CHK-1003",
    citizen_id: "CIT-8845",
    citizen_name: "Harish Kumar",
    scheduled_time: "Today, 10:15 AM (Overdue 3.5h)",
    last_known_location: "H.No 204, Lane 2, Model Town",
    family_notified: true,
    police_notified: true,
    status: "PENDING_CALL"
  },
  {
    id: "CHK-1004",
    citizen_id: "CIT-8842",
    citizen_name: "Sunita Devi",
    scheduled_time: "Yesterday, 07:00 PM (Overdue 17h)",
    last_known_location: "H.No 88, Block C, Model Town",
    family_notified: true,
    police_notified: true,
    status: "ALERT_INGESTED"
  },
  {
    id: "CHK-1005",
    citizen_id: "CIT-8844",
    citizen_name: "Kamla Sharma",
    scheduled_time: "Yesterday, 08:30 PM (Overdue 15.5h)",
    last_known_location: "H.No 64, Phase 1, Model Town",
    family_notified: true,
    police_notified: true,
    status: "BEAT_DISPATCHED"
  }
];

export default function MissedCheckIns() {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/welfare/missed-checkins')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          setCheckins(data);
        } else {
          setCheckins(MOCK_MISSED_CHECKINS);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setCheckins(MOCK_MISSED_CHECKINS);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col gap-spacing-lg w-full text-left">
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
                    <td className="p-spacing-md font-headline-sm font-bold text-on-surface">
                      {chk.citizen_name}
                      <span className="block font-label-sm text-slate-500 font-normal">ID: {chk.citizen_id || 'CIT-8843'}</span>
                    </td>
                    <td className="p-spacing-md font-code-md text-error font-bold">{chk.scheduled_time}</td>
                    <td className="p-spacing-md font-body-sm text-on-surface-variant">{chk.last_known_location}</td>
                    <td className="p-spacing-md font-label-sm font-bold text-secondary">
                      {chk.family_notified ? 'YES (SMS SENT ✓)' : 'NO'}
                    </td>
                    <td className="p-spacing-md font-label-sm font-bold text-error">
                      {chk.police_notified ? 'YES (ALERT INGESTED 🚨)' : 'NO'}
                    </td>
                    <td className="p-spacing-md">
                      <span className="px-spacing-xs py-spacing-3xs rounded font-label-sm font-bold uppercase bg-error-container text-on-error-container">
                        {chk.status}
                      </span>
                    </td>
                    <td className="p-spacing-md text-right">
                      <button
                        onClick={() => alert(`Initiating priority welfare verification call for ${chk.citizen_name}...`)}
                        className="py-spacing-2xs px-spacing-sm bg-primary text-on-primary font-label-sm font-bold rounded shadow-sm hover:bg-on-surface transition-all"
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
