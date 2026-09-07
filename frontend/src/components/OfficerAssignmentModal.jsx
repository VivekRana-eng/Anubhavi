import React, { useState } from 'react';
import { useCommandStore } from '../context/CommandStoreContext';
import { useAuth } from '../context/AuthContext';

export default function OfficerAssignmentModal({
  caseId = 'SOS-2026-0001',
  caseData = null,
  emergencyType = 'Medical Emergency',
  location = 'Model Town',
  onClose,
  onAssigned
}) {
  const { user } = useAuth();
  const { cases, officers, assignOfficer, reassignOfficer } = useCommandStore();

  // Find target case from shared store if caseData not passed
  const activeCase = caseData || cases.find(c => c.id === caseId) || { id: caseId, location_address: location };

  const currentOfficer = activeCase.assignment_details?.officer_name || activeCase.assigned_officer_name || null;
  const currentOfficerRank = activeCase.assignment_details?.officer_rank || activeCase.assigned_officer_rank || 'Officer';
  const isReassignment = !!currentOfficer;

  // Manual Police Station state initialized to case's station or default
  const [policeStation, setPoliceStation] = useState(activeCase.police_station || 'Model Town Police Station');
  const [stationCode, setStationCode] = useState(activeCase.station_code || 'MTP-PS-01');
  const [selectedOfficerId, setSelectedOfficerId] = useState('');
  const [officerName, setOfficerName] = useState('');
  const [officerRank, setOfficerRank] = useState('');
  const [policeId, setPoliceId] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  const PRESET_STATIONS = [
    { name: 'Model Town Police Station', code: 'MTP-PS-01' },
    { name: 'Sector 17 Police Station', code: 'SEC17-PS-02' },
    { name: 'Phase 8 Police Station', code: 'PH8-PS-03' },
    { name: 'Central Police Station', code: 'CPS-04' },
    { name: 'North Zone Police Station', code: 'NZ-PS-05' },
    { name: 'South Zone Police Station', code: 'SZ-PS-06' }
  ];

  // Handle officer dropdown selection
  const handleSelectOfficer = (e) => {
    const offId = e.target.value;
    setSelectedOfficerId(offId);
    if (!offId) return;

    const found = officers.find(o => o.id === offId);
    if (found) {
      setOfficerName(found.name);
      setOfficerRank(found.rank);
      setPoliceId(found.id);
      setVehicle(found.vehicle);
      if (found.station_name) setPoliceStation(found.station_name);
      if (found.station_code) setStationCode(found.station_code);
    }
  };

  const handleAssignSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!policeStation.trim()) {
      setError('Please manually enter or select Police Station Name.');
      return;
    }

    if (!officerName.trim()) {
      setError('Please select or enter Officer Name.');
      return;
    }

    setSubmitting(true);
    setError('');

    const assignedRole = user?.role === 'DSP' ? 'DSP' : 'SHO';

    try {
      if (isReassignment) {
        // REASSIGN OFFICER
        const prevFull = `${currentOfficerRank ? currentOfficerRank + ' ' : ''}${currentOfficer}`;
        reassignOfficer({
          caseId: activeCase.id,
          citizenName: activeCase.citizen_name || 'Rajesh Sharma',
          previousOfficer: prevFull,
          newOfficerName: officerName,
          newOfficerRank: officerRank || 'Officer',
          newPoliceId: policeId || 'POL-102',
          newVehicle: vehicle || 'PCR Patrol Unit',
          stationName: policeStation,
          stationCode: stationCode,
          remarks: remarks || `Reassigned by ${assignedRole}`,
          assignedByRole: assignedRole
        });
        setSuccessMsg('✓ Officer reassigned successfully');
      } else {
        // ASSIGN OFFICER
        assignOfficer({
          caseId: activeCase.id,
          citizenName: activeCase.citizen_name || 'Rajesh Sharma',
          officerName: officerName,
          officerRank: officerRank || 'Officer',
          policeId: policeId || 'POL-101',
          vehicle: vehicle || 'PCR Patrol Unit',
          stationName: policeStation,
          stationCode: stationCode,
          remarks: remarks || `Assigned by ${assignedRole}`,
          assignedByRole: assignedRole
        });
        setSuccessMsg('✓ Officer assigned successfully');
      }

      setTimeout(() => {
        if (onAssigned) onAssigned();
        onClose();
      }, 1000);

    } catch (err) {
      setError('Officer assignment failed. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 selection:bg-[#2e5746] selection:text-white">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 animate-in fade-in duration-200 text-left">
        
        {/* MODAL HEADER */}
        <div className={`p-5 text-white flex items-center justify-between ${isReassignment ? 'bg-amber-800' : 'bg-[#2e5746]'}`}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[26px]">
              {isReassignment ? 'swap_horiz' : 'local_police'}
            </span>
            <div>
              <h3 className="text-base font-extrabold tracking-tight uppercase">
                {isReassignment ? 'REASSIGN RESPONSE OFFICER' : 'ASSIGN RESPONSE OFFICER'}
              </h3>
              <p className="text-xs text-emerald-100 font-medium">SOS CASE: {activeCase.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-emerald-100 hover:text-white text-xl p-1 rounded-lg cursor-pointer">
            ✕
          </button>
        </div>

        {/* MODAL FORM BODY */}
        <form onSubmit={handleAssignSubmit} className="p-6 max-h-[82vh] overflow-y-auto flex flex-col gap-4 text-left">
          
          {/* SUCCESS BANNER TOAST */}
          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-black flex items-center gap-2 animate-in fade-in duration-200 shadow-sm">
              <span className="material-symbols-outlined text-[20px] text-emerald-700">check_circle</span>
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          {/* REASSIGNMENT PREVIOUS OFFICER BANNER */}
          {isReassignment && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col gap-1 text-xs">
              <span className="font-extrabold uppercase text-[10px] text-amber-800 tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">history</span>
                CURRENTLY ASSIGNED OFFICER
              </span>
              <div className="flex items-center justify-between font-bold text-amber-950">
                <span className="text-sm">{currentOfficerRank} {currentOfficer}</span>
                <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px] uppercase font-black">REASSIGNING</span>
              </div>
            </div>
          )}

          {/* SOS CASE SUMMARY */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">SENIOR CITIZEN</span>
              <span className="text-xs font-black text-slate-800">{activeCase.citizen_name || 'Rajesh Sharma'}</span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">CASE LOCATION</span>
              <span className="text-xs font-black text-slate-800 truncate block">{activeCase.location_address || location}</span>
            </div>
          </div>

          {/* MANUAL POLICE STATION INPUT SECTION */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col gap-2">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#2e5746] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">domain</span>
                POLICE STATION (MANUAL INPUT & SELECTION) *
              </span>
              <span className="text-[10px] text-slate-500 font-bold">Type any station name</span>
            </label>

            <div className="relative flex items-center">
              <input
                type="text"
                value={policeStation}
                onChange={(e) => setPoliceStation(e.target.value)}
                placeholder="e.g. Model Town Police Station / Sector 17 PS"
                className="w-full h-11 pl-4 pr-10 bg-white border border-emerald-300 rounded-xl text-slate-900 font-extrabold text-xs focus:outline-none focus:border-[#2e5746] shadow-xs"
              />
              <span className="material-symbols-outlined absolute right-3.5 text-emerald-700 text-[18px] pointer-events-none">
                edit
              </span>
            </div>

          </div>

          {/* MANUAL / DETAILED OFFICER INPUT FIELDS */}
          <div className="p-4 rounded-2xl bg-white border border-slate-300 shadow-xs flex flex-col gap-3">
            <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 text-[#2e5746]">
              <span className="material-symbols-outlined text-[18px]">edit_note</span>
              <span className="text-xs font-black uppercase tracking-wider">MANUAL OFFICER DISPATCH DETAILS</span>
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
                  placeholder="e.g. Inspector Sharma / SI Verma"
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
                  placeholder="e.g. Inspector / Sub-Inspector"
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
                  placeholder="e.g. POL-1031"
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
                  placeholder="e.g. Patrol Jeep #01 / PCR Bike #12"
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-xs focus:bg-white focus:outline-none focus:border-[#2e5746]"
                />
              </div>
            </div>
          </div>

          {/* LIVE REASSIGNMENT PREVIEW COMPARISON STRIP */}
          {isReassignment && officerName ? (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-amber-700">REASSIGNMENT MAPPING</span>
                <span className="font-extrabold text-amber-950">
                  {currentOfficerRank} {currentOfficer} → <span className="text-emerald-700">{officerRank} {officerName}</span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Police Station: <strong className="text-[#2e5746]">{policeStation}</strong>
                </span>
              </div>
              <span className="material-symbols-outlined text-amber-600 text-[20px]">swap_horiz</span>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 flex items-center justify-between text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2e5746] text-[18px]">verified_user</span>
                <div className="flex flex-col">
                  <span className="font-extrabold text-slate-900">
                    {officerRank || 'Officer'} {officerName || 'Name'}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Station: <strong className="text-[#2e5746]">{policeStation || 'Police Station'}</strong>
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                READY FOR DISPATCH
              </span>
            </div>
          )}

          {/* REASON / ASSIGNMENT NOTE */}
          <div>
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 block">
              REASON / ASSIGNMENT NOTE
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Priority dispatch requested via DSP Directorate"
              className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium text-xs focus:outline-none focus:border-[#2e5746]"
            />
          </div>

          {/* BUTTON ACTIONS */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl transition-all cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={submitting || !!successMsg}
              className={`px-6 py-2.5 text-white text-xs font-extrabold rounded-xl shadow-lg transition-all flex items-center gap-2 uppercase tracking-wider cursor-pointer ${
                isReassignment ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#2e5746] hover:bg-[#244638]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isReassignment ? 'swap_horiz' : 'send'}
              </span>
              {submitting ? 'DISPATCHING...' : isReassignment ? 'REASSIGN OFFICER' : 'ASSIGN OFFICER'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
