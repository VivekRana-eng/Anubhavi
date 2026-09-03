import React, { useEffect, useState } from 'react';

export default function WelfareChecks() {
  const [welfares, setWelfares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [form, setForm] = useState({
    citizen_id: 'CIT-8841',
    scheduled_date: new Date().toISOString().split('T')[0],
    scheduled_time: '11:00',
    check_type: 'Welfare Call',
    purpose: 'Routine safety check',
    notes: 'Elder lives alone'
  });

  const loadWelfares = () => {
    setLoading(true);
    fetch('/api/welfare/checks')
      .then(res => res.json())
      .then(data => {
        setWelfares(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadWelfares();
  }, []);

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/welfare/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('anubhavi_token')}`
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setShowScheduleModal(false);
        loadWelfares();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-spacing-lg w-full">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg border border-surface-container-highest flex flex-col md:flex-row items-start md:items-center justify-between gap-spacing-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-spacing-xs">
            <span className="px-spacing-xs py-spacing-3xs rounded bg-primary-container text-on-primary font-label-sm uppercase font-bold">
              PREVENTIVE CARE DESK
            </span>
            <span className="font-code-md text-on-surface-variant font-bold">WELFARE ROSTER</span>
          </div>
          <h1 className="font-headline-lg text-on-surface font-bold tracking-tight mt-1">
            Scheduled Welfare Checks & Visits
          </h1>
          <p className="font-body-sm text-on-surface-variant">
            Routine police welfare calls, beat visits, and cyber safety awareness briefings.
          </p>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="px-spacing-md py-spacing-xs bg-primary text-on-primary font-label-lg font-bold rounded shadow hover:bg-on-surface flex items-center gap-spacing-xs"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          SCHEDULE WELFARE CHECK
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-highest overflow-hidden">
        {loading ? (
          <div className="py-spacing-2xl text-center font-label-md text-on-surface-variant">Loading welfare roster...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-surface-container-highest text-on-surface-variant font-label-sm uppercase">
                  <th className="p-spacing-md">Citizen Name</th>
                  <th className="p-spacing-md">Scheduled Date & Time</th>
                  <th className="p-spacing-md">Check Type</th>
                  <th className="p-spacing-md">Assigned Officer</th>
                  <th className="p-spacing-md">Purpose</th>
                  <th className="p-spacing-md">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest">
                {welfares.map((w) => (
                  <tr key={w.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-spacing-md font-headline-sm font-bold text-on-surface">{w.citizen_name}</td>
                    <td className="p-spacing-md font-code-md text-on-surface font-semibold">{w.scheduled_date} at {w.scheduled_time}</td>
                    <td className="p-spacing-md font-body-sm font-bold">{w.check_type}</td>
                    <td className="p-spacing-md font-body-sm text-primary font-semibold">{w.assigned_officer_name || 'Unassigned'}</td>
                    <td className="p-spacing-md font-body-sm text-on-surface-variant">{w.purpose}</td>
                    <td className="p-spacing-md">
                      <span className="px-spacing-xs py-spacing-3xs rounded font-label-sm font-bold uppercase bg-surface-container-highest text-on-surface">
                        {w.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 backdrop-blur-sm p-spacing-md">
          <form onSubmit={handleScheduleSubmit} className="bg-surface-container-lowest w-full max-w-lg rounded-xl shadow-xl p-spacing-lg border border-surface-container-highest flex flex-col gap-spacing-md">
            <div className="flex items-center justify-between border-b border-surface-container-highest pb-spacing-xs">
              <span className="font-headline-sm font-bold text-on-surface">Schedule Senior Welfare Check</span>
              <button type="button" onClick={() => setShowScheduleModal(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-spacing-2xs">
              <label className="font-label-sm uppercase font-semibold">Select Citizen</label>
              <select
                value={form.citizen_id}
                onChange={e => setForm({...form, citizen_id: e.target.value})}
                className="h-10 px-spacing-sm bg-surface-container-low border rounded font-body-sm"
              >
                <option value="CIT-8841">Rajesh Sharma (72y)</option>
                <option value="CIT-8842">Sunita Devi (68y)</option>
                <option value="CIT-8843">Mohan Lal (75y)</option>
                <option value="CIT-8844">Kamla Sharma (70y)</option>
                <option value="CIT-8845">Harish Kumar (74y)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-spacing-sm">
              <div className="flex flex-col gap-spacing-2xs">
                <label className="font-label-sm uppercase font-semibold">Date</label>
                <input
                  type="date"
                  value={form.scheduled_date}
                  onChange={e => setForm({...form, scheduled_date: e.target.value})}
                  className="h-10 px-spacing-sm bg-surface-container-low border rounded font-body-sm"
                />
              </div>

              <div className="flex flex-col gap-spacing-2xs">
                <label className="font-label-sm uppercase font-semibold">Time</label>
                <input
                  type="time"
                  value={form.scheduled_time}
                  onChange={e => setForm({...form, scheduled_time: e.target.value})}
                  className="h-10 px-spacing-sm bg-surface-container-low border rounded font-body-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-spacing-2xs">
              <label className="font-label-sm uppercase font-semibold">Check Type</label>
              <select
                value={form.check_type}
                onChange={e => setForm({...form, check_type: e.target.value})}
                className="h-10 px-spacing-sm bg-surface-container-low border rounded font-body-sm"
              >
                <option value="Welfare Call">Welfare Call</option>
                <option value="Periodic Check-in">Periodic Beat Check-in</option>
                <option value="Safety Awareness Message">Safety Awareness Message</option>
                <option value="Follow-up">Post-Incident Follow-up</option>
              </select>
            </div>

            <button type="submit" className="py-spacing-xs bg-primary text-on-primary font-label-lg font-bold rounded shadow hover:bg-on-surface">
              SUBMIT & SCHEDULE
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
