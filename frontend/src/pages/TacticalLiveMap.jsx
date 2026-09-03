import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TacticalLiveMap() {
  const [selectedPin, setSelectedPin] = useState(null);
  const navigate = useNavigate();

  const mapPins = [
    {
      id: 'ANB-SOS-2026-00124',
      type: 'SOS',
      title: '🚨 CRITICAL SOS: Rajesh Sharma (72y)',
      address: 'H.No 412, Lane 4, Model Town Phase 2',
      status: 'IN_PROGRESS',
      lat: 30.9010,
      lng: 75.8573,
      x: 55, // SVG grid percentages
      y: 42,
      officer: 'HC Raj Kumar (PCR Van #04)'
    },
    {
      id: 'CIT-8842',
      type: 'SENIOR',
      title: 'Sunita Devi (68y)',
      address: 'H.No 88, Block C, Model Town',
      status: 'SAFE',
      lat: 30.8995,
      lng: 75.8560,
      x: 35,
      y: 65
    },
    {
      id: 'CIT-8843',
      type: 'SENIOR',
      title: 'Mohan Lal (75y)',
      address: 'H.No 125, Sector 3, Model Town',
      status: 'MISSED_CHECKIN',
      lat: 30.9032,
      lng: 75.8590,
      x: 75,
      y: 25
    },
    {
      id: 'PS-MODEL-TOWN',
      type: 'STATION',
      title: 'Model Town Police Station (HQ)',
      address: 'Main Road, Ward Sector 1',
      status: 'HQ_ONLINE',
      x: 50,
      y: 50
    },
    {
      id: 'PCR-VAN-04',
      type: 'PATROL',
      title: 'PCR Van #04 (HC Raj Kumar)',
      address: 'En Route Phase 2',
      status: 'DISPATCHED',
      x: 52,
      y: 45
    }
  ];

  return (
    <div className="flex flex-col gap-spacing-lg w-full">
      {/* HEADER */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg border border-surface-container-highest flex flex-col md:flex-row items-start md:items-center justify-between gap-spacing-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-spacing-xs">
            <span className="px-spacing-xs py-spacing-3xs rounded bg-primary-container text-on-primary font-label-sm uppercase font-bold">
              GIS COMMAND GRID
            </span>
            <span className="font-code-md text-on-surface-variant font-bold">LIVE MAP TELEMETRY</span>
          </div>
          <h1 className="font-headline-lg text-on-surface font-bold tracking-tight mt-1">
            Tactical GIS Beat & SOS Live Map
          </h1>
          <p className="font-body-sm text-on-surface-variant">
            Geospatial tracking of senior residents, active SOS panic triggers, PCR patrol vans, and ward sector boundaries.
          </p>
        </div>

        <div className="flex items-center gap-spacing-xs">
          <span className="px-spacing-sm py-spacing-2xs rounded bg-surface-container-low border font-label-sm text-on-surface font-semibold">
            🟢 Cell Tower Triangulation + GPS Sync Active
          </span>
        </div>
      </div>

      {/* MAP CANVAS CONTAINER */}
      <div className="relative w-full h-[600px] bg-[#1e293b] rounded-xl overflow-hidden shadow-xl border-2 border-surface-container-highest">
        {/* GRID OVERLAY SIMULATION */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        ></div>

        {/* MAP BACKGROUND VECTOR PATHS (LUDHIANA BEAT SECTORS) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          {/* Roads & Sectors */}
          <path d="M 0 300 Q 400 250 1000 350" stroke="#334155" strokeWidth="12" fill="none" />
          <path d="M 500 0 Q 520 300 480 600" stroke="#334155" strokeWidth="10" fill="none" />
          <path d="M 100 100 L 900 500" stroke="#1e293b" strokeWidth="6" strokeDasharray="8 8" fill="none" />

          {/* Sector Boundary Geo-fence */}
          <rect x="20%" y="15%" width="60%" height="70%" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4" />
          <text x="22%" y="19%" fill="#38bdf8" fontSize="11" fontFamily="Public Sans" fontWeight="bold" opacity="0.6">
            MODEL TOWN PS BEAT SECTOR 3 JURISDICTION (GEO-FENCE ACTIVE)
          </text>
        </svg>

        {/* INTERACTIVE MAP PINS */}
        {mapPins.map((pin) => (
          <div
            key={pin.id}
            onClick={() => setSelectedPin(pin)}
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
          >
            {pin.type === 'SOS' && (
              <div className="relative flex items-center justify-center">
                <span className="w-10 h-10 rounded-full bg-error/40 animate-ping absolute"></span>
                <div className="w-10 h-10 rounded-full bg-error text-on-error flex items-center justify-center shadow-lg border-2 border-white">
                  <span className="material-symbols-outlined text-[20px]">fmd_bad</span>
                </div>
              </div>
            )}

            {pin.type === 'SENIOR' && (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md border-2 border-white text-white ${
                pin.status === 'MISSED_CHECKIN' ? 'bg-error' : 'bg-secondary'
              }`}>
                <span className="material-symbols-outlined text-[16px]">elderly</span>
              </div>
            )}

            {pin.type === 'STATION' && (
              <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center shadow-xl border-2 border-amber-400">
                <span className="material-symbols-outlined text-[22px]">local_police</span>
              </div>
            )}

            {pin.type === 'PATROL' && (
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
                <span className="material-symbols-outlined text-[16px]">directions_car</span>
              </div>
            )}

            {/* PIN HOVER TOOLTIP */}
            <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-md pointer-events-none">
              {pin.title}
            </div>
          </div>
        ))}

        {/* SELECTED PIN POPUP MODAL ON MAP */}
        {selectedPin && (
          <div className="absolute top-4 left-4 z-30 bg-slate-900/90 text-white backdrop-blur-md p-spacing-md rounded-xl border border-slate-700 w-80 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-700 pb-spacing-xs">
              <span className="font-headline-sm font-bold text-amber-400">{selectedPin.title}</span>
              <button onClick={() => setSelectedPin(null)} className="text-slate-400 hover:text-white">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="py-spacing-sm flex flex-col gap-spacing-2xs text-xs">
              <span className="text-slate-300">Location: {selectedPin.address}</span>
              <span className="text-slate-300">Status: <strong className="text-white">{selectedPin.status}</strong></span>
              {selectedPin.officer && <span className="text-amber-300">Officer Assigned: {selectedPin.officer}</span>}
            </div>

            <div className="flex items-center gap-spacing-xs pt-spacing-xs">
              {selectedPin.type === 'SOS' && (
                <button
                  onClick={() => navigate(`/sho/cases/${selectedPin.id}`)}
                  className="flex-1 py-spacing-2xs bg-red-600 text-white rounded font-bold hover:bg-red-700 transition-colors"
                >
                  OPEN CASE FILE
                </button>
              )}

              <button
                onClick={() => alert(`Directions calculated to ${selectedPin.address} (3.2 km, approx 4 mins)`)}
                className="py-spacing-2xs px-spacing-sm bg-slate-700 text-white rounded font-bold hover:bg-slate-600"
              >
                GET DIRECTIONS
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
