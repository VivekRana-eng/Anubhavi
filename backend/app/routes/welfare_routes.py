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

@router.get("/checks")
def list_welfare_checks():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM welfare_checks ORDER BY scheduled_date ASC, scheduled_time ASC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

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
    return [dict(r) for r in rows]
