from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid
from app.database import get_db_connection, log_audit
from app.auth import get_current_user

router = APIRouter(prefix="/api/welfare", tags=["Welfare & Check-ins"])

class ScheduleWelfareRequest(BaseModel):
    citizen_id: str
    scheduled_date: str
    scheduled_time: str
    check_type: str # Welfare Call, Periodic Check-in, Safety Awareness Message, Follow-up
    assigned_officer_id: Optional[str] = None
    purpose: Optional[str] = None
    notes: Optional[str] = None

MOCK_WELFARE_CHECKS = [
    {
        "id": "WEL-9001",
        "citizen_id": "CIT-8841",
        "citizen_name": "Rajesh Sharma",
        "scheduled_date": "2026-09-04",
        "scheduled_time": "10:30 AM",
        "assigned_officer_name": "ASI Amit Singh",
        "check_type": "Periodic Beat Visit",
        "purpose": "Pacemaker medical safety & keyholder verification",
        "status": "SCHEDULED"
    },
    {
        "id": "WEL-9002",
        "citizen_id": "CIT-8842",
        "citizen_name": "Sunita Devi",
        "scheduled_date": "2026-09-04",
        "scheduled_time": "11:45 AM",
        "assigned_officer_name": "HC Raj Kumar",
        "check_type": "Welfare Call",
        "purpose": "Post-monsoon home door lock safety check",
        "status": "CONFIRMED"
    },
    {
        "id": "WEL-9003",
        "citizen_id": "CIT-8843",
        "citizen_name": "Mohan Lal",
        "scheduled_date": "2026-09-04",
        "scheduled_time": "02:15 PM",
        "assigned_officer_name": "SI Neeraj Kumar",
        "check_type": "Cyber Safety Briefing",
        "purpose": "Digital arrest fraud awareness & helpline setup",
        "status": "SCHEDULED"
    },
    {
        "id": "WEL-9004",
        "citizen_id": "CIT-8844",
        "citizen_name": "Kamla Sharma",
        "scheduled_date": "2026-09-05",
        "scheduled_time": "09:00 AM",
        "assigned_officer_name": "Const. Vikram Sharma",
        "check_type": "Post-Incident Follow-up",
        "purpose": "Asthma nebulizer emergency battery check",
        "status": "CONFIRMED"
    },
    {
        "id": "WEL-9005",
        "citizen_id": "CIT-8845",
        "citizen_name": "Harish Kumar",
        "scheduled_date": "2026-09-05",
        "scheduled_time": "04:00 PM",
        "assigned_officer_name": "SI Rahul Verma",
        "check_type": "Welfare Call",
        "purpose": "Living status & emergency contact audit",
        "status": "SCHEDULED"
    }
]

@router.get("/checks")
def list_welfare_checks():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM welfare_checks ORDER BY scheduled_date ASC, scheduled_time ASC")
    rows = cursor.fetchall()
    conn.close()
    
    results = [dict(r) for r in rows]
    if not results:
        results = MOCK_WELFARE_CHECKS
    return results

@router.post("/schedule")
def schedule_welfare_check(req: ScheduleWelfareRequest, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM senior_citizens WHERE id = ?", (req.citizen_id,))
    cit = cursor.fetchone()
    if not cit:
        conn.close()
        raise HTTPException(status_code=404, detail="Citizen not found")
    citizen = dict(cit)

    officer_name = "Unassigned"
    if req.assigned_officer_id:
        cursor.execute("SELECT name, rank FROM police_officers WHERE id = ?", (req.assigned_officer_id,))
        off = cursor.fetchone()
        if off:
            officer_name = f"{off['rank']} {off['name']}"

    wel_id = f"WEL-{uuid.uuid4().hex[:6].upper()}"

    cursor.execute("""
        INSERT INTO welfare_checks (id, citizen_id, citizen_name, scheduled_date, scheduled_time, check_type, assigned_officer_id, assigned_officer_name, purpose, notes, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SCHEDULED')
    """, (wel_id, citizen["id"], citizen["name"], req.scheduled_date, req.scheduled_time, req.check_type, req.assigned_officer_id, officer_name, req.purpose, req.notes))

    conn.commit()
    conn.close()

    log_audit(current_user["id"], current_user["name"], current_user["role"], "WELFARE CHECK SCHEDULED", f"Scheduled {req.check_type} for {citizen['name']} on {req.scheduled_date} at {req.scheduled_time}", wel_id)

    return {"status": "SUCCESS", "welfare_id": wel_id, "message": "Welfare check scheduled successfully"}

@router.get("/missed-checkins")
def list_missed_checkins():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM check_ins ORDER BY scheduled_time DESC")
    rows = cursor.fetchall()
    conn.close()
    
    results = [dict(r) for r in rows]
    if not results:
        results = [
            {
                "id": "CHK-1001",
                "citizen_id": "CIT-8843",
                "citizen_name": "Mohan Lal",
                "scheduled_time": "Today, 08:00 AM (Overdue 6h)",
                "last_known_location": "H.No 125, Sector 3, Model Town",
                "family_notified": 1,
                "police_notified": 1,
                "status": "UNRESPONSIVE"
            },
            {
                "id": "CHK-1002",
                "citizen_id": "CIT-8841",
                "citizen_name": "Rajesh Sharma",
                "scheduled_time": "Today, 09:30 AM (Overdue 4.5h)",
                "last_known_location": "H.No 412, Lane 4, Model Town Phase 2",
                "family_notified": 1,
                "police_notified": 1,
                "status": "UNRESPONSIVE"
            },
            {
                "id": "CHK-1003",
                "citizen_id": "CIT-8845",
                "citizen_name": "Harish Kumar",
                "scheduled_time": "Today, 10:15 AM (Overdue 3.5h)",
                "last_known_location": "H.No 204, Lane 2, Model Town",
                "family_notified": 1,
                "police_notified": 1,
                "status": "PENDING_CALL"
            },
            {
                "id": "CHK-1004",
                "citizen_id": "CIT-8842",
                "citizen_name": "Sunita Devi",
                "scheduled_time": "Yesterday, 07:00 PM (Overdue 17h)",
                "last_known_location": "H.No 88, Block C, Model Town",
                "family_notified": 1,
                "police_notified": 1,
                "status": "ALERT_INGESTED"
            },
            {
                "id": "CHK-1005",
                "citizen_id": "CIT-8844",
                "citizen_name": "Kamla Sharma",
                "scheduled_time": "Yesterday, 08:30 PM (Overdue 15.5h)",
                "last_known_location": "H.No 64, Phase 1, Model Town",
                "family_notified": 1,
                "police_notified": 1,
                "status": "BEAT_DISPATCHED"
            }
        ]
    return results
