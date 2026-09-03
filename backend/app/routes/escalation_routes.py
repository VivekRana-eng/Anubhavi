from fastapi import APIRouter, Depends
from datetime import datetime
import uuid
from app.database import get_db_connection, log_audit
from app.auth import get_current_user
from app.websocket import manager

router = APIRouter(prefix="/api/escalations", tags=["24h Escalations SLA"])

@router.get("")
def get_escalated_cases():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM sos_cases WHERE status = 'ESCALATED' OR escalation_deadline < datetime('now') ORDER BY created_at DESC")
    sos_rows = cursor.fetchall()

    cursor.execute("SELECT * FROM assistance_requests WHERE status = 'ESCALATED' OR escalation_deadline < datetime('now') ORDER BY created_at DESC")
    ast_rows = cursor.fetchall()
    conn.close()

    return {
        "escalated_sos": [dict(r) for r in sos_rows],
        "escalated_assistance": [dict(r) for r in ast_rows]
    }

@router.post("/trigger-fastforward")
async def trigger_test_escalation(current_user: dict = Depends(get_current_user)):
    """
    Demo/Test Mechanism: Simulates 24-hour statutory deadline expiration instantly
    Marks case as ESCALATED and generates DSP Notification.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    # Find the latest NEW or ACCEPTED SOS case to escalate
    cursor.execute("SELECT * FROM sos_cases WHERE status IN ('NEW', 'ACCEPTED') ORDER BY created_at DESC LIMIT 1")
    target_case = cursor.fetchone()

    if not target_case:
        # If no unhandled SOS case, pick any active case
        cursor.execute("SELECT * FROM sos_cases WHERE status != 'CLOSED' ORDER BY created_at DESC LIMIT 1")
        target_case = cursor.fetchone()

    if not target_case:
        conn.close()
        return {"status": "FAILED", "message": "No active cases available to escalate"}

    case_dict = dict(target_case)
    now = datetime.now()
    now_str = now.strftime("%Y-%m-%d %H:%M:%S")

    cursor.execute("""
        UPDATE sos_cases
        SET status = 'ESCALATED'
        WHERE id = ?
    """, (case_dict["id"],))

    # Add Timeline Event
    cursor.execute("""
        INSERT INTO case_timeline (id, case_id, event_time, title, description, actor_name, actor_role, badge_type)
        VALUES (?, ?, ?, '⚠️ Statutory 24h SLA Expired - Case Escalated to DSP', 'Case crossed statutory threshold without SHO completion. Automatic DSP notification dispatched.', 'Watchdog System', 'SYSTEM', 'DANGER')
    """, (f"TL-{uuid.uuid4().hex[:6]}", case_dict["id"], now.strftime("%H:%M PM")))

    # Create DSP Notification
    cursor.execute("""
        INSERT INTO notifications (id, recipient_id, recipient_role, type, title, message, case_id, created_at, status)
        VALUES (?, 'USER-DSP-01', 'DSP', 'ESCALATION', '⚠️ CASE ESCALATED TO DSP', ?, ?, ?, 'UNREAD')
    """, (f"NOT-{uuid.uuid4().hex[:6]}", f"Case {case_dict['id']} ({case_dict['citizen_name']}) has not received required SHO action within statutory 24-hour cycle.", case_dict["id"], now_str))

    conn.commit()
    conn.close()

    log_audit(current_user["id"], current_user["name"], current_user["role"], "CASE ESCALATED", f"Fast-forward SLA Watchdog auto-escalated case {case_dict['id']} to DSP", case_dict["id"])

    await manager.broadcast({
        "event": "CASE_ESCALATED",
        "case_id": case_dict["id"],
        "citizen_name": case_dict["citizen_name"],
        "time": now.strftime("%I:%M %p")
    })

    return {
        "status": "SUCCESS",
        "message": f"Case {case_dict['id']} auto-escalated to DSP successfully",
        "case_id": case_dict["id"]
    }
