import React, { useEffect, useState } from 'react';
import { useCommandStore } from '../context/CommandStoreContext';

const DEMO_REQUESTS = [
  {
    id: 'AST-2026-041',
    citizen_name: 'Sunita Devi',
    request_type: 'Welfare Assistance',
    location: 'Model Town Phase 2',
    created_at: 'Today, 10:30 AM',
    status: 'IN_PROGRESS',
  },
  {
    id: 'AST-2026-040',
    citizen_name: 'Rajesh Sharma',
    request_type: 'Home Safety',
    location: 'Model Town Phase 2',
    created_at: 'Yesterday, 04:15 PM',
    status: 'NEW',
  },
];

const OFFICERS = [
  { id: 'POL-1025', name: 'ASI Amit Singh', rank: 'Assistant Sub-Inspector', mobile: '+91 98721-44102' },
  { id: 'POL-1024', name: 'HC Raj Kumar', rank: 'Head Constable', mobile: '+91 98140-99812' },
  { id: 'POL-1028', name: 'SI Rahul Verma', rank: 'Sub-Inspector', mobile: '+91 98112-33445' },
  { id: 'POL-1026', name: 'Const. Vikram Sharma', rank: 'Constable', mobile: '+91 98112-99124' },
  { id: 'POL-1027', name: 'SI Neeraj Kumar', rank: 'Sub-Inspector', mobile: '+91 98112-77123' },
  { id: 'POL-1029', name: 'HC Manpreet Singh', rank: 'Head Constable', mobile: '+91 98112-55667' },
  { id: 'POL-1031', name: 'Inspector Sharma', rank: 'Inspector', mobile: '+91 98112-11223' }
];

