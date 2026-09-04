import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import OfficerAssignmentModal from '../components/OfficerAssignmentModal';

const MOCK_CASE_DATABASE = {
  "ANB-SOS-2026-4D9F2": {
    case: {
      id: "ANB-SOS-2026-4D9F2",
      citizen_id: "CIT-8841",
      citizen_name: "Rajesh Sharma",
      citizen_age: 72,
      citizen_mobile: "+91 98721-00214",
      emergency_type: "Medical Emergency",
      location_address: "H.No 412, Lane 4, Model Town Phase 2, Ludhiana",
      latitude: 30.9010,
      longitude: 75.8573,
      created_at: "2026-09-03 20:50:08",
      status: "ASSIGNED",
      assignment_details: {
        police_station: "MODEL TOWN POLICE STATION",
        station_code: "MTP-PS-01",
        jurisdiction: "Model Town • District Central • Zone 1",
        assigned_by: "Insp. Raj Kumar",
        officer_name: "ASI Amit Singh",
        officer_rank: "Assistant Sub-Inspector",
        police_id: "POL-1025",
        vehicle: "PCR Bike #12",
        response_type: "Police Emergency Response",
        estimated_response_time: "10 minutes"
      }
    },
    citizen: {
      id: "CIT-8841",
      name: "Rajesh Sharma",
      age: 72,
      gender: "Male",
      mobile: "+91 98721-00214",
      living_status: "LIVES_ALONE",
      aadhaar_masked: "XXXX-XXXX-4912",
      medical_conditions: "Severe Cardiac History, Pacemaker Fitted (2023)"
    },
    assigned_officer: {
      id: "POL-1025",
      name: "ASI Amit Singh",
      rank: "Assistant Sub-Inspector",
      police_id: "POL-1025",
      mobile: "+91 98721-44102",
      current_vehicle: "PCR Bike #12",
      avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzZPFuUAA-GjuqoDc0ROMs6dF5KTfabqTVwmZNnY0YDGQ9ceS9un43-t50gBNKIJ4FWwDanXcLlOf3uQ5hE6oF4TjJMUg01bZqIsuDr_TucayV1CUZ0p9svKyoLK9bOq5KNLlmLW_ibbjW1j5gl_SufTcWTSXmmRk8Bl6TuVDgTpWdBrch9ZX1PYhBhZDN0gycUWhzsrGo_k6Lrcij-yVjYLVqigwCWcvqJnVGg0nhy4lGx0JiBO"
    }
  },
  "SOS-2026-0001": {
    case: {
      id: "SOS-2026-0001",
      citizen_id: "CIT-8841",
      citizen_name: "Rajesh Sharma",
      citizen_age: 72,
      citizen_mobile: "+91 98721-00214",
      emergency_type: "Medical Emergency",
      location_address: "H.No 412, Lane 4, Model Town Phase 2, Ludhiana",
      latitude: 30.9010,
      longitude: 75.8573,
      created_at: "2026-09-03 18:50:08",
      status: "ASSIGNED",
      assignment_details: {
        police_station: "MODEL TOWN POLICE STATION",
        station_code: "MTP-PS-01",
        jurisdiction: "Model Town • District Central • Zone 1",
        assigned_by: "Insp. Raj Kumar",
        officer_name: "ASI Amit Singh",
        officer_rank: "Assistant Sub-Inspector",
        police_id: "POL-1025",
        vehicle: "PCR Bike #12",
        response_type: "Police Emergency Response",
        estimated_response_time: "10 minutes"
      }
    },
    citizen: {
      id: "CIT-8841",
      name: "Rajesh Sharma",
      age: 72,
      gender: "Male",
      mobile: "+91 98721-00214",
      living_status: "LIVES_ALONE",
      aadhaar_masked: "XXXX-XXXX-4912",
      medical_conditions: "Severe Cardiac History, Pacemaker Fitted (2023)"
    },
    assigned_officer: {
      id: "POL-1025",
      name: "ASI Amit Singh",
      rank: "Assistant Sub-Inspector",
      police_id: "POL-1025",
      mobile: "+91 98721-44102",
      current_vehicle: "PCR Bike #12",
      avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzZPFuUAA-GjuqoDc0ROMs6dF5KTfabqTVwmZNnY0YDGQ9ceS9un43-t50gBNKIJ4FWwDanXcLlOf3uQ5hE6oF4TjJMUg01bZqIsuDr_TucayV1CUZ0p9svKyoLK9bOq5KNLlmLW_ibbjW1j5gl_SufTcWTSXmmRk8Bl6TuVDgTpWdBrch9ZX1PYhBhZDN0gycUWhzsrGo_k6Lrcij-yVjYLVqigwCWcvqJnVGg0nhy4lGx0JiBO"
    }
  },
  "SOS-2026-0002": {
    case: {
      id: "SOS-2026-0002",
      citizen_id: "CIT-9102",
      citizen_name: "Sunita Devi",
      citizen_age: 68,
      citizen_mobile: "+91 97812-33412",
      emergency_type: "Women Safety",
      location_address: "Flat 302, Block B, Sector 17, Chandigarh",
      latitude: 30.7333,
      longitude: 76.7794,
      created_at: "2026-09-03 18:20:00",
      status: "ACTIVE",
      assignment_details: {
        police_station: "Sector 17 Police Station",
        station_code: "SEC17-PS-02",
        jurisdiction: "Sector 17 • Central District • Zone 2",
        assigned_by: "Insp. Raj Kumar"
      }
    },
    citizen: {
      id: "CIT-9102",
      name: "Sunita Devi",
      age: 68,
      gender: "Female",
      mobile: "+91 97812-33412",
      living_status: "LIVES_ALONE",
      aadhaar_masked: "XXXX-XXXX-8102",
      medical_conditions: "Hypertension, Joint Pain History"
    },
    assigned_officer: null
  },
  "SOS-2026-0003": {
    case: {
      id: "SOS-2026-0003",
      citizen_id: "CIT-7714",
      citizen_name: "Mohan Lal",
      citizen_age: 75,
      citizen_mobile: "+91 99145-88210",
      emergency_type: "Senior Citizen Assistance",
      location_address: "House 125, Phase 8, Mohali",
      latitude: 30.7046,
      longitude: 76.7179,
      created_at: "2026-09-03 17:50:00",
      status: "ACKNOWLEDGED",
      assignment_details: {
        police_station: "Phase 8 Police Station",
        station_code: "PH8-PS-03",
        jurisdiction: "Phase 8 • Mohali District • Zone 3",
        assigned_by: "Insp. Raj Kumar",
        officer_name: "HC Raj Kumar",
        officer_rank: "Head Constable",
        police_id: "POL-1024",
        vehicle: "PCR Van #04"
      }
    },
    citizen: {
      id: "CIT-7714",
      name: "Mohan Lal",
      age: 75,
      gender: "Male",
      mobile: "+91 99145-88210",
      living_status: "LIVES WITH SPOUSE",
      aadhaar_masked: "XXXX-XXXX-3341",
      medical_conditions: "Diabetic, Limited Mobility"
    },
    assigned_officer: {
      id: "POL-1024",
      name: "HC Raj Kumar",
      rank: "Head Constable",
      police_id: "POL-1024",
      mobile: "+91 99145-11002",
      current_vehicle: "PCR Van #04",
      avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzZPFuUAA-GjuqoDc0ROMs6dF5KTfabqTVwmZNnY0YDGQ9ceS9un43-t50gBNKIJ4FWwDanXcLlOf3uQ5hE6oF4TjJMUg01bZqIsuDr_TucayV1CUZ0p9svKyoLK9bOq5KNLlmLW_ibbjW1j5gl_SufTcWTSXmmRk8Bl6TuVDgTpWdBrch9ZX1PYhBhZDN0gycUWhzsrGo_k6Lrcij-yVjYLVqigwCWcvqJnVGg0nhy4lGx0JiBO"
    }
  },
  "SOS-2026-0004": {
    case: {
      id: "SOS-2026-0004",
      citizen_id: "CIT-6629",
      citizen_name: "Kamla Sharma",
      citizen_age: 70,
      citizen_mobile: "+91 96461-44912",
      emergency_type: "Harassment",
      location_address: "88 Commercial Complex, Central Bazaar",
      latitude: 30.7300,
      longitude: 76.7800,
      created_at: "2026-09-03 17:05:00",
      status: "OFFICER DISPATCHED",
      assignment_details: {
        police_station: "Central Police Station",
        station_code: "CPS-04",
        jurisdiction: "Central Bazaar • District 1",
        assigned_by: "Insp. Raj Kumar",
        officer_name: "Const. Vikram Sharma",
        officer_rank: "Constable",
        police_id: "POL-1026",
        vehicle: "PCR Van #02"
      }
    },
    citizen: {
      id: "CIT-6629",
      name: "Kamla Sharma",
      age: 70,
      gender: "Female",
      mobile: "+91 96461-44912",
      living_status: "LIVES_ALONE",
      aadhaar_masked: "XXXX-XXXX-9912",
      medical_conditions: "Asthma, High Blood Pressure"
    },
    assigned_officer: {
      id: "POL-1026",
      name: "Const. Vikram Sharma",
      rank: "Constable",
      police_id: "POL-1026",
      mobile: "+91 96461-22001",
      current_vehicle: "PCR Van #02",
      avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzZPFuUAA-GjuqoDc0ROMs6dF5KTfabqTVwmZNnY0YDGQ9ceS9un43-t50gBNKIJ4FWwDanXcLlOf3uQ5hE6oF4TjJMUg01bZqIsuDr_TucayV1CUZ0p9svKyoLK9bOq5KNLlmLW_ibbjW1j5gl_SufTcWTSXmmRk8Bl6TuVDgTpWdBrch9ZX1PYhBhZDN0gycUWhzsrGo_k6Lrcij-yVjYLVqigwCWcvqJnVGg0nhy4lGx0JiBO"
    }
  },
  "SOS-2026-0005": {
    case: {
      id: "SOS-2026-0005",
      citizen_id: "CIT-5510",
      citizen_name: "Harish Kumar",
      citizen_age: 74,
      citizen_mobile: "+91 98881-22901",
      emergency_type: "Accident",
      location_address: "GT Road Crossing, North Zone Sector 4",
      latitude: 30.9100,
      longitude: 75.8500,
      created_at: "2026-09-03 19:34:22",
      status: "ON THE WAY",
      assignment_details: {
        police_station: "North Zone Police Station",
        station_code: "NZ-PS-05",
        jurisdiction: "North Zone • Sector 4",
        assigned_by: "Insp. Raj Kumar",
        officer_name: "SI Rahul Verma",
        officer_rank: "Sub-Inspector",
        police_id: "POL-1028",
        vehicle: "PCR Car #03"
      }
    },
    citizen: {
      id: "CIT-5510",
      name: "Harish Kumar",
      age: 74,
      gender: "Male",
      mobile: "+91 98881-22901",
      living_status: "LIVES_ALONE",
      aadhaar_masked: "XXXX-XXXX-5520",
      medical_conditions: "Cardiac Arrhythmia History"
    },
    assigned_officer: {
      id: "POL-1028",
      name: "SI Rahul Verma",
      rank: "Sub-Inspector",
      police_id: "POL-1028",
      mobile: "+91 98881-77881",
      current_vehicle: "PCR Car #03",
      avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzZPFuUAA-GjuqoDc0ROMs6dF5KTfabqTVwmZNnY0YDGQ9ceS9un43-t50gBNKIJ4FWwDanXcLlOf3uQ5hE6oF4TjJMUg01bZqIsuDr_TucayV1CUZ0p9svKyoLK9bOq5KNLlmLW_ibbjW1j5gl_SufTcWTSXmmRk8Bl6TuVDgTpWdBrch9ZX1PYhBhZDN0gycUWhzsrGo_k6Lrcij-yVjYLVqigwCWcvqJnVGg0nhy4lGx0JiBO"
    }
  },
  "SOS-2026-0006": {
    case: {
      id: "SOS-2026-0006",
      citizen_id: "CIT-4481",
      citizen_name: "Prem Prakash",
      citizen_age: 78,
      citizen_mobile: "+91 98140-55123",
      emergency_type: "General Emergency",
      location_address: "45 Park Avenue, South Zone",
      latitude: 30.8900,
      longitude: 75.8300,
      created_at: "2026-09-03 19:44:22",
      status: "ARRIVED",
      assignment_details: {
        police_station: "South Zone Police Station",
        station_code: "SZ-PS-06",
        jurisdiction: "South Zone • Sector 12",
        assigned_by: "Insp. Raj Kumar",
        officer_name: "HC Manpreet Singh",
        officer_rank: "Head Constable",
        police_id: "POL-1029",
        vehicle: "PCR Van #09"
      }
    },
    citizen: {
      id: "CIT-4481",
      name: "Prem Prakash",
      age: 78,
      gender: "Male",
      mobile: "+91 98140-55123",
      living_status: "LIVES_ALONE",
      aadhaar_masked: "XXXX-XXXX-4412",
      medical_conditions: "Arthritis, Mild Hearing Impairment"
    },
    assigned_officer: {
      id: "POL-1029",
      name: "HC Manpreet Singh",
      rank: "Head Constable",
      police_id: "POL-1029",
      mobile: "+91 98140-99221",
      current_vehicle: "PCR Van #09",
      avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzZPFuUAA-GjuqoDc0ROMs6dF5KTfabqTVwmZNnY0YDGQ9ceS9un43-t50gBNKIJ4FWwDanXcLlOf3uQ5hE6oF4TjJMUg01bZqIsuDr_TucayV1CUZ0p9svKyoLK9bOq5KNLlmLW_ibbjW1j5gl_SufTcWTSXmmRk8Bl6TuVDgTpWdBrch9ZX1PYhBhZDN0gycUWhzsrGo_k6Lrcij-yVjYLVqigwCWcvqJnVGg0nhy4lGx0JiBO"
    }
  },
  "SOS-2026-0007": {
    case: {
      id: "SOS-2026-0007",
      citizen_id: "CIT-3312",
      citizen_name: "Gurdev Singh",
      citizen_age: 81,
      citizen_mobile: "+91 94172-66301",
      emergency_type: "Missing Person",
      location_address: "Sector 3 Main Gate, Model Town",
      latitude: 30.9020,
      longitude: 75.8560,
      created_at: "2026-09-02 21:00:00",
      status: "RESOLVED",
      assignment_details: {
        police_station: "Model Town Police Station",
        station_code: "MTP-PS-01",
        jurisdiction: "Model Town • Zone 1",
        assigned_by: "Insp. Raj Kumar",
        officer_name: "ASI Amit Singh",
        officer_rank: "Assistant Sub-Inspector",
        police_id: "POL-1025",
        vehicle: "PCR Bike #12"
      }
    },
    citizen: {
      id: "CIT-3312",
      name: "Gurdev Singh",
      age: 81,
      gender: "Male",
      mobile: "+91 94172-66301",
      living_status: "LIVES WITH FAMILY",
      aadhaar_masked: "XXXX-XXXX-3312",
      medical_conditions: "Memory Loss, Dementia"
    },
    assigned_officer: {
      id: "POL-1025",
      name: "ASI Amit Singh",
      rank: "Assistant Sub-Inspector",
      police_id: "POL-1025",
      mobile: "+91 98721-44102",
      current_vehicle: "PCR Bike #12"
    }
  },
  "SOS-2026-0008": {
    case: {
      id: "SOS-2026-0008",
      citizen_id: "CIT-2291",
      citizen_name: "Vidya Wanti",
      citizen_age: 76,
      citizen_mobile: "+91 98150-11234",
      emergency_type: "Medical Emergency",
      location_address: "Villa 12, Sector 17",
      latitude: 30.7350,
      longitude: 76.7780,
      created_at: "2026-09-02 16:30:00",
      status: "CANCELLED",
      assignment_details: {
        police_station: "Sector 17 Police Station",
        station_code: "SEC17-PS-02",
        jurisdiction: "Sector 17 • Zone 2",
        assigned_by: "Insp. Raj Kumar"
      }
    },
    citizen: {
      id: "CIT-2291",
      name: "Vidya Wanti",
      age: 76,
      gender: "Female",
      mobile: "+91 98150-11234",
      living_status: "LIVES_ALONE",
      aadhaar_masked: "XXXX-XXXX-2291",
      medical_conditions: "Bronchitis"
    },
    assigned_officer: null
  },
  "SOS-2026-0009": {
    case: {
      id: "SOS-2026-0009",
      citizen_id: "CIT-1182",
      citizen_name: "Baldev Raj",
      citizen_age: 73,
      citizen_mobile: "+91 98760-44321",
      emergency_type: "Medical Emergency",
      location_address: "104 Rosewood Enclave, Phase 8",
      latitude: 30.7050,
      longitude: 76.7180,
      created_at: "2026-09-02 14:15:00",
      status: "ASSIGNED",
      assignment_details: {
        police_station: "Phase 8 Police Station",
        station_code: "PH8-PS-03",
        jurisdiction: "Phase 8 • Mohali",
        assigned_by: "Insp. Raj Kumar",
        officer_name: "HC Raj Kumar",
        officer_rank: "Head Constable",
        police_id: "POL-1024",
        vehicle: "PCR Van #04"
      }
    },
    citizen: {
      id: "CIT-1182",
      name: "Baldev Raj",
      age: 73,
      gender: "Male",
      mobile: "+91 98760-44321",
      living_status: "LIVES WITH SPOUSE",
      aadhaar_masked: "XXXX-XXXX-1182",
      medical_conditions: "Hypertension, Cardiac Issue"
    },
    assigned_officer: {
      id: "POL-1024",
      name: "HC Raj Kumar",
      rank: "Head Constable",
      police_id: "POL-1024",
      mobile: "+91 99145-11002",
      current_vehicle: "PCR Van #04"
    }
  },
  "SOS-2026-0010": {
    case: {
      id: "SOS-2026-0010",
      citizen_id: "CIT-9011",
      citizen_name: "Asha Rani",
      citizen_age: 69,
      citizen_mobile: "+91 98111-77890",
      emergency_type: "Women Safety",
      location_address: "Central Mall Parking Level 2",
      latitude: 30.7310,
      longitude: 76.7810,
      created_at: "2026-08-31 11:20:00",
      status: "ACTIVE",
      assignment_details: {
        police_station: "Central Police Station",
        station_code: "CPS-04",
        jurisdiction: "Central Mall • Zone 1",
        assigned_by: "Insp. Raj Kumar"
      }
    },
    citizen: {
      id: "CIT-9011",
      name: "Asha Rani",
      age: 69,
      gender: "Female",
      mobile: "+91 98111-77890",
      living_status: "LIVES_ALONE",
      aadhaar_masked: "XXXX-XXXX-9011",
      medical_conditions: "None"
    },
    assigned_officer: null
  },
  "SOS-2026-0011": {
    case: {
      id: "SOS-2026-0011",
      citizen_id: "CIT-8123",
      citizen_name: "Ramesh Chander",
      citizen_age: 77,
      citizen_mobile: "+91 98888-33210",
      emergency_type: "Senior Citizen Assistance",
      location_address: "North Zone Community Hall",
      latitude: 30.9110,
      longitude: 75.8510,
      created_at: "2026-08-30 09:40:00",
      status: "ACKNOWLEDGED",
      assignment_details: {
        police_station: "North Zone Police Station",
        station_code: "NZ-PS-05",
        jurisdiction: "North Zone",
        assigned_by: "Insp. Raj Kumar"
      }
    },
    citizen: {
      id: "CIT-8123",
      name: "Ramesh Chander",
      age: 77,
      gender: "Male",
      mobile: "+91 98888-33210",
      living_status: "LIVES WITH SPOUSE",
      aadhaar_masked: "XXXX-XXXX-8123",
      medical_conditions: "Mobility Limitation"
    },
    assigned_officer: null
  },
  "SOS-2026-0012": {
    case: {
      id: "SOS-2026-0012",
      citizen_id: "CIT-7234",
      citizen_name: "Savitri Devi",
      citizen_age: 82,
      citizen_mobile: "+91 94170-99887",
      emergency_type: "Harassment",
      location_address: "219 Officers Colony, South Zone",
      latitude: 30.8910,
      longitude: 75.8310,
      created_at: "2026-08-29 18:10:00",
      status: "RESOLVED",
      assignment_details: {
        police_station: "South Zone Police Station",
        station_code: "SZ-PS-06",
        jurisdiction: "South Zone",
        assigned_by: "Insp. Raj Kumar",
        officer_name: "HC Manpreet Singh",
        officer_rank: "Head Constable",
        police_id: "POL-1029",
        vehicle: "PCR Van #09"
      }
    },
    citizen: {
      id: "CIT-7234",
      name: "Savitri Devi",
      age: 82,
      gender: "Female",
      mobile: "+91 94170-99887",
      living_status: "LIVES_ALONE",
      aadhaar_masked: "XXXX-XXXX-7234",
      medical_conditions: "Hearing Impaired"
    },
    assigned_officer: {
      id: "POL-1029",
      name: "HC Manpreet Singh",
      rank: "Head Constable",
      police_id: "POL-1029",
      mobile: "+91 98140-99221",
      current_vehicle: "PCR Van #09"
    }
  },
  "SOS-2026-0013": {
    case: {
      id: "SOS-2026-0013",
      citizen_id: "CIT-6345",
      citizen_name: "Tilak Raj",
      citizen_age: 79,
      citizen_mobile: "+91 98720-11223",
      emergency_type: "General Emergency",
      location_address: "House 50, Model Town Extension",
      latitude: 30.9030,
      longitude: 75.8580,
      created_at: "2026-08-28 15:25:00",
      status: "ASSIGNED",
      assignment_details: {
        police_station: "Model Town Police Station",
        station_code: "MTP-PS-01",
        jurisdiction: "Model Town",
        assigned_by: "Insp. Raj Kumar",
        officer_name: "ASI Amit Singh",
        officer_rank: "Assistant Sub-Inspector",
        police_id: "POL-1025",
        vehicle: "PCR Bike #12"
      }
    },
    citizen: {
      id: "CIT-6345",
      name: "Tilak Raj",
      age: 79,
      gender: "Male",
      mobile: "+91 98720-11223",
      living_status: "LIVES_ALONE",
      aadhaar_masked: "XXXX-XXXX-6345",
      medical_conditions: "Asthma"
    },
    assigned_officer: {
      id: "POL-1025",
      name: "ASI Amit Singh",
      rank: "Assistant Sub-Inspector",
      police_id: "POL-1025",
      mobile: "+91 98721-44102",
      current_vehicle: "PCR Bike #12"
    }
  },
  "SOS-2026-0014": {
    case: {
      id: "SOS-2026-0014",
      citizen_id: "CIT-5456",
      citizen_name: "Santosh Kumari",
      citizen_age: 71,
      citizen_mobile: "+91 98141-88765",
      emergency_type: "Accident",
      location_address: "Sector 17 Bus Stand Junction",
      latitude: 30.7340,
      longitude: 76.7770,
      created_at: "2026-08-24 13:00:00",
      status: "OFFICER DISPATCHED",
      assignment_details: {
        police_station: "Sector 17 Police Station",
        station_code: "SEC17-PS-02",
        jurisdiction: "Sector 17",
        assigned_by: "Insp. Raj Kumar",
        officer_name: "HC Raj Kumar",
        officer_rank: "Head Constable",
        police_id: "POL-1024",
        vehicle: "PCR Van #04"
      }
    },
    citizen: {
      id: "CIT-5456",
      name: "Santosh Kumari",
      age: 71,
      gender: "Female",
      mobile: "+91 98141-88765",
      living_status: "LIVES_ALONE",
      aadhaar_masked: "XXXX-XXXX-5456",
      medical_conditions: "Diabetic"
    },
    assigned_officer: {
      id: "POL-1024",
      name: "HC Raj Kumar",
      rank: "Head Constable",
      police_id: "POL-1024",
      mobile: "+91 99145-11002",
      current_vehicle: "PCR Van #04"
    }
  },
  "SOS-2026-0015": {
    case: {
      id: "SOS-2026-0015",
      citizen_id: "CIT-4567",
      citizen_name: "Swaran Singh",
      citizen_age: 85,
      citizen_mobile: "+91 99140-55443",
      emergency_type: "Medical Emergency",
      location_address: "Phase 8 Industrial Area Gate 1",
      latitude: 30.7060,
      longitude: 76.7190,
      created_at: "2026-08-22 10:15:00",
      status: "ON THE WAY",
      assignment_details: {
        police_station: "Phase 8 Police Station",
        station_code: "PH8-PS-03",
        jurisdiction: "Phase 8 Industrial Area",
        assigned_by: "Insp. Raj Kumar",
        officer_name: "SI Rahul Verma",
        officer_rank: "Sub-Inspector",
        police_id: "POL-1028",
        vehicle: "PCR Car #03"
      }
    },
    citizen: {
      id: "CIT-4567",
      name: "Swaran Singh",
      age: 85,
      gender: "Male",
      mobile: "+91 99140-55443",
      living_status: "LIVES_ALONE",
      aadhaar_masked: "XXXX-XXXX-4567",
      medical_conditions: "Cardiac History, Respiratory Care Needed"
    },
    assigned_officer: {
      id: "POL-1028",
      name: "SI Rahul Verma",
      rank: "Sub-Inspector",
      police_id: "POL-1028",
      mobile: "+91 98881-77881",
      current_vehicle: "PCR Car #03"
    }
  },
  "SOS-2026-0016": {
    case: {
      id: "SOS-2026-0016",
      citizen_id: "CIT-3678",
      citizen_name: "Krishna Gopal",
      citizen_age: 73,
      citizen_mobile: "+91 98765-12345",
      emergency_type: "Missing Person",
      location_address: "Railway Station Exit 3, Central",
      latitude: 30.7320,
      longitude: 76.7820,
      created_at: "2026-08-19 08:45:00",
      status: "ARRIVED",
      assignment_details: {
        police_station: "Central Police Station",
        station_code: "CPS-04",
        jurisdiction: "Central Railway Circle",
        assigned_by: "Insp. Raj Kumar",
        officer_name: "Const. Vikram Sharma",
        officer_rank: "Constable",
        police_id: "POL-1026",
        vehicle: "PCR Van #02"
      }
    },
    citizen: {
      id: "CIT-3678",
      name: "Krishna Gopal",
      age: 73,
      gender: "Male",
      mobile: "+91 98765-12345",
      living_status: "LIVES_ALONE",
      aadhaar_masked: "XXXX-XXXX-3678",
      medical_conditions: "Dementia"
    },
    assigned_officer: {
      id: "POL-1026",
      name: "Const. Vikram Sharma",
      rank: "Constable",
      police_id: "POL-1026",
      mobile: "+91 96461-22001",
      current_vehicle: "PCR Van #02"
    }
  },
  "SOS-2026-0017": {
    case: {
      id: "SOS-2026-0017",
      citizen_id: "CIT-2789",
      citizen_name: "Pushpa Rani",
      citizen_age: 67,
      citizen_mobile: "+91 98112-66554",
      emergency_type: "Women Safety",
      location_address: "North Zone Bypass Road",
      latitude: 30.9120,
      longitude: 75.8520,
      created_at: "2026-08-16 23:10:00",
      status: "RESOLVED",
      assignment_details: {
        police_station: "North Zone Police Station",
        station_code: "NZ-PS-05",
        jurisdiction: "North Zone Bypass",
        assigned_by: "Insp. Raj Kumar",
        officer_name: "SI Neeraj Kumar",
        officer_rank: "Sub-Inspector",
        police_id: "POL-1027",
        vehicle: "PCR Car #01"
      }
    },
    citizen: {
      id: "CIT-2789",
      name: "Pushpa Rani",
      age: 67,
      gender: "Female",
      mobile: "+91 98112-66554",
      living_status: "LIVES_ALONE",
      aadhaar_masked: "XXXX-XXXX-2789",
      medical_conditions: "Hypertension"
    },
    assigned_officer: {
      id: "POL-1027",
      name: "SI Neeraj Kumar",
      rank: "Sub-Inspector",
      police_id: "POL-1027",
      mobile: "+91 98112-00112",
      current_vehicle: "PCR Car #01"
    }
  },
  "SOS-2026-0018": {
    case: {
      id: "SOS-2026-0018",
      citizen_id: "CIT-1890",
      citizen_name: "Joginder Pal",
      citizen_age: 80,
      citizen_mobile: "+91 94171-33221",
      emergency_type: "Senior Citizen Assistance",
      location_address: "12 South Zone Green Park",
      latitude: 30.8920,
      longitude: 75.8320,
      created_at: "2026-08-14 14:00:00",
      status: "CANCELLED",
      assignment_details: {
        police_station: "South Zone Police Station",
        station_code: "SZ-PS-06",
        jurisdiction: "South Zone",
        assigned_by: "Insp. Raj Kumar"
      }
    },
    citizen: {
      id: "CIT-1890",
      name: "Joginder Pal",
      age: 80,
      gender: "Male",
      mobile: "+91 94171-33221",
      living_status: "LIVES_ALONE",
      aadhaar_masked: "XXXX-XXXX-1890",
      medical_conditions: "Joint Pain"
    },
    assigned_officer: null
  },
  "SOS-2026-0019": {
    case: {
      id: "SOS-2026-0019",
      citizen_id: "CIT-0901",
      citizen_name: "Darshan Lal",
      citizen_age: 76,
      citizen_mobile: "+91 98722-88990",
      emergency_type: "Medical Emergency",
      location_address: "Model Town Phase 3 Market",
      latitude: 30.9040,
      longitude: 75.8590,
      created_at: "2026-08-12 11:30:00",
      status: "ACTIVE",
      assignment_details: {
        police_station: "Model Town Police Station",
        station_code: "MTP-PS-01",
        jurisdiction: "Model Town",
        assigned_by: "Insp. Raj Kumar",
        officer_name: "HC Raj Kumar",
        officer_rank: "Head Constable",
        police_id: "POL-1024",
        vehicle: "PCR Van #04"
      }
    },
    citizen: {
      id: "CIT-0901",
      name: "Darshan Lal",
      age: 76,
      gender: "Male",
      mobile: "+91 98722-88990",
      living_status: "LIVES WITH SPOUSE",
      aadhaar_masked: "XXXX-XXXX-0901",
      medical_conditions: "Diabetes"
    },
    assigned_officer: {
      id: "POL-1024",
      name: "HC Raj Kumar",
      rank: "Head Constable",
      police_id: "POL-1024",
      mobile: "+91 99145-11002",
      current_vehicle: "PCR Van #04"
    }
  },
  "SOS-2026-0020": {
    case: {
      id: "SOS-2026-0020",
      citizen_id: "CIT-9812",
      citizen_name: "Nirmala Devi",
      citizen_age: 74,
      citizen_mobile: "+91 98142-11009",
      emergency_type: "General Emergency",
      location_address: "Sector 17 House #512",
      latitude: 30.7360,
      longitude: 76.7760,
      created_at: "2026-08-09 17:40:00",
      status: "ASSIGNED",
      assignment_details: {
        police_station: "Sector 17 Police Station",
        station_code: "SEC17-PS-02",
        jurisdiction: "Sector 17",
        assigned_by: "Insp. Raj Kumar",
        officer_name: "ASI Amit Singh",
        officer_rank: "Assistant Sub-Inspector",
        police_id: "POL-1025",
        vehicle: "PCR Bike #12"
      }
    },
    citizen: {
      id: "CIT-9812",
      name: "Nirmala Devi",
      age: 74,
      gender: "Female",
      mobile: "+91 98142-11009",
      living_status: "LIVES_ALONE",
      aadhaar_masked: "XXXX-XXXX-9812",
      medical_conditions: "Hypertension"
    },
    assigned_officer: {
      id: "POL-1025",
      name: "ASI Amit Singh",
      rank: "Assistant Sub-Inspector",
      police_id: "POL-1025",
      mobile: "+91 98721-44102",
      current_vehicle: "PCR Bike #12"
    }
  }
};

