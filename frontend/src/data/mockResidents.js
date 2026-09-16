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
    },
    audit_trail: [
      {
        id: "AUD-301",
        action: "VIEW ONLY DOSSIER ACCESSED",
        description: "View Only dossier loaded for Mohan Lal (RES-001)",
        timestamp: "Today, 08:30 AM"
      },
      {
        id: "AUD-302",
        action: "STATUS UPDATE",
        description: "Status changed to MISSED_CHECKIN following auto-check failure",
        timestamp: "Today, 08:00 AM"
      }
    ]
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
    },
    audit_trail: [
      {
        id: "AUD-201",
        action: "VIEW ONLY DOSSIER ACCESSED",
        description: "View Only dossier loaded for Rajesh Sharma (RES-002)",
        timestamp: "Today, 02:36 PM"
      },
      {
        id: "AUD-202",
        action: "SOS DISPATCH TRIGGERED",
        description: "High priority cardiac alert dispatched to ASI Amit Singh",
        timestamp: "Today, 02:34 PM"
      }
    ]
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
    },
    audit_trail: [
      {
        id: "AUD-401",
        action: "VIEW ONLY DOSSIER ACCESSED",
        description: "View Only dossier loaded for Sunita Kapoor (RES-003)",
        timestamp: "Today, 11:50 AM"
      }
    ]
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
      },
      {
        id: "EC-004-B",
        name: "S. Harbhajan Singh",
        relationship: "Brother",
        mobile: "+91 98144-88321",
        location: "Model Town Extension",
        notify_status: "ON FILE",
        is_keyholder: 0
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
    },
    audit_trail: [
      {
        id: "AUD-501",
        action: "VIEW ONLY DOSSIER ACCESSED",
        description: "View Only dossier loaded for Harpreet Singh (RES-004)",
        timestamp: "Yesterday, 05:10 PM"
      }
    ]
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
      },
      {
        id: "EC-005-B",
        name: "Meena Sharma",
        relationship: "Neighbor",
        mobile: "+91 98140-33299",
        location: "H.No 62 (Next Door)",
        notify_status: "ON FILE",
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
    },
    audit_trail: [
      {
        id: "AUD-601",
        action: "VIEW ONLY DOSSIER ACCESSED",
        description: "View Only dossier loaded for Anita Verma (RES-005)",
        timestamp: "Yesterday, 10:20 AM"
      }
    ]
  },
  {
    id: "RES-006",
    aliases: ["CIT-8123", "CIT-3312"],
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
      },
      {
        id: "EC-006-B",
        name: "Dr. Anjali Gupta",
        relationship: "Orthopedic Specialist",
        mobile: "+91 98140-77112",
        location: "Deep Hospital, Ludhiana",
        notify_status: "ON FILE",
        is_keyholder: 0
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
    },
    audit_trail: [
      {
        id: "AUD-701",
        action: "VIEW ONLY DOSSIER ACCESSED",
        description: "View Only dossier loaded for Ramesh Kumar (RES-006)",
        timestamp: "3 Days ago, 04:00 PM"
      }
    ]
  }
];

/**
 * Lookup resident by ID or Alias
 * Case-insensitive lookup supporting RES-001, CIT-8841, etc.
 * Returns null if not found.
 */
export function getResidentById(rawId) {
  if (!rawId) return null;
  const cleanId = String(rawId).trim().toUpperCase();

  // 1. Direct ID match
  const directMatch = MOCK_RESIDENTS.find(
    (r) => r.id.toUpperCase() === cleanId
  );
  if (directMatch) return directMatch;

  // 2. Alias match (e.g. legacy CIT IDs)
  const aliasMatch = MOCK_RESIDENTS.find(
    (r) => r.aliases && r.aliases.some((a) => a.toUpperCase() === cleanId)
  );
  if (aliasMatch) return aliasMatch;

  return null;
}

/**
 * Returns all mock residents
 */
export function getAllResidents() {
  return MOCK_RESIDENTS;
}
