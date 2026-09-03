from datetime import datetime, timedelta
import uuid
from app.database import get_db_connection, init_db

def seed_demo_data():
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    # Clear existing data for clean re-seed
    tables = [
        "users", "police_stations", "police_officers", "senior_citizens",
        "emergency_contacts", "sos_cases", "assistance_requests",
        "case_timeline", "notifications", "welfare_checks", "check_ins", "audit_logs"
    ]
    for table in tables:
        cursor.execute(f"DELETE FROM {table}")

    now = datetime.now()
    now_str = now.isoformat()

    # 1. Police Stations (6 Stations)
    stations = [
        ("MTP-PS-01", "Model Town Police Station", "Zone 1", "Central District, Ludhiana", "Punjab", "POL-SHO-041", "+91 161-2401100"),
        ("SEC17-PS-02", "Sector 17 Police Station", "Zone 2", "Central District, Ludhiana", "Punjab", "POL-SHO-042", "+91 161-2401102"),
        ("PH8-PS-03", "Phase 8 Police Station", "Zone 3", "Mohali District", "Punjab", "POL-SHO-043", "+91 172-2401103"),
        ("CPS-04", "Central Police Station", "Zone 1", "Central District, Ludhiana", "Punjab", "POL-SHO-044", "+91 161-2401104"),
        ("NZ-PS-05", "North Zone Police Station", "Zone 4", "North District, Ludhiana", "Punjab", "POL-SHO-045", "+91 161-2401105"),
        ("SZ-PS-06", "South Zone Police Station", "Zone 5", "South District, Ludhiana", "Punjab", "POL-SHO-046", "+91 161-2401106")
    ]
    for st in stations:
        cursor.execute("""
            INSERT INTO police_stations (id, name, zone, district, state, sho_id, contact_number)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, st)

    station_id = "MTP-PS-01"

    # 2. Users (SHO, DSP, Officers)
    users_data = [
        ("USER-SHO-01", "sho@anubhavi.com", "sho@123", "Insp. Raj Kumar", "SHO", "Inspector", "POL-SHO-041", station_id, "+91 98765-00123", "ACTIVE", now_str),
        ("USER-DSP-01", "dsp@anubhavi.demo", "DSP@123", "DSP Harpreet Singh", "DSP", "Deputy Superintendent of Police", "POL-DSP-009", station_id, "+91 98765-00124", "ACTIVE", now_str),
        ("USER-OFF-01", "raj.kumar@police.gov.in", "OFF@123", "HC Raj Kumar", "POLICE_OFFICER", "Head Constable", "POL-1024", station_id, "+91 98112-00101", "ACTIVE", now_str),
        ("USER-OFF-02", "amit.singh@police.gov.in", "OFF@123", "ASI Amit Singh", "POLICE_OFFICER", "Assistant Sub-Inspector", "POL-1025", station_id, "+91 98112-00102", "ACTIVE", now_str),
        ("USER-OFF-03", "vikram.sharma@police.gov.in", "OFF@123", "Const. Vikram Sharma", "POLICE_OFFICER", "Constable", "POL-1026", station_id, "+91 98112-00103", "ACTIVE", now_str),
        ("USER-OFF-04", "neeraj.kumar@police.gov.in", "OFF@123", "SI Neeraj Kumar", "POLICE_OFFICER", "Sub-Inspector", "POL-1027", station_id, "+91 98112-00104", "ACTIVE", now_str),
        ("USER-OFF-05", "rahul.verma@police.gov.in", "OFF@123", "SI Rahul Verma", "POLICE_OFFICER", "Sub-Inspector", "POL-1028", station_id, "+91 98112-00105", "ACTIVE", now_str),
        ("USER-OFF-06", "manpreet.singh@police.gov.in", "OFF@123", "HC Manpreet Singh", "POLICE_OFFICER", "Head Constable", "POL-1029", station_id, "+91 98112-00106", "ACTIVE", now_str),
        ("USER-CIT-01", "rajesh.sharma@demo.com", "CIT@123", "Rajesh Sharma", "SENIOR_CITIZEN", "Citizen", "CIT-8841", station_id, "+91 98721-00214", "ACTIVE", now_str),
    ]
    for u in users_data:
        cursor.execute("""
            INSERT INTO users (id, email, password_hash, name, role, rank, police_id, police_station_id, mobile, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, u)

    # 3. Police Officers Roster (6 Officers)
    officers = [
        ("POL-1025", "ASI Amit Singh", "Assistant Sub-Inspector", "POL-1025", "+91 98721-44102", station_id, "AVAILABLE", "PCR Bike #12", 1, "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"),
        ("POL-1024", "HC Raj Kumar", "Head Constable", "POL-1024", "+91 98140-99812", station_id, "AVAILABLE", "PCR Van #04", 2, "https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzZPFuUAA-GjuqoDc0ROMs6dF5KTfabqTVwmZNnY0YDGQ9ceS9un43-t50gBNKIJ4FWwDanXcLlOf3uQ5hE6oF4TjJMUg01bZqIsuDr_TucayV1CUZ0p9svKyoLK9bOq5KNLlmLW_ibbjW1j5gl_SufTcWTSXmmRk8Bl6TuVDgTpWdBrch9ZX1PYhBhZDN0gycUWhzsrGo_k6Lrcij-yVjYLVqigwCWcvqJnVGg0nhy4lGx0JiBO"),
        ("POL-1027", "SI Neeraj Kumar", "Sub-Inspector", "POL-1027", "+91 98112-77123", station_id, "AVAILABLE", "PCR Car #01", 1, "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"),
        ("POL-1026", "Const. Vikram Sharma", "Constable", "POL-1026", "+91 98112-99124", station_id, "ON_DUTY", "PCR Van #02", 2, "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"),
        ("POL-1028", "SI Rahul Verma", "Sub-Inspector", "POL-1028", "+91 98112-33445", "SEC17-PS-02", "AVAILABLE", "PCR Car #03", 1, "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"),
        ("POL-1029", "HC Manpreet Singh", "Head Constable", "POL-1029", "+91 98112-55667", "SZ-PS-06", "AVAILABLE", "PCR Van #09", 1, "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80")
    ]
    for o in officers:
        cursor.execute("""
            INSERT INTO police_officers (id, name, rank, police_id, mobile, police_station_id, status, current_vehicle, active_cases_count, avatar_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, o)

    # 4. Senior Citizens Registry
    citizens = [
        ("CIT-8841", "Rajesh Sharma", 72, "Male", "+91 98721-00214", "H.No 412, Lane 4, Model Town Phase 2", "Near Guru Nanak Park", 30.9010, 75.8573, "XXXX-XXXX-4912", "Severe Cardiac History, Pacemaker Fitted (2023), Blood: O+ Positive", "HIGH", "LIVES_ALONE", station_id, (now - timedelta(hours=2)).strftime("%Y-%m-%d %H:%M"), "https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD", "SOS_ACTIVE"),
        ("CIT-8842", "Sunita Devi", 68, "Female", "+91 97812-33412", "H.No 88, Block C, Model Town", "Opp. Community Centre", 30.8995, 75.8560, "XXXX-XXXX-8821", "Hypertension, Arthritis, Blood: A+ Positive", "MEDIUM", "WITH_SPOUSE", station_id, (now - timedelta(hours=5)).strftime("%Y-%m-%d %H:%M"), "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80", "SAFE"),
        ("CIT-8843", "Mohan Lal", 75, "Male", "+91 99145-88210", "H.No 125, Sector 3, Model Town", "Behind Main Market", 30.9032, 75.8590, "XXXX-XXXX-1102", "Diabetes Type 2, Reduced Mobility, Blood: B+ Positive", "HIGH", "LIVES_ALONE", station_id, (now - timedelta(hours=14)).strftime("%Y-%m-%d %H:%M"), "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80", "MISSED_CHECKIN"),
        ("CIT-8844", "Kamla Sharma", 70, "Female", "+91 96461-44912", "H.No 64, Phase 1, Model Town", "Near Post Office", 30.8980, 75.8540, "XXXX-XXXX-3390", "Asthma, Mild Cognitive Impairment, Blood: AB+ Positive", "MEDIUM", "LIVES_ALONE", station_id, (now - timedelta(hours=1)).strftime("%Y-%m-%d %H:%M"), "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80", "SAFE"),
        ("CIT-8845", "Harish Kumar", 74, "Male", "+91 98881-22901", "H.No 204, Lane 2, Model Town", "Near Rose Garden", 30.9025, 75.8580, "XXXX-XXXX-7714", "Hypertension, Post-Stroke Recovery, Blood: O- Negative", "HIGH", "WITH_SPOUSE", station_id, (now - timedelta(hours=8)).strftime("%Y-%m-%d %H:%M"), "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80", "SAFE")
    ]
    for c in citizens:
        cursor.execute("""
            INSERT INTO senior_citizens (id, name, age, gender, mobile, address, landmark, latitude, longitude, aadhaar_masked, medical_conditions, risk_level, living_status, police_station_id, last_check_in, avatar_url, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, c)

    # 5. Emergency Contacts
    contacts = [
        ("EC-01", "CIT-8841", "Amit Sharma", "Son (Toronto, Canada)", "+1 416-555-0198", "Overseas", 0, "NOTIFIED (Read 02:35 PM)"),
        ("EC-02", "CIT-8841", "Col. S. Dhillon", "Neighbor & Keyholder", "+91 94172-00301", "H.No 410 (Next Door)", 1, "ON SCENE WITH SPARE KEYS")
    ]
    for cnt in contacts:
        cursor.execute("""
            INSERT INTO emergency_contacts (id, citizen_id, name, relationship, mobile, location, is_keyholder, notify_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, cnt)

    # 6. 20 Realistic SOS Cases Distributed Across Stations & Officers
    raw_cases = [
        # id, citizen_id, citizen_name, age, mobile, address, lat, lng, emergency_type, created_delta, accepted_by, officer_id, officer_name, officer_rank, vehicle, station_name, station_code, status, priority, notes
        ("SOS-2026-0001", "CIT-8841", "Rajesh Sharma", 72, "+91 98721-00214", "H.No 412, Lane 4, Model Town Phase 2, Ludhiana", 30.9010, 75.8573, "Medical Emergency", timedelta(hours=2), "Insp. Raj Kumar", "POL-1025", "ASI Amit Singh", "Assistant Sub-Inspector", "PCR Bike #12", "Model Town Police Station", "MTP-PS-01", "ASSIGNED", "HIGH", "Citizen hit panic button after acute chest pain."),
        ("SOS-2026-0002", "CIT-8842", "Sunita Devi", 68, "+91 97812-33412", "Flat 302, Block B, Sector 17, Chandigarh", 30.8995, 75.8560, "Women Safety", timedelta(minutes=30), None, None, None, None, None, "Sector 17 Police Station", "SEC17-PS-02", "ACTIVE", "CRITICAL", "Intruder reported outside balcony door."),
        ("SOS-2026-0003", "CIT-8843", "Mohan Lal", 75, "+91 99145-88210", "House 125, Phase 8, Mohali", 30.9032, 75.8590, "Senior Citizen Assistance", timedelta(hours=1), "Insp. Raj Kumar", None, None, None, None, "Phase 8 Police Station", "PH8-PS-03", "ACKNOWLEDGED", "HIGH", "Elder unable to unlock door from inside."),
        ("SOS-2026-0004", "CIT-8844", "Kamla Sharma", 70, "+91 96461-44912", "88 Commercial Complex, Central Bazaar", 30.8980, 75.8540, "Harassment", timedelta(minutes=45), "Insp. Raj Kumar", "POL-1026", "Const. Vikram Sharma", "Constable", "PCR Van #02", "Central Police Station", "CPS-04", "OFFICER DISPATCHED", "MEDIUM", "Verbal harassment reported near market entrance."),
        ("SOS-2026-0005", "CIT-8845", "Harish Kumar", 74, "+91 98881-22901", "GT Road Crossing, North Zone Sector 4", 30.9025, 75.8580, "Accident", timedelta(minutes=20), "Insp. Raj Kumar", "POL-1028", "SI Rahul Verma", "Sub-Inspector", "PCR Car #03", "North Zone Police Station", "NZ-PS-05", "ON THE WAY", "CRITICAL", "Vehicle collision near crossing. Rapid ambulance requested."),
        ("SOS-2026-0006", "CIT-8846", "Prem Prakash", 78, "+91 98140-55123", "45 Park Avenue, South Zone", 30.9001, 75.8550, "General Emergency", timedelta(minutes=10), "Insp. Raj Kumar", "POL-1029", "HC Manpreet Singh", "Head Constable", "PCR Van #09", "South Zone Police Station", "SZ-PS-06", "ARRIVED", "NORMAL", "Power outage and panic alarm in senior residence."),
        ("SOS-2026-0007", "CIT-8847", "Gurdev Singh", 81, "+91 94172-66301", "Sector 3 Main Gate, Model Town", 30.9015, 75.8570, "Missing Person", timedelta(days=1), "Insp. Raj Kumar", "POL-1025", "ASI Amit Singh", "Assistant Sub-Inspector", "PCR Bike #12", "Model Town Police Station", "MTP-PS-01", "RESOLVED", "HIGH", "Dementia elder safely reunited with family."),
        ("SOS-2026-0008", "CIT-8848", "Vidya Wanti", 76, "+91 98150-11234", "Villa 12, Sector 17", 30.8990, 75.8565, "Medical Emergency", timedelta(days=1), "Insp. Raj Kumar", "POL-1028", "SI Rahul Verma", "Sub-Inspector", "PCR Car #03", "Sector 17 Police Station", "SEC17-PS-02", "CANCELLED", "NORMAL", "Accidental trigger by grandchild."),
        ("SOS-2026-0009", "CIT-8849", "Baldev Raj", 73, "+91 98760-44321", "104 Rosewood Enclave, Phase 8", 30.9030, 75.8595, "Medical Emergency", timedelta(days=1), "Insp. Raj Kumar", "POL-1024", "HC Raj Kumar", "Head Constable", "PCR Van #04", "Phase 8 Police Station", "PH8-PS-03", "ASSIGNED", "CRITICAL", "Acute shortness of breath reported."),
        ("SOS-2026-0010", "CIT-8850", "Asha Rani", 69, "+91 98111-77890", "Central Mall Parking Level 2", 30.8985, 75.8545, "Women Safety", timedelta(days=3), None, None, None, None, None, "Central Police Station", "CPS-04", "ACTIVE", "HIGH", "Followed by suspicious individual in parking lot."),
        ("SOS-2026-0011", "CIT-8851", "Ramesh Chander", 77, "+91 98888-33210", "North Zone Community Hall", 30.9020, 75.8585, "Senior Citizen Assistance", timedelta(days=4), "Insp. Raj Kumar", None, None, None, None, "North Zone Police Station", "NZ-PS-05", "ACKNOWLEDGED", "MEDIUM", "Medical escort requested for health checkup."),
        ("SOS-2026-0012", "CIT-8852", "Savitri Devi", 82, "+91 94170-99887", "219 Officers Colony, South Zone", 30.9005, 75.8555, "Harassment", timedelta(days=5), "Insp. Raj Kumar", "POL-1029", "HC Manpreet Singh", "Head Constable", "PCR Van #09", "South Zone Police Station", "SZ-PS-06", "RESOLVED", "HIGH", "Nuisance phone calls investigated and resolved."),
        ("SOS-2026-0013", "CIT-8853", "Tilak Raj", 79, "+91 98720-11223", "House 50, Model Town Extension", 30.9012, 75.8575, "General Emergency", timedelta(days=6), "Insp. Raj Kumar", "POL-1025", "ASI Amit Singh", "Assistant Sub-Inspector", "PCR Bike #12", "Model Town Police Station", "MTP-PS-01", "ASSIGNED", "CRITICAL", "Fall in bathroom, resident unable to get up."),
        ("SOS-2026-0014", "CIT-8854", "Santosh Kumari", 71, "+91 98141-88765", "Sector 17 Bus Stand Junction", 30.8998, 75.8562, "Accident", timedelta(days=10), "Insp. Raj Kumar", "POL-1024", "HC Raj Kumar", "Head Constable", "PCR Van #04", "Sector 17 Police Station", "SEC17-PS-02", "OFFICER DISPATCHED", "HIGH", "Minor collision involving senior pedestrian."),
        ("SOS-2026-0015", "CIT-8855", "Swaran Singh", 85, "+91 99140-55443", "Phase 8 Industrial Area Gate 1", 30.9035, 75.8598, "Medical Emergency", timedelta(days=12), "Insp. Raj Kumar", "POL-1028", "SI Rahul Verma", "Sub-Inspector", "PCR Car #03", "Phase 8 Police Station", "PH8-PS-03", "ON THE WAY", "MEDIUM", "Dehydration and fainting near factory outlet."),
        ("SOS-2026-0016", "CIT-8856", "Krishna Gopal", 73, "+91 98765-12345", "Railway Station Exit 3, Central", 30.8982, 75.8542, "Missing Person", timedelta(days=15), "Insp. Raj Kumar", "POL-1026", "Const. Vikram Sharma", "Constable", "PCR Van #02", "Central Police Station", "CPS-04", "ARRIVED", "NORMAL", "Elder misplaced luggage and got disoriented."),
        ("SOS-2026-0017", "CIT-8857", "Pushpa Rani", 67, "+91 98112-66554", "North Zone Bypass Road", 30.9028, 75.8582, "Women Safety", timedelta(days=18), "Insp. Raj Kumar", "POL-1027", "SI Neeraj Kumar", "Sub-Inspector", "PCR Car #01", "North Zone Police Station", "NZ-PS-05", "RESOLVED", "CRITICAL", "Vehicle breakdown late night on bypass highway."),
        ("SOS-2026-0018", "CIT-8858", "Joginder Pal", 80, "+91 94171-33221", "12 South Zone Green Park", 30.9008, 75.8558, "Senior Citizen Assistance", timedelta(days=20), "Insp. Raj Kumar", "POL-1029", "HC Manpreet Singh", "Head Constable", "PCR Van #09", "South Zone Police Station", "SZ-PS-06", "CANCELLED", "NORMAL", "Senior requested lock inspection, completed."),
        ("SOS-2026-0019", "CIT-8859", "Darshan Lal", 76, "+91 98722-88990", "Model Town Phase 3 Market", 30.9018, 75.8578, "Medical Emergency", timedelta(days=22), None, "POL-1024", "HC Raj Kumar", "Head Constable", "PCR Van #04", "Model Town Police Station", "MTP-PS-01", "ACTIVE", "HIGH", "Severe knee injury after slipping near bank."),
        ("SOS-2026-0020", "CIT-8860", "Nirmala Devi", 74, "+91 98142-11009", "Sector 17 House #512", 30.8992, 75.8568, "General Emergency", timedelta(days=25), "Insp. Raj Kumar", "POL-1025", "ASI Amit Singh", "Assistant Sub-Inspector", "PCR Bike #12", "Sector 17 Police Station", "SEC17-PS-02", "ASSIGNED", "HIGH", "Gas leak panic alarm in kitchen.")
    ]

    for item in raw_cases:
        cid, citizen_id, cname, age, mobile, address, lat, lng, etype, cdelta, abased, offid, offname, offrank, offveh, stname, stcode, st, prio, notes = item
        created_at_dt = now - cdelta
        created_at_str = created_at_dt.strftime("%Y-%m-%d %H:%M:%S")
        deadline_str = (created_at_dt + timedelta(hours=24)).strftime("%Y-%m-%d %H:%M:%S")

        assignment_details = None
        if offid:
            assignment_details = import_json_dumps({
                "police_station": stname,
                "station_code": stcode,
                "jurisdiction": f"{stname} Jurisdiction",
                "sho_name": "Insp. Raj Kumar",
                "officer_id": offid,
                "officer_name": offname,
                "officer_rank": offrank,
                "police_id": offid,
                "vehicle": offveh or "PCR Patrol Unit",
                "response_type": "Police Emergency Response",
                "priority": prio,
                "instructions": notes,
                "estimated_response_time": "10 minutes",
                "remarks": "Dispatched via Control Room",
                "assigned_by": abased or "Insp. Raj Kumar",
                "assigned_at": created_at_str
            })

        cursor.execute("""
            INSERT INTO sos_cases (id, citizen_id, citizen_name, citizen_age, citizen_mobile, location_address, latitude, longitude, emergency_type, created_at, accepted_at, accepted_by, assigned_officer_id, assigned_at, status, escalation_deadline, sla_hours, is_emergency, notes, assignment_details)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 24, 1, ?, ?)
        """, (cid, citizen_id, cname, age, mobile, address, lat, lng, etype, created_at_str, created_at_str if abased else None, abased, offid, created_at_str if offid else None, st, deadline_str, notes, assignment_details))

    conn.commit()
    conn.close()
    print("ANUBHAVI Enriched 20-Record SOS Seed Data Generated Successfully!")

def import_json_dumps(obj):
    import json
    return json.dumps(obj)

if __name__ == "__main__":
    seed_demo_data()