const applyLocalStorageOverrides = (id, result) => {
  try {
    const storedStatuses = JSON.parse(localStorage.getItem('anubhavi_local_cases_status') || '{}');
    if (storedStatuses[id]) {
      result.case.status = storedStatuses[id];
    }
  } catch (e) {}

  try {
    const storedNotif = JSON.parse(localStorage.getItem('anubhavi_local_user_notification') || 'null');
    if (storedNotif && storedNotif.case_id === id) {
      result.case.status = storedNotif.status || 'ASSIGNED';
      result.case.assignment_details = {
        police_station: storedNotif.police_station || result.case.assignment_details?.police_station || 'Sector 17 Police Station',
        station_code: storedNotif.station_code || 'SEC17-PS-02',
        jurisdiction: storedNotif.jurisdiction || 'Sector 17 • Central District',
        assigned_by: storedNotif.assigned_by || 'Insp. Raj Kumar',
        officer_name: storedNotif.officer_name,
        officer_rank: storedNotif.officer_rank,
        police_id: storedNotif.police_id,
        vehicle: storedNotif.vehicle
      };
      result.assigned_officer = {
        id: storedNotif.police_id || 'POL-1025',
        name: storedNotif.officer_name,
        rank: storedNotif.officer_rank,
        police_id: storedNotif.police_id,
        mobile: storedNotif.officer_mobile || '+91 98721-44102',
        current_vehicle: storedNotif.vehicle,
        avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzZPFuUAA-GjuqoDc0ROMs6dF5KTfabqTVwmZNnY0YDGQ9ceS9un43-t50gBNKIJ4FWwDanXcLlOf3uQ5hE6oF4TjJMUg01bZqIsuDr_TucayV1CUZ0p9svKyoLK9bOq5KNLlmLW_ibbjW1j5gl_SufTcWTSXmmRk8Bl6TuVDgTpWdBrch9ZX1PYhBhZDN0gycUWhzsrGo_k6Lrcij-yVjYLVqigwCWcvqJnVGg0nhy4lGx0JiBO'
      };
    }
  } catch (e) {}
};

