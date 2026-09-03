import React, { useEffect, useState } from 'react';

export default function AssistanceRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = () => {
    setLoading(true);
    fetch('/api/assistance')
      .then(res => res.json())
      .then(data => {
        setRequests(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/assistance/${id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('anubhavi_token')}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) loadRequests();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-spacing-lg w-full">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg border border-surface-container-highest flex flex-col md:flex-row items-start md:items-center justify-between gap-spacing-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-spacing-xs">
            <span className="px-spacing-xs py-spacing-3xs rounded bg-primary-container text-on-primary font-label-sm uppercase font-bold">
              NON-EMERGENCY DESK
            </span>
            <span className="font-code-md text-on-surface-variant font-bold">ASSISTANCE QUEUE</span>
          </div>
          <h1 className="font-headline-lg text-on-surface font-bold tracking-tight mt-1">
            Senior Citizen Assistance Requests
          </h1>
          <p className="font-body-sm text-on-surface-variant">
            Welfare assistance, medical escort, safety concern, and neighbor check-in requests.
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-highest overflow-hidden">
        {loading ? (
          <div className="py-spacing-2xl text-center font-label-md text-on-surface-variant">Loading assistance requests...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-surface-container-highest text-on-surface-variant font-label-sm uppercase">
                  <th className="p-spacing-md">Request ID</th>
                  <th className="p-spacing-md">Citizen Name</th>
                  <th className="p-spacing-md">Request Type</th>
                  <th className="p-spacing-md">Location</th>
                  <th className="p-spacing-md">Logged Time</th>
                  <th className="p-spacing-md">Status</th>
                  <th className="p-spacing-md text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-spacing-md font-code-md text-primary font-bold">{r.id}</td>
                    <td className="p-spacing-md font-headline-sm font-bold text-on-surface">{r.citizen_name}</td>
                    <td className="p-spacing-md font-body-sm font-semibold">{r.request_type}</td>
                    <td className="p-spacing-md font-body-sm text-on-surface-variant">{r.location}</td>
                    <td className="p-spacing-md font-code-md text-on-surface-variant">{r.created_at}</td>
                    <td className="p-spacing-md">
                      <span className="px-spacing-xs py-spacing-3xs rounded font-label-sm font-bold uppercase bg-surface-container-highest text-on-surface">
                        {r.status}
                      </span>
                    </td>
                    <td className="p-spacing-md text-right">
                      {r.status === 'NEW' && (
                        <button
                          onClick={() => handleUpdateStatus(r.id, 'ACCEPTED')}
                          className="py-spacing-2xs px-spacing-sm bg-primary text-on-primary font-label-sm font-bold rounded shadow-sm hover:bg-on-surface"
                        >
                          ACCEPT REQUEST
                        </button>
                      )}
                      {r.status === 'ACCEPTED' && (
                        <button
                          onClick={() => handleUpdateStatus(r.id, 'RESOLVED')}
                          className="py-spacing-2xs px-spacing-sm bg-secondary-container text-on-secondary-container font-label-sm font-bold rounded"
                        >
                          MARK RESOLVED
                        </button>
                      )}
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
