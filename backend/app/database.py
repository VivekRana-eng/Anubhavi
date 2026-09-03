import sqlite3
import json
import os
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "anubhavi.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL, -- SHO, DSP, POLICE_OFFICER, SENIOR_CITIZEN
        rank TEXT,
        police_id TEXT,
        police_station_id TEXT,
        mobile TEXT,
        status TEXT DEFAULT 'ACTIVE',
        created_at TEXT
    )
    """)

    # Police Stations Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS police_stations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        zone TEXT NOT NULL,
        district TEXT NOT NULL,
        state TEXT NOT NULL,
        sho_id TEXT,
        contact_number TEXT
    )
    """)

    # Police Officers Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS police_officers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        rank TEXT NOT NULL,
        police_id TEXT UNIQUE NOT NULL,
        mobile TEXT NOT NULL,
        police_station_id TEXT NOT NULL,
        status TEXT DEFAULT 'AVAILABLE', -- AVAILABLE, ON_DUTY, BUSY, OFFLINE
        current_vehicle TEXT,
        active_cases_count INTEGER DEFAULT 0,
        avatar_url TEXT
    )
    """)

    # Senior Citizens Registry
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS senior_citizens (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        gender TEXT NOT NULL,
        mobile TEXT NOT NULL,
        address TEXT NOT NULL,
        landmark TEXT,
        latitude REAL,
        longitude REAL,
        aadhaar_masked TEXT,
        medical_conditions TEXT, -- JSON string or comma list
        risk_level TEXT DEFAULT 'HIGH', -- HIGH, MEDIUM, LOW
        living_status TEXT DEFAULT 'LIVES_ALONE',
        police_station_id TEXT NOT NULL,
        last_check_in TEXT,
        avatar_url TEXT,
        status TEXT DEFAULT 'SAFE'
    )
    """)

    # Emergency Contacts Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS emergency_contacts (
        id TEXT PRIMARY KEY,
        citizen_id TEXT NOT NULL,
        name TEXT NOT NULL,
        relationship TEXT NOT NULL,
        mobile TEXT NOT NULL,
        location TEXT,
        is_keyholder INTEGER DEFAULT 0,
        notify_status TEXT DEFAULT 'NOTIFIED'
    )
    """)

    # SOS Cases Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sos_cases (
        id TEXT PRIMARY KEY,
        citizen_id TEXT NOT NULL,
        citizen_name TEXT NOT NULL,
        citizen_age INTEGER,
        citizen_mobile TEXT,
        location_address TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        emergency_type TEXT NOT NULL, -- Safety Emergency, Medical Fall, Cardiac, Harassment, Intruder, Assistance
        created_at TEXT NOT NULL,
        accepted_at TEXT,
        accepted_by TEXT,
        assigned_officer_id TEXT,
        assigned_at TEXT,
        status TEXT DEFAULT 'NEW', -- NEW, ACCEPTED, OFFICER_ASSIGNED, IN_PROGRESS, OFFICER_AT_LOCATION, RESOLVED, CLOSED, ESCALATED
        escalation_deadline TEXT NOT NULL,
        sla_hours INTEGER DEFAULT 24,
        is_emergency INTEGER DEFAULT 1,
        resolved_at TEXT,
        closed_at TEXT,
        notes TEXT,
        assignment_details TEXT
    )
    """)

    # Check if assignment_details column exists for backward compatibility
    cursor.execute("PRAGMA table_info(sos_cases)")
    cols = [col[1] for col in cursor.fetchall()]
    if "assignment_details" not in cols:
        try:
            cursor.execute("ALTER TABLE sos_cases ADD COLUMN assignment_details TEXT")
        except Exception:
            pass

    # Assistance Requests Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS assistance_requests (
        id TEXT PRIMARY KEY,
        citizen_id TEXT NOT NULL,
        citizen_name TEXT NOT NULL,
        request_type TEXT NOT NULL, -- Welfare Assistance, Safety Concern, Medical Assistance, Neighbour Concern, Other
        description TEXT,
        location TEXT NOT NULL,
        created_at TEXT NOT NULL,
        accepted_at TEXT,
        assigned_officer_id TEXT,
        status TEXT DEFAULT 'NEW', -- NEW, ACCEPTED, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED, ESCALATED
        escalation_deadline TEXT NOT NULL
    )
    """)

    # Case Timeline Events
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS case_timeline (
        id TEXT PRIMARY KEY,
        case_id TEXT NOT NULL,
        event_time TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        actor_name TEXT,
        actor_role TEXT,
        badge_type TEXT DEFAULT 'INFO' -- DANGER, SUCCESS, WARNING, PRIMARY, INFO
    )
    """)

    # Notifications Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        recipient_id TEXT NOT NULL,
        recipient_role TEXT DEFAULT 'SHO',
        type TEXT NOT NULL, -- EMERGENCY, SOS, ASSISTANCE, ESCALATION, OFFICER_ASSIGNMENT, WELFARE, SYSTEM
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        case_id TEXT,
        created_at TEXT NOT NULL,
        read_at TEXT,
        status TEXT DEFAULT 'UNREAD'
    )
    """)

    # Welfare Checks Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS welfare_checks (
        id TEXT PRIMARY KEY,
        citizen_id TEXT NOT NULL,
        citizen_name TEXT NOT NULL,
        scheduled_date TEXT NOT NULL,
        scheduled_time TEXT NOT NULL,
        check_type TEXT NOT NULL, -- Welfare Call, Periodic Check-in, Safety Awareness Message, Follow-up
        assigned_officer_id TEXT,
        assigned_officer_name TEXT,
        purpose TEXT,
        notes TEXT,
        status TEXT DEFAULT 'SCHEDULED' -- SCHEDULED, COMPLETED, MISSED, CANCELLED
    )
    """)

    # Missed Check-ins Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS check_ins (
        id TEXT PRIMARY KEY,
        citizen_id TEXT NOT NULL,
        citizen_name TEXT NOT NULL,
        scheduled_time TEXT NOT NULL,
        last_contact TEXT,
        last_known_location TEXT,
        family_notified INTEGER DEFAULT 1,
        police_notified INTEGER DEFAULT 1,
        status TEXT DEFAULT 'MISSED' -- COMPLETED, REMINDER_SENT, MISSED, POLICE_NOTIFIED, RESOLVED
    )
    """)

    # Audit Logs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        user_name TEXT NOT NULL,
        user_role TEXT NOT NULL,
        action TEXT NOT NULL,
        target_id TEXT,
        description TEXT NOT NULL,
        timestamp TEXT NOT NULL
    )
    """)

    conn.commit()
    conn.close()

def log_audit(user_id: str, user_name: str, user_role: str, action: str, description: str, target_id: str = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    import uuid
    log_id = f"AUD-{uuid.uuid4().hex[:8].upper()}"
    now_str = datetime.now().isoformat()
    cursor.execute("""
        INSERT INTO audit_logs (id, user_id, user_name, user_role, action, target_id, description, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (log_id, user_id, user_name, user_role, action, target_id, description, now_str))
    conn.commit()
    conn.close()