const getFallbackCase = (id, stateData = null) => {
  if (stateData) {
    const assignment = stateData.assignment_details || {};
    const result = {
      case: {
        id: stateData.id || id,
        citizen_id: stateData.citizen_id || `CIT-${(id || '').slice(-4) || '8841'}`,
        citizen_name: stateData.citizen_name || stateData.citizenName || 'Senior Citizen',
        citizen_age: stateData.citizen_age || stateData.citizenAge || 75,
        citizen_mobile: stateData.citizen_mobile || stateData.phone || '+91 98765-43210',
        emergency_type: stateData.emergency_type || 'Emergency SOS Alert',
        location_address: stateData.location_address || stateData.address || 'Model Town, Sector 3, Ludhiana',
        latitude: stateData.latitude || 30.9010,
        longitude: stateData.longitude || 75.8573,
        created_at: stateData.created_at || '2026-09-03 20:50:08',
        status: stateData.status || 'ACTIVE',
        assignment_details: {
          police_station: assignment.police_station || stateData.police_station || 'Model Town Police Station',
          station_code: assignment.station_code || stateData.station_code || 'MTP-PS-01',
          jurisdiction: assignment.jurisdiction || 'District Central • Zone 1',
          assigned_by: assignment.assigned_by || 'Insp. Raj Kumar',
          officer_name: assignment.officer_name || stateData.assigned_officer_name,
          officer_rank: assignment.officer_rank || stateData.assigned_officer_rank,
          police_id: assignment.police_id || 'POL-1025',
          vehicle: assignment.vehicle || 'PCR Vehicle'
        }
      },
      citizen: {
        id: stateData.citizen_id || `CIT-${(id || '').slice(-4) || '8841'}`,
        name: stateData.citizen_name || stateData.citizenName || 'Senior Citizen',
        age: stateData.citizen_age || stateData.citizenAge || 75,
        gender: stateData.gender || 'Senior Citizen',
        mobile: stateData.citizen_mobile || stateData.phone || '+91 98765-43210',
        living_status: 'LIVES_ALONE',
        aadhaar_masked: 'XXXX-XXXX-4912',
        medical_conditions: 'Senior Citizen Registered under Police Safety Protocol'
      },
      assigned_officer: (assignment.officer_name || stateData.assigned_officer_name) ? {
        id: assignment.police_id || 'POL-1025',
        name: assignment.officer_name || stateData.assigned_officer_name,
        rank: assignment.officer_rank || stateData.assigned_officer_rank || 'Officer',
        police_id: assignment.police_id || 'POL-1025',
        mobile: '+91 98721-44102',
        current_vehicle: assignment.vehicle || 'PCR Patrol Unit',
        avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzZPFuUAA-GjuqoDc0ROMs6dF5KTfabqTVwmZNnY0YDGQ9ceS9un43-t50gBNKIJ4FWwDanXcLlOf3uQ5hE6oF4TjJMUg01bZqIsuDr_TucayV1CUZ0p9svKyoLK9bOq5KNLlmLW_ibbjW1j5gl_SufTcWTSXmmRk8Bl6TuVDgTpWdBrch9ZX1PYhBhZDN0gycUWhzsrGo_k6Lrcij-yVjYLVqigwCWcvqJnVGg0nhy4lGx0JiBO'
      } : null
    };
    applyLocalStorageOverrides(id, result);
    return result;
  }

  if (MOCK_CASE_DATABASE[id]) {
    const base = MOCK_CASE_DATABASE[id];
    const result = JSON.parse(JSON.stringify(base));
    applyLocalStorageOverrides(id, result);
    return result;
  }

  const result = {
    case: {
      id: id || "ANB-SOS-2026-4D9F2",
      citizen_id: `CIT-${(id || '').slice(-4) || '8841'}`,
      citizen_name: "Senior Citizen",
      citizen_age: 75,
      citizen_mobile: "+91 98765-43210",
      emergency_type: "Emergency SOS Alert",
      location_address: "Model Town, Sector 3, Ludhiana",
      latitude: 30.9010,
      longitude: 75.8573,
      created_at: "2026-09-03 20:50:08",
      status: "ACTIVE",
      assignment_details: {
        police_station: "Model Town Police Station",
        station_code: "MTP-PS-01",
        jurisdiction: "District Central • Zone 1",
        assigned_by: "Insp. Raj Kumar"
      }
    },
    citizen: {
      id: `CIT-${(id || '').slice(-4) || '8841'}`,
      name: "Senior Citizen",
      age: 75,
      gender: "Senior Citizen",
      mobile: "+91 98765-43210",
      living_status: "LIVES_ALONE",
      aadhaar_masked: "XXXX-XXXX-4912",
      medical_conditions: "Registered under Police Safety Protocol"
    },
    assigned_officer: null
  };
  applyLocalStorageOverrides(id, result);
  return result;
};

