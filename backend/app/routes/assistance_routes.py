from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
import uuid
from app.database import get_db_connection, log_audit
from app.auth import get_current_user

router = APIRouter(prefix="/api/assistance", tags=["Assistance Requests"])

class CreateAssistanceRequest(BaseModel):
    citizen_id: str
    request_type: str # Welfare Assistance, Safety Concern, Medical Assistance, Neighbour Concern, Other
    description: Optional[str] = None
    location: Optional[str] = None

class UpdateAssistanceStatus(BaseModel):
    status: str
    officer_id: Optional[str] = None

@router.get("")
def list_assistance_requests():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM assistance_requests ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.post("/create")
def create_assistance_request(req: CreateAssistanceRequest):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM senior_citizens WHERE id = ?", (req.citizen_id,))
    cit = cursor.fetchone()
    if not cit:
        conn.close()
        raise HTTPException(status_code=404, detail="Citizen not found")
    citizen = dict(cit)

    now = datetime.now()
    now_str = now.strftime("%Y-%m-%d %H:%M:%S")
    deadline = (now + timedelta(hours=24)).strftime("%Y-%m-%d %H:%M:%S")
    req_id = f"AST-2026-{uuid.uuid4().hex[:4].upper()}"

    location = req.location or citizen["address"]

    cursor.execute("""
        INSERT INTO assistance_requests (id, citizen_id, citizen_name, request_type, description, location, created_at, status, escalation_deadline)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'NEW', ?)
    """, (req_id, citizen["id"], citizen["name"], req.request_type, req.description, location, now_str, deadline))

    conn.commit()
    conn.close()

    log_audit("SYSTEM", "ANUBHAVI System", "SYSTEM", "ASSISTANCE REQUEST CREATED", f"Created assistance request {req_id} for {citizen['name']}", req_id)

    return {"status": "SUCCESS", "request_id": req_id, "message": "Assistance request logged"}

@router.post("/{request_id}/status")
def update_assistance_status(request_id: str, req: UpdateAssistanceStatus, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()

    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    cursor.execute("SELECT * FROM assistance_requests WHERE id = ?", (request_id,))
    existing = cursor.fetchone()
    if not existing:
        conn.close()
        raise HTTPException(status_code=404, detail="Assistance Request not found")

    accepted_at = now_str if req.status == "ACCEPTED" else existing["accepted_at"]
    assigned_officer_id = req.officer_id if req.officer_id else existing["assigned_officer_id"]

    cursor.execute("""
        UPDATE assistance_requests
        SET status = ?, accepted_at = ?, assigned_officer_id = ?
        WHERE id = ?
    """, (req.status, accepted_at, assigned_officer_id, request_id))

    conn.commit()
    conn.close()

    log_audit(current_user["id"], current_user["name"], current_user["role"], "ASSISTANCE STATUS UPDATED", f"Updated assistance request {request_id} to {req.status}", request_id)

    return {"status": "SUCCESS", "message": f"Assistance request updated to {req.status}"}
