import React, { createContext, useContext, useEffect, useState } from 'react';

const CommandStoreContext = createContext();

// 20 Initial SOS cases distributed across 6 Police Stations
export const INITIAL_CASES = [
  {
    id: "ANB-SOS-2026-90412",
    citizen_name: "Rajesh Sharma",
    citizen_age: 72,
    citizen_mobile: "+91 98721-00214",
    emergency_type: "Medical Emergency",
    location_address: "H.No 412, Lane 4, Model Town Phase 2, Ludhiana",
    created_at: "2026-09-07 15:45:10",
    police_station: "Model Town Police Station",
    station_code: "MTP-PS-01",
    assigned_officer_name: "ASI Amit Singh",
    assigned_officer_rank: "Assistant Sub-Inspector",
    status: "ASSIGNED",
    assignment_details: {
      police_station: "Model Town Police Station",
      station_code: "MTP-PS-01",
      officer_name: "ASI Amit Singh",
      officer_rank: "Assistant Sub-Inspector",
      police_id: "POL-1025",
      vehicle: "PCR Bike #12",
      remarks: "Dispatched for cardiac emergency",
      assigned_at: "15:46 PM",
      assigned_by: "DSP"
    }
  },
  {
    id: "SOS-2026-0001",
    citizen_name: "Rajesh Sharma",
    citizen_age: 72,
    citizen_mobile: "+91 98721-00214",
    emergency_type: "Medical Emergency",
    location_address: "H.No 412, Lane 4, Model Town Phase 2, Ludhiana",
    created_at: "2026-09-07 14:10:00",
    police_station: "Model Town Police Station",
    station_code: "MTP-PS-01",
    assigned_officer_name: "ASI Amit Singh",
    assigned_officer_rank: "Assistant Sub-Inspector",
    status: "ASSIGNED",
    assignment_details: {
      police_station: "Model Town Police Station",
      station_code: "MTP-PS-01",
      officer_name: "ASI Amit Singh",
      officer_rank: "Assistant Sub-Inspector",
      police_id: "POL-1025",
      vehicle: "PCR Bike #12",
      remarks: "First responder unit dispatched",
      assigned_at: "14:12 PM",
      assigned_by: "DSP"
    }
  },
  {
    id: "SOS-2026-0002",
    citizen_name: "Sunita Devi",
    citizen_age: 68,
    citizen_mobile: "+91 97812-33412",
    emergency_type: "Women Safety",
    location_address: "Flat 302, Block B, Sector 17, Chandigarh",
    created_at: "2026-09-07 13:50:00",
    police_station: "Sector 17 Police Station",
    station_code: "SEC17-PS-02",
    status: "ACTIVE"
  },
  {
    id: "SOS-2026-0003",
    citizen_name: "Mohan Lal",
    citizen_age: 75,
    citizen_mobile: "+91 99145-88210",
    emergency_type: "Senior Citizen Assistance",
    location_address: "House 125, Phase 8, Mohali",
    created_at: "2026-09-07 12:30:00",
    police_station: "Phase 8 Police Station",
    station_code: "PH8-PS-03",
    assigned_officer_name: "HC Raj Kumar",
    assigned_officer_rank: "Head Constable",
    status: "ACKNOWLEDGED",
    assignment_details: {
      police_station: "Phase 8 Police Station",
      station_code: "PH8-PS-03",
      officer_name: "HC Raj Kumar",
      officer_rank: "Head Constable",
      police_id: "POL-1024",
      vehicle: "PCR Van #04",
      assigned_at: "12:32 PM",
      assigned_by: "SHO"
    }
  },
  {
    id: "SOS-2026-0004",
    citizen_name: "Kamla Sharma",
    citizen_age: 70,
    citizen_mobile: "+91 96461-44912",
    emergency_type: "Harassment",
    location_address: "88 Commercial Complex, Central Bazaar",
    created_at: "2026-09-07 11:15:00",
    police_station: "Central Police Station",
    station_code: "CPS-04",
    assigned_officer_name: "Const. Vikram Sharma",
    assigned_officer_rank: "Constable",
    status: "OFFICER DISPATCHED",
    assignment_details: {
      police_station: "Central Police Station",
      station_code: "CPS-04",
      officer_name: "Const. Vikram Sharma",
      officer_rank: "Constable",
      police_id: "POL-1026",
      vehicle: "PCR Van #02",
      assigned_at: "11:18 AM",
      assigned_by: "DSP"
    }
  },
  {
    id: "SOS-2026-0005",
    citizen_name: "Harish Kumar",
    citizen_age: 74,
    citizen_mobile: "+91 98881-22901",
    emergency_type: "Accident",
    location_address: "GT Road Crossing, North Zone Sector 4",
    created_at: "2026-09-07 10:40:00",
    police_station: "North Zone Police Station",
    station_code: "NZ-PS-05",
    assigned_officer_name: "SI Rahul Verma",
    assigned_officer_rank: "Sub-Inspector",
    status: "ON THE WAY",
    assignment_details: {
      police_station: "North Zone Police Station",
      station_code: "NZ-PS-05",
      officer_name: "SI Rahul Verma",
      officer_rank: "Sub-Inspector",
      police_id: "POL-1028",
      vehicle: "PCR Car #03",
      assigned_at: "10:42 AM",
      assigned_by: "DSP"
    }
  },
  {
    id: "SOS-2026-0006",
    citizen_name: "Prem Prakash",
    citizen_age: 78,
    citizen_mobile: "+91 98140-55123",
    emergency_type: "General Emergency",
    location_address: "45 Park Avenue, South Zone",
    created_at: "2026-09-07 09:20:00",
    police_station: "South Zone Police Station",
    station_code: "SZ-PS-06",
    assigned_officer_name: "HC Manpreet Singh",
    assigned_officer_rank: "Head Constable",
    status: "ARRIVED",
    assignment_details: {
      police_station: "South Zone Police Station",
      station_code: "SZ-PS-06",
      officer_name: "HC Manpreet Singh",
      officer_rank: "Head Constable",
      police_id: "POL-1029",
      vehicle: "PCR Van #09",
      assigned_at: "09:22 AM",
      assigned_by: "SHO"
    }
  },
  {
    id: "SOS-2026-0007",
    citizen_name: "Gurdev Singh",
    citizen_age: 81,
    citizen_mobile: "+91 94172-66301",
    emergency_type: "Missing Person",
    location_address: "Sector 3 Main Gate, Model Town",
    created_at: "2026-09-06 21:00:00",
    police_station: "Model Town Police Station",
    station_code: "MTP-PS-01",
    assigned_officer_name: "ASI Amit Singh",
    assigned_officer_rank: "Assistant Sub-Inspector",
    status: "RESOLVED",
    assignment_details: {
      police_station: "Model Town Police Station",
      station_code: "MTP-PS-01",
      officer_name: "ASI Amit Singh",
      officer_rank: "Assistant Sub-Inspector",
      police_id: "POL-1025",
      vehicle: "PCR Bike #12"
    }
  },
  {
    id: "SOS-2026-0008",
    citizen_name: "Vidya Wanti",
    citizen_age: 76,
    citizen_mobile: "+91 98150-11234",
    emergency_type: "Medical Emergency",
    location_address: "Villa 12, Sector 17",
    created_at: "2026-09-06 16:30:00",
    police_station: "Sector 17 Police Station",
    station_code: "SEC17-PS-02",
    status: "CANCELLED"
  },
  {
    id: "SOS-2026-0009",
    citizen_name: "Baldev Raj",
    citizen_age: 73,
    citizen_mobile: "+91 98760-44321",
    emergency_type: "Medical Emergency",
    location_address: "104 Rosewood Enclave, Phase 8",
    created_at: "2026-09-06 14:15:00",
    police_station: "Phase 8 Police Station",
    station_code: "PH8-PS-03",
    assigned_officer_name: "HC Raj Kumar",
    assigned_officer_rank: "Head Constable",
    status: "ASSIGNED",
    assignment_details: {
      police_station: "Phase 8 Police Station",
      station_code: "PH8-PS-03",
      officer_name: "HC Raj Kumar",
      officer_rank: "Head Constable",
      police_id: "POL-1024",
      vehicle: "PCR Van #04"
    }
  },
  {
    id: "SOS-2026-0010",
    citizen_name: "Asha Rani",
    citizen_age: 69,
    citizen_mobile: "+91 98111-77890",
    emergency_type: "Women Safety",
    location_address: "Central Mall Parking Level 2",
    created_at: "2026-09-05 11:20:00",
    police_station: "Central Police Station",
    station_code: "CPS-04",
    status: "ACTIVE"
  },
  {
    id: "SOS-2026-0011",
    citizen_name: "Ramesh Chander",
    citizen_age: 77,
    citizen_mobile: "+91 98888-33210",
    emergency_type: "Senior Citizen Assistance",
    location_address: "North Zone Community Hall",
    created_at: "2026-09-05 09:40:00",
    police_station: "North Zone Police Station",
    station_code: "NZ-PS-05",
    status: "ACKNOWLEDGED"
  },
  {
    id: "SOS-2026-0012",
    citizen_name: "Savitri Devi",
    citizen_age: 82,
    citizen_mobile: "+91 94170-99887",
    emergency_type: "Harassment",
    location_address: "219 Officers Colony, South Zone",
    created_at: "2026-09-04 18:10:00",
    police_station: "South Zone Police Station",
    station_code: "SZ-PS-06",
    assigned_officer_name: "HC Manpreet Singh",
    assigned_officer_rank: "Head Constable",
    status: "RESOLVED"
  },
  {
    id: "SOS-2026-0013",
    citizen_name: "Tilak Raj",
    citizen_age: 79,
    citizen_mobile: "+91 98720-11223",
    emergency_type: "General Emergency",
    location_address: "House 50, Model Town Extension",
    created_at: "2026-09-04 15:25:00",
    police_station: "Model Town Police Station",
    station_code: "MTP-PS-01",
    assigned_officer_name: "ASI Amit Singh",
    assigned_officer_rank: "Assistant Sub-Inspector",
    status: "ASSIGNED",
    assignment_details: {
      police_station: "Model Town Police Station",
      station_code: "MTP-PS-01",
      officer_name: "ASI Amit Singh",
      officer_rank: "Assistant Sub-Inspector",
      police_id: "POL-1025",
      vehicle: "PCR Bike #12"
    }
  },
  {
    id: "SOS-2026-0014",
    citizen_name: "Santosh Kumari",
    citizen_age: 71,
    citizen_mobile: "+91 98141-88765",
    emergency_type: "Accident",
    location_address: "Sector 17 Bus Stand Junction",
    created_at: "2026-09-03 13:00:00",
    police_station: "Sector 17 Police Station",
    station_code: "SEC17-PS-02",
    assigned_officer_name: "HC Raj Kumar",
    assigned_officer_rank: "Head Constable",
    status: "OFFICER DISPATCHED"
  },
  {
    id: "SOS-2026-0015",
    citizen_name: "Swaran Singh",
    citizen_age: 85,
    citizen_mobile: "+91 99140-55443",
    emergency_type: "Medical Emergency",
    location_address: "Phase 8 Industrial Area Gate 1",
    created_at: "2026-09-02 10:15:00",
    police_station: "Phase 8 Police Station",
    station_code: "PH8-PS-03",
    assigned_officer_name: "SI Rahul Verma",
    assigned_officer_rank: "Sub-Inspector",
    status: "ON THE WAY"
  },
  {
    id: "SOS-2026-0016",
    citizen_name: "Krishna Gopal",
    citizen_age: 73,
    citizen_mobile: "+91 98765-12345",
    emergency_type: "Missing Person",
    location_address: "Railway Station Exit 3, Central",
    created_at: "2026-09-01 08:45:00",
    police_station: "Central Police Station",
    station_code: "CPS-04",
    assigned_officer_name: "Const. Vikram Sharma",
    assigned_officer_rank: "Constable",
    status: "ARRIVED"
  },
  {
    id: "SOS-2026-0017",
    citizen_name: "Pushpa Rani",
    citizen_age: 67,
    citizen_mobile: "+91 98112-66554",
    emergency_type: "Women Safety",
    location_address: "North Zone Bypass Road",
    created_at: "2026-08-30 23:10:00",
    police_station: "North Zone Police Station",
    station_code: "NZ-PS-05",
    assigned_officer_name: "SI Neeraj Kumar",
    assigned_officer_rank: "Sub-Inspector",
    status: "RESOLVED"
  },
  {
    id: "SOS-2026-0018",
    citizen_name: "Joginder Pal",
    citizen_age: 80,
    citizen_mobile: "+91 94171-33221",
    emergency_type: "Senior Citizen Assistance",
    location_address: "12 South Zone Green Park",
    created_at: "2026-08-28 14:00:00",
    police_station: "South Zone Police Station",
    station_code: "SZ-PS-06",
    status: "CANCELLED"
  },
  {
    id: "SOS-2026-0019",
    citizen_name: "Darshan Lal",
    citizen_age: 76,
    citizen_mobile: "+91 98722-88990",
    emergency_type: "Medical Emergency",
    location_address: "Model Town Phase 3 Market",
    created_at: "2026-08-25 11:30:00",
    police_station: "Model Town Police Station",
    station_code: "MTP-PS-01",
    assigned_officer_name: "HC Raj Kumar",
    assigned_officer_rank: "Head Constable",
    status: "ACTIVE"
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "NOT-SYS-001",
    type: "OFFICER_ASSIGNED",
    title: "Officer Assigned",
    message: "DSP assigned ASI Amit Singh to SOS-2026-0001 at Model Town Police Station.",
    recipientRole: "SHO",
    stationId: "MTP-PS-01",
    police_station: "Model Town Police Station",
    caseId: "SOS-2026-0001",
    officer_name: "ASI Amit Singh",
    officer_rank: "Assistant Sub-Inspector",
    police_id: "POL-1025",
    vehicle: "PCR Bike #12",
    createdAt: new Date().toISOString(),
    time: "10 mins ago",
    read: false,
    priority: "HIGH"
  },
  {
    id: "NOT-SYS-002",
    type: "OFFICER_REASSIGNED",
    title: "Officer Reassigned",
    message: "DSP reassigned SOS-2026-0004 from Const. Vikram Sharma to SI Neeraj Kumar.",
    recipientRole: "SHO",
    stationId: "CPS-04",
    police_station: "Central Police Station",
    caseId: "SOS-2026-0004",
    previousOfficer: "Const. Vikram Sharma",
    newOfficer: "SI Neeraj Kumar",
    createdAt: new Date().toISOString(),
    time: "25 mins ago",
    read: false,
    priority: "HIGH"
  },
  {
    id: "NOT-SYS-003",
    type: "STATUS_UPDATED",
    title: "Case Status Updated",
    message: "SHO Model Town updated SOS-2026-0001 status to 'On Site'.",
    recipientRole: "DSP",
    stationId: "MTP-PS-01",
    police_station: "Model Town Police Station",
    caseId: "SOS-2026-0001",
    createdAt: new Date().toISOString(),
    time: "40 mins ago",
    read: false,
    priority: "MEDIUM"
  }
];