export default function CaseDetails() {
  const { caseId } = useParams();
  const location = useLocation();
  const stateCase = location.state?.caseData;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const navigate = useNavigate();

  const loadCaseDetails = () => {
    setLoading(true);
    fetch(`/api/sos/${caseId}`)
      .then(res => {
        if (!res.ok) throw new Error("Case not found");
        return res.json();
      })
      .then(d => {
        // Merge with local storage overrides
        const storedStatuses = JSON.parse(localStorage.getItem('anubhavi_local_cases_status') || '{}');
        if (storedStatuses[caseId]) {
          d.case.status = storedStatuses[caseId];
        }
        setData(d);
        setSelectedStatus(d.case.status);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        const fallbackCase = getFallbackCase(caseId, stateCase);
        setData(fallbackCase);
        setSelectedStatus(fallbackCase.case.status);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCaseDetails();
  }, [caseId]);

  const handleUpdateStatus = async () => {
    setUpdating(true);
    try {
      const storedStatuses = JSON.parse(localStorage.getItem('anubhavi_local_cases_status') || '{}');
      storedStatuses[caseId] = selectedStatus;
      localStorage.setItem('anubhavi_local_cases_status', JSON.stringify(storedStatuses));

      const res = await fetch(`/api/sos/${caseId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('anubhavi_token')}`
        },
        body: JSON.stringify({ status: selectedStatus })
      });
      loadCaseDetails();
    } catch (e) {
      console.error(e);
      loadCaseDetails();
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-spacing-3xl text-center font-headline-sm text-on-surface-variant">
        Loading operational case file {caseId}...
      </div>
    );
  }

  if (!data || !data.case) {
    return (
      <div className="py-spacing-3xl text-center flex flex-col items-center gap-spacing-md">
        <span className="material-symbols-outlined text-[48px] text-error">error</span>
        <h2 className="font-headline-md font-bold">Case File Not Found</h2>
        <button
          onClick={() => navigate('/sho/dashboard')}
          className="px-spacing-md py-spacing-xs bg-primary text-on-primary rounded font-label-lg"
        >
          RETURN TO DASHBOARD
        </button>
      </div>
    );
  }

  const { case: c, citizen, assigned_officer } = data;
  const assignment = c.assignment_details || {};
  const activeOfficer = assigned_officer || (c.status === 'ASSIGNED' || assignment.officer_name ? {
    id: assignment.officer_id || 'POL-1025',
    name: assignment.officer_name || 'ASI Amit Singh',
    rank: assignment.officer_rank || 'Assistant Sub-Inspector',
    police_id: assignment.police_id || 'POL-1025',
    mobile: '+91 98721-44102',
    current_vehicle: assignment.vehicle || 'PCR Bike #12',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzZPFuUAA-GjuqoDc0ROMs6dF5KTfabqTVwmZNnY0YDGQ9ceS9un43-t50gBNKIJ4FWwDanXcLlOf3uQ5hE6oF4TjJMUg01bZqIsuDr_TucayV1CUZ0p9svKyoLK9bOq5KNLlmLW_ibbjW1j5gl_SufTcWTSXmmRk8Bl6TuVDgTpWdBrch9ZX1PYhBhZDN0gycUWhzsrGo_k6Lrcij-yVjYLVqigwCWcvqJnVGg0nhy4lGx0JiBO'
  } : null);

  return (
    <div className="flex flex-col gap-spacing-lg w-full text-left">
      {/* TOP NAVIGATION BACK BAR */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="px-spacing-md py-spacing-xs bg-surface-container-lowest hover:bg-surface-container-high text-on-surface rounded-lg font-label-lg font-bold shadow-sm border border-surface-container-highest flex items-center gap-spacing-xs transition-all"
        >
          <span className="material-symbols-outlined text-[20px] text-primary">arrow_back</span>
          ← BACK TO DASHBOARD
        </button>
      </div>

      {/* CASE HEADER & STATUS MODIFIER */}
      <div className="relative bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg overflow-hidden border border-surface-container-highest">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-spacing-md relative z-10">
          <div className="flex flex-col gap-spacing-2xs">
            <div className="flex items-center gap-spacing-sm">
              <h1 className="font-headline-lg text-on-surface font-bold tracking-tight">
                {c.emergency_type} ({citizen.name || c.citizen_name})
              </h1>
            </div>
            <p className="font-body-sm text-on-surface-variant flex items-center gap-spacing-xs">
              <span className="material-symbols-outlined text-[16px] text-secondary">domain</span>
              Model Town PS, Central District, Ludhiana • Recorded via National ERSS-112 Ingestion Pipe
            </p>
          </div>


        </div>
      </div>

      {/* MAIN OPERATIONAL CONTAINER */}
      <div className="flex flex-col gap-spacing-lg w-full">
        {/* SECTION A: SENIOR CITIZEN PROFILE */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg relative overflow-hidden border border-surface-container-highest">
          <div className="flex items-center justify-between pb-spacing-sm mb-spacing-md border-b border-surface-container-highest">
            <div className="flex items-center gap-spacing-xs">
              <span className="material-symbols-outlined text-primary text-[22px]">elderly</span>
              <h2 className="font-headline-sm text-on-surface font-bold uppercase tracking-wider">
                Section A: Senior Citizen Registry Profile
              </h2>
            </div>
            <button
              onClick={() => navigate(`/sho/citizens/${c.citizen_id}`)}
              className="px-spacing-xs py-spacing-3xs rounded bg-surface-container-highest text-on-surface font-label-sm font-bold hover:bg-primary hover:text-on-primary transition-all"
            >
              VIEW ONLY →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-spacing-md items-center">
            <div className="md:col-span-4 flex flex-col items-center sm:flex-row gap-spacing-md">
              <img
                src={citizen.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD"}
                alt={citizen.name || c.citizen_name}
                className="w-24 h-24 rounded-full object-cover shadow-sm bg-surface-container flex-shrink-0"
              />
              <div className="flex flex-col text-center sm:text-left">
                <span className="font-headline-md text-on-surface font-bold">{citizen.name || c.citizen_name}</span>
                <span className="font-label-md text-on-surface-variant">{citizen.age || c.citizen_age} Yrs • {citizen.gender || 'Male'} • {citizen.living_status || 'LIVES_ALONE'}</span>
                <span className="font-code-md text-primary font-bold mt-spacing-2xs">{citizen.mobile || c.citizen_mobile}</span>
                <span className="text-[11px] text-secondary mt-1">Aadhaar: {citizen.aadhaar_masked || 'XXXX-XXXX-4912'}</span>
              </div>
            </div>

            <div className="md:col-span-8 bg-surface-container-low p-spacing-md rounded-lg flex flex-col gap-spacing-xs border border-surface-container-highest">
              <span className="font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Registered Residence</span>
              <span className="font-body-sm text-on-surface font-semibold">{c.location_address}</span>


            </div>
          </div>
        </div>

        {/* SECTION B: SOS TELEMETRY */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg flex flex-col gap-spacing-md border border-surface-container-highest">
          <div className="flex items-center justify-between pb-spacing-xs border-b border-surface-container-highest">
            <div className="flex items-center gap-spacing-xs">
              <span className="material-symbols-outlined text-secondary text-[22px]">satellite_alt</span>
              <h2 className="font-headline-sm text-on-surface font-bold uppercase tracking-wider">
                Section B: SOS Alert Telemetry & Tactical Map
              </h2>
            </div>
            <span className="font-label-sm text-on-surface-variant font-semibold">Cell Tower Triangulation + GPS Active</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-spacing-md bg-surface-container-low p-spacing-md rounded-xl">
            <div className="flex flex-col bg-surface-container-lowest p-spacing-sm rounded-lg shadow-sm border border-surface-container-highest">
              <span className="font-label-sm text-on-surface-variant uppercase font-semibold">Triggered At</span>
              <span className="font-code-md text-on-surface font-bold mt-0.5">{c.created_at}</span>
            </div>
            <div className="flex flex-col bg-surface-container-lowest p-spacing-sm rounded-lg shadow-sm border border-surface-container-highest">
              <span className="font-label-sm text-on-surface-variant uppercase font-semibold">Beat Sector</span>
              <span className="font-label-md text-on-surface font-bold mt-0.5">Model Town Sector 3</span>
            </div>
          </div>
        </div>

        {/* SECTION C: ASSIGNED POLICE OFFICER & POLICE STATION */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg flex flex-col gap-spacing-md border border-surface-container-highest">
          <div className="flex items-center justify-between pb-spacing-xs border-b border-surface-container-highest">
            <div className="flex items-center gap-spacing-xs">
              <span className="material-symbols-outlined text-primary text-[22px]">local_police</span>
              <h2 className="font-headline-sm text-on-surface font-bold uppercase tracking-wider">
                Section C: Assigned Response & Police Station Dispatch
              </h2>
            </div>

            {!activeOfficer ? (
              <button
                onClick={() => setShowAssignModal(true)}
                className="px-spacing-md py-spacing-xs bg-primary text-on-primary font-label-sm font-bold rounded shadow hover:bg-on-surface"
              >
                ASSIGN RESPONSE NOW
              </button>
            ) : (
              <span className="px-spacing-xs py-spacing-3xs rounded bg-secondary-container text-on-secondary-container font-label-sm font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-secondary"></span> RESPONSE ASSIGNED
              </span>
            )}
          </div>

          {activeOfficer ? (
            <div className="flex flex-col gap-spacing-md">
              {/* POLICE STATION STRIP */}
              <div className="bg-surface-container-low p-spacing-md rounded-lg border border-surface-container-highest flex flex-col sm:flex-row items-start sm:items-center justify-between gap-spacing-sm">
                <div className="flex flex-col">
                  <span className="font-label-sm text-on-surface-variant uppercase font-bold tracking-wider">Assigned From Police Station</span>
                  <span className="font-headline-sm text-on-surface font-extrabold">{assignment.police_station || 'MODEL TOWN POLICE STATION'}</span>
                  <span className="font-body-sm text-[#2e5746] font-bold mt-0.5">Station Code: <strong className="text-on-surface">{assignment.station_code || 'MTP-PS-01'}</strong> • Jurisdiction: {assignment.jurisdiction || 'Model Town • District Central • Zone 1'}</span>
                </div>
                <div className="flex flex-col items-start sm:items-end">
                  <span className="px-spacing-xs py-spacing-3xs rounded bg-primary-container text-on-primary font-label-sm font-bold uppercase">
                    Status: {c.status}
                  </span>
                  <span className="text-[12px] text-on-surface-variant font-semibold mt-1">Assigned By: {assignment.assigned_by || 'Insp. Raj Kumar'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-spacing-md items-center">
                <div className="md:col-span-3 flex flex-col items-center text-center">
                  <img
                    src={activeOfficer.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzZPFuUAA-GjuqoDc0ROMs6dF5KTfabqTVwmZNnY0YDGQ9ceS9un43-t50gBNKIJ4FWwDanXcLlOf3uQ5hE6oF4TjJMUg01bZqIsuDr_TucayV1CUZ0p9svKyoLK9bOq5KNLlmLW_ibbjW1j5gl_SufTcWTSXmmRk8Bl6TuVDgTpWdBrch9ZX1PYhBhZDN0gycUWhzsrGo_k6Lrcij-yVjYLVqigwCWcvqJnVGg0nhy4lGx0JiBO"}
                    alt={activeOfficer.name}
                    className="w-20 h-20 rounded-full object-cover shadow-sm bg-surface-container"
                  />
                  <span className="font-headline-sm text-on-surface font-bold mt-spacing-xs">{activeOfficer.name}</span>
                  <span className="font-label-sm text-on-surface-variant">Police ID: {activeOfficer.police_id}</span>
                </div>

                <div className="md:col-span-5 grid grid-cols-2 gap-spacing-xs bg-surface-container-low p-spacing-md rounded-lg border border-surface-container-highest">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-on-surface-variant uppercase font-semibold">Rank</span>
                    <span className="font-label-md text-on-surface font-bold">{activeOfficer.rank}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-on-surface-variant uppercase font-semibold">Vehicle Unit</span>
                    <span className="font-label-md text-on-surface font-bold">{assignment.vehicle || activeOfficer.current_vehicle || 'PCR Bike #12'}</span>
                  </div>
                </div>

                <div className="md:col-span-4 flex flex-col gap-spacing-xs">
                  <button
                    onClick={() => alert(`📻 CALLING OFFICER VIA POLICE RADIO CHANNEL: Dispatching to ${activeOfficer.name}...`)}
                    className="w-full py-spacing-xs px-spacing-sm bg-primary text-on-primary rounded font-label-sm font-bold shadow-sm hover:bg-on-surface transition-all flex items-center justify-center gap-spacing-xs"
                  >
                    <span className="material-symbols-outlined text-[18px]">radio</span>
                    CALL OFFICER VIA POLICE RADIO
                  </button>
                  <button
                    onClick={() => setShowAssignModal(true)}
                    className="w-full py-spacing-xs px-spacing-sm bg-surface-container-high text-on-surface rounded font-label-sm font-bold hover:bg-surface-container-highest transition-all flex items-center justify-center gap-spacing-xs"
                  >
                    <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                    REASSIGN OFFICER
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-spacing-lg text-center font-label-md text-on-surface-variant bg-surface-container-low rounded-lg">
              No police officer currently assigned. Click "ASSIGN RESPONSE NOW" to dispatch available beat patrol.
            </div>
          )}
        </div>
      </div>

      {showAssignModal && (
        <OfficerAssignmentModal
          caseId={c.id}
          emergencyType={c.emergency_type}
          location={c.location_address}
          onClose={() => setShowAssignModal(false)}
          onAssigned={loadCaseDetails}
        />
      )}
    </div>
  );
}
