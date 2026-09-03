from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from datetime import datetime

from app.database import get_db_connection

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("")
def get_notifications(recipient_id: Optional[str] = None, recipient_role: Optional[str] = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = "SELECT * FROM notifications WHERE 1=1"
    params = []
    
    if recipient_id:
        query += " AND recipient_id = ?"
        params.append(recipient_id)
    if recipient_role:
        query += " AND recipient_role = ?"
        params.append(recipient_role)
        
    query += " ORDER BY created_at DESC LIMIT 50"
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(r) for r in rows]

@router.patch("/{notification_id}/read")
def mark_notification_read(notification_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute("UPDATE notifications SET status = 'READ', read_at = ? WHERE id = ?", (now_str, notification_id))
    conn.commit()
    conn.close()
    return {"status": "SUCCESS", "notification_id": notification_id}
