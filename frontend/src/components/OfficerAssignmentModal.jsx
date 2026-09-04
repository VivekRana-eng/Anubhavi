import React, { useState } from 'react';

export default function OfficerAssignmentModal({ caseId = 'SOS-2026-0001', emergencyType = 'Medical Emergency', location = 'Model Town', onClose, onAssigned }) {
  const [policeStation, setPoliceStation] = useState('MODEL TOWN POLICE STATION');
  const [officerName, setOfficerName] = useState('');
  const [officerRank, setOfficerRank] = useState('');
  const [policeId, setPoliceId] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAssignSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!officerName.trim()) {
      setError('Please enter the response officer full name.');
      return;
    }

    setSubmitting(true);
    setError('');

    const assignedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const notifData = {
      event: 'SOS_ASSIGNED',
      type: 'ASSIGNMENT',
      title: '👮 OFFICER ASSIGNED BY DSP',
      message: `Case ${caseId}: Assigned to ${officerRank ? officerRank + ' ' : ''}${officerName} (${policeId || 'POL-ID'}) from ${policeStation || 'Police Station'} • Patrol Vehicle: ${vehicle || 'PCR Unit'}`,
      case_id: caseId,
      citizen_id: 'CIT-8841',
      police_station: policeStation || 'MODEL TOWN POLICE STATION',
      station_code: 'MTP-PS-01',
      jurisdiction: 'Model Town • District Central • Zone 1',
      sho_name: 'Insp. Raj Kumar',
      officer_name: officerName,
      officer_rank: officerRank || 'Officer',
      police_id: policeId || 'POL-101',
      vehicle: vehicle || 'PCR Patrol Unit',
      remarks: remarks || 'Dispatched via Control Room',
      status: 'ASSIGNED',
      assigned_at: assignedTime,
      time: assignedTime,
      location: location || 'Model Town'
    };

    const payload = {
      caseId: caseId,
      citizenId: 'CIT-8841',
      citizenName: 'Rajesh Sharma',
      policeStation: policeStation || 'MODEL TOWN POLICE STATION',
      stationCode: 'MTP-PS-01',
      jurisdiction: 'Model Town • District Central • Zone 1',
      shoId: 'SHO-101',
      shoName: 'Insp. Raj Kumar',
      officer_id: policeId || 'POL-101',
      officer_name: officerName,
      officer_rank: officerRank,
      police_id: policeId,
      vehicle: vehicle,
      assignedVehicle: vehicle,
      remarks: remarks,
      status: 'ASSIGNED'
    };

    try {
      const res = await fetch(`/api/sos/${caseId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('anubhavi_token')}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || 'Officer assignment failed');
      
      // Dispatch live custom event for notification panel & citizen popups
      localStorage.setItem('anubhavi_local_user_notification', JSON.stringify(notifData));
      window.dispatchEvent(new CustomEvent('anubhavi_new_notification', { detail: notifData }));

      if (onAssigned) onAssigned(data || { assignment: notifData });
      onClose();
    } catch (err) {
      console.warn("Offline fallback for officer assignment dispatch", err);
      localStorage.setItem('anubhavi_local_user_notification', JSON.stringify(notifData));
      window.dispatchEvent(new CustomEvent('anubhavi_new_notification', { detail: notifData }));
      
      if (onAssigned) onAssigned({ assignment: notifData });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 selection:bg-[#2e5746] selection:text-white">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 animate-in fade-in duration-200">
        
        {/* MODAL HEADER */}
        <div className="p-5 bg-[#2e5746] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[26px]">local_police</span>
            <div>
              <h3 className="text-base font-extrabold tracking-tight uppercase">ASSIGN RESPONSE OFFICER</h3>
              <p className="text-xs text-emerald-100 font-medium">SOS CASE: {caseId}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-emerald-100 hover:text-white text-xl p-1 rounded-lg">
            ✕
          </button>
        </div>

        {/* MODAL FORM BODY */}
        <form onSubmit={handleAssignSubmit} className="p-6 max-h-[82vh] overflow-y-auto flex flex-col gap-4 text-left">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          {/* SOS CASE SUMMARY */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">SOS CASE ID</span>
              <span className="text-xs font-black text-slate-800">{caseId}</span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">LOCATION</span>
              <span className="text-xs font-black text-slate-800 truncate block">{location}</span>
            </div>
          </div>

          {/* POLICE STATION DETAILS ("ASSIGNING FROM") */}
          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80 flex flex-col gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#2e5746] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">domain</span>
              ASSIGNING FROM POLICE STATION
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1 block">
                  Police Station Name *
                </label>
                <input
                  type="text"
                  value={policeStation}
                  onChange={(e) => setPoliceStation(e.target.value)}
                  placeholder="e.g. MODEL TOWN POLICE STATION"
                  className="w-full h-10 px-3 bg-white border border-emerald-300 rounded-xl text-slate-900 font-extrabold text-xs focus:outline-none focus:border-[#2e5746]"
                />
              </div>
              <div className="flex flex-col justify-end text-left sm:text-right">
                <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-200/80 text-[#2e5746] text-[11px] font-bold self-start sm:self-end">
                  District Central • Zone 1
                </span>
                <p className="text-[11px] text-slate-500 font-semibold mt-1">Assigned By: DSP / SHO</p>
              </div>
            </div>
          </div>

          {/* MANUALLY WRITTEN POLICE OFFICER INPUT FIELDS */}
          <div className="p-4 rounded-2xl bg-white border border-slate-300 shadow-xs flex flex-col gap-3">
            <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 text-[#2e5746]">
              <span className="material-symbols-outlined text-[18px]">edit_note</span>
              <span className="text-xs font-black uppercase tracking-wider">MANUALLY WRITE OFFICER DETAILS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* OFFICER FULL NAME */}
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1 block">
                  Officer Full Name *
                </label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  placeholder="e.g. ASI Amit Singh / Insp. Vikramjit"
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-xs focus:bg-white focus:outline-none focus:border-[#2e5746]"
                />
              </div>

              {/* OFFICER RANK */}
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1 block">
                  Officer Rank *
                </label>
                <input
                  type="text"
                  value={officerRank}
                  onChange={(e) => setOfficerRank(e.target.value)}
                  placeholder="e.g. Assistant Sub-Inspector / Head Constable"
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-xs focus:bg-white focus:outline-none focus:border-[#2e5746]"
                />
              </div>

              {/* POLICE BADGE / ID */}
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1 block">
                  Police Badge / ID Number *
                </label>
                <input
                  type="text"
                  value={policeId}
                  onChange={(e) => setPoliceId(e.target.value)}
                  placeholder="e.g. POL-1025"
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-xs focus:bg-white focus:outline-none focus:border-[#2e5746]"
                />
              </div>

              {/* PATROL VEHICLE UNIT */}
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1 block">
                  Patrol Vehicle / Unit *
                </label>
                <input
                  type="text"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  placeholder="e.g. PCR Bike #12 / PCR Van #04"
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-xs focus:bg-white focus:outline-none focus:border-[#2e5746]"
                />
              </div>
            </div>
          </div>

          {/* LIVE OFFICER PREVIEW STRIP */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 flex items-center justify-between text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#2e5746] text-[18px]">verified_user</span>
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900">
                  {officerRank || 'Officer'} {officerName || 'Name'}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Station: <strong className="text-[#2e5746]">{policeStation || 'Police Station'}</strong> • ID: <strong>{policeId || 'POL-ID'}</strong> • Vehicle: <strong>{vehicle || 'PCR Unit'}</strong>
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
              READY FOR DISPATCH
            </span>
          </div>

          {/* ADDITIONAL REMARKS */}
          <div>
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 block">
              ADDITIONAL REMARKS
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Dispatched via Model Town PS Control Room"
              className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium text-xs focus:outline-none focus:border-[#2e5746]"
            />
          </div>

          {/* BUTTON ACTIONS */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl transition-all"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-[#2e5746] hover:bg-[#244638] text-white text-xs font-extrabold rounded-xl shadow-lg transition-all flex items-center gap-2 uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              {submitting ? 'DISPATCHING...' : 'ASSIGN OFFICER'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
