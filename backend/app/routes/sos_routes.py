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
    citizen_id: Optional[str] = "CIT-8841"
    citizen_name: Optional[str] = None
    citizen_mobile: Optional[str] = None
    emergency_type: str = "Safety Emergency"
    description: Optional[str] = None
    location_address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    priority: Optional[str] = "HIGH"
    notes: Optional[str] = None

class AssignOfficerRequest(BaseModel):
    officer_id: Optional[str] = "POL-1025"
    officer_name: Optional[str] = None
    officer_rank: Optional[str] = None
    police_id: Optional[str] = None
    assigned_vehicle: Optional[str] = None
    vehicle: Optional[str] = None
    police_station: Optional[str] = "MODEL TOWN POLICE STATION"
    station_code: Optional[str] = "MTP-PS-01"
    jurisdiction: Optional[str] = "Model Town • District Central • Zone 1"
    sho_name: Optional[str] = "Insp. Raj Kumar"
    response_type: Optional[str] = "Police Emergency Response"
    priority: Optional[str] = "HIGH"
    instructions: Optional[str] = "Dispatched for immediate emergency response."
    estimated_response_time: Optional[str] = "10 minutes"
    remarks: Optional[str] = None

class UpdateStatusRequest(BaseModel):
    status: str # ACTIVE, ACKNOWLEDGED, ASSIGNED, OFFICER_DISPATCHED, ON_THE_WAY, ARRIVED, OFFICER_AT_LOCATION, RESOLVED, CLOSED, CANCELLED
    notes: Optional[str] = None

