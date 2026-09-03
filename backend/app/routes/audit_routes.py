from fastapi import APIRouter
from app.database import get_db_connection

router = APIRouter(prefix="/api/audit-logs", tags=["Audit Logs"])

@router.get("")
def list_audit_logs():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]