export const INITIAL_ACTIVITY_LOGS = [
  {
    id: "LOG-101",
    timestamp: "14:12 PM",
    dateText: "Today",
    message: "DSP assigned ASI Amit Singh to SOS-2026-0001 at Model Town Police Station.",
    caseId: "SOS-2026-0001",
    stationName: "Model Town Police Station",
    type: "ASSIGNMENT"
  },
  {
    id: "LOG-102",
    timestamp: "11:18 AM",
    dateText: "Today",
    message: "DSP assigned Const. Vikram Sharma to SOS-2026-0004 at Central Police Station.",
    caseId: "SOS-2026-0004",
    stationName: "Central Police Station",
    type: "ASSIGNMENT"
  },
  {
    id: "LOG-103",
    timestamp: "10:42 AM",
    dateText: "Today",
    message: "DSP reassigned SOS-2026-0005 from ASI Amit Singh to SI Rahul Verma.",
    caseId: "SOS-2026-0005",
    stationName: "North Zone Police Station",
    type: "REASSIGNMENT"
  },
  {
    id: "LOG-104",
    timestamp: "09:22 AM",
    dateText: "Today",
    message: "SHO Model Town marked SOS-2026-0006 status as 'Arrived'.",
    caseId: "SOS-2026-0006",
    stationName: "South Zone Police Station",
    type: "STATUS_UPDATE"
  }
];

