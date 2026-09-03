from fastapi import APIRouter, HTTPException, Depends
from app.database import get_db_connection, log_audit
from app.auth import get_current_user

router = APIRouter(prefix="/api/citizens", tags=["Senior Citizens"])

@router.get("")
def list_citizens(search: str = None, risk: str = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM senior_citizens WHERE 1=1"
    params = []

    if search:
        query += " AND (name LIKE ? OR mobile LIKE ? OR address LIKE ? OR id LIKE ?)"
        term = f"%{search}%"
        params.extend([term, term, term, term])

    if risk:
        query += " AND risk_level = ?"
        params.append(risk)

    query += " ORDER BY name ASC"
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.get("/{citizen_id}")
def get_citizen_360_profile(citizen_id: str, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM senior_citizens WHERE id = ?", (citizen_id,))
    cit_row = cursor.fetchone()
    if not cit_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Senior Citizen profile not found")

    citizen = dict(cit_row)

    # Contacts
    cursor.execute("SELECT * FROM emergency_contacts WHERE citizen_id = ?", (citizen_id,))
    contacts = [dict(r) for r in cursor.fetchall()]

    # SOS History
    cursor.execute("SELECT * FROM sos_cases WHERE citizen_id = ? ORDER BY created_at DESC", (citizen_id,))
    sos_history = [dict(r) for r in cursor.fetchall()]

    # Assistance Requests
    cursor.execute("SELECT * FROM assistance_requests WHERE citizen_id = ? ORDER BY created_at DESC", (citizen_id,))
    assistance_history = [dict(r) for r in cursor.fetchall()]

    # Welfare Checks
    cursor.execute("SELECT * FROM welfare_checks WHERE citizen_id = ? ORDER BY scheduled_date DESC", (citizen_id,))
    welfare_history = [dict(r) for r in cursor.fetchall()]

    # Audit Trail for Citizen
    cursor.execute("SELECT * FROM audit_logs WHERE target_id = ? OR description LIKE ? ORDER BY timestamp DESC", (citizen_id, f"%{citizen['name']}%"))
    audit_trail = [dict(r) for r in cursor.fetchall()]

    conn.close()

    log_audit(current_user["id"], current_user["name"], current_user["role"], "CITIZEN PROFILE VIEWED", f"Viewed 360 profile for {citizen['name']} ({citizen['id']})", citizen_id)

    return {
        "citizen": citizen,
        "emergency_contacts": contacts,
        "sos_history": sos_history,
        "assistance_requests": assistance_history,
        "welfare_checks": welfare_history,
        "audit_trail": audit_trail
    }
