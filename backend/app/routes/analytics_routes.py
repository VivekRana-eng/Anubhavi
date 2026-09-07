from fastapi import APIRouter
from app.database import get_db_connection

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/dashboard-stats")
def get_dashboard_stats():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM senior_citizens")
    total_citizens = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM sos_cases WHERE status IN ('NEW', 'ACCEPTED', 'OFFICER_ASSIGNED', 'IN_PROGRESS', 'OFFICER_AT_LOCATION')")
    active_sos = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM assistance_requests WHERE status IN ('NEW', 'ACCEPTED', 'ASSIGNED', 'IN_PROGRESS')")
    pending_assistance = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM check_ins WHERE status = 'MISSED'")
    missed_checkins = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM sos_cases WHERE status NOT IN ('RESOLVED', 'CLOSED')")
    active_cases = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM sos_cases WHERE status IN ('RESOLVED', 'CLOSED')")
    resolved_cases = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM sos_cases WHERE status = 'ESCALATED'")
    escalated_cases = cursor.fetchone()[0]

    cursor.execute("""
        SELECT AVG((julianday(accepted_at) - julianday(created_at)) * 24 * 60)
        FROM sos_cases
        WHERE accepted_at IS NOT NULL AND created_at IS NOT NULL
    """)
    avg_response_minutes = cursor.fetchone()[0]

    conn.close()

    return {
        "total_citizens": total_citizens,
        "active_sos": active_sos,
        "pending_assistance": pending_assistance,
        "missed_checkins": missed_checkins,
        "active_cases": active_cases,
        "resolved_cases": resolved_cases,
        "escalated_cases": escalated_cases,
        "avg_response_time": f"{round(avg_response_minutes)} min" if avg_response_minutes is not None else "—",
        "station_name": "Model Town Police Station",
        "sho_name": "Insp. Raj Kumar",
        "badge_id": "POL-SHO-041"
    }

@router.get("/charts")
def get_analytics_charts():
    return {
        "sos_by_day": [
            {"day": "Mon", "sos": 2, "assistance": 4},
            {"day": "Tue", "sos": 4, "assistance": 6},
            {"day": "Wed", "sos": 1, "assistance": 5},
            {"day": "Thu", "sos": 5, "assistance": 8},
            {"day": "Fri", "sos": 3, "assistance": 7},
            {"day": "Sat", "sos": 6, "assistance": 9},
            {"day": "Sun", "sos": 2, "assistance": 3}
        ],
        "status_distribution": [
            {"name": "New", "value": 3, "color": "#DC2626"},
            {"name": "In Progress", "value": 8, "color": "#D97706"},
            {"name": "Officer Assigned", "value": 6, "color": "#2563EB"},
            {"name": "Resolved", "value": 126, "color": "#059669"},
            {"name": "Escalated", "value": 1, "color": "#93000A"}
        ],
        "response_time_trend": [
            {"week": "Week 1", "minutes": 14},
            {"week": "Week 2", "minutes": 11},
            {"week": "Week 3", "minutes": 9},
            {"week": "Week 4", "minutes": 8}
        ]
    }
