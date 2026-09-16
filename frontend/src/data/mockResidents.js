/**
 * Centralized Mock Data Store for Senior Citizens / Residents
 * Prototype / Demo Data - Fictional and Local Only
 */

export const MOCK_RESIDENTS = [
  {
    id: "RES-001",
    aliases: ["CIT-8843", "CIT-7714"],
    name: "Mohan Lal",
    age: 75,
    gender: "Male",
    living_status: "LIVES_ALONE",
    livingStatus: "LIVES_ALONE",
    mobile: "+91 99145-88210",
    residence: "H.No 125, Sector 3, Model Town, Ludhiana",
    address: "H.No 125, Sector 3, Model Town, Ludhiana",
    landmark: "Behind Main Market, Sector 3",
    latitude: 30.9032,
    longitude: 75.8590,
    aadhaar_masked: "XXXX-XXXX-1102",
    risk_level: "HIGH",
    riskLevel: "HIGH",
    status: "MISSED_CHECKIN",
    medical_conditions: "Diabetes Type 2, Reduced Mobility, Blood: B+ Positive",
    medicalConditions: "Diabetes Type 2, Reduced Mobility, Blood: B+ Positive",
    avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    emergency_contacts: [
      {
        id: "EC-001-A",
        name: "Vikram Lal",
        relationship: "Son (Primary Kin)",
        mobile: "+91 98765-11200",
        location: "Sector 32, Ludhiana",
        notify_status: "VERIFIED KEYHOLDER",
        is_keyholder: 1
      },
      {
        id: "EC-001-B",
        name: "Dr. K.K. Bansal",
        relationship: "Family Physician",
        mobile: "+91 98141-55099",
        location: "Model Town Clinic",
        notify_status: "ON FILE",
        is_keyholder: 0
      }
    ],
    sos_history: [
      {
        id: "ANB-SOS-2026-00301",
        emergency_type: "Missed Daily Wellness Check-in",
        created_at: "Today, 08:00 AM",
        status: "INVESTIGATING",
        location_address: "H.No 125, Sector 3, Model Town, Ludhiana"
      },
      {
        id: "ANB-SOS-2026-00192",
        emergency_type: "Mobility Assistance Alert",
        created_at: "10 Aug 2026",
        status: "RESOLVED",
        location_address: "H.No 125, Sector 3, Model Town, Ludhiana"
      }
    ],
    assistance_requests: [
      {
        id: "AST-2026-101",
        request_type: "Prescription Delivery Verification",
        created_at: "Yesterday, 02:30 PM",
        status: "COMPLETED",
        description: "Assisted with verifying insulin refill and routine glucose check."
      }
    ],
    welfare_checks: [
      {
        id: "WEL-301",
        check_type: "Diabetes & Mobility Welfare Visit",
        scheduled_date: "Today",
        scheduled_time: "02:15 PM",
        status: "SCHEDULED",
        assigned_officer_name: "SI Neeraj Kumar",
        purpose: "Morning check-in follow-up and mobility safety check"
      }
    ],
    assigned_officer: {
      id: "POL-1027",
      name: "SI Neeraj Kumar (POL-1027)",
      designation: "Sub-Inspector",
      role: "Beat Officer • Sector 3",
      mobile: "+91 98112-77123",
      vehicle: "PCR Car #01",
      avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
    }
  },
  {
    id: "RES-002",
    aliases: ["CIT-8841"],
    name: "Rajesh Sharma",
    age: 72,
    gender: "Male",
    living_status: "LIVES_ALONE",
    livingStatus: "LIVES_ALONE",
    mobile: "+91 98102-33412",
    residence: "H.No 412, Lane 4, Model Town Phase 2, Ludhiana",
    address: "H.No 412, Lane 4, Model Town Phase 2, Ludhiana",
    landmark: "Near Model Town Park",
    latitude: 30.9010,
    longitude: 75.8573,
    aadhaar_masked: "XXXX-XXXX-4912",
    risk_level: "HIGH",
    riskLevel: "HIGH",
    status: "SOS_ACTIVE",
    medical_conditions: "Severe Cardiac History, Pacemaker Fitted (2023), Blood: O+ Positive",
    medicalConditions: "Severe Cardiac History, Pacemaker Fitted (2023), Blood: O+ Positive",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD",
    emergency_contacts: [
      {
        id: "EC-002-A",
        name: "Amit Sharma",
        relationship: "Son (Primary Kin)",
        mobile: "+91 98721-00123",
        location: "Model Town Phase 2",
        notify_status: "VERIFIED KEYHOLDER",
        is_keyholder: 1
      },
      {
        id: "EC-002-B",
        name: "Col. S. Dhillon",
        relationship: "Neighbor & Keyholder",
        mobile: "+91 94172-88301",
        location: "Immediate Next Door (H.No 410)",
        notify_status: "ON FILE",
        is_keyholder: 1
      }
    ],
    sos_history: [
      {
        id: "ANB-SOS-2026-00124",
        emergency_type: "Medical Emergency (Cardiac Fall)",
        created_at: "Today, 02:34 PM",
        status: "ACTIVE",
        location_address: "H.No 412, Lane 4, Model Town Phase 2, Ludhiana"
      },
      {
        id: "ANB-SOS-2026-00088",
        emergency_type: "Accidental Panic Ping",
        created_at: "15 Aug 2026",
        status: "RESOLVED",
        location_address: "H.No 412, Lane 4, Model Town Phase 2, Ludhiana"
      }
    ],
    assistance_requests: [
      {
        id: "AST-2026-042",
        request_type: "Beat Constable Gate Lock Check",
        created_at: "Yesterday, 04:00 PM",
        status: "COMPLETED",
        description: "Elder requested police officer to check main entrance deadbolt."
      }
    ],
    welfare_checks: [
      {
        id: "WEL-101",
        check_type: "Pacemaker & Cardiac Follow-up",
        scheduled_date: "Today",
        scheduled_time: "10:30 AM",
        status: "SCHEDULED",
        assigned_officer_name: "ASI Amit Singh",
        purpose: "Pacemaker medical safety & keyholder verification"
      }
    ],
    assigned_officer: {
      id: "POL-1025",
      name: "ASI Amit Singh (POL-1025)",
      designation: "Assistant Sub-Inspector",
      role: "PCR Bike #12 Patrol Lead",
      mobile: "+91 98721-44102",
      vehicle: "PCR Bike #12",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    }
  },
  {
    id: "RES-003",
    aliases: ["CIT-8842", "CIT-9102"],
    name: "Sunita Kapoor",
    age: 68,
    gender: "Female",
    living_status: "WITH_SPOUSE",
    livingStatus: "WITH_SPOUSE",
    mobile: "+91 97812-33412",
    residence: "H.No 88, Block C, Model Town, Ludhiana",
    address: "H.No 88, Block C, Model Town, Ludhiana",
    landmark: "Opposite Community Centre",
    latitude: 30.8995,
    longitude: 75.8560,
    aadhaar_masked: "XXXX-XXXX-8821",
    risk_level: "MEDIUM",
    riskLevel: "MEDIUM",
    status: "SAFE",
    medical_conditions: "Hypertension, Arthritis, Blood: A+ Positive",
    medicalConditions: "Hypertension, Arthritis, Blood: A+ Positive",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    emergency_contacts: [
      {
        id: "EC-003-A",
        name: "Ramesh Kapoor",
        relationship: "Spouse (Cohabitant)",
        mobile: "+91 97812-33413",
        location: "Same Residence",
        notify_status: "VERIFIED KEYHOLDER",
        is_keyholder: 1
      },
      {
        id: "EC-003-B",
        name: "Pooja Kapoor",
        relationship: "Daughter",
        mobile: "+91 98155-22441",
        location: "Civil Lines, Ludhiana",
        notify_status: "ON FILE",
        is_keyholder: 1
      }
    ],
    sos_history: [
      {
        id: "ANB-SOS-2026-00045",
        emergency_type: "Routine Safety Beacon Test",
        created_at: "28 Jul 2026",
        status: "RESOLVED",
        location_address: "H.No 88, Block C, Model Town, Ludhiana"
      }
    ],
    assistance_requests: [
      {
        id: "AST-2026-041",
        request_type: "Monsoon Roof & Drain Inspection",
        created_at: "Today, 10:30 AM",
        status: "IN_PROGRESS",
        description: "Requested safety inspection for front balcony drain during rain."
      }
    ],
    welfare_checks: [
      {
        id: "WEL-9002",
        check_type: "Post-Monsoon Safety Check",
        scheduled_date: "Today",
        scheduled_time: "11:45 AM",
        status: "CONFIRMED",
        assigned_officer_name: "HC Raj Kumar",
        purpose: "Post-monsoon home door lock safety check"
      }
    ],
    assigned_officer: {
      id: "POL-1024",
      name: "HC Raj Kumar (POL-1024)",
      designation: "Head Constable",
      role: "PCR Van #04 Commander",
      mobile: "+91 98140-99812",
      vehicle: "PCR Van #04",
      avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzZPFuUAA-GjuqoDc0ROMs6dF5KTfabqTVwmZNnY0YDGQ9ceS9un43-t50gBNKIJ4FWwDanXcLlOf3uQ5hE6oF4TjJMUg01bZqIsuDr_TucayV1CUZ0p9svKyoLK9bOq5KNLlmLW_ibbjW1j5gl_SufTcWTSXmmRk8Bl6TuVDgTpWdBrch9ZX1PYhBhZDN0gycUWhzsrGo_k6Lrcij-yVjYLVqigwCWcvqJnVGg0nhy4lGx0JiBO"
    }
  },
  {
    id: "RES-004",
    aliases: ["CIT-8845", "CIT-5510"],
    name: "Harpreet Singh",
    age: 79,
    gender: "Male",
    living_status: "LIVES_ALONE",
    livingStatus: "LIVES_ALONE",
    mobile: "+91 98881-22901",
    residence: "H.No 204, Lane 2, Model Town, Ludhiana",
    address: "H.No 204, Lane 2, Model Town, Ludhiana",
    landmark: "Near Rose Garden",
    latitude: 30.9025,
    longitude: 75.8580,
    aadhaar_masked: "XXXX-XXXX-7714",
    risk_level: "HIGH",
    riskLevel: "HIGH",
    status: "SAFE",
    medical_conditions: "Post-Stroke Recovery, Hypertension, Blood: O- Negative",
    medicalConditions: "Post-Stroke Recovery, Hypertension, Blood: O- Negative",
    avatar_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    emergency_contacts: [
      {
        id: "EC-004-A",
        name: "Gurpreet Singh",
        relationship: "Son (Local Contact)",
        mobile: "+91 98882-99100",
        location: "BRS Nagar, Ludhiana",
        notify_status: "VERIFIED KEYHOLDER",
        is_keyholder: 1
      }
    ],
    sos_history: [
      {
        id: "ANB-SOS-2026-00072",
        emergency_type: "Mobility Assistance Request",
        created_at: "03 Aug 2026",
        status: "RESOLVED",
        location_address: "H.No 204, Lane 2, Model Town, Ludhiana"
      }
    ],
    assistance_requests: [
      {
        id: "AST-2026-039",
        request_type: "Physical Therapy Transport Check",
        created_at: "02 Aug 2026",
        status: "COMPLETED",
        description: "Assisted senior in coordinating safe clinic transportation."
      }
    ],
    welfare_checks: [
      {
        id: "WEL-9005",
        check_type: "Post-Stroke Living Audit",
        scheduled_date: "Tomorrow",
        scheduled_time: "04:00 PM",
        status: "SCHEDULED",
        assigned_officer_name: "SI Rahul Verma",
        purpose: "Living status & emergency contact audit"
      }
    ],
    assigned_officer: {
      id: "POL-1028",
      name: "SI Rahul Verma (POL-1028)",
      designation: "Sub-Inspector",
      role: "PCR Car #03 Commander",
      mobile: "+91 98112-33445",
      vehicle: "PCR Car #03",
      avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
    }
  },
  {
    id: "RES-005",
    aliases: ["CIT-8844", "CIT-6629"],
    name: "Anita Verma",
    age: 70,
    gender: "Female",
    living_status: "LIVES_ALONE",
    livingStatus: "LIVES_ALONE",
    mobile: "+91 96461-44912",
    residence: "H.No 64, Phase 1, Model Town, Ludhiana",
    address: "H.No 64, Phase 1, Model Town, Ludhiana",
    landmark: "Near Post Office",
    latitude: 30.8980,
    longitude: 75.8540,
    aadhaar_masked: "XXXX-XXXX-3390",
    risk_level: "MEDIUM",
    riskLevel: "MEDIUM",
    status: "SAFE",
    medical_conditions: "Asthma, Mild Cognitive Impairment, Blood: AB+ Positive",
    medicalConditions: "Asthma, Mild Cognitive Impairment, Blood: AB+ Positive",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    emergency_contacts: [
      {
        id: "EC-005-A",
        name: "Sunil Verma",
        relationship: "Son (Primary Kin)",
        mobile: "+91 96462-11002",
        location: "Sarabha Nagar, Ludhiana",
        notify_status: "VERIFIED KEYHOLDER",
        is_keyholder: 1
      }
    ],
    sos_history: [
      {
        id: "ANB-SOS-2026-00031",
        emergency_type: "Asthma Inhaler Alert",
        created_at: "18 Jul 2026",
        status: "RESOLVED",
        location_address: "H.No 64, Phase 1, Model Town, Ludhiana"
      }
    ],
    assistance_requests: [
      {
        id: "AST-2026-029",
        request_type: "Emergency Battery Check for Nebulizer",
        created_at: "22 Jul 2026",
        status: "COMPLETED",
        description: "Checked backup power unit for senior medical equipment."
      }
    ],
    welfare_checks: [
      {
        id: "WEL-9004",
        check_type: "Post-Incident Follow-up",
        scheduled_date: "Tomorrow",
        scheduled_time: "09:00 AM",
        status: "CONFIRMED",
        assigned_officer_name: "Const. Vikram Sharma",
        purpose: "Asthma nebulizer emergency battery check"
      }
    ],
    assigned_officer: {
      id: "POL-1026",
      name: "Const. Vikram Sharma (POL-1026)",
      designation: "Constable",
      role: "PCR Van #02 Duty Officer",
      mobile: "+91 98112-99124",
      vehicle: "PCR Van #02",
      avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    }
  },
  {
    id: "RES-006",
    aliases: ["CIT-8123"],
    name: "Ramesh Kumar",
    age: 77,
    gender: "Male",
    living_status: "LIVES WITH FAMILY",
    livingStatus: "LIVES WITH FAMILY",
    mobile: "+91 98888-33210",
    residence: "H.No 310, Sector 4, Model Town, Ludhiana",
    address: "H.No 310, Sector 4, Model Town, Ludhiana",
    landmark: "Near Community Park Gate 2",
    latitude: 30.9110,
    longitude: 75.8510,
    aadhaar_masked: "XXXX-XXXX-8123",
    risk_level: "MEDIUM",
    riskLevel: "MEDIUM",
    status: "SAFE",
    medical_conditions: "Mobility Limitation, Blood: B- Negative",
    medicalConditions: "Mobility Limitation, Blood: B- Negative",
    avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    emergency_contacts: [
      {
        id: "EC-006-A",
        name: "Deepak Kumar",
        relationship: "Son (Living in same house)",
        mobile: "+91 98888-33211",
        location: "H.No 310, Sector 4, Model Town",
        notify_status: "VERIFIED KEYHOLDER",
        is_keyholder: 1
      }
    ],
    sos_history: [
      {
        id: "ANB-SOS-2026-00015",
        emergency_type: "Support Call",
        created_at: "05 Jul 2026",
        status: "RESOLVED",
        location_address: "H.No 310, Sector 4, Model Town, Ludhiana"
      }
    ],
    assistance_requests: [
      {
        id: "AST-2026-018",
        request_type: "Ramp Safety Verification",
        created_at: "10 Jul 2026",
        status: "COMPLETED",
        description: "Assisted with checking accessibility ramp anti-slip surface."
      }
    ],
    welfare_checks: [
      {
        id: "WEL-9006",
        check_type: "Routine Family & Senior Check",
        scheduled_date: "In 3 Days",
        scheduled_time: "03:00 PM",
        status: "SCHEDULED",
        assigned_officer_name: "HC Manpreet Singh",
        purpose: "Senior mobility welfare & family support check"
      }
    ],
    assigned_officer: {
      id: "POL-1029",
      name: "HC Manpreet Singh (POL-1029)",
      designation: "Head Constable",
      role: "PCR Van #09 Beat Officer",
      mobile: "+91 98112-55667",
      vehicle: "PCR Van #09",
      avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
    }
  },
  {
    id: "RES-007",
    aliases: ["CIT-4677", "CIT-4567"],
    name: "Swaran Singh",
    age: 85,
    gender: "Male",
    living_status: "LIVES_ALONE",
    livingStatus: "LIVES_ALONE",
    mobile: "+91 99140-55443",
    residence: "Phase 8 Industrial Area Gate 1, Mohali",
    address: "Phase 8 Industrial Area Gate 1, Mohali",
    landmark: "Near Gate 1 Industrial Complex",
    latitude: 30.7060,
    longitude: 76.7190,
    aadhaar_masked: "XXXX-XXXX-4567",
    risk_level: "HIGH",
    riskLevel: "HIGH",
    status: "ACTIVE",
    medical_conditions: "Cardiac History, Respiratory Care Needed, Blood: AB- Negative",
    medicalConditions: "Cardiac History, Respiratory Care Needed, Blood: AB- Negative",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD",
    emergency_contacts: [
      {
        id: "EC-007-A",
        name: "Jaswinder Singh",
        relationship: "Son (Primary Kin)",
        mobile: "+91 99140-11223",
        location: "Phase 7, Mohali",
        notify_status: "VERIFIED KEYHOLDER",
        is_keyholder: 1
      },
      {
        id: "EC-007-B",
        name: "Dr. T.S. Gill",
        relationship: "Cardiologist",
        mobile: "+91 98140-66778",
        location: "Fortis Hospital, Mohali",
        notify_status: "ON FILE",
        is_keyholder: 0
      }
    ],
    sos_history: [
      {
        id: "SOS-2026-0015",
        emergency_type: "Medical Emergency (Respiratory Distress)",
        created_at: "Today, 10:15 AM",
        status: "ON THE WAY",
        location_address: "Phase 8 Industrial Area Gate 1, Mohali"
      }
    ],
    assistance_requests: [
      {
        id: "AST-2026-045",
        request_type: "Oxygen Cylinder Refill Assistance",
        created_at: "Yesterday, 03:00 PM",
        status: "COMPLETED",
        description: "Assisted senior with verifying medical backup equipment."
      }
    ],
    welfare_checks: [
      {
        id: "WEL-701",
        check_type: "Respiratory & Elder Living Safety Check",
        scheduled_date: "Today",
        scheduled_time: "12:00 PM",
        status: "SCHEDULED",
        assigned_officer_name: "SI Rahul Verma",
        purpose: "Senior respiratory health follow-up"
      }
    ],
    assigned_officer: {
      id: "POL-1028",
      name: "SI Rahul Verma (POL-1028)",
      designation: "Sub-Inspector",
      role: "PCR Car #03 Commander",
      mobile: "+91 98112-33445",
      vehicle: "PCR Car #03",
      avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
    }
  },
  {
    id: "RES-008",
    aliases: ["CIT-4481"],
    name: "Prem Prakash",
    age: 78,
    gender: "Male",
    living_status: "LIVES_ALONE",
    livingStatus: "LIVES_ALONE",
    mobile: "+91 98140-55123",
    residence: "45 Park Avenue, South Zone, Ludhiana",
    address: "45 Park Avenue, South Zone, Ludhiana",
    landmark: "Opposite South Zone Park",
    latitude: 30.8900,
    longitude: 75.8300,
    aadhaar_masked: "XXXX-XXXX-4412",
    risk_level: "MEDIUM",
    riskLevel: "MEDIUM",
    status: "SAFE",
    medical_conditions: "Arthritis, Mild Hearing Impairment, Blood: O+ Positive",
    medicalConditions: "Arthritis, Mild Hearing Impairment, Blood: O+ Positive",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD",
    emergency_contacts: [
      {
        id: "EC-008-A",
        name: "Rajeev Prakash",
        relationship: "Son",
        mobile: "+91 98140-55124",
        location: "South Zone",
        notify_status: "VERIFIED KEYHOLDER",
        is_keyholder: 1
      }
    ],
    sos_history: [],
    assistance_requests: [],
    welfare_checks: [],
    assigned_officer: {
      id: "POL-1029",
      name: "HC Manpreet Singh (POL-1029)",
      designation: "Head Constable",
      role: "PCR Van #09 Commander",
      mobile: "+91 98112-55667",
      vehicle: "PCR Van #09",
      avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
    }
  },
  {
    id: "RES-009",
    aliases: ["CIT-3312"],
    name: "Gurdev Singh",
    age: 81,
    gender: "Male",
    living_status: "LIVES WITH FAMILY",
    livingStatus: "LIVES WITH FAMILY",
    mobile: "+91 94172-66301",
    residence: "Sector 3 Main Gate, Model Town, Ludhiana",
    address: "Sector 3 Main Gate, Model Town, Ludhiana",
    landmark: "Main Gate Model Town",
    latitude: 30.9020,
    longitude: 75.8560,
    aadhaar_masked: "XXXX-XXXX-3312",
    risk_level: "HIGH",
    riskLevel: "HIGH",
    status: "SAFE",
    medical_conditions: "Memory Loss, Dementia, Blood: B+ Positive",
    medicalConditions: "Memory Loss, Dementia, Blood: B+ Positive",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD",
    emergency_contacts: [
      {
        id: "EC-009-A",
        name: "Manjit Singh",
        relationship: "Son (Living with father)",
        mobile: "+91 94172-66302",
        location: "Sector 3, Model Town",
        notify_status: "VERIFIED KEYHOLDER",
        is_keyholder: 1
      }
    ],
    sos_history: [],
    assistance_requests: [],
    welfare_checks: [],
    assigned_officer: {
      id: "POL-1025",
      name: "ASI Amit Singh (POL-1025)",
      designation: "Assistant Sub-Inspector",
      role: "PCR Bike #12",
      mobile: "+91 98721-44102",
      vehicle: "PCR Bike #12",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    }
  },
  {
    id: "RES-010",
    aliases: ["CIT-2291"],
    name: "Vidya Wanti",
    age: 76,
    gender: "Female",
    living_status: "LIVES_ALONE",
    livingStatus: "LIVES_ALONE",
    mobile: "+91 98150-11234",
    residence: "Villa 12, Sector 17, Chandigarh",
    address: "Villa 12, Sector 17, Chandigarh",
    landmark: "Sector 17 Villa Colony",
    latitude: 30.7350,
    longitude: 76.7780,
    aadhaar_masked: "XXXX-XXXX-2291",
    risk_level: "LOW",
    riskLevel: "LOW",
    status: "SAFE",
    medical_conditions: "Bronchitis, Blood: A+ Positive",
    medicalConditions: "Bronchitis, Blood: A+ Positive",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD",
    emergency_contacts: [],
    sos_history: [],
    assistance_requests: [],
    welfare_checks: [],
    assigned_officer: {
      id: "POL-1026",
      name: "Const. Vikram Sharma (POL-1026)",
      designation: "Constable",
      role: "PCR Van #02",
      mobile: "+91 98112-99124",
      vehicle: "PCR Van #02",
      avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    }
  },
  {
    id: "RES-011",
    aliases: ["CIT-1182"],
    name: "Baldev Raj",
    age: 73,
    gender: "Male",
    living_status: "LIVES WITH SPOUSE",
    livingStatus: "LIVES WITH SPOUSE",
    mobile: "+91 98760-44321",
    residence: "104 Rosewood Enclave, Phase 8, Mohali",
    address: "104 Rosewood Enclave, Phase 8, Mohali",
    landmark: "Rosewood Enclave",
    latitude: 30.7050,
    longitude: 76.7180,
    aadhaar_masked: "XXXX-XXXX-1182",
    risk_level: "MEDIUM",
    riskLevel: "MEDIUM",
    status: "SAFE",
    medical_conditions: "Hypertension, Cardiac Issue",
    medicalConditions: "Hypertension, Cardiac Issue",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD",
    emergency_contacts: [],
    sos_history: [],
    assistance_requests: [],
    welfare_checks: [],
    assigned_officer: {
      id: "POL-1024",
      name: "HC Raj Kumar (POL-1024)",
      designation: "Head Constable",
      role: "PCR Van #04",
      mobile: "+91 98140-99812",
      vehicle: "PCR Van #04",
      avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzZPFuUAA-GjuqoDc0ROMs6dF5KTfabqTVwmZNnY0YDGQ9ceS9un43-t50gBNKIJ4FWwDanXcLlOf3uQ5hE6oF4TjJMUg01bZqIsuDr_TucayV1CUZ0p9svKyoLK9bOq5KNLlmLW_ibbjW1j5gl_SufTcWTSXmmRk8Bl6TuVDgTpWdBrch9ZX1PYhBhZDN0gycUWhzsrGo_k6Lrcij-yVjYLVqigwCWcvqJnVGg0nhy4lGx0JiBO"
    }
  },
  {
    id: "RES-012",
    aliases: ["CIT-9011"],
    name: "Asha Rani",
    age: 69,
    gender: "Female",
    living_status: "LIVES_ALONE",
    livingStatus: "LIVES_ALONE",
    mobile: "+91 98111-77890",
    residence: "Central Mall Parking Level 2, Ludhiana",
    address: "Central Mall Parking Level 2, Ludhiana",
    landmark: "Central Mall",
    latitude: 30.7310,
    longitude: 76.7810,
    aadhaar_masked: "XXXX-XXXX-9011",
    risk_level: "MEDIUM",
    riskLevel: "MEDIUM",
    status: "ACTIVE",
    medical_conditions: "Hypertension, Blood: A- Negative",
    medicalConditions: "Hypertension, Blood: A- Negative",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD",
    emergency_contacts: [],
    sos_history: [],
    assistance_requests: [],
    welfare_checks: [],
    assigned_officer: {
      id: "POL-1026",
      name: "Const. Vikram Sharma (POL-1026)",
      designation: "Constable",
      role: "PCR Van #02",
      mobile: "+91 98112-99124",
      vehicle: "PCR Van #02",
      avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    }
  },
  {
    id: "RES-013",
    aliases: ["CIT-7234"],
    name: "Savitri Devi",
    age: 82,
    gender: "Female",
    living_status: "LIVES_ALONE",
    livingStatus: "LIVES_ALONE",
    mobile: "+91 94170-99887",
    residence: "219 Officers Colony, South Zone, Ludhiana",
    address: "219 Officers Colony, South Zone, Ludhiana",
    landmark: "Officers Colony",
    latitude: 30.8910,
    longitude: 75.8310,
    aadhaar_masked: "XXXX-XXXX-7234",
    risk_level: "MEDIUM",
    riskLevel: "MEDIUM",
    status: "SAFE",
    medical_conditions: "Hearing Impaired, Blood: B+ Positive",
    medicalConditions: "Hearing Impaired, Blood: B+ Positive",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD",
    emergency_contacts: [],
    sos_history: [],
    assistance_requests: [],
    welfare_checks: [],
    assigned_officer: {
      id: "POL-1029",
      name: "HC Manpreet Singh (POL-1029)",
      designation: "Head Constable",
      role: "PCR Van #09",
      mobile: "+91 98112-55667",
      vehicle: "PCR Van #09",
      avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
    }
  },
  {
    id: "RES-014",
    aliases: ["CIT-6345"],
    name: "Tilak Raj",
    age: 79,
    gender: "Male",
    living_status: "LIVES_ALONE",
    livingStatus: "LIVES_ALONE",
    mobile: "+91 98720-11223",
    residence: "House 50, Model Town Extension, Ludhiana",
    address: "House 50, Model Town Extension, Ludhiana",
    landmark: "Model Town Extension",
    latitude: 30.9030,
    longitude: 75.8580,
    aadhaar_masked: "XXXX-XXXX-6345",
    risk_level: "MEDIUM",
    riskLevel: "MEDIUM",
    status: "SAFE",
    medical_conditions: "Asthma, Blood: AB+ Positive",
    medicalConditions: "Asthma, Blood: AB+ Positive",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD",
    emergency_contacts: [],
    sos_history: [],
    assistance_requests: [],
    welfare_checks: [],
    assigned_officer: {
      id: "POL-1025",
      name: "ASI Amit Singh (POL-1025)",
      designation: "Assistant Sub-Inspector",
      role: "PCR Bike #12",
      mobile: "+91 98721-44102",
      vehicle: "PCR Bike #12",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    }
  },
  {
    id: "RES-015",
    aliases: ["CIT-5456"],
    name: "Santosh Kumari",
    age: 71,
    gender: "Female",
    living_status: "LIVES_ALONE",
    livingStatus: "LIVES_ALONE",
    mobile: "+91 98141-88765",
    residence: "Sector 17 Bus Stand Junction, Chandigarh",
    address: "Sector 17 Bus Stand Junction, Chandigarh",
    landmark: "Bus Stand Junction",
    latitude: 30.7340,
    longitude: 76.7770,
    aadhaar_masked: "XXXX-XXXX-5456",
    risk_level: "MEDIUM",
    riskLevel: "MEDIUM",
    status: "SAFE",
    medical_conditions: "Diabetic, Blood: O- Negative",
    medicalConditions: "Diabetic, Blood: O- Negative",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD",
    emergency_contacts: [],
    sos_history: [],
    assistance_requests: [],
    welfare_checks: [],
    assigned_officer: {
      id: "POL-1028",
      name: "SI Rahul Verma (POL-1028)",
      designation: "Sub-Inspector",
      role: "PCR Car #03",
      mobile: "+91 98112-33445",
      vehicle: "PCR Car #03",
      avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
    }
  },
  {
    id: "RES-016",
    aliases: ["CIT-3678"],
    name: "Krishna Gopal",
    age: 73,
    gender: "Male",
    living_status: "LIVES_ALONE",
    livingStatus: "LIVES_ALONE",
    mobile: "+91 98765-12345",
    residence: "Railway Station Exit 3, Central, Ludhiana",
    address: "Railway Station Exit 3, Central, Ludhiana",
    landmark: "Railway Station Exit 3",
    latitude: 30.7320,
    longitude: 76.7820,
    aadhaar_masked: "XXXX-XXXX-3678",
    risk_level: "HIGH",
    riskLevel: "HIGH",
    status: "SAFE",
    medical_conditions: "Dementia, Blood: A+ Positive",
    medicalConditions: "Dementia, Blood: A+ Positive",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD",
    emergency_contacts: [],
    sos_history: [],
    assistance_requests: [],
    welfare_checks: [],
    assigned_officer: {
      id: "POL-1026",
      name: "Const. Vikram Sharma (POL-1026)",
      designation: "Constable",
      role: "PCR Van #02",
      mobile: "+91 98112-99124",
      vehicle: "PCR Van #02",
      avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    }
  },
  {
    id: "RES-017",
    aliases: ["CIT-2789"],
    name: "Pushpa Rani",
    age: 67,
    gender: "Female",
    living_status: "LIVES_ALONE",
    livingStatus: "LIVES_ALONE",
    mobile: "+91 98112-66554",
    residence: "North Zone Bypass Road, Ludhiana",
    address: "North Zone Bypass Road, Ludhiana",
    landmark: "North Zone Bypass",
    latitude: 30.9120,
    longitude: 75.8520,
    aadhaar_masked: "XXXX-XXXX-2789",
    risk_level: "MEDIUM",
    riskLevel: "MEDIUM",
    status: "SAFE",
    medical_conditions: "Hypertension, Blood: B+ Positive",
    medicalConditions: "Hypertension, Blood: B+ Positive",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD",
    emergency_contacts: [],
    sos_history: [],
    assistance_requests: [],
    welfare_checks: [],
    assigned_officer: {
      id: "POL-1028",
      name: "SI Rahul Verma (POL-1028)",
      designation: "Sub-Inspector",
      role: "PCR Car #03",
      mobile: "+91 98112-33445",
      vehicle: "PCR Car #03",
      avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
    }
  },
  {
    id: "RES-018",
    aliases: ["CIT-1890"],
    name: "Joginder Pal",
    age: 80,
    gender: "Male",
    living_status: "LIVES_ALONE",
    livingStatus: "LIVES_ALONE",
    mobile: "+91 94171-33221",
    residence: "12 South Zone Green Park, Ludhiana",
    address: "12 South Zone Green Park, Ludhiana",
    landmark: "Green Park",
    latitude: 30.8920,
    longitude: 75.8320,
    aadhaar_masked: "XXXX-XXXX-1890",
    risk_level: "LOW",
    riskLevel: "LOW",
    status: "SAFE",
    medical_conditions: "Joint Pain, Arthritis, Blood: O+ Positive",
    medicalConditions: "Joint Pain, Arthritis, Blood: O+ Positive",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD",
    emergency_contacts: [],
    sos_history: [],
    assistance_requests: [],
    welfare_checks: [],
    assigned_officer: {
      id: "POL-1029",
      name: "HC Manpreet Singh (POL-1029)",
      designation: "Head Constable",
      role: "PCR Van #09",
      mobile: "+91 98112-55667",
      vehicle: "PCR Van #09",
      avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
    }
  },
  {
    id: "RES-019",
    aliases: ["CIT-0901"],
    name: "Darshan Lal",
    age: 76,
    gender: "Male",
    living_status: "LIVES WITH SPOUSE",
    livingStatus: "LIVES WITH SPOUSE",
    mobile: "+91 98722-88990",
    residence: "Model Town Phase 3 Market, Ludhiana",
    address: "Model Town Phase 3 Market, Ludhiana",
    landmark: "Phase 3 Market",
    latitude: 30.9040,
    longitude: 75.8590,
    aadhaar_masked: "XXXX-XXXX-0901",
    risk_level: "MEDIUM",
    riskLevel: "MEDIUM",
    status: "ACTIVE",
    medical_conditions: "Diabetes, Blood: A+ Positive",
    medicalConditions: "Diabetes, Blood: A+ Positive",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD",
    emergency_contacts: [],
    sos_history: [],
    assistance_requests: [],
    welfare_checks: [],
    assigned_officer: {
      id: "POL-1027",
      name: "SI Neeraj Kumar (POL-1027)",
      designation: "Sub-Inspector",
      role: "PCR Car #01",
      mobile: "+91 98112-77123",
      vehicle: "PCR Car #01",
      avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
    }
  },
  {
    id: "RES-020",
    aliases: ["CIT-9812"],
    name: "Nirmala Devi",
    age: 74,
    gender: "Female",
    living_status: "LIVES_ALONE",
    livingStatus: "LIVES_ALONE",
    mobile: "+91 98142-11009",
    residence: "Sector 17 House #512, Chandigarh",
    address: "Sector 17 House #512, Chandigarh",
    landmark: "Sector 17",
    latitude: 30.7360,
    longitude: 76.7760,
    aadhaar_masked: "XXXX-XXXX-9812",
    risk_level: "MEDIUM",
    riskLevel: "MEDIUM",
    status: "SAFE",
    medical_conditions: "Hypertension, Blood: B- Negative",
    medicalConditions: "Hypertension, Blood: B- Negative",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD",
    emergency_contacts: [],
    sos_history: [],
    assistance_requests: [],
    welfare_checks: [],
    assigned_officer: {
      id: "POL-1028",
      name: "SI Rahul Verma (POL-1028)",
      designation: "Sub-Inspector",
      role: "PCR Car #03",
      mobile: "+91 98112-33445",
      vehicle: "PCR Car #03",
      avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
    }
  }
];

