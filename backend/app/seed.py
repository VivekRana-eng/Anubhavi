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

    # 1. Police Station
    station_id = "PS-MODEL-TOWN-01"
    cursor.execute("""
        INSERT INTO police_stations (id, name, zone, district, state, sho_id, contact_number)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (station_id, "Model Town Police Station", "Zone 1", "Central District, Ludhiana", "Punjab", "POL-SHO-041", "+91 161-2401100"))

    # 2. Users (SHO, DSP, Officers)
    # Demo SHO Credentials: sho@anubhavi.demo / SHO@123
    # Password hash stored or simplified check for demo
    users_data = [
        ("USER-SHO-01", "sho@anubhavi.com", "sho@123", "Insp. Raj Kumar", "SHO", "Inspector", "POL-SHO-041", station_id, "+91 98765-XXXX1", "ACTIVE", now_str),
        ("USER-DSP-01", "dsp@anubhavi.demo", "DSP@123", "DSP Harpreet Singh", "DSP", "Deputy Superintendent of Police", "POL-DSP-009", station_id, "+91 98765-XXXX0", "ACTIVE", now_str),
        ("USER-OFF-01", "raj.kumar@police.gov.in", "OFF@123", "HC Raj Kumar", "POLICE_OFFICER", "Head Constable", "POL-1024", station_id, "+91 98112-XXXX2", "ACTIVE", now_str),
        ("USER-OFF-02", "amit.singh@police.gov.in", "OFF@123", "ASI Amit Singh", "POLICE_OFFICER", "Assistant Sub-Inspector", "POL-1025", station_id, "+91 98112-XXXX3", "ACTIVE", now_str),
        ("USER-OFF-03", "vikram.sharma@police.gov.in", "OFF@123", "Const. Vikram Sharma", "POLICE_OFFICER", "Constable", "POL-1026", station_id, "+91 98112-XXXX4", "ACTIVE", now_str),
        ("USER-OFF-04", "neeraj.kumar@police.gov.in", "OFF@123", "SI Neeraj Kumar", "POLICE_OFFICER", "Sub-Inspector", "POL-1027", station_id, "+91 98112-XXXX5", "ACTIVE", now_str),
        ("USER-CIT-01", "rajesh.sharma@demo.com", "CIT@123", "Rajesh Sharma", "SENIOR_CITIZEN", "Citizen", "CIT-8841", station_id, "+91 98721-XXXX5", "ACTIVE", now_str),
    ]
    for u in users_data:
        cursor.execute("""
            INSERT INTO users (id, email, password_hash, name, role, rank, police_id, police_station_id, mobile, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, u)

    # 3. Police Officers Roster
    officers = [
        ("POL-1024", "HC Raj Kumar", "Head Constable", "POL-1024", "+91 98112-XXXX2", station_id, "AVAILABLE", "PCR Van #04", 1, "https://lh3.googleusercontent.com/aida-public/AB6AXuAWhzZPFuUAA-GjuqoDc0ROMs6dF5KTfabqTVwmZNnY0YDGQ9ceS9un43-t50gBNKIJ4FWwDanXcLlOf3uQ5hE6oF4TjJMUg01bZqIsuDr_TucayV1CUZ0p9svKyoLK9bOq5KNLlmLW_ibbjW1j5gl_SufTcWTSXmmRk8Bl6TuVDgTpWdBrch9ZX1PYhBhZDN0gycUWhzsrGo_k6Lrcij-yVjYLVqigwCWcvqJnVGg0nhy4lGx0JiBO"),
        ("POL-1025", "ASI Amit Singh", "Assistant Sub-Inspector", "POL-1025", "+91 98112-XXXX3", station_id, "AVAILABLE", "PCR Bike #12", 0, "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"),
        ("POL-1026", "Const. Vikram Sharma", "Constable", "POL-1026", "+91 98112-XXXX4", station_id, "ON_DUTY", "PCR Van #02", 2, "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"),
        ("POL-1027", "SI Neeraj Kumar", "Sub-Inspector", "POL-1027", "+91 98112-XXXX5", station_id, "AVAILABLE", "PCR Car #01", 0, "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80")
    ]
    for o in officers:
        cursor.execute("""
            INSERT INTO police_officers (id, name, rank, police_id, mobile, police_station_id, status, current_vehicle, active_cases_count, avatar_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, o)

    # 4. Senior Citizens Registry
    citizens = [
        ("CIT-8841", "Rajesh Sharma", 72, "Male", "+91 98721-XXXX5", "H.No 412, Lane 4, Model Town Phase 2", "Near Guru Nanak Park", 30.9010, 75.8573, "XXXX-XXXX-4912", "Severe Cardiac History, Pacemaker Fitted (2023), Blood: O+ Positive", "HIGH", "LIVES_ALONE", station_id, (now - timedelta(hours=2)).strftime("%Y-%m-%d %H:%M"), "https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD", "SOS_ACTIVE"),
        ("CIT-8842", "Sunita Devi", 68, "Female", "+91 97812-XXXX1", "H.No 88, Block C, Model Town", "Opp. Community Centre", 30.8995, 75.8560, "XXXX-XXXX-8821", "Hypertension, Arthritis, Blood: A+ Positive", "MEDIUM", "WITH_SPOUSE", station_id, (now - timedelta(hours=5)).strftime("%Y-%m-%d %H:%M"), "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80", "SAFE"),
        ("CIT-8843", "Mohan Lal", 75, "Male", "+91 99145-XXXX9", "H.No 125, Sector 3, Model Town", "Behind Main Market", 30.9032, 75.8590, "XXXX-XXXX-1102", "Diabetes Type 2, Reduced Mobility", "HIGH", "LIVES_ALONE", station_id, (now - timedelta(hours=14)).strftime("%Y-%m-%d %H:%M"), "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80", "MISSED_CHECKIN"),
        ("CIT-8844", "Kamla Sharma", 70, "Female", "+91 96461-XXXX4", "H.No 64, Phase 1, Model Town", "Near Post Office", 30.8980, 75.8540, "XXXX-XXXX-3390", "Asthma, Mild Cognitive Impairment", "MEDIUM", "LIVES_ALONE", station_id, (now - timedelta(hours=1)).strftime("%Y-%m-%d %H:%M"), "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80", "SAFE"),
        ("CIT-8845", "Harish Kumar", 74, "Male", "+91 98881-XXXX7", "H.No 204, Lane 2, Model Town", "Near Rose Garden", 30.9025, 75.8580, "XXXX-XXXX-7714", "Hypertension, Post-Stroke Recovery", "HIGH", "WITH_SPOUSE", station_id, (now - timedelta(hours=8)).strftime("%Y-%m-%d %H:%M"), "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80", "SAFE")
    ]
    for c in citizens:
        cursor.execute("""
            INSERT INTO senior_citizens (id, name, age, gender, mobile, address, landmark, latitude, longitude, aadhaar_masked, medical_conditions, risk_level, living_status, police_station_id, last_check_in, avatar_url, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, c)

    # 5. Emergency Contacts
    contacts = [
        ("EC-01", "CIT-8841", "Amit Sharma", "Son (Toronto, Canada)", "+1 416-555-0198", "Overseas", 0, "NOTIFIED (Read 02:35 PM)"),
        ("EC-02", "CIT-8841", "Col. S. Dhillon", "Neighbor & Keyholder", "+91 94172-XXXXX", "H.No 410 (Next Door)", 1, "ON SCENE WITH SPARE KEYS"),
        ("EC-03", "CIT-8842", "Ritu Sharma", "Daughter", "+91 98140-XXXX2", "Ludhiana Sector 4", 1, "NOTIFIED"),
        ("EC-04", "CIT-8843", "Suresh Lal", "Son", "+91 98760-XXXX8", "Chandigarh", 0, "PENDING")
    ]
    for cnt in contacts:
        cursor.execute("""
            INSERT INTO emergency_contacts (id, citizen_id, name, relationship, mobile, location, is_keyholder, notify_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, cnt)

    # 6. Active Primary SOS Case (ANB-SOS-2026-00124)
    created_time = now - timedelta(minutes=90)
    accepted_time = now - timedelta(minutes=88)
    assigned_time = now - timedelta(minutes=86)
    deadline_time = created_time + timedelta(hours=24)

    primary_case = (
        "ANB-SOS-2026-00124",
        "CIT-8841",
        "Rajesh Sharma",
        72,
        "+91 98721-XXXX5",
        "H.No 412, Lane 4, Model Town Phase 2, Ludhiana",
        30.9010,
        75.8573,
        "Safety Emergency (Cardiac Fall)",
        created_time.strftime("%Y-%m-%d %H:%M:%S"),
        accepted_time.strftime("%Y-%m-%d %H:%M:%S"),
        "Insp. Raj Kumar (SHO-041)",
        "POL-1024",
        assigned_time.strftime("%Y-%m-%d %H:%M:%S"),
        "IN_PROGRESS",
        deadline_time.strftime("%Y-%m-%d %H:%M:%S"),
        24,
        1,
        None,
        None,
        "Citizen hit panic button after acute chest pain & dizziness. PCR Van #04 dispatched."
    )
    cursor.execute("""
        INSERT INTO sos_cases (id, citizen_id, citizen_name, citizen_age, citizen_mobile, location_address, latitude, longitude, emergency_type, created_at, accepted_at, accepted_by, assigned_officer_id, assigned_at, status, escalation_deadline, sla_hours, is_emergency, resolved_at, closed_at, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, primary_case)

    # Secondary Demo SOS cases
    sos2_time = now - timedelta(minutes=15)
    sos2_deadline = sos2_time + timedelta(hours=24)
    cursor.execute("""
        INSERT INTO sos_cases (id, citizen_id, citizen_name, citizen_age, citizen_mobile, location_address, latitude, longitude, emergency_type, created_at, accepted_at, accepted_by, assigned_officer_id, assigned_at, status, escalation_deadline, sla_hours, is_emergency, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, ("ANB-SOS-2026-00125", "CIT-8843", "Mohan Lal", 75, "+91 99145-XXXX9", "H.No 125, Sector 3, Model Town", 30.9032, 75.8590, "Unresponsive Panic Alert", sos2_time.strftime("%Y-%m-%d %H:%M:%S"), None, None, None, None, "NEW", sos2_deadline.strftime("%Y-%m-%d %H:%M:%S"), 24, 1, "Unacknowledged new SOS trigger"))

    sos3_time = now - timedelta(minutes=5)
    sos3_deadline = sos3_time + timedelta(hours=24)
    cursor.execute("""
        INSERT INTO sos_cases (id, citizen_id, citizen_name, citizen_age, citizen_mobile, location_address, latitude, longitude, emergency_type, created_at, accepted_at, accepted_by, assigned_officer_id, assigned_at, status, escalation_deadline, sla_hours, is_emergency, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, ("ANB-SOS-2026-00126", "CIT-8844", "Kamla Sharma", 70, "+91 96461-XXXX4", "H.No 64, Phase 1, Model Town", 30.8980, 75.8540, "Suspicious Perimeter Activity", sos3_time.strftime("%Y-%m-%d %H:%M:%S"), None, None, None, None, "NEW", sos3_deadline.strftime("%Y-%m-%d %H:%M:%S"), 24, 1, "Elder reported suspicious noise outside window"))

    # 7. Case Timeline Events for ANB-SOS-2026-00124
    timeline_events = [
        ("TL-01", "ANB-SOS-2026-00124", created_time.strftime("%H:%M PM"), "SOS Triggered by Citizen", "Smartphone panic button v4.8 triggered in Model Town Sector 3.", "Rajesh Sharma", "SENIOR_CITIZEN", "DANGER"),
        ("TL-02", "ANB-SOS-2026-00124", created_time.strftime("%H:%M PM"), "SHO Notified on Console", "Station high-decibel audible chime and visual overlay activated.", "System Console", "SYSTEM", "INFO"),
        ("TL-03", "ANB-SOS-2026-00124", accepted_time.strftime("%H:%M PM"), "SHO Accepted Case", "Insp. Raj Kumar accepted case. GD Entry GD-LDH-2026-901 created.", "Insp. Raj Kumar", "SHO", "SUCCESS"),
        ("TL-04", "ANB-SOS-2026-00124", assigned_time.strftime("%H:%M PM"), "Officer Assigned: HC Raj Kumar", "PCR Van #04 redirected from patrolling Gill Road towards Model Town Phase 2.", "Insp. Raj Kumar", "SHO", "PRIMARY"),
        ("TL-05", "ANB-SOS-2026-00124", (assigned_time + timedelta(minutes=1)).strftime("%H:%M PM"), "Citizen & Kin Notified via ERSS Push", "Automated WhatsApp tracking links transmitted to Amit Sharma and Col. Dhillon.", "Comms Relay", "SYSTEM", "INFO"),
        ("TL-06", "ANB-SOS-2026-00124", (assigned_time + timedelta(minutes=10)).strftime("%H:%M PM"), "Officer Reached Location", "GPS confirmed on-site within 35m of citizen residence. Resident assisted.", "HC Raj Kumar", "POLICE_OFFICER", "SUCCESS")
    ]
    for tl in timeline_events:
        cursor.execute("""
            INSERT INTO case_timeline (id, case_id, event_time, title, description, actor_name, actor_role, badge_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, tl)

    # 8. Assistance Requests
    ast_time1 = now - timedelta(hours=4)
    ast_deadline1 = ast_time1 + timedelta(hours=24)
    cursor.execute("""
        INSERT INTO assistance_requests (id, citizen_id, citizen_name, request_type, description, location, created_at, accepted_at, assigned_officer_id, status, escalation_deadline)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, ("AST-2026-041", "CIT-8842", "Sunita Devi", "Welfare Assistance", "Request for home safety inspection & lock check", "H.No 88, Block C, Model Town", ast_time1.strftime("%Y-%m-%d %H:%M:%S"), (ast_time1 + timedelta(minutes=20)).strftime("%Y-%m-%d %H:%M:%S"), "POL-1025", "IN_PROGRESS", ast_deadline1.strftime("%Y-%m-%d %H:%M:%S")))

    # 9. Notifications
    nots = [
        ("NOT-01", "POL-SHO-041", "SHO", "SOS", "🚨 New SOS Alert Received", "Rajesh Sharma (72y) triggered SOS panic button in Model Town Phase 2.", "ANB-SOS-2026-00124", created_time.strftime("%Y-%m-%d %H:%M:%S"), None, "UNREAD"),
        ("NOT-02", "POL-SHO-041", "SHO", "ASSISTANCE", "🆘 New Assistance Request", "Sunita Devi requested police welfare assistance.", "AST-2026-041", ast_time1.strftime("%Y-%m-%d %H:%M:%S"), None, "UNREAD"),
        ("NOT-03", "POL-SHO-041", "SHO", "OFFICER_ASSIGNMENT", "👮 Officer Assigned", "HC Raj Kumar assigned to case ANB-SOS-2026-00124.", "ANB-SOS-2026-00124", assigned_time.strftime("%Y-%m-%d %H:%M:%S"), None, "UNREAD"),
        ("NOT-04", "POL-SHO-041", "SHO", "ESCALATION", "⚠️ Escalation Warning", "Case ANB-SOS-2026-00125 is approaching statutory 24-hour escalation limit.", "ANB-SOS-2026-00125", (now - timedelta(minutes=10)).strftime("%Y-%m-%d %H:%M:%S"), None, "UNREAD")
    ]
    for n in nots:
        cursor.execute("""
            INSERT INTO notifications (id, recipient_id, recipient_role, type, title, message, case_id, created_at, read_at, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, n)

    # 10. Welfare Checks
    welfares = [
        ("WEL-01", "CIT-8845", "Harish Kumar", now.strftime("%Y-%m-%d"), "17:00", "Periodic Check-in", "POL-1026", "Const. Vikram Sharma", "Post-stroke recovery safety check", "Scheduled afternoon visit", "SCHEDULED"),
        ("WEL-02", "CIT-8844", "Kamla Sharma", (now + timedelta(days=1)).strftime("%Y-%m-%d"), "10:30", "Safety Awareness Message", "POL-1027", "SI Neeraj Kumar", "Elder cyber fraud awareness briefing", "Routine welfare protocol", "SCHEDULED")
    ]
    for w in welfares:
        cursor.execute("""
            INSERT INTO welfare_checks (id, citizen_id, citizen_name, scheduled_date, scheduled_time, check_type, assigned_officer_id, assigned_officer_name, purpose, notes, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, w)

    # 11. Missed Check-ins
    checkins = [
        ("CHK-01", "CIT-8843", "Mohan Lal", (now - timedelta(hours=14)).strftime("%H:%M"), (now - timedelta(hours=18)).strftime("%Y-%m-%d %H:%M"), "H.No 125, Sector 3, Model Town", 1, 1, "MISSED")
    ]
    for chk in checkins:
        cursor.execute("""
            INSERT INTO check_ins (id, citizen_id, citizen_name, scheduled_time, last_contact, last_known_location, family_notified, police_notified, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, chk)

    # 12. Initial Audit Logs
    cursor.execute("""
        INSERT INTO audit_logs (id, user_id, user_name, user_role, action, target_id, description, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, ("AUD-INIT-01", "POL-SHO-041", "Insp. Raj Kumar", "SHO", "SHO LOGIN", "PS-MODEL-TOWN-01", "SHO logged into ANUBHAVI Command Console at Model Town Police Station", now_str))

    conn.commit()
    conn.close()
    print("ANUBHAVI Database Seeded Successfully!")

if __name__ == "__main__":
    seed_demo_data()
