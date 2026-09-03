from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
import uuid
import json

from app.database import get_db_connection, log_audit
from app.auth import get_current_user
from app.websocket import manager

router = APIRouter(prefix="/api/sos", tags=["SOS Cases"])

class CreateSosRequest(BaseModel):
    citizen_id: str
    emergency_type: str = "Safety Emergency"
    location_address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    notes: Optional[str] = None

class AssignOfficerRequest(BaseModel):
    officer_id: str

class UpdateStatusRequest(BaseModel):
    status: str # NEW, ACCEPTED, OFFICER_ASSIGNED, IN_PROGRESS, OFFICER_AT_LOCATION, RESOLVED, CLOSED, ESCALATED
    notes: Optional[str] = None

@router.get("")
def list_sos_cases(status: Optional[str] = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    if status:
        cursor.execute("SELECT * FROM sos_cases WHERE status = ? ORDER BY created_at DESC", (status,))
    else:
        cursor.execute("SELECT * FROM sos_cases ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.get("/{case_id}")
def get_sos_case_details(case_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM sos_cases WHERE id = ?", (case_id,))
    case_row = cursor.fetchone()

    if not case_row:
        conn.close()
        raise HTTPException(status_code=404, detail=f"SOS Case {case_id} not found")

    case_dict = dict(case_row)

    # Citizen Info
    cursor.execute("SELECT * FROM senior_citizens WHERE id = ?", (case_dict["citizen_id"],))
    citizen_row = cursor.fetchone()
    citizen_dict = dict(citizen_row) if citizen_row else {}

    # Contacts
    cursor.execute("SELECT * FROM emergency_contacts WHERE citizen_id = ?", (case_dict["citizen_id"],))
    contacts = [dict(c) for c in cursor.fetchall()]

    # Assigned Officer Info
    officer_dict = None
    if case_dict["assigned_officer_id"]:
        cursor.execute("SELECT * FROM police_officers WHERE id = ?", (case_dict["assigned_officer_id"],))
        off_row = cursor.fetchone()
        if off_row:
            officer_dict = dict(off_row)

    # Case Timeline
    cursor.execute("SELECT * FROM case_timeline WHERE case_id = ? ORDER BY event_time ASC", (case_id,))
    timeline = [dict(t) for t in cursor.fetchall()]

    conn.close()

    return {
        "case": case_dict,
        "citizen": citizen_dict,
        "emergency_contacts": contacts,
        "assigned_officer": officer_dict,
        "timeline": timeline
    }

@router.post("/trigger")
async def trigger_new_sos(req: CreateSosRequest):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM senior_citizens WHERE id = ?", (req.citizen_id,))
    citizen = cursor.fetchone()
    if not citizen:
        conn.close()
        raise HTTPException(status_code=404, detail=f"Senior Citizen {req.citizen_id} not found")

    citizen_dict = dict(citizen)
    now = datetime.now()
    now_str = now.strftime("%Y-%m-%d %H:%M:%S")

    # Generate sequential or unique Case ID
    case_id = f"ANB-SOS-2026-{uuid.uuid4().hex[:5].upper()}"
    deadline = now + timedelta(hours=24)

    address = req.location_address or citizen_dict["address"]
    lat = req.latitude or citizen_dict["latitude"]
    lng = req.longitude or citizen_dict["longitude"]

    cursor.execute("""
        INSERT INTO sos_cases (id, citizen_id, citizen_name, citizen_age, citizen_mobile, location_address, latitude, longitude, emergency_type, created_at, status, escalation_deadline, sla_hours, is_emergency, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'NEW', ?, 24, 1, ?)
    """, (case_id, citizen_dict["id"], citizen_dict["name"], citizen_dict["age"], citizen_dict["mobile"], address, lat, lng, req.emergency_type, now_str, deadline.strftime("%Y-%m-%d %H:%M:%S"), req.notes or "Live Panic Trigger"))

    # Update citizen status to SOS_ACTIVE
    cursor.execute("UPDATE senior_citizens SET status = 'SOS_ACTIVE' WHERE id = ?", (citizen_dict["id"],))

    # Add Timeline Event
    cursor.execute("""
        INSERT INTO case_timeline (id, case_id, event_time, title, description, actor_name, actor_role, badge_type)
        VALUES (?, ?, ?, ?, ?, ?, 'SENIOR_CITIZEN', 'DANGER')
    """, (f"TL-{uuid.uuid4().hex[:6]}", case_id, now.strftime("%H:%M PM"), "SOS Triggered by Citizen", f"Panic alert triggered by {citizen_dict['name']}. Emergency: {req.emergency_type}", citizen_dict["name"]))

    # Notification for SHO
    notif_id = f"NOT-{uuid.uuid4().hex[:6]}"
    cursor.execute("""
        INSERT INTO notifications (id, recipient_id, recipient_role, type, title, message, case_id, created_at, status)
        VALUES (?, 'POL-SHO-041', 'SHO', 'SOS', '🚨 NEW SOS ALERT', ?, ?, ?, 'UNREAD')
    """, (notif_id, f"{citizen_dict['name']} ({citizen_dict['age']}y) triggered an SOS alert in {address}", case_id, now_str))

    conn.commit()
    conn.close()

    # Log Audit
    log_audit("SYSTEM", "ANUBHAVI ERSS Engine", "SYSTEM", "SOS CREATED", f"New SOS case {case_id} generated for citizen {citizen_dict['name']}", case_id)

    # Broadcast via WebSocket
    payload = {
        "event": "NEW_SOS_ALERT",
        "case_id": case_id,
        "citizen_name": citizen_dict["name"],
        "citizen_age": citizen_dict["age"],
        "citizen_mobile": citizen_dict["mobile"],
        "emergency_type": req.emergency_type,
        "location": address,
        "sos_time": now.strftime("%I:%M %p"),
        "created_at": now_str
    }
    await manager.broadcast(payload)

    return {"status": "SUCCESS", "message": "SOS alert triggered successfully", "case_id": case_id}

@router.post("/{case_id}/accept")
async def accept_case(case_id: str, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM sos_cases WHERE id = ?", (case_id,))
    case_row = cursor.fetchone()
    if not case_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Case not found")

    now = datetime.now()
    now_str = now.strftime("%Y-%m-%d %H:%M:%S")
    accepted_by = f"{current_user['name']} ({current_user['rank']})"

    cursor.execute("""
        UPDATE sos_cases
        SET status = 'ACCEPTED', accepted_at = ?, accepted_by = ?
        WHERE id = ?
    """, (now_str, accepted_by, case_id))

    # Add Timeline Event
    cursor.execute("""
        INSERT INTO case_timeline (id, case_id, event_time, title, description, actor_name, actor_role, badge_type)
        VALUES (?, ?, ?, 'SHO Accepted Case', ?, ?, 'SHO', 'SUCCESS')
    """, (f"TL-{uuid.uuid4().hex[:6]}", case_id, now.strftime("%H:%M PM"), f"{current_user['name']} accepted responsibility for case. GD entry recorded.", current_user['name']))

    conn.commit()
    conn.close()

    log_audit(current_user["id"], current_user["name"], current_user["role"], "SOS ACCEPTED", f"Case {case_id} accepted by SHO {current_user['name']}", case_id)

    await manager.broadcast({
        "event": "CASE_ACCEPTED",
        "case_id": case_id,
        "accepted_by": accepted_by,
        "time": now.strftime("%I:%M %p")
    })

    return {"status": "SUCCESS", "message": "Case accepted successfully", "case_id": case_id}

@router.post("/{case_id}/assign")
async def assign_officer(case_id: str, req: AssignOfficerRequest, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM sos_cases WHERE id = ?", (case_id,))
    case_row = cursor.fetchone()
    if not case_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Case not found")
    case_dict = dict(case_row)

    cursor.execute("SELECT * FROM police_officers WHERE id = ?", (req.officer_id,))
    officer_row = cursor.fetchone()
    if not officer_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Police Officer not found")
    officer = dict(officer_row)

    now = datetime.now()
    now_str = now.strftime("%Y-%m-%d %H:%M:%S")

    cursor.execute("""
        UPDATE sos_cases
        SET status = 'OFFICER_ASSIGNED', assigned_officer_id = ?, assigned_at = ?
        WHERE id = ?
    """, (officer["id"], now_str, case_id))

    # Update officer status and case count
    cursor.execute("""
        UPDATE police_officers
        SET active_cases_count = active_cases_count + 1
        WHERE id = ?
    """, (officer["id"],))

    # Add Timeline Event
    cursor.execute("""
        INSERT INTO case_timeline (id, case_id, event_time, title, description, actor_name, actor_role, badge_type)
        VALUES (?, ?, ?, ?, ?, ?, 'SHO', 'PRIMARY')
    """, (f"TL-{uuid.uuid4().hex[:6]}", case_id, now.strftime("%H:%M PM"), f"Officer Assigned: {officer['name']}", f"{officer['rank']} {officer['name']} ({officer['police_id']}) assigned to emergency dispatch.", current_user["name"]))

    # Notification for Citizen / Kin
    cursor.execute("""
        INSERT INTO notifications (id, recipient_id, recipient_role, type, title, message, case_id, created_at, status)
        VALUES (?, ?, 'SENIOR_CITIZEN', 'OFFICER_ASSIGNMENT', '👮 Police Officer Assigned', ?, ?, ?, 'UNREAD')
    """, (f"NOT-{uuid.uuid4().hex[:6]}", case_dict["citizen_id"], f"{officer['rank']} {officer['name']} has been assigned to your case ({case_id}) and is en route.", case_id, now_str))

    conn.commit()
    conn.close()

    log_audit(current_user["id"], current_user["name"], current_user["role"], "OFFICER ASSIGNED", f"Assigned {officer['name']} ({officer['police_id']}) to case {case_id}", case_id)

    await manager.broadcast({
        "event": "OFFICER_ASSIGNED",
        "case_id": case_id,
        "officer_name": officer["name"],
        "officer_rank": officer["rank"],
        "assigned_at": now.strftime("%I:%M %p")
    })

    return {"status": "SUCCESS", "message": f"Officer {officer['name']} assigned successfully", "case_id": case_id}

@router.post("/{case_id}/status")
async def update_case_status(case_id: str, req: UpdateStatusRequest, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM sos_cases WHERE id = ?", (case_id,))
    case_row = cursor.fetchone()
    if not case_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Case not found")
    case_dict = dict(case_row)

    now = datetime.now()
    now_str = now.strftime("%Y-%m-%d %H:%M:%S")

    resolved_at = now_str if req.status == "RESOLVED" else case_dict["resolved_at"]
    closed_at = now_str if req.status == "CLOSED" else case_dict["closed_at"]

    cursor.execute("""
        UPDATE sos_cases
        SET status = ?, resolved_at = ?, closed_at = ?
        WHERE id = ?
    """, (req.status, resolved_at, closed_at, case_id))

    # If resolved or closed, restore citizen status to SAFE
    if req.status in ["RESOLVED", "CLOSED"]:
        cursor.execute("UPDATE senior_citizens SET status = 'SAFE' WHERE id = ?", (case_dict["citizen_id"],))

    # Add Timeline Event
    badge_map = {
        "IN_PROGRESS": "WARNING",
        "OFFICER_AT_LOCATION": "PRIMARY",
        "RESOLVED": "SUCCESS",
        "CLOSED": "INFO",
        "ESCALATED": "DANGER"
    }
    badge_type = badge_map.get(req.status, "INFO")

    cursor.execute("""
        INSERT INTO case_timeline (id, case_id, event_time, title, description, actor_name, actor_role, badge_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (f"TL-{uuid.uuid4().hex[:6]}", case_id, now.strftime("%H:%M PM"), f"Status Updated: {req.status}", req.notes or f"Case status updated to {req.status} by {current_user['name']}.", current_user["name"], current_user["role"], badge_type))

    conn.commit()
    conn.close()

    log_audit(current_user["id"], current_user["name"], current_user["role"], "STATUS UPDATED", f"Updated status of case {case_id} to {req.status}", case_id)

    await manager.broadcast({
        "event": "STATUS_UPDATED",
        "case_id": case_id,
        "new_status": req.status,
        "updated_at": now.strftime("%I:%M %p")
    })

    return {"status": "SUCCESS", "message": f"Case status updated to {req.status}", "case_id": case_id}