export const POLICE_OFFICERS_ROSTER = [
  { id: "POL-1025", name: "ASI Amit Singh", rank: "Assistant Sub-Inspector", station_code: "MTP-PS-01", station_name: "Model Town Police Station", vehicle: "PCR Bike #12", mobile: "+91 98721-44102", status: "AVAILABLE" },
  { id: "POL-1024", name: "HC Raj Kumar", rank: "Head Constable", station_code: "MTP-PS-01", station_name: "Model Town Police Station", vehicle: "PCR Van #04", mobile: "+91 98140-99812", status: "AVAILABLE" },
  { id: "POL-1027", name: "SI Neeraj Kumar", rank: "Sub-Inspector", station_code: "MTP-PS-01", station_name: "Model Town Police Station", vehicle: "PCR Car #01", mobile: "+91 98112-77123", status: "AVAILABLE" },
  { id: "POL-1026", name: "Const. Vikram Sharma", rank: "Constable", station_code: "CPS-04", station_name: "Central Police Station", vehicle: "PCR Van #02", mobile: "+91 98112-99124", status: "ON_DUTY" },
  { id: "POL-1028", name: "SI Rahul Verma", rank: "Sub-Inspector", station_code: "NZ-PS-05", station_name: "North Zone Police Station", vehicle: "PCR Car #03", mobile: "+91 98112-33445", status: "AVAILABLE" },
  { id: "POL-1029", name: "HC Manpreet Singh", rank: "Head Constable", station_code: "SZ-PS-06", station_name: "South Zone Police Station", vehicle: "PCR Van #09", mobile: "+91 98112-55667", status: "AVAILABLE" },
  { id: "POL-1030", name: "SI Verma", rank: "Sub-Inspector", station_code: "MTP-PS-01", station_name: "Model Town Police Station", vehicle: "PCR Car #05", mobile: "+91 98112-88990", status: "AVAILABLE" },
  { id: "POL-1031", name: "Inspector Sharma", rank: "Inspector", station_code: "MTP-PS-01", station_name: "Model Town Police Station", vehicle: "Patrol Jeep #01", mobile: "+91 98112-11223", status: "AVAILABLE" }
];

