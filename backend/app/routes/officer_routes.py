from fastapi import APIRouter
from app.database import get_db_connection

router = APIRouter(prefix="/api/officers", tags=["Police Officers"])

@router.get("")
def list_officers():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM police_officers ORDER BY status ASC, name ASC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]
