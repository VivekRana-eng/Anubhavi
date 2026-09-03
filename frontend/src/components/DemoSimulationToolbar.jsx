import React, { useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';

export default function DemoSimulationToolbar({ onRefresh }) {
  const [collapsed, setCollapsed] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const { triggerLocalAlert } = useWebSocket();

  const handleTriggerSos = async () => {
    setTriggering(true);
    try {
      const res = await fetch('/api/sos/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizen_id: 'CIT-8841',
          emergency_type: 'Safety Emergency (Medical Fall)',
          location_address: 'H.No 412, Lane 4, Model Town Phase 2, Ludhiana'
        })
      });
      const data = await res.json();
      if (res.ok) {
        triggerLocalAlert({
          event: 'NEW_SOS_ALERT',
          case_id: data.case_id,
          citizen_name: 'Rajesh Sharma',
          citizen_age: 72,
          citizen_mobile: '+91 98721-XXXX5',
          emergency_type: 'Safety Emergency (Medical Fall)',
          location: 'H.No 412, Lane 4, Model Town Phase 2',
          sos_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        if (onRefresh) onRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTriggering(false);
    }
  };

  const handleFastForwardEscalation = async () => {
    try {
      const res = await fetch('/api/escalations/trigger-fastforward', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('anubhavi_token')}`
        }
      });
      const data = await res.json();
      alert(`⚠️ ESCALATION TEST: ${data.message}`);
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end">
      {collapsed ? (
        <button
          onClick={() => setCollapsed(false)}
          className="px-spacing-md py-spacing-xs bg-primary text-on-primary rounded-full shadow-lg font-label-sm font-bold flex items-center gap-spacing-xs hover:bg-on-surface transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">build</span>
          ANUBHAVI DEMO SUITE
        </button>
      ) : (
        <div className="bg-surface-container-lowest p-spacing-md rounded-xl shadow-2xl border-2 border-primary w-80 flex flex-col gap-spacing-sm animate-fade-in">
          <div className="flex items-center justify-between border-b border-surface-container-highest pb-spacing-xs">
            <div className="flex items-center gap-spacing-2xs">
              <span className="material-symbols-outlined text-primary text-[20px]">smart_toy</span>
              <span className="font-headline-sm text-on-surface font-bold">Interactive Demo Suite</span>
            </div>
            <button onClick={() => setCollapsed(true)} className="text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <p className="font-body-sm text-on-surface-variant">
            Simulate operational police triggers in real time:
          </p>

          <button
            onClick={handleTriggerSos}
            disabled={triggering}
            className="py-spacing-xs px-spacing-sm bg-error text-on-error rounded font-label-sm font-bold shadow hover:bg-error-container hover:text-on-error-container transition-all flex items-center justify-center gap-spacing-xs"
          >
            <span className="material-symbols-outlined text-[18px]">e911_emergency</span>
            {triggering ? 'TRIGGERING...' : '🚨 TRIGGER LIVE MOCK SOS'}
          </button>

          <button
            onClick={handleFastForwardEscalation}
            className="py-spacing-xs px-spacing-sm bg-error-container text-on-error-container rounded font-label-sm font-bold shadow hover:bg-error hover:text-on-error transition-all flex items-center justify-center gap-spacing-xs"
          >
            <span className="material-symbols-outlined text-[18px]">running_with_errors</span>
            ⚡ FAST-FORWARD 24H SLA ESCALATION
          </button>

          <button
            onClick={() => alert("📻 SIMULATED POLICE RADIO DISPATCH: 'PCR Van #04, respond to Model Town Phase 2 elder panic alert. Over.'")}
            className="py-spacing-xs px-spacing-sm bg-surface-container-high text-on-surface rounded font-label-sm font-bold shadow hover:bg-surface-container-highest transition-all flex items-center justify-center gap-spacing-xs"
          >
            <span className="material-symbols-outlined text-[18px]">radio</span>
            📻 SIMULATE OFFICER RADIO DISPATCH
          </button>

          <div className="text-[10px] text-on-surface-variant text-center pt-spacing-2xs border-t border-surface-container-highest">
            Model Town Police Station • SHO Test Terminal
          </div>
        </div>
      )}
    </div>
  );
}