export const CommandStoreProvider = ({ children }) => {
  // 1. SHARED CASES STATE
  const [cases, setCases] = useState(() => {
    try {
      const stored = localStorage.getItem('anubhavi_shared_cases');
      return stored ? JSON.parse(stored) : INITIAL_CASES;
    } catch {
      return INITIAL_CASES;
    }
  });

  // 2. SHARED NOTIFICATIONS STATE
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem('anubhavi_shared_notifications');
      return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // 3. SHARED ACTIVITY LOGS STATE
  const [activityLogs, setActivityLogs] = useState(() => {
    try {
      const stored = localStorage.getItem('anubhavi_shared_activity_logs');
      return stored ? JSON.parse(stored) : INITIAL_ACTIVITY_LOGS;
    } catch {
      return INITIAL_ACTIVITY_LOGS;
    }
  });

  // Synchronize memory state to localStorage & broadcast event
  const saveStateToStorage = (updatedCases, updatedNotifications, updatedLogs) => {
    try {
      if (updatedCases) {
        localStorage.setItem('anubhavi_shared_cases', JSON.stringify(updatedCases));
      }
      if (updatedNotifications) {
        localStorage.setItem('anubhavi_shared_notifications', JSON.stringify(updatedNotifications));
      }
      if (updatedLogs) {
        localStorage.setItem('anubhavi_shared_activity_logs', JSON.stringify(updatedLogs));
      }
      window.dispatchEvent(new Event('anubhavi_store_changed'));
    } catch (e) {
      console.error('Storage Save Error:', e);
    }
  };

  // Cross-tab and window event listener for real-time sync
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'anubhavi_shared_cases' && e.newValue) {
        try { setCases(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === 'anubhavi_shared_notifications' && e.newValue) {
        try { setNotifications(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === 'anubhavi_shared_activity_logs' && e.newValue) {
        try { setActivityLogs(JSON.parse(e.newValue)); } catch {}
      }
    };

    const handleLocalCustomEvent = () => {
      try {
        const storedCases = localStorage.getItem('anubhavi_shared_cases');
        if (storedCases) setCases(JSON.parse(storedCases));

        const storedNotifs = localStorage.getItem('anubhavi_shared_notifications');
        if (storedNotifs) setNotifications(JSON.parse(storedNotifs));

        const storedLogs = localStorage.getItem('anubhavi_shared_activity_logs');
        if (storedLogs) setActivityLogs(JSON.parse(storedLogs));
      } catch (e) {}
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('anubhavi_store_changed', handleLocalCustomEvent);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('anubhavi_store_changed', handleLocalCustomEvent);
    };
  }, []);

  // ----------------------------------------------------------------------
  // ACTION 1: DSP → SHO ASSIGN OFFICER
  // ----------------------------------------------------------------------
  const assignOfficer = ({
    caseId,
    officerName,
    officerRank,
    policeId = 'POL-101',
    vehicle = 'PCR Patrol Unit',
    stationName = 'Model Town Police Station',
    stationCode = 'MTP-PS-01',
    remarks = 'Assigned via DSP Command Console',
    assignedByRole = 'DSP'
  }) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fullOfficerName = `${officerRank ? officerRank + ' ' : ''}${officerName}`;

    // 1. Update Case in Shared Cases
    const updatedCases = cases.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          status: 'ASSIGNED',
          police_station: stationName,
          station_code: stationCode,
          assigned_officer_name: officerName,
          assigned_officer_rank: officerRank || 'Officer',
          assignment_details: {
            police_station: stationName,
            station_code: stationCode,
            officer_name: officerName,
            officer_rank: officerRank || 'Officer',
            police_id: policeId,
            vehicle: vehicle,
            remarks: remarks,
            assigned_at: timeNow,
            assigned_by: assignedByRole
          }
        };
      }
      return c;
    });

    // 2. Create SHO Notification
    const newNotif = {
      id: `NOT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: 'OFFICER_ASSIGNED',
      title: 'Officer Assigned',
      message: `${assignedByRole} assigned ${fullOfficerName} to ${caseId} at ${stationName}.`,
      recipientRole: 'SHO',
      stationId: stationCode,
      police_station: stationName,
      caseId: caseId,
      officer_name: officerName,
      officer_rank: officerRank || 'Officer',
      police_id: policeId,
      vehicle: vehicle,
      createdAt: new Date().toISOString(),
      time: 'Just Now',
      read: false,
      priority: 'HIGH'
    };

    const updatedNotifs = [newNotif, ...notifications];

    // 3. Create DSP Activity Log
    const newLog = {
      id: `LOG-${Date.now()}`,
      timestamp: timeNow,
      dateText: 'Today',
      message: `${assignedByRole} assigned ${fullOfficerName} to ${caseId} at ${stationName}.`,
      caseId: caseId,
      stationName: stationName,
      type: 'ASSIGNMENT'
    };

    const updatedLogs = [newLog, ...activityLogs];

    // 4. Update Memory State & Save
    setCases(updatedCases);
    setNotifications(updatedNotifs);
    setActivityLogs(updatedLogs);
    saveStateToStorage(updatedCases, updatedNotifs, updatedLogs);
    window.dispatchEvent(new CustomEvent('anubhavi_new_toast_notification', { detail: newNotif }));

    // Optional API Sync
    fetch(`/api/sos/${caseId}/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('anubhavi_token')}`
      },
      body: JSON.stringify({
        officer_id: policeId,
        police_station: stationName,
        station_code: stationCode,
        assigned_vehicle: vehicle,
        remarks: remarks,
        sho_name: assignedByRole === 'DSP' ? 'DSP Harpreet Singh' : 'Insp. Raj Kumar'
      })
    }).catch(err => console.warn('Offline mode assignment saved locally.', err));

    return { caseId, officerName, status: 'ASSIGNED' };
  };

  // ----------------------------------------------------------------------
  // ACTION 2: DSP → SHO REASSIGN OFFICER
  // ----------------------------------------------------------------------
  const reassignOfficer = ({
    caseId,
    previousOfficer = 'Previous Officer',
    newOfficerName,
    newOfficerRank,
    newPoliceId = 'POL-102',
    newVehicle = 'PCR Unit',
    stationName = 'Model Town Police Station',
    stationCode = 'MTP-PS-01',
    remarks = 'Reassigned via DSP Command Console',
    assignedByRole = 'DSP'
  }) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fullNewOfficerName = `${newOfficerRank ? newOfficerRank + ' ' : ''}${newOfficerName}`;

    // 1. Update Case in Shared Cases
    const updatedCases = cases.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          status: 'ASSIGNED',
          assigned_officer_name: newOfficerName,
          assigned_officer_rank: newOfficerRank || 'Officer',
          assignment_details: {
            police_station: stationName,
            station_code: stationCode,
            officer_name: newOfficerName,
            officer_rank: newOfficerRank || 'Officer',
            police_id: newPoliceId,
            vehicle: newVehicle,
            remarks: remarks,
            previous_officer: previousOfficer,
            assigned_at: timeNow,
            assigned_by: assignedByRole
          }
        };
      }
      return c;
    });

    // 2. Create SHO Reassignment Notification
    const newNotif = {
      id: `NOT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: 'OFFICER_REASSIGNED',
      title: 'Officer Reassigned',
      message: `DSP reassigned ${caseId} from ${previousOfficer} to ${fullNewOfficerName}.`,
      previousOfficer: previousOfficer,
      newOfficer: fullNewOfficerName,
      recipientRole: 'SHO',
      stationId: stationCode,
      police_station: stationName,
      caseId: caseId,
      officer_name: newOfficerName,
      officer_rank: newOfficerRank || 'Officer',
      police_id: newPoliceId,
      vehicle: newVehicle,
      createdAt: new Date().toISOString(),
      time: 'Just Now',
      read: false,
      priority: 'HIGH'
    };

    const updatedNotifs = [newNotif, ...notifications];

    // 3. Create DSP Activity Log
    const newLog = {
      id: `LOG-${Date.now()}`,
      timestamp: timeNow,
      dateText: 'Today',
      message: `${assignedByRole} reassigned ${caseId} from ${previousOfficer} to ${fullNewOfficerName}.`,
      caseId: caseId,
      stationName: stationName,
      type: 'REASSIGNMENT'
    };

    const updatedLogs = [newLog, ...activityLogs];

    // 4. Update Memory State & Save
    setCases(updatedCases);
    setNotifications(updatedNotifs);
    setActivityLogs(updatedLogs);
    saveStateToStorage(updatedCases, updatedNotifs, updatedLogs);
    window.dispatchEvent(new CustomEvent('anubhavi_new_toast_notification', { detail: newNotif }));

    return { caseId, previousOfficer, newOfficerName, status: 'ASSIGNED' };
  };

  // ----------------------------------------------------------------------
  // ACTION 3: SHO → DSP STATUS UPDATE
  // ----------------------------------------------------------------------
  const updateCaseStatus = ({
    caseId,
    newStatus,
    notes = '',
    updatedByRole = 'SHO',
    updatedByName = 'Insp. Raj Kumar'
  }) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let targetStation = 'Model Town Police Station';
    let targetCode = 'MTP-PS-01';

    const updatedCases = cases.map(c => {
      if (c.id === caseId) {
        targetStation = c.police_station || targetStation;
        targetCode = c.station_code || targetCode;
        return { ...c, status: newStatus };
      }
      return c;
    });

    // Create DSP Notification & Log
    const newNotif = {
      id: `NOT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: 'STATUS_UPDATED',
      title: 'Case Status Updated',
      message: `${updatedByName} (${updatedByRole}) marked ${caseId} as "${newStatus}".`,
      recipientRole: 'DSP',
      stationId: targetCode,
      police_station: targetStation,
      caseId: caseId,
      newStatus: newStatus,
      createdAt: new Date().toISOString(),
      time: 'Just Now',
      read: false,
      priority: 'MEDIUM'
    };

    const newLog = {
      id: `LOG-${Date.now()}`,
      timestamp: timeNow,
      dateText: 'Today',
      message: `${updatedByRole} updated ${caseId} status to "${newStatus}".`,
      caseId: caseId,
      stationName: targetStation,
      type: 'STATUS_UPDATE'
    };

    const updatedNotifs = [newNotif, ...notifications];
    const updatedLogs = [newLog, ...activityLogs];

    setCases(updatedCases);
    setNotifications(updatedNotifs);
    setActivityLogs(updatedLogs);
    saveStateToStorage(updatedCases, updatedNotifs, updatedLogs);

    // Optional API call
    fetch(`/api/sos/${caseId}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('anubhavi_token')}`
      },
      body: JSON.stringify({ status: newStatus, notes: notes })
    }).catch(err => console.warn('Offline status update saved locally.', err));

    return { caseId, newStatus };
  };

  // ----------------------------------------------------------------------
  // NOTIFICATION UTILITIES
  // ----------------------------------------------------------------------
  const getFilteredNotifications = (userRole, userStationCode = 'MTP-PS-01') => {
    if (userRole === 'DSP') {
      // DSP receives all notifications & status updates across all stations
      return notifications;
    }
    // SHO receives all assignment, reassignment, SOS alerts and SHO-targeted notifications
    return notifications.filter(n => {
      if (n.recipientRole === 'DSP') return false; // Filter out DSP-only logs
      return true; // Show all assignment, reassignment & emergency alerts in Station Notifications popover!
    });
  };

  const getUnreadNotificationCount = (userRole, userStationCode = 'MTP-PS-01') => {
    const list = getFilteredNotifications(userRole, userStationCode);
    return list.filter(n => !n.read).length;
  };

  const markNotificationRead = (notifId) => {
    const updatedNotifs = notifications.map(n => n.id === notifId ? { ...n, read: true } : n);
    setNotifications(updatedNotifs);
    saveStateToStorage(null, updatedNotifs, null);
  };

  const clearAllNotifications = () => {
    const updatedNotifs = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifs);
    saveStateToStorage(null, updatedNotifs, null);
  };

  return (
    <CommandStoreContext.Provider value={{
      cases,
      notifications,
      activityLogs,
      officers: POLICE_OFFICERS_ROSTER,
      assignOfficer,
      reassignOfficer,
      updateCaseStatus,
      getFilteredNotifications,
      getUnreadNotificationCount,
      markNotificationRead,
      clearAllNotifications
    }}>
      {children}
    </CommandStoreContext.Provider>
  );
};

export const useCommandStore = () => useContext(CommandStoreContext);