@router.get("")
def list_sos_cases(status: Optional[str] = None, citizen_id: Optional[str] = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM sos_cases WHERE 1=1"
    params = []
    
    if status:
        query += " AND status = ?"
        params.append(status)
    if citizen_id:
        query += " AND citizen_id = ?"
        params.append(citizen_id)
        
    query += " ORDER BY created_at DESC"
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    
    results = []
    for r in rows:
        d = dict(r)
        if d.get("assignment_details"):
            try:
                d["assignment_details"] = json.loads(d["assignment_details"])
            except Exception:
                pass
        results.append(d)
    return results

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
    if case_dict.get("assignment_details"):
        try:
            case_dict["assignment_details"] = json.loads(case_dict["assignment_details"])
        except Exception:
            pass

    # Citizen Info
    cursor.execute("SELECT * FROM senior_citizens WHERE id = ?", (case_dict["citizen_id"],))
    citizen_row = cursor.fetchone()
    citizen_dict = dict(citizen_row) if citizen_row else {}

    # Contacts
    cursor.execute("SELECT * FROM emergency_contacts WHERE citizen_id = ?", (case_dict["citizen_id"],))
    contacts = [dict(c) for c in cursor.fetchall()]

    # Assigned Officer Info
    officer_dict = None
    if case_dict.get("assigned_officer_id"):
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

    citizen_id = req.citizen_id or "CIT-8841"
    cursor.execute("SELECT * FROM senior_citizens WHERE id = ?", (citizen_id,))
    citizen = cursor.fetchone()
    
    if not citizen:
        # Fallback if citizen ID not in table yet
        citizen_name = req.citizen_name or "Rajesh Sharma"
        citizen_mobile = req.citizen_mobile or "+91 98721-00214"
        citizen_age = 72
        address = req.location_address or "H.No 412, Lane 4, Model Town Phase 2, Ludhiana"
        lat = req.latitude or 30.9010
        lng = req.longitude or 75.8573
    else:
        c_dict = dict(citizen)
        citizen_name = req.citizen_name or c_dict["name"]
        citizen_mobile = req.citizen_mobile or c_dict["mobile"]
        citizen_age = c_dict["age"]
        address = req.location_address or c_dict["address"]
        lat = req.latitude or c_dict["latitude"]
        lng = req.longitude or c_dict["longitude"]

    now = datetime.now()
    now_str = now.strftime("%Y-%m-%d %H:%M:%S")
    case_id = f"ANB-SOS-2026-{uuid.uuid4().hex[:5].upper()}"
    deadline = now + timedelta(hours=24)

    cursor.execute("""
        INSERT INTO sos_cases (id, citizen_id, citizen_name, citizen_age, citizen_mobile, location_address, latitude, longitude, emergency_type, created_at, status, escalation_deadline, sla_hours, is_emergency, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?, 24, 1, ?)
    """, (case_id, citizen_id, citizen_name, citizen_age, citizen_mobile, address, lat, lng, req.emergency_type, now_str, deadline.strftime("%Y-%m-%d %H:%M:%S"), req.description or req.notes or "Live Panic Trigger"))

    # Update citizen status to SOS_ACTIVE
    cursor.execute("UPDATE senior_citizens SET status = 'SOS_ACTIVE' WHERE id = ?", (citizen_id,))

    # Add Timeline Event
    cursor.execute("""
        INSERT INTO case_timeline (id, case_id, event_time, title, description, actor_name, actor_role, badge_type)
        VALUES (?, ?, ?, ?, ?, ?, 'SENIOR_CITIZEN', 'DANGER')
    """, (f"TL-{uuid.uuid4().hex[:6]}", case_id, now.strftime("%H:%M PM"), "SOS Triggered by Citizen", f"Emergency SOS alert triggered by {citizen_name}. Type: {req.emergency_type}. Location: {address}", citizen_name))

    # Notification for SHO
    notif_id = f"NOT-{uuid.uuid4().hex[:6]}"
    cursor.execute("""
        INSERT INTO notifications (id, recipient_id, recipient_role, type, title, message, case_id, created_at, status)
        VALUES (?, 'POL-SHO-041', 'SHO', 'SOS', '🚨 NEW SOS ALERT', ?, ?, ?, 'UNREAD')
    """, (notif_id, f"{citizen_name} ({citizen_age}y) triggered an SOS alert in {address}", case_id, now_str))

    conn.commit()
    conn.close()

    log_audit("SYSTEM", "ANUBHAVI ERSS Engine", "SYSTEM", "SOS CREATED", f"New SOS case {case_id} generated for citizen {citizen_name}", case_id)

    # Broadcast via WebSocket to SHO Command Console
    payload = {
        "event": "NEW_SOS_ALERT",
        "case_id": case_id,
        "citizen_id": citizen_id,
        "citizen_name": citizen_name,
        "citizen_age": citizen_age,
        "citizen_mobile": citizen_mobile,
        "emergency_type": req.emergency_type,
        "description": req.description or req.notes or "Immediate Emergency Support Requested",
        "location": address,
        "latitude": lat,
        "longitude": lng,
        "priority": req.priority or "HIGH",
        "sos_time": now.strftime("%I:%M %p"),
        "created_at": now_str,
        "status": "ACTIVE"
    }
    await manager.broadcast(payload)

    return {"status": "SUCCESS", "message": "SOS alert triggered successfully", "case_id": case_id, "case": payload}

@router.post("/{case_id}/accept")
async def accept_case(case_id: str, current_user: Optional[dict] = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM sos_cases WHERE id = ?", (case_id,))
    case_row = cursor.fetchone()
    if not case_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Case not found")

    now = datetime.now()
    now_str = now.strftime("%Y-%m-%d %H:%M:%S")
    actor_name = current_user["name"] if current_user else "Insp. Raj Kumar"

    cursor.execute("""
        UPDATE sos_cases
        SET status = 'ACKNOWLEDGED', accepted_at = ?, accepted_by = ?
        WHERE id = ?
    """, (now_str, actor_name, case_id))

    # Add Timeline Event
    cursor.execute("""
        INSERT INTO case_timeline (id, case_id, event_time, title, description, actor_name, actor_role, badge_type)
        VALUES (?, ?, ?, 'SHO Acknowledged Case', ?, ?, 'SHO', 'SUCCESS')
    """, (f"TL-{uuid.uuid4().hex[:6]}", case_id, now.strftime("%H:%M PM"), f"{actor_name} acknowledged responsibility for case {case_id}.", actor_name))

    conn.commit()
    conn.close()

    await manager.broadcast({
        "event": "CASE_ACCEPTED",
        "case_id": case_id,
        "accepted_by": actor_name,
        "time": now.strftime("%I:%M %p"),
        "status": "ACKNOWLEDGED"
    })

    return {"status": "SUCCESS", "message": "Case acknowledged successfully", "case_id": case_id}

@router.post("/{case_id}/assign")
async def assign_officer(case_id: str, req: AssignOfficerRequest, current_user: Optional[dict] = Depends(get_current_user)):
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

    mock_officers_dict = {
        "POL-1025": {"id": "POL-1025", "name": "ASI Amit Singh", "rank": "Assistant Sub-Inspector", "police_id": "POL-1025", "current_vehicle": "PCR Bike #12"},
        "POL-1024": {"id": "POL-1024", "name": "HC Raj Kumar", "rank": "Head Constable", "police_id": "POL-1024", "current_vehicle": "PCR Van #04"},
        "POL-1027": {"id": "POL-1027", "name": "SI Neeraj Kumar", "rank": "Sub-Inspector", "police_id": "POL-1027", "current_vehicle": "PCR Car #01"},
        "POL-1026": {"id": "POL-1026", "name": "Const. Vikram Sharma", "rank": "Constable", "police_id": "POL-1026", "current_vehicle": "PCR Van #02"}
    }

    if not officer_row:
        officer = mock_officers_dict.get(req.officer_id, {
            "id": req.officer_id,
            "name": "ASI Amit Singh",
            "rank": "Assistant Sub-Inspector",
            "police_id": "POL-1025",
            "mobile": "+91 98721-44102",
            "current_vehicle": "PCR Bike #12"
        })
    else:
        officer = dict(officer_row)

    now = datetime.now()
    now_str = now.strftime("%Y-%m-%d %H:%M:%S")
    actor_name = req.sho_name or (current_user["name"] if current_user else "Insp. Raj Kumar")
    police_station = req.police_station or "MODEL TOWN POLICE STATION"
    station_code = req.station_code or "MTP-PS-01"
    jurisdiction = req.jurisdiction or "Model Town • District Central • Zone 1"
    vehicle = req.vehicle or req.assigned_vehicle or officer.get("current_vehicle", "PCR Unit")
    final_officer_name = req.officer_name or officer.get("name", "ASI Amit Singh")
    final_officer_rank = req.officer_rank or officer.get("rank", "Assistant Sub-Inspector")
    final_police_id = req.police_id or officer.get("police_id", req.officer_id or "POL-1025")

    assignment_data = {
        "police_station": police_station,
        "station_code": station_code,
        "jurisdiction": jurisdiction,
        "sho_name": actor_name,
        "officer_id": req.officer_id or "POL-1025",
        "officer_name": final_officer_name,
        "officer_rank": final_officer_rank,
        "police_id": final_police_id,
        "vehicle": vehicle,
        "response_type": req.response_type,
        "priority": req.priority,
        "instructions": req.instructions,
        "estimated_response_time": req.estimated_response_time,
        "remarks": req.remarks,
        "assigned_by": actor_name,
        "assigned_at": now_str
    }

    cursor.execute("""
        UPDATE sos_cases
        SET status = 'ASSIGNED', assigned_officer_id = ?, assigned_at = ?, assignment_details = ?
        WHERE id = ?
    """, (officer["id"], now_str, json.dumps(assignment_data), case_id))

    # Add Timeline Event
    cursor.execute("""
        INSERT INTO case_timeline (id, case_id, event_time, title, description, actor_name, actor_role, badge_type)
        VALUES (?, ?, ?, ?, ?, ?, 'SHO', 'PRIMARY')
    """, (f"TL-{uuid.uuid4().hex[:6]}", case_id, now.strftime("%H:%M PM"), f"Officer Assigned: {officer['name']}", f"{officer['rank']} {officer['name']} ({officer.get('police_id', officer['id'])}) assigned from {police_station} ({vehicle}). ETA: {req.estimated_response_time}", actor_name))

    # User Notification
    cursor.execute("""
        INSERT INTO notifications (id, recipient_id, recipient_role, type, title, message, case_id, created_at, status)
        VALUES (?, ?, 'SENIOR_CITIZEN', 'OFFICER_ASSIGNMENT', '🚔 RESPONSE ASSIGNED', ?, ?, ?, 'UNREAD')
    """, (f"NOT-{uuid.uuid4().hex[:6]}", case_dict["citizen_id"], f"{officer['rank']} {officer['name']} dispatched from {police_station} ({vehicle}). Estimated ETA: {req.estimated_response_time}.", case_id, now_str))

    conn.commit()
    conn.close()

    payload = {
        "event": "SOS_ASSIGNED",
        "case_id": case_id,
        "citizen_id": case_dict["citizen_id"],
        "police_station": police_station,
        "station_code": station_code,
        "jurisdiction": jurisdiction,
        "sho_name": actor_name,
        "officer_id": officer["id"],
        "officer_name": officer["name"],
        "officer_rank": officer["rank"],
        "police_id": officer.get("police_id", officer["id"]),
        "vehicle": vehicle,
        "response_type": req.response_type,
        "priority": req.priority,
        "instructions": req.instructions,
        "eta": req.estimated_response_time,
        "remarks": req.remarks,
        "status": "ASSIGNED",
        "assigned_at": now.strftime("%I:%M %p")
    }

    # Broadcast to User Dashboard in real time
    await manager.broadcast(payload)

    return {"status": "SUCCESS", "message": f"Officer {officer['name']} assigned successfully", "case_id": case_id, "assignment": payload}

@router.post("/{case_id}/status")
async def update_case_status(case_id: str, req: UpdateStatusRequest, current_user: Optional[dict] = Depends(get_current_user)):
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
    actor_name = current_user["name"] if current_user else "Insp. Raj Kumar"

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

    # Status message mapping for user notification
    status_messages = {
        "OFFICER_DISPATCHED": ("🚔 Officer Dispatched", "Your assigned officer is on the way to your emergency location."),
        "ON_THE_WAY": ("🚔 Officer En Route", "Police response unit is approaching your area."),
        "ARRIVED": ("📍 Officer Arrived", "Your assigned officer has reached your location."),
        "OFFICER_AT_LOCATION": ("📍 Officer Arrived", "Your assigned officer has reached your location."),
        "RESOLVED": ("✅ Case Resolved", "Your SOS emergency request has been marked as resolved by SHO Command."),
        "CLOSED": ("🔒 Case Closed", "Emergency case documentation closed."),
        "CANCELLED": ("❌ Case Cancelled", "Emergency request cancelled.")
    }

    title, msg = status_messages.get(req.status, (f"Status Update: {req.status}", req.notes or f"Status changed to {req.status}"))

    # Create Notification
    cursor.execute("""
        INSERT INTO notifications (id, recipient_id, recipient_role, type, title, message, case_id, created_at, status)
        VALUES (?, ?, 'SENIOR_CITIZEN', 'SOS_STATUS', ?, ?, ?, ?, 'UNREAD')
    """, (f"NOT-{uuid.uuid4().hex[:6]}", case_dict["citizen_id"], title, msg, case_id, now_str))

    # Add Timeline Event
    badge_map = {
        "OFFICER_DISPATCHED": "PRIMARY",
        "ON_THE_WAY": "WARNING",
        "ARRIVED": "PRIMARY",
        "OFFICER_AT_LOCATION": "PRIMARY",
        "RESOLVED": "SUCCESS",
        "CLOSED": "INFO",
        "CANCELLED": "DANGER"
    }
    badge_type = badge_map.get(req.status, "INFO")

    cursor.execute("""
        INSERT INTO case_timeline (id, case_id, event_time, title, description, actor_name, actor_role, badge_type)
        VALUES (?, ?, ?, ?, ?, ?, 'SHO', ?)
    """, (f"TL-{uuid.uuid4().hex[:6]}", case_id, now.strftime("%H:%M PM"), title, req.notes or msg, actor_name, badge_type))

    conn.commit()
    conn.close()

    payload = {
        "event": "SOS_STATUS_UPDATED",
        "case_id": case_id,
        "citizen_id": case_dict["citizen_id"],
        "new_status": req.status,
        "title": title,
        "message": msg,
        "notes": req.notes,
        "updated_at": now.strftime("%I:%M %p")
    }

    await manager.broadcast(payload)

    return {"status": "SUCCESS", "message": f"Case status updated to {req.status}", "case_id": case_id, "update": payload}