export default function AssistanceRequests() {
  const { addCustomNotification } = useCommandStore();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({ meeting_date: '', meeting_time: '10:00', officer_id: '', officer_name: '', officer_rank: '', police_id: '', officer_mobile: '' });

  const loadRequests = () => {
    setLoading(true);
    setError('');
    fetch('/api/assistance')
      .then(res => {
        if (!res.ok) throw new Error('Unable to load assistance requests');
        return res.json();
      })
      .then(data => {
        let localRequest = null;
        try {
          const raw = localStorage.getItem('anubhavi_local_assistance_request');
          localRequest = raw ? JSON.parse(raw) : null;
        } catch (error) {
          localRequest = null;
        }
        const serverRequests = Array.isArray(data) && data.length > 0 ? data : DEMO_REQUESTS;
        if (localRequest && localRequest.id) {
          setRequests([localRequest, ...serverRequests.filter(item => item && item.id !== localRequest.id)]);
        } else {
          setRequests(serverRequests);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Live data unavailable. Showing demo assistance requests.');
        setRequests(DEMO_REQUESTS);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadRequests();
    const handleLocalRequest = (event) => {
      if (event.key !== 'anubhavi_local_assistance_request' || !event.newValue) return;
      try {
        const request = JSON.parse(event.newValue);
        if (request && request.id) {
          setRequests(prev => [request, ...prev.filter(item => item && item.id !== request.id)]);
        }
      } catch (error) {
        console.error('Local assistance request error:', error);
      }
    };
    const handleLocalRequestEvent = (event) => {
      if (event.detail && event.detail.id) {
        setRequests(prev => [event.detail, ...prev.filter(item => item && item.id !== event.detail.id)]);
      }
    };
    window.addEventListener('storage', handleLocalRequest);
    window.addEventListener('anubhavi_new_assistance_request', handleLocalRequestEvent);
    return () => {
      window.removeEventListener('storage', handleLocalRequest);
      window.removeEventListener('anubhavi_new_assistance_request', handleLocalRequestEvent);
    };
  }, []);

  const handleUpdateStatus = async (id, status) => {
    const targetReq = requests.find(r => r.id === id);
    const citizen = targetReq?.citizen_name || 'Rajesh Sharma';
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    if (addCustomNotification) {
      addCustomNotification({
        id: `NOT-STATUS-${id}-${Date.now()}`,
        type: 'STATUS_UPDATED',
        title: 'Assistance Status Updated',
        message: `SHO marked assistance request ${id} (${citizen}) as "${status}".`,
        citizen_name: citizen,
        caseId: id,
        request_id: id,
        police_station: 'Model Town Police Station',
        time: `Just Now • ${timeNow}`,
        priority: 'MEDIUM'
      });
    }

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

  const openSchedule = (request) => {
    setSelectedRequest(request);
    setScheduleForm({
      meeting_date: request.meeting_date || new Date().toISOString().split('T')[0],
      meeting_time: request.meeting_time || '10:00',
      officer_id: request.assigned_officer_id || '',
      officer_name: request.assigned_officer_name || '',
      officer_rank: request.assigned_officer_rank || '',
      police_id: request.assigned_officer_id || '',
      officer_mobile: request.assigned_officer_mobile || ''
    });
  };

  const handleSchedule = async (event) => {
    event.preventDefault();
    const officerName = scheduleForm.officer_name.trim();
    const officerRank = scheduleForm.officer_rank.trim();
    const policeId = scheduleForm.police_id.trim();
    if (!officerName || !officerRank || !policeId) {
      setError('Please fill Officer Name, Rank, and Belt / Police Number.');
      return;
    }
    const updatedRequest = {
      ...selectedRequest,
      status: 'ASSIGNED',
      meeting_date: scheduleForm.meeting_date,
      meeting_time: scheduleForm.meeting_time,
      assigned_officer_id: policeId,
      assigned_officer_name: officerName,
      assigned_officer_rank: officerRank,
      assigned_officer_mobile: scheduleForm.officer_mobile
    };

    const citizen = updatedRequest.citizen_name || 'Rajesh Sharma';
    const fullOfficerName = `${officerRank ? officerRank + ' ' : ''}${officerName}`;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    // Add Notification to SHO Notification Panel
    if (addCustomNotification) {
      addCustomNotification({
        id: `NOT-AST-${updatedRequest.id}-${Date.now()}`,
        type: 'ASSISTANCE_ASSIGNED',
        title: 'Assistance Officer Assigned',
        message: `SHO assigned ${fullOfficerName} to citizen ${citizen} (${updatedRequest.id}) for ${updatedRequest.request_type || 'Welfare Assistance'}.`,
        citizen_name: citizen,
        caseId: updatedRequest.id,
        request_id: updatedRequest.id,
        officer_name: officerName,
        officer_rank: officerRank || 'Officer',
        police_id: policeId,
        officer_mobile: scheduleForm.officer_mobile,
        police_station: 'Model Town Police Station',
        meeting_date: updatedRequest.meeting_date,
        meeting_time: updatedRequest.meeting_time,
        time: `Just Now • ${timeNow}`,
        priority: 'HIGH'
      });
    }

    try {
      await fetch(`/api/assistance/${selectedRequest.id}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('anubhavi_token')}` },
        body: JSON.stringify({ ...scheduleForm, officer_id: policeId, officer_name: officerName, officer_rank: officerRank, officer_mobile: scheduleForm.officer_mobile })
      });
    } catch (error) {
      console.warn('Offline assignment saved locally');
    }

    setRequests(prev => prev.map(item => item.id === updatedRequest.id ? updatedRequest : item));
    localStorage.setItem('anubhavi_local_assistance_assignment', JSON.stringify(updatedRequest));
    const assignmentNotification = {
      event: 'ASSISTANCE_ASSIGNED',
      request_id: updatedRequest.id,
      citizen_id: updatedRequest.citizen_id,
      citizen_name: citizen,
      title: 'Assistance Visit Scheduled',
      message: `${fullOfficerName} has been assigned to citizen ${citizen} for assistance request.`,
      meeting_date: updatedRequest.meeting_date,
      meeting_time: updatedRequest.meeting_time,
      officer_name: officerName,
      officer_rank: officerRank,
      police_id: policeId,
      officer_mobile: scheduleForm.officer_mobile,
      police_station: 'Model Town Police Station',
      status: 'ASSIGNED'
    };
    localStorage.setItem('anubhavi_local_user_notification', JSON.stringify(assignmentNotification));
    window.dispatchEvent(new CustomEvent('anubhavi_new_notification', { detail: assignmentNotification }));
    setSelectedRequest(null);
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
            User-requested assistance, meeting scheduling, and officer assignment desk.
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-highest overflow-hidden">
        {error && <div className="border-b border-amber-200 bg-amber-50 px-spacing-lg py-spacing-sm text-sm font-semibold text-amber-800">{error}</div>}
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
                  <th className="p-spacing-md">Meeting</th>
                  <th className="p-spacing-md">Assigned Officer</th>
                  <th className="p-spacing-md">Status</th>
                  <th className="p-spacing-md text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest">
                {requests.length === 0 ? (
                  <tr><td colSpan="9" className="p-spacing-2xl text-center text-on-surface-variant">No assistance requests found.</td></tr>
                ) : requests.filter(Boolean).map((r) => (
                  <tr key={r.id || `req-${Math.random()}`} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-spacing-md font-code-md text-primary font-bold">{r.id}</td>
                    <td className="p-spacing-md font-headline-sm font-bold text-on-surface">{r.citizen_name || r.citizen || 'Senior Citizen'}</td>
                    <td className="p-spacing-md font-body-sm font-semibold">{r.request_type || r.type || 'Assistance Request'}</td>
                    <td className="p-spacing-md font-body-sm text-on-surface-variant">{r.location || 'Model Town Ward'}</td>
                    <td className="p-spacing-md font-code-md text-on-surface-variant">{r.created_at}</td>
                    <td className="p-spacing-md font-code-md font-semibold">{r.meeting_date ? `${r.meeting_date} ${r.meeting_time || ''}` : 'Not scheduled'}</td>
                    <td className="p-spacing-md font-body-sm font-semibold">{r.assigned_officer_name || 'Unassigned'}</td>
                    <td className="p-spacing-md">
                      <span className="px-spacing-xs py-spacing-3xs rounded font-label-sm font-bold uppercase bg-surface-container-highest text-on-surface">
                        {r.status}
                      </span>
                    </td>
                    <td className="p-spacing-md text-right">
                      {(r.status === 'NEW' || r.status === 'PENDING' || r.status === 'ACCEPTED' || r.status === 'IN_PROGRESS') && <button onClick={() => openSchedule(r)} className="py-spacing-2xs px-spacing-sm bg-primary text-on-primary font-label-sm font-bold rounded shadow-sm hover:bg-on-surface">SET MEETING & OFFICER</button>}
                      {r.status === 'ASSIGNED' && <button onClick={() => openSchedule(r)} className="py-spacing-2xs px-spacing-sm bg-secondary-container text-on-secondary-container font-label-sm font-bold rounded">EDIT ASSIGNMENT</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 p-spacing-md backdrop-blur-sm">
          <form onSubmit={handleSchedule} className="flex w-full max-w-lg flex-col gap-spacing-md rounded-xl border border-surface-container-highest bg-surface-container-lowest p-spacing-lg text-left shadow-xl">
            <div className="flex items-center justify-between border-b border-surface-container-highest pb-spacing-xs">
              <div><h2 className="font-headline-sm font-bold">Schedule Assistance Visit</h2><p className="text-xs text-on-surface-variant">{selectedRequest.citizen_name || 'Senior Citizen'} • {selectedRequest.request_type || selectedRequest.type || 'Assistance Request'}</p></div>
              <button type="button" onClick={() => setSelectedRequest(null)}><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="grid grid-cols-2 gap-spacing-sm">
              <label className="flex flex-col gap-1 text-xs font-bold">Meeting Date<input required type="date" value={scheduleForm.meeting_date} onChange={e => setScheduleForm({...scheduleForm, meeting_date: e.target.value})} className="h-10 rounded border bg-surface-container-low px-2" /></label>
              <label className="flex flex-col gap-1 text-xs font-bold">Meeting Time<input required type="time" value={scheduleForm.meeting_time} onChange={e => setScheduleForm({...scheduleForm, meeting_time: e.target.value})} className="h-10 rounded border bg-surface-container-low px-2" /></label>
            </div>
            <div className="grid grid-cols-1 gap-spacing-sm sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-xs font-bold">Officer Name<input required value={scheduleForm.officer_name} onChange={e => setScheduleForm({...scheduleForm, officer_name: e.target.value})} placeholder="e.g. ASI Amit Singh" className="h-10 rounded border bg-surface-container-low px-2" /></label>
              <label className="flex flex-col gap-1 text-xs font-bold">Rank<input required value={scheduleForm.officer_rank} onChange={e => setScheduleForm({...scheduleForm, officer_rank: e.target.value})} placeholder="e.g. Assistant Sub-Inspector" className="h-10 rounded border bg-surface-container-low px-2" /></label>
              <label className="flex flex-col gap-1 text-xs font-bold">Belt / Police Number<input required value={scheduleForm.police_id} onChange={e => setScheduleForm({...scheduleForm, police_id: e.target.value, officer_id: e.target.value})} placeholder="e.g. POL-1025" className="h-10 rounded border bg-surface-container-low px-2" /></label>
            </div>
            <button type="submit" className="rounded bg-primary py-spacing-xs font-label-lg font-bold text-on-primary">SAVE ASSIGNMENT</button>
          </form>
        </div>
      )}
    </div>
  );
}