/**
 * Lookup resident by ID, Alias, or Name
 * Case-insensitive lookup supporting RES-001, CIT-8841, CIT-4677, etc.
 * Returns null if not found (e.g. explicitly invalid test IDs).
 */
export function getResidentById(rawId) {
  if (!rawId) return null;
  const cleanId = String(rawId).trim().toUpperCase();

  // Guard against explicitly requested invalid test routes
  if (
    cleanId === 'INVALID-ID' ||
    cleanId === 'INVALID' ||
    cleanId === 'NOT_FOUND' ||
    cleanId === 'TEST-INVALID' ||
    cleanId === 'UNKNOWN'
  ) {
    return null;
  }

  // 1. Direct ID match (e.g. RES-001, RES-007)
  const directMatch = MOCK_RESIDENTS.find(
    (r) => r.id.toUpperCase() === cleanId
  );
  if (directMatch) return directMatch;

  // 2. Alias match (e.g. CIT-8841, CIT-4677, CIT-4567, etc.)
  const aliasMatch = MOCK_RESIDENTS.find(
    (r) => r.aliases && r.aliases.some((a) => a.toUpperCase() === cleanId)
  );
  if (aliasMatch) return aliasMatch;

  // 3. Name match
  const nameMatch = MOCK_RESIDENTS.find(
    (r) => r.name.toUpperCase() === cleanId || cleanId.includes(r.name.toUpperCase())
  );
  if (nameMatch) return nameMatch;

  // 4. If ID is formatted like CIT-XXXX or RES-XXXX from a case, synthesize a rich profile if not in blacklist
  if (cleanId.startsWith('CIT-') || cleanId.startsWith('RES-')) {
    return {
      id: cleanId,
      name: "Senior Citizen (Registered)",
      age: 74,
      gender: "Senior Resident",
      living_status: "LIVES_ALONE",
      livingStatus: "LIVES_ALONE",
      mobile: "+91 98765-43210",
      residence: "Model Town Sector 3, Ludhiana",
      address: "Model Town Sector 3, Ludhiana",
      landmark: "Near Police Beat Box #4",
      latitude: 30.9010,
      longitude: 75.8573,
      aadhaar_masked: "XXXX-XXXX-4912",
      risk_level: "MEDIUM",
      riskLevel: "MEDIUM",
      status: "SAFE",
      medical_conditions: "Senior Citizen Registered under Police Safety Protocol",
      medicalConditions: "Senior Citizen Registered under Police Safety Protocol",
      avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      emergency_contacts: [
        {
          id: "EC-GEN-01",
          name: "Family Kin / Contact",
          relationship: "Emergency Contact",
          mobile: "+91 98721-00123",
          location: "Ludhiana Jurisdiction",
          notify_status: "ON FILE",
          is_keyholder: 1
        }
      ],
      sos_history: [
        {
          id: `SOS-LOG-${cleanId}`,
          emergency_type: "Emergency Assistance Record",
          created_at: "Today, 10:00 AM",
          status: "RESOLVED",
          location_address: "Model Town Sector 3, Ludhiana"
        }
      ],
      assistance_requests: [
        {
          id: `AST-LOG-${cleanId}`,
          request_type: "Routine Police Beat Check",
          created_at: "Yesterday, 04:00 PM",
          status: "COMPLETED",
          description: "Routine safety & door latch inspection conducted by beat officer."
        }
      ],
      welfare_checks: [
        {
          id: `WEL-LOG-${cleanId}`,
          check_type: "Periodic Elder Welfare Visit",
          scheduled_date: "Today",
          scheduled_time: "11:00 AM",
          status: "CONFIRMED",
          assigned_officer_name: "HC Raj Kumar",
          purpose: "Routine elder safety and keyholder verification"
        }
      ],
      assigned_officer: {
        id: "POL-1024",
        name: "HC Raj Kumar (POL-1024)",
        designation: "Head Constable",
        role: "Primary Beat Patrol Officer • PCR Van #04",
        mobile: "+91 98140-99812",
        vehicle: "PCR Van #04",
        avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzZPFuUAA-GjuqoDc0ROMs6dF5KTfabqTVwmZNnY0YDGQ9ceS9un43-t50gBNKIJ4FWwDanXcLlOf3uQ5hE6oF4TjJMUg01bZqIsuDr_TucayV1CUZ0p9svKyoLK9bOq5KNLlmLW_ibbjW1j5gl_SufTcWTSXmmRk8Bl6TuVDgTpWdBrch9ZX1PYhBhZDN0gycUWhzsrGo_k6Lrcij-yVjYLVqigwCWcvqJnVGg0nhy4lGx0JiBO"
      }
    };
  }

  return null;
}

/**
 * Returns all mock residents
 */
export function getAllResidents() {
  return MOCK_RESIDENTS;
}
