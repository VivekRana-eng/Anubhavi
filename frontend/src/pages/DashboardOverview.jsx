import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OfficerAssignmentModal from '../components/OfficerAssignmentModal';
import FilterChips from '../components/FilterChips';
import { useWebSocket } from '../context/WebSocketContext';
import { useFilter, applyFiltersAndSearch } from '../context/FilterContext';

const MOCK_SOS_CASES = [
  {
    id: "ANB-SOS-2026-4D9F2",
    citizen_name: "Rajesh Sharma",
    citizen_age: 72,
    citizen_mobile: "+91 98721-00214",
    emergency_type: "Medical Emergency",
    location_address: "H.No 412, Lane 4, Model Town Phase 2, Ludhiana",
    created_at: "2026-09-03 20:50:08",
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
    id: "SOS-2026-0006",
    citizen_name: "Prem Prakash",
    citizen_age: 78,
    citizen_mobile: "+91 98140-55123",
    emergency_type: "General Emergency",
    location_address: "45 Park Avenue, South Zone",
    created_at: "2026-09-03 19:44:22",
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
      vehicle: "PCR Van #09"
    }
  },
  {
    id: "SOS-2026-0005",
    citizen_name: "Harish Kumar",
    citizen_age: 74,
    citizen_mobile: "+91 98881-22901",
    emergency_type: "Accident",
    location_address: "GT Road Crossing, North Zone Sector 4",
    created_at: "2026-09-03 19:34:22",
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
      vehicle: "PCR Car #03"
    }
  },
  {
    id: "SOS-2026-0001",
    citizen_name: "Rajesh Sharma",
    citizen_age: 72,
    citizen_mobile: "+91 98721-00214",
    emergency_type: "Medical Emergency",
    location_address: "H.No 412, Lane 4, Model Town Phase 2, Ludhiana",
    created_at: "2026-09-03 18:50:08",
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
    id: "SOS-2026-0002",
    citizen_name: "Sunita Devi",
    citizen_age: 68,
    citizen_mobile: "+91 97812-33412",
    emergency_type: "Women Safety",
    location_address: "Flat 302, Block B, Sector 17, Chandigarh",
    created_at: "2026-09-03 18:20:00",
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
    created_at: "2026-09-03 17:50:00",
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
      vehicle: "PCR Van #04"
    }
  },
  {
    id: "SOS-2026-0004",
    citizen_name: "Kamla Sharma",
    citizen_age: 70,
    citizen_mobile: "+91 96461-44912",
    emergency_type: "Harassment",
    location_address: "88 Commercial Complex, Central Bazaar",
    created_at: "2026-09-03 17:05:00",
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
      vehicle: "PCR Van #02"
    }
  },
  {
    id: "SOS-2026-0007",
    citizen_name: "Gurdev Singh",
    citizen_age: 81,
    citizen_mobile: "+91 94172-66301",
    emergency_type: "Missing Person",
    location_address: "Sector 3 Main Gate, Model Town",
    created_at: "2026-09-02 21:00:00",
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
    created_at: "2026-09-02 16:30:00",
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
    created_at: "2026-09-02 14:15:00",
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
    created_at: "2026-08-31 11:20:00",
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
    created_at: "2026-08-30 09:40:00",
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
    created_at: "2026-08-29 18:10:00",
    police_station: "South Zone Police Station",
    station_code: "SZ-PS-06",
    assigned_officer_name: "HC Manpreet Singh",
    assigned_officer_rank: "Head Constable",
    status: "RESOLVED",
    assignment_details: {
      police_station: "South Zone Police Station",
      station_code: "SZ-PS-06",
      officer_name: "HC Manpreet Singh",
      officer_rank: "Head Constable",
      police_id: "POL-1029",
      vehicle: "PCR Van #09"
    }
  },
  {
    id: "SOS-2026-0013",
    citizen_name: "Tilak Raj",
    citizen_age: 79,
    citizen_mobile: "+91 98720-11223",
    emergency_type: "General Emergency",
    location_address: "House 50, Model Town Extension",
    created_at: "2026-08-28 15:25:00",
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
    created_at: "2026-08-24 13:00:00",
    police_station: "Sector 17 Police Station",
    station_code: "SEC17-PS-02",
    assigned_officer_name: "HC Raj Kumar",
    assigned_officer_rank: "Head Constable",
    status: "OFFICER DISPATCHED",
    assignment_details: {
      police_station: "Sector 17 Police Station",
      station_code: "SEC17-PS-02",
      officer_name: "HC Raj Kumar",
      officer_rank: "Head Constable",
      police_id: "POL-1024",
      vehicle: "PCR Van #04"
    }
  },
  {
    id: "SOS-2026-0015",
    citizen_name: "Swaran Singh",
    citizen_age: 85,
    citizen_mobile: "+91 99140-55443",
    emergency_type: "Medical Emergency",
    location_address: "Phase 8 Industrial Area Gate 1",
    created_at: "2026-08-22 10:15:00",
    police_station: "Phase 8 Police Station",
    station_code: "PH8-PS-03",
    assigned_officer_name: "SI Rahul Verma",
    assigned_officer_rank: "Sub-Inspector",
    status: "ON THE WAY",
    assignment_details: {
      police_station: "Phase 8 Police Station",
      station_code: "PH8-PS-03",
      officer_name: "SI Rahul Verma",
      officer_rank: "Sub-Inspector",
      police_id: "POL-1028",
      vehicle: "PCR Car #03"
    }
  },
  {
    id: "SOS-2026-0016",
    citizen_name: "Krishna Gopal",
    citizen_age: 73,
    citizen_mobile: "+91 98765-12345",
    emergency_type: "Missing Person",
    location_address: "Railway Station Exit 3, Central",
    created_at: "2026-08-19 08:45:00",
    police_station: "Central Police Station",
    station_code: "CPS-04",
    assigned_officer_name: "Const. Vikram Sharma",
    assigned_officer_rank: "Constable",
    status: "ARRIVED",
    assignment_details: {
      police_station: "Central Police Station",
      station_code: "CPS-04",
      officer_name: "Const. Vikram Sharma",
      officer_rank: "Constable",
      police_id: "POL-1026",
      vehicle: "PCR Van #02"
    }
  },
  {
    id: "SOS-2026-0017",
    citizen_name: "Pushpa Rani",
    citizen_age: 67,
    citizen_mobile: "+91 98112-66554",
    emergency_type: "Women Safety",
    location_address: "North Zone Bypass Road",
    created_at: "2026-08-16 23:10:00",
    police_station: "North Zone Police Station",
    station_code: "NZ-PS-05",
    assigned_officer_name: "SI Neeraj Kumar",
    assigned_officer_rank: "Sub-Inspector",
    status: "RESOLVED",
    assignment_details: {
      police_station: "North Zone Police Station",
      station_code: "NZ-PS-05",
      officer_name: "SI Neeraj Kumar",
      officer_rank: "Sub-Inspector",
      police_id: "POL-1027",
      vehicle: "PCR Car #01"
    }
  },
  {
    id: "SOS-2026-0018",
    citizen_name: "Joginder Pal",
    citizen_age: 80,
    citizen_mobile: "+91 94171-33221",
    emergency_type: "Senior Citizen Assistance",
    location_address: "12 South Zone Green Park",
    created_at: "2026-08-14 14:00:00",
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
    created_at: "2026-08-12 11:30:00",
    police_station: "Model Town Police Station",
    station_code: "MTP-PS-01",
    assigned_officer_name: "HC Raj Kumar",
    assigned_officer_rank: "Head Constable",
    status: "ACTIVE",
    assignment_details: {
      police_station: "Model Town Police Station",
      station_code: "MTP-PS-01",
      officer_name: "HC Raj Kumar",
      officer_rank: "Head Constable",
      police_id: "POL-1024",
      vehicle: "PCR Van #04"
    }
  },
  {
    id: "SOS-2026-0020",
    citizen_name: "Nirmala Devi",
    citizen_age: 74,
    citizen_mobile: "+91 98142-11009",
    emergency_type: "General Emergency",
    location_address: "Sector 17 House #512",
    created_at: "2026-08-09 17:40:00",
    police_station: "Sector 17 Police Station",
    station_code: "SEC17-PS-02",
    assigned_officer_name: "ASI Amit Singh",
    assigned_officer_rank: "Assistant Sub-Inspector",
    status: "ASSIGNED",
    assignment_details: {
      police_station: "Sector 17 Police Station",
      station_code: "SEC17-PS-02",
      officer_name: "ASI Amit Singh",
      officer_rank: "Assistant Sub-Inspector",
      police_id: "POL-1025",
      vehicle: "PCR Bike #12"
    }
  }
];

