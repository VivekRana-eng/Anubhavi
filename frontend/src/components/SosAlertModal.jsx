import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../context/WebSocketContext';
import OfficerAssignmentModal from './OfficerAssignmentModal';

export default function SosAlertModal() {
  const { activeAlert, userNotification, dismissAlert, dismissUserNotification } = useWebSocket();
  const navigate = useNavigate();
  const [accepting, setAccepting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAssignment, setShowAssignment] = useState(false);

  if (!activeAlert && userNotification?.event === 'NEW_ASSISTANCE_REQUEST') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/70 backdrop-blur-md p-spacing-md">
        <div className="w-full max-w-lg rounded-xl border-2 border-secondary bg-surface-container-lowest p-spacing-lg shadow-2xl">
          <div className="flex items-center gap-spacing-sm border-b border-surface-container-highest pb-spacing-sm">
            <span className="material-symbols-outlined text-secondary text-[32px]">emergency</span>
            <div><h2 className="font-headline-sm font-extrabold">🤝 NEW ASSISTANCE REQUEST</h2><p className="font-label-sm text-on-surface-variant">Immediate review required</p></div>
          </div>
          <div className="mt-spacing-md space-y-spacing-xs text-left font-body-sm text-on-surface">
            <p><strong>Senior Citizen:</strong> {userNotification.citizen_name || 'Senior Citizen'}</p>
            <p><strong>Request:</strong> {userNotification.request_type || 'General Assistance'}</p>
            <p><strong>Description:</strong> {userNotification.description || userNotification.message || 'Assistance requested'}</p>
            <p><strong>Location:</strong> {userNotification.location || 'Model Town Ward'}</p>
            {userNotification.meeting_date && <p><strong>Meeting Date:</strong> {userNotification.meeting_date}</p>}
          </div>
          <button onClick={dismissUserNotification} className="mt-spacing-md w-full rounded bg-primary py-spacing-xs font-label-lg font-bold text-on-primary">DISMISS</button>
        </div>
      </div>
    );
  }

  if (!activeAlert) return null;

  const handleAccept = async () => {
    setAccepting(true);
    if (activeAlert.local_demo) {
      setShowAssignment(true);
      setAccepting(false);
      setShowConfirm(false);
      return;
    }
    try {
      const res = await fetch(`/api/sos/${activeAlert.case_id}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('anubhavi_token')}`
        }
      });
      if (res.ok) {
        setShowConfirm(false);
        setShowAssignment(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAccepting(false);
      setShowConfirm(false);
    }
  };

  if (showAssignment) {
    return (
      <OfficerAssignmentModal
        caseId={activeAlert.case_id}
        emergencyType={activeAlert.emergency_type}
        location={activeAlert.location || activeAlert.location_address}
        onClose={() => {
          setShowAssignment(false);
          dismissAlert();
        }}
        onAssigned={() => {
          setShowAssignment(false);
          dismissAlert();
          navigate(`/sho/cases/${activeAlert.case_id}`);
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/70 backdrop-blur-md p-spacing-md animate-fade-in">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-xl shadow-2xl border-2 border-error overflow-hidden relative">
        {/* TOP FLASHING EMERGENCY STRIP */}
        <div className="bg-error text-on-error p-spacing-md flex items-center justify-between">
          <div className="flex items-center gap-spacing-xs">
            <span className="material-symbols-outlined text-[28px] animate-pulse">emergency</span>
            <div className="flex flex-col">
              <span className="font-headline-sm font-extrabold uppercase tracking-wider">🚨 NEW SOS EMERGENCY ALERT</span>
              <span className="font-label-sm text-on-error/80">Immediate Station Action Required</span>
            </div>
          </div>
          <span className="px-spacing-xs py-spacing-3xs rounded bg-surface-container-lowest text-error font-code-md font-bold">
            {activeAlert.sos_time || 'JUST NOW'}
          </span>
        </div>

        {/* ALERT BODY */}
        <div className="p-spacing-lg flex flex-col gap-spacing-md">
          <div className="flex items-center justify-between bg-error-container/40 p-spacing-sm rounded-lg border border-error-container">
            <div className="flex flex-col">
              <span className="font-label-sm text-on-error-container uppercase font-bold">Emergency Category</span>
              <span className="font-headline-md text-error font-extrabold">{activeAlert.emergency_type || 'Safety Emergency'}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="font-label-sm text-on-surface-variant uppercase">Case Reference</span>
              <span className="font-code-md text-on-surface font-bold">{activeAlert.case_id}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-spacing-sm bg-surface-container-low p-spacing-md rounded-lg">
            <div className="flex flex-col">
              <span className="font-label-sm text-on-surface-variant uppercase">Senior Citizen</span>
              <span className="font-headline-sm text-on-surface font-bold">{activeAlert.citizen_name || 'Rajesh Sharma'}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-on-surface-variant uppercase">Age / Gender</span>
              <span className="font-body-sm text-on-surface font-semibold">{activeAlert.citizen_age || 72} Yrs • Male</span>
            </div>
            <div className="flex flex-col col-span-2">
              <span className="font-label-sm text-on-surface-variant uppercase">Registered Location</span>
              <span className="font-body-sm text-on-surface font-semibold">{activeAlert.location || 'Model Town Phase 2, Ludhiana'}</span>
            </div>
            <div className="flex flex-col col-span-2">
              <span className="font-label-sm text-on-surface-variant uppercase">Citizen Contact</span>
              <span className="font-code-md text-primary font-bold">{activeAlert.citizen_mobile || '+91 98XXXXXX45'}</span>
            </div>
          </div>

          {showConfirm ? (
            <div className="bg-surface-container-high p-spacing-md rounded-lg flex flex-col gap-spacing-sm text-center">
              <span className="font-headline-sm text-on-surface font-bold">Accept this SOS Case?</span>
              <p className="font-body-sm text-on-surface-variant">
                Accepting will assign case ownership to Insp. Raj Kumar and initialize General Diary record.
              </p>
              <div className="flex items-center gap-spacing-sm pt-spacing-xs">
                <button
                  onClick={handleAccept}
                  disabled={accepting}
                  className="flex-1 py-spacing-xs bg-primary text-on-primary font-label-lg rounded font-bold hover:bg-on-surface transition-all shadow"
                >
                  {accepting ? 'ACCEPTING...' : 'YES, ACCEPT & CONTINUE'}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-spacing-md py-spacing-xs bg-surface-container text-on-surface font-label-lg rounded hover:bg-surface-container-highest"
                >
                  CANCEL
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-spacing-xs pt-spacing-xs">
              <button
                onClick={() => setShowAssignment(true)}
                className="flex-1 py-spacing-xs px-spacing-md bg-error text-on-error font-label-lg rounded font-bold shadow-lg hover:bg-error-container hover:text-on-error-container transition-all flex items-center justify-center gap-spacing-xs"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                ACCEPT CASE
              </button>

              <button
                onClick={() => {
                  dismissAlert();
                  navigate(`/sho/cases/${activeAlert.case_id}`);
                }}
                className="py-spacing-xs px-spacing-md bg-primary text-on-primary font-label-lg rounded font-bold shadow hover:bg-on-surface transition-all flex items-center justify-center gap-spacing-xs"
              >
                <span className="material-symbols-outlined text-[18px]">visibility</span>
                VIEW DETAILS
              </button>


            </div>
          )}
        </div>
      </div>
    </div>
  );
}
