import React, { useState } from 'react';

const MOCK_POLICE_OFFICERS = [
  {
    id: 'POL-1025',
    name: 'ASI Amit Singh',
    rank: 'Assistant Sub-Inspector',
    police_id: 'POL-1025',
    vehicle: 'PCR Bike #12',
    status: 'AVAILABLE',
    active_cases: 1
  },
  {
    id: 'POL-1024',
    name: 'HC Raj Kumar',
    rank: 'Head Constable',
    police_id: 'POL-1024',
    vehicle: 'PCR Van #04',
    status: 'AVAILABLE',
    active_cases: 2
  },
  {
    id: 'POL-1027',
    name: 'SI Neeraj Kumar',
    rank: 'Sub-Inspector',
    police_id: 'POL-1027',
    vehicle: 'PCR Car #01',
    status: 'AVAILABLE',
    active_cases: 1
  },
  {
    id: 'POL-1026',
    name: 'Const. Vikram Sharma',
    rank: 'Constable',
    police_id: 'POL-1026',
    vehicle: 'PCR Van #02',
    status: 'ON_DUTY',
    active_cases: 2
  }
];

export default function OfficerAssignmentModal({ caseId = 'SOS-2026-0001', emergencyType = 'Medical Emergency', location = 'Model Town', onClose, onAssigned }) {
  const [selectedOfficerId, setSelectedOfficerId] = useState('POL-1025');
  const [responseType, setResponseType] = useState('Police Emergency Response');
  const [estimatedResponseTime, setEstimatedResponseTime] = useState('10 minutes');
  const [instructions, setInstructions] = useState('Officer dispatched for immediate emergency response and on-scene triage.');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selectedOfficer = MOCK_POLICE_OFFICERS.find(o => o.id === selectedOfficerId) || MOCK_POLICE_OFFICERS[0];
  const isSelectedOfficerAvailable = selectedOfficer.status === 'AVAILABLE';

  const handleAssignSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!isSelectedOfficerAvailable) {
      setError(`Officer ${selectedOfficer.name} is currently ${selectedOfficer.status} and cannot be assigned.`);
      return;
    }

    setSubmitting(true);
    setError('');

    const payload = {
      caseId: caseId,
      citizenId: 'CIT-8841',
      citizenName: 'Rajesh Sharma',
      policeStation: 'MODEL TOWN POLICE STATION',
      stationCode: 'MTP-PS-01',
      jurisdiction: 'Model Town • District Central • Zone 1',
      shoId: 'SHO-101',
      shoName: 'Insp. Raj Kumar',
      officer_id: selectedOfficer.id,
      assignedOfficerId: selectedOfficer.id,
      assignedOfficerName: selectedOfficer.name,
      assignedOfficerRank: selectedOfficer.rank,
      assignedVehicle: selectedOfficer.vehicle,
      response_type: responseType,
      priority: 'HIGH',
      instructions: instructions,
      estimated_response_time: estimatedResponseTime,
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
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.detail || 'API offline fallback');

      // Mirror to local storage for instant multi-tab offline demo synchronization
      localStorage.setItem('anubhavi_local_user_notification', JSON.stringify({
        event: 'SOS_ASSIGNED',
        case_id: caseId,
        citizen_id: 'CIT-8841',
        police_station: 'MODEL TOWN POLICE STATION',
        station_code: 'MTP-PS-01',
        jurisdiction: 'Model Town • District Central • Zone 1',
        sho_name: 'Insp. Raj Kumar',
        officer_name: selectedOfficer.name,
        officer_rank: selectedOfficer.rank,
        police_id: selectedOfficer.police_id,
        vehicle: selectedOfficer.vehicle,
        response_type: responseType,
        priority: 'HIGH',
        eta: estimatedResponseTime,
        instructions: instructions,
        remarks: remarks,
        status: 'ASSIGNED',
        assigned_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));

      if (onAssigned) onAssigned(data);
      onClose();
    } catch (e) {
      console.warn("Using offline fallback assignment dispatch", e);
      const notifData = {
        event: 'SOS_ASSIGNED',
        case_id: caseId,
        citizen_id: 'CIT-8841',
        police_station: 'MODEL TOWN POLICE STATION',
        station_code: 'MTP-PS-01',
        jurisdiction: 'Model Town • District Central • Zone 1',
        sho_name: 'Insp. Raj Kumar',
        officer_name: selectedOfficer.name,
        officer_rank: selectedOfficer.rank,
        police_id: selectedOfficer.police_id,
        vehicle: selectedOfficer.vehicle,
        response_type: responseType,
        priority: 'HIGH',
        eta: estimatedResponseTime,
        instructions: instructions,
        remarks: remarks,
        status: 'ASSIGNED',
        assigned_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      localStorage.setItem('anubhavi_local_user_notification', JSON.stringify(notifData));
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
              <h3 className="text-base font-extrabold tracking-tight uppercase">ASSIGN RESPONSE</h3>
              <p className="text-xs text-emerald-100 font-medium">SOS CASE: {caseId}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-emerald-100 hover:text-white text-xl p-1 rounded-lg">
            ✕
          </button>
        </div>

        {/* MODAL FORM BODY */}
        <form onSubmit={handleAssignSubmit} className="p-6 max-h-[80vh] overflow-y-auto flex flex-col gap-4 text-left">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          {/* SOS CASE SUMMARY */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">SOS CASE</span>
              <span className="text-xs font-black text-slate-800">{caseId}</span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">LOCATION</span>
              <span className="text-xs font-black text-slate-800 truncate block">{location}</span>
            </div>
          </div>

          {/* POLICE STATION DETAILS ("ASSIGNING FROM") */}
          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80 flex flex-col gap-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#2e5746] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">domain</span>
              ASSIGNING FROM POLICE STATION
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mt-1">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">MODEL TOWN POLICE STATION</h4>
                <p className="text-xs text-slate-600 font-medium">Station Code: <strong className="text-slate-800">MTP-PS-01</strong></p>
              </div>
              <div className="text-left sm:text-right">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-200/80 text-[#2e5746] text-[11px] font-bold">
                  District Central • Zone 1
                </span>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Assigned By: Insp. Raj Kumar (SHO)</p>
              </div>
            </div>
          </div>

          {/* OFFICER SELECTION DROPDOWN */}
          <div>
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 block">
              SELECT RESPONSE OFFICER
            </label>
            <select
              value={selectedOfficerId}
              onChange={(e) => setSelectedOfficerId(e.target.value)}
              className="w-full h-12 px-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-bold text-sm focus:outline-none focus:border-[#2e5746]"
            >
              {MOCK_POLICE_OFFICERS.map((off) => {
                const isAvail = off.status === 'AVAILABLE';
                return (
                  <option key={off.id} value={off.id} disabled={!isAvail}>
                    {off.name} ({off.rank}) — {off.vehicle} — [{isAvail ? 'AVAILABLE ✓' : 'ON DUTY ⚠️'}]
                  </option>
                );
              })}
            </select>
          </div>

          {/* SELECTED OFFICER DETAILS CARD */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isSelectedOfficerAvailable ? 'bg-slate-50 border-slate-200' : 'bg-amber-50 border-amber-200'
          }`}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Rank</span>
                <span className="text-xs font-bold text-slate-800">{selectedOfficer.rank}</span>
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Police ID</span>
                <span className="text-xs font-bold text-[#2e5746]">{selectedOfficer.police_id}</span>
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Vehicle</span>
                <span className="text-xs font-bold text-slate-800">{selectedOfficer.vehicle}</span>
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Current Status</span>
                <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-black uppercase ${
                  isSelectedOfficerAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                }`}>
                  {isSelectedOfficerAvailable ? 'AVAILABLE ✓' : 'ON DUTY'}
                </span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
              <span>Active Assigned Cases: <strong>{selectedOfficer.active_cases}</strong></span>
              {!isSelectedOfficerAvailable && (
                <span className="text-amber-700 font-bold">⚠️ Officer currently deployed on active call</span>
              )}
            </div>
          </div>

          {/* RESPONSE TYPE */}
          <div>
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 block">
              RESPONSE TYPE
            </label>
            <select
              value={responseType}
              onChange={(e) => setResponseType(e.target.value)}
              className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-bold text-xs focus:outline-none focus:border-[#2e5746]"
            >
              <option value="Police Emergency Response">Police Emergency Response</option>
              <option value="Police Patrol Van">Police Patrol Van</option>
              <option value="Medical Rapid Response">Medical Rapid Response</option>
              <option value="Senior Citizen Welfare Support">Senior Citizen Support</option>
            </select>
          </div>

          {/* ESTIMATED RESPONSE TIME (ETA) */}
          <div>
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 block">
              ESTIMATED RESPONSE TIME
            </label>
            <select
              value={estimatedResponseTime}
              onChange={(e) => setEstimatedResponseTime(e.target.value)}
              className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-bold text-xs focus:outline-none focus:border-[#2e5746]"
            >
              <option value="5 minutes">5 minutes (Rapid Priority)</option>
              <option value="10 minutes">10 minutes (Standard Response)</option>
              <option value="15 minutes">15 minutes</option>
              <option value="20 minutes">20 minutes</option>
            </select>
          </div>

          {/* INSTRUCTIONS */}
          <div>
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 block">
              INSTRUCTIONS
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Enter dispatch instructions for officer..."
              className="w-full min-h-16 p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-[#2e5746]"
            />
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
              className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-[#2e5746]"
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-5 h-11 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              CANCEL
            </button>

            <button
              type="submit"
              disabled={submitting || !isSelectedOfficerAvailable}
              className={`px-6 h-11 rounded-xl font-extrabold text-xs shadow-lg transition-all active:scale-[0.99] flex items-center gap-1.5 ${
                isSelectedOfficerAvailable
                  ? 'bg-[#2e5746] hover:bg-[#244638] text-white shadow-[#2e5746]/20'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
              }`}
            >
              {submitting ? 'ASSIGNING...' : 'ASSIGN OFFICER'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