export default function DashboardOverview() {
  const [stats, setStats] = useState(null);
  const [allSosCases, setAllSosCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCaseForAssign, setSelectedCaseForAssign] = useState(null);
  const [countdown, setCountdown] = useState('18h 38m 43s');
  const navigate = useNavigate();
  const { lastEvent } = useWebSocket();
  const { searchQuery, filters, clearAllFilters, activeFilterCount } = useFilter();

  const loadDashboardData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/analytics/dashboard-stats').then(res => res.json()).catch(() => null),
      fetch('/api/sos').then(res => res.json()).catch(() => null)
    ])
      .then(([statsData, casesData]) => {
        if (statsData) setStats(statsData);
        if (casesData && Array.isArray(casesData) && casesData.length > 0) {
          setAllSosCases(casesData);
        } else {
          setAllSosCases(MOCK_SOS_CASES);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setAllSosCases(MOCK_SOS_CASES);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(() => {
      const seconds = Math.floor(Math.random() * 60);
      setCountdown(`18h 38m ${seconds < 10 ? '0' + seconds : seconds}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Real-time listener: refresh triage feed instantly when a WebSocket or custom event arrives
  useEffect(() => {
    const handleNewSos = (e) => {
      if (e.detail) {
        const data = e.detail;
        setAllSosCases(prev => {
          if (prev.some(c => c.id === data.case_id)) return prev;
          const newCase = {
            id: data.case_id,
            citizen_name: data.citizen_name || 'Senior Citizen',
            citizen_age: data.citizen_age || 72,
            citizen_mobile: data.citizen_mobile || '+91 98721-00214',
            emergency_type: data.emergency_type || 'Emergency Alarm',
            location_address: data.location || data.location_address || 'Model Town Ward',
            created_at: data.sos_time || 'Just Now',
            status: 'ACTIVE'
          };
          return [newCase, ...prev];
        });
        setStats(prev => prev ? { ...prev, active_sos: (prev.active_sos || 0) + 1 } : prev);
      }
    };

    window.addEventListener('anubhavi_new_sos_alert', handleNewSos);

    if (lastEvent) {
      if (lastEvent.event === 'NEW_SOS_ALERT') {
        setAllSosCases(prev => {
          if (prev.some(c => c.id === lastEvent.case_id)) return prev;
          const newCase = {
            id: lastEvent.case_id,
            citizen_name: lastEvent.citizen_name,
            citizen_age: lastEvent.citizen_age || 72,
            citizen_mobile: lastEvent.citizen_mobile,
            emergency_type: lastEvent.emergency_type,
            location_address: lastEvent.location,
            created_at: lastEvent.sos_time || lastEvent.created_at,
            status: 'NEW',
            priority: lastEvent.priority || 'HIGH'
          };
          return [newCase, ...prev];
        });
        setStats(prev => prev ? { ...prev, active_sos: (prev.active_sos || 0) + 1 } : prev);
      } else {
        loadDashboardData();
      }
    }

    return () => window.removeEventListener('anubhavi_new_sos_alert', handleNewSos);
  }, [lastEvent]);

  const handleAcceptCase = async (caseId) => {
    try {
      const res = await fetch(`/api/sos/${caseId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('anubhavi_token')}`
        }
      });
      if (res.ok) {
        loadDashboardData();
      }
    } catch (e) {
      console.error(e);
      setAllSosCases(prev => prev.map(c => c.id === caseId ? { ...c, status: 'ACKNOWLEDGED' } : c));
    }
  };

  // Compute filtered SOS cases using AND filter logic
  const filteredCases = applyFiltersAndSearch(allSosCases, searchQuery, filters);
  const activeCasesCount = allSosCases.filter(c => c.status !== 'CLOSED' && c.status !== 'RESOLVED').length;

  return (
    <div className="flex flex-col gap-spacing-lg w-full">
      {/* STATISTICAL METRIC CARDS (4 CARDS) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-spacing-sm text-left">
        <div className="bg-surface-container-lowest p-spacing-md rounded-xl shadow-sm border border-surface-container-highest flex flex-col justify-between">
          <span className="font-label-sm text-on-surface-variant uppercase font-semibold">Total Citizens</span>
          <span className="font-headline-xl text-primary font-extrabold mt-1">{stats?.total_citizens || 1248}</span>
          <span className="font-label-sm text-secondary mt-1 font-bold">Model Town Ward</span>
        </div>

        <div className="bg-error-container/20 p-spacing-md rounded-xl shadow-sm border border-error-container flex flex-col justify-between">
          <span className="font-label-sm text-error uppercase font-extrabold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-error animate-ping"></span> Active SOS
          </span>
          <span className="font-headline-xl text-error font-extrabold mt-1">{activeCasesCount}</span>
          <span className="font-label-sm text-error font-bold mt-1">Requires Triage</span>
        </div>

        <div className="bg-surface-container-lowest p-spacing-md rounded-xl shadow-sm border border-surface-container-highest flex flex-col justify-between">
          <span className="font-label-sm text-on-surface-variant uppercase font-semibold">Missed Check-ins</span>
          <span className="font-headline-xl text-on-surface font-extrabold mt-1">{stats?.missed_checkins || 5}</span>
          <span className="font-label-sm text-on-surface-variant font-semibold mt-1">Unresponsive pings</span>
        </div>

        <div className="bg-surface-container-lowest p-spacing-md rounded-xl shadow-sm border border-surface-container-highest flex flex-col justify-between">
          <span className="font-label-sm text-on-surface-variant uppercase font-semibold">Avg Response</span>
          <span className="font-headline-xl text-primary font-extrabold mt-1">{stats?.avg_response_time || '8 min'}</span>
          <span className="font-label-sm text-secondary font-semibold mt-1">Target &lt;15m</span>
        </div>
      </div>

      {/* ACTIVE FILTER CHIPS DISPLAY */}
      <FilterChips />

      {/* ACTIVE SOS & EMERGENCY TRIAGE QUEUE */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg border border-surface-container-highest flex flex-col gap-spacing-md text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-surface-container-highest pb-spacing-xs gap-2">
          <div className="flex items-center gap-spacing-xs">
            <span className="material-symbols-outlined text-error text-[24px]">fmd_bad</span>
            <h2 className="font-headline-sm text-on-surface font-bold uppercase tracking-wider">
              Priority SOS Emergency Triage Feed
            </h2>
          </div>

          {/* DYNAMIC RESULT COUNT */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-surface-container-high text-on-surface font-label-md font-bold rounded-lg border border-surface-container-highest">
              Showing {filteredCases.length} of {allSosCases.length} cases
            </span>
          </div>
        </div>

        {/* NO RESULTS MATCHING FILTER EMPTY STATE */}
        {filteredCases.length === 0 ? (
          <div className="py-12 px-4 text-center flex flex-col items-center justify-center gap-3 bg-slate-50 rounded-2xl border border-slate-200 my-2">
            <div className="w-16 h-16 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-500 text-3xl">
              🔍
            </div>
            <h3 className="text-lg font-black text-slate-900">No cases found</h3>
            <p className="text-xs font-semibold text-slate-500 max-w-sm">
              Try changing your search or filters. No incident records match your active selection.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-2 px-5 py-2.5 bg-[#2e5746] hover:bg-[#244638] text-white font-extrabold text-xs rounded-xl shadow-md transition-all uppercase tracking-wider"
            >
              CLEAR FILTERS
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-spacing-md">
            {filteredCases.map((c) => {
              const assignment = c.assignment_details || {};
              const officerName = assignment.officer_name || c.assigned_officer_name || c.assignedOfficer || c.officer_name || (c.status === 'ASSIGNED' || c.status === 'ARRIVED' || c.status === 'ON THE WAY' || c.status === 'ON_THE_WAY' || c.status === 'OFFICER_DISPATCHED' || c.status === 'OFFICER DISPATCHED' ? 'ASI Amit Singh' : null);
              const officerRank = assignment.officer_rank || c.assigned_officer_rank || c.officer_rank || (officerName === 'ASI Amit Singh' ? 'Assistant Sub-Inspector' : officerName === 'HC Manpreet Singh' ? 'Head Constable' : officerName === 'SI Rahul Verma' ? 'Sub-Inspector' : officerName === 'Const. Vikram Sharma' ? 'Constable' : officerName === 'HC Raj Kumar' ? 'Head Constable' : 'Officer');
              const stationName = assignment.police_station || c.police_station || c.policeStation || 'Model Town Police Station';
              const stationCode = assignment.station_code || c.stationCode || 'MTP-PS-01';

              return (
                <div
                  key={c.id}
                  className={`p-spacing-md rounded-xl border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-spacing-md transition-all ${
                    c.status === 'NEW' || c.status === 'ACTIVE'
                      ? 'bg-error-container/10 border-error shadow-sm'
                      : 'bg-surface-container-low border-surface-container-highest'
                  }`}
                >
                  <div className="flex flex-col gap-spacing-2xs flex-1 text-left">
                    <div className="flex flex-wrap items-center gap-spacing-xs">
                      <span className="font-code-md text-on-surface font-extrabold">{c.id}</span>
                      
                      {/* STATUS BADGE */}
                      <span className={`px-spacing-xs py-spacing-3xs rounded font-label-sm font-bold uppercase ${
                        c.status === 'NEW' || c.status === 'ACTIVE' ? 'bg-error text-on-error animate-pulse' :
                        c.status === 'ACKNOWLEDGED' || c.status === 'ACCEPTED' ? 'bg-secondary-container text-on-secondary-container' :
                        c.status === 'RESOLVED' ? 'bg-emerald-700 text-white' :
                        c.status === 'CANCELLED' ? 'bg-slate-300 text-slate-700' :
                        'bg-primary-container text-on-primary'
                      }`}>
                        {c.status}
                      </span>
                    </div>

                    <span className="font-headline-sm text-on-surface font-bold mt-1">
                      Senior Citizen: {c.citizen_name || c.citizenName} ({c.citizen_age || c.citizenAge || 72} Yrs)
                    </span>

                    {/* POLICE STATION & ASSIGNED OFFICER STRIP */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-700 font-semibold my-1">
                      <span className="flex items-center gap-1 text-emerald-900 font-bold">
                        <span className="material-symbols-outlined text-[15px] text-[#2e5746]">domain</span>
                        {stationName} ({stationCode})
                      </span>
                      {officerName && (
                        <span className="flex items-center gap-1 text-slate-800 font-extrabold">
                          <span className="material-symbols-outlined text-[15px] text-primary">local_police</span>
                          Officer: {officerRank} {officerName}
                        </span>
                      )}
                    </div>

                    <span className="font-body-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                      {c.location_address || c.address || 'Model Town, Sector 3, Ludhiana'}
                    </span>

                    <span className="font-code-md text-primary font-bold">
                      Mobile: {c.citizen_mobile || c.phone || '+91 98721-00214'} • Triggered At: {c.created_at || c.createdAt || '2026-09-03 20:50:08'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-spacing-xs w-full lg:w-auto justify-end">
                    {(c.status === 'NEW' || c.status === 'ACTIVE') && (
                      <button
                        onClick={() => handleAcceptCase(c.id)}
                        className="py-spacing-xs px-spacing-md bg-error text-on-error font-label-sm font-bold rounded shadow hover:bg-error-container hover:text-on-error-container transition-all flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        ACCEPT CASE
                      </button>
                    )}

                    {(c.status === 'ACKNOWLEDGED' || c.status === 'ACCEPTED' || c.status === 'ASSIGNED' || c.status === 'ARRIVED' || c.status === 'ON THE WAY' || c.status === 'ON_THE_WAY' || c.status === 'OFFICER DISPATCHED') && (
                      <button
                        onClick={() => setSelectedCaseForAssign(c.id)}
                        className="py-spacing-xs px-spacing-md bg-primary text-on-primary font-label-sm font-bold rounded shadow hover:bg-on-surface transition-all flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">person_add</span>
                        {c.status === 'ASSIGNED' || c.status === 'ARRIVED' || c.status === 'ON THE WAY' || c.status === 'ON_THE_WAY' || c.status === 'OFFICER DISPATCHED' ? 'REASSIGN OFFICER' : 'ASSIGN OFFICER'}
                      </button>
                    )}

                    <button
                      onClick={() => navigate(`/sho/cases/${c.id}`)}
                      className="py-spacing-xs px-spacing-md bg-surface-container-high text-on-surface font-label-sm font-bold rounded hover:bg-surface-container-highest transition-all flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      VIEW FULL CASE
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedCaseForAssign && (
        <OfficerAssignmentModal
          caseId={selectedCaseForAssign}
          onClose={() => setSelectedCaseForAssign(null)}
          onAssigned={loadDashboardData}
        />
      )}
    </div>
  );
}
