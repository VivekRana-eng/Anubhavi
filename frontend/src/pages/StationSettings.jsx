import React, { useState } from 'react';

export default function StationSettings() {
  const [stationName, setStationName] = useState('Model Town Police Station');
  const [district, setDistrict] = useState('Central District, Ludhiana');
  const [slaHours, setSlaHours] = useState('24');
  const [sosSlaMins, setSosSlaMins] = useState('15');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-spacing-lg w-full">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg border border-surface-container-highest flex flex-col md:flex-row items-start md:items-center justify-between gap-spacing-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-spacing-xs">
            <span className="px-spacing-xs py-spacing-3xs rounded bg-primary-container text-on-primary font-label-sm uppercase font-bold">
              POLICE CONFIGURATION
            </span>
            <span className="font-code-md text-on-surface-variant font-bold">STATION SETTINGS</span>
          </div>
          <h1 className="font-headline-lg text-on-surface font-bold tracking-tight mt-1">
            Station Settings & SLA Emergency Thresholds
          </h1>
          <p className="font-body-sm text-on-surface-variant">
            Configure statutory 24-hour escalation parameters, station jurisdiction parameters, and emergency alerts.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg border border-surface-container-highest flex flex-col gap-spacing-md max-w-2xl">
        {saved && (
          <div className="p-spacing-sm bg-secondary-container text-on-secondary-container rounded font-label-sm font-bold">
            ✓ Station settings saved successfully.
          </div>
        )}

        <div className="flex flex-col gap-spacing-2xs">
          <label className="font-label-sm uppercase font-bold">Police Station Name</label>
          <input
            type="text"
            value={stationName}
            onChange={e => setStationName(e.target.value)}
            className="h-10 px-spacing-sm bg-surface-container-low border rounded font-body-sm text-on-surface"
          />
        </div>

        <div className="flex flex-col gap-spacing-2xs">
          <label className="font-label-sm uppercase font-bold">District & Zone</label>
          <input
            type="text"
            value={district}
            onChange={e => setDistrict(e.target.value)}
            className="h-10 px-spacing-sm bg-surface-container-low border rounded font-body-sm text-on-surface"
          />
        </div>

        <div className="grid grid-cols-2 gap-spacing-md">
          <div className="flex flex-col gap-spacing-2xs">
            <label className="font-label-sm uppercase font-bold">Statutory Escalation Threshold (Hours)</label>
            <input
              type="number"
              value={slaHours}
              onChange={e => setSlaHours(e.target.value)}
              className="h-10 px-spacing-sm bg-surface-container-low border rounded font-body-sm text-on-surface"
            />
            <span className="text-[11px] text-on-surface-variant">Administrative assistance 24h statutory rule</span>
          </div>

          <div className="flex flex-col gap-spacing-2xs">
            <label className="font-label-sm uppercase font-bold">Critical SOS Target SLA (Minutes)</label>
            <input
              type="number"
              value={sosSlaMins}
              onChange={e => setSosSlaMins(e.target.value)}
              className="h-10 px-spacing-sm bg-surface-container-low border rounded font-body-sm text-on-surface"
            />
            <span className="text-[11px] text-on-surface-variant">Target beat officer dispatch SLA</span>
          </div>
        </div>

        <button type="submit" className="py-spacing-xs bg-primary text-on-primary font-label-lg font-bold rounded shadow hover:bg-on-surface">
          SAVE STATION CONFIGURATION
        </button>
      </form>
    </div>
  );
}
