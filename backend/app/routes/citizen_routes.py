from fastapi import APIRouter, HTTPException, Depends
from app.database import get_db_connection, log_audit

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
def get_citizen_360_profile(citizen_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM senior_citizens WHERE id = ?", (citizen_id,))
    cit_row = cursor.fetchone()

    if not cit_row:
        # Fallback mock citizen data if specific ID not found in database
        citizen = {
            "id": citizen_id,
            "name": "Rajesh Sharma",
            "age": 72,
            "gender": "Male",
            "mobile": "+91 98102-33412",
            "aadhaar_masked": "XXXX-XXXX-4912",
            "address": "House #402, Sector 3, Model Town, Ludhiana",
            "landmark": "Near Model Town Community Park",
            "latitude": 30.9010,
            "longitude": 75.8573,
            "risk_level": "HIGH",
            "status": "SAFE",
            "living_status": "LIVES_ALONE",
            "medical_conditions": "Severe Cardiac History, Pacemaker Installed (2023), Hypertension",
            "avatar_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD"
        }
    else:
        citizen = dict(cit_row)

    # Contacts
    cursor.execute("SELECT * FROM emergency_contacts WHERE citizen_id = ?", (citizen_id,))
    contacts = [dict(r) for r in cursor.fetchall()]
    if not contacts:
        contacts = [
            { "id": "EC-01", "name": "Amit Sharma", "relationship": "Son (Primary Kin)", "mobile": "+91 98721-00123", "location": "Model Town Phase 2", "notify_status": "VERIFIED KEYHOLDER", "is_keyholder": 1 },
            { "id": "EC-02", "name": "Col. S. Dhillon", "relationship": "Neighbor", "mobile": "+91 94172-88301", "location": "Immediate Next Door", "notify_status": "ON FILE", "is_keyholder": 1 }
        ]

    # SOS History
    cursor.execute("SELECT * FROM sos_cases WHERE citizen_id = ? ORDER BY created_at DESC", (citizen_id,))
    sos_history = [dict(r) for r in cursor.fetchall()]
    if not sos_history:
        sos_history = [
            { "id": "ANB-SOS-2026-00124", "emergency_type": "Medical Panic Alarm", "created_at": "Today, 02:34 PM", "status": "RESOLVED", "location_address": citizen["address"] },
            { "id": "ANB-SOS-2026-00088", "emergency_type": "Routine SOS Check", "created_at": "15 Aug 2026", "status": "RESOLVED", "location_address": citizen["address"] }
        ]

    # Assistance Requests
    cursor.execute("SELECT * FROM assistance_requests WHERE citizen_id = ? ORDER BY created_at DESC", (citizen_id,))
    assistance_history = [dict(r) for r in cursor.fetchall()]
    if not assistance_history:
        assistance_history = [
            { "id": "AST-2026-042", "request_type": "Beat Constable Visit & Lock Inspection", "created_at": "Yesterday, 04:00 PM", "status": "COMPLETED", "description": "Elder requested police beat officer to verify main gate safety latch." }
        ]

    # Welfare Checks
    cursor.execute("SELECT * FROM welfare_checks WHERE citizen_id = ? ORDER BY scheduled_date DESC", (citizen_id,))
    welfare_history = [dict(r) for r in cursor.fetchall()]
    if not welfare_history:
        welfare_history = [
            { "id": "WEL-101", "check_type": "Weekly Beat Visit", "scheduled_date": "2026-09-05", "scheduled_time": "11:00 AM", "status": "SCHEDULED", "assigned_officer_name": "HC Raj Kumar", "purpose": "Routine preventive elder safety visit" }
        ]

    # Audit Trail for Citizen
    cursor.execute("SELECT * FROM audit_logs WHERE target_id = ? OR description LIKE ? ORDER BY timestamp DESC", (citizen_id, f"%{citizen['name']}%"))
    audit_trail = [dict(r) for r in cursor.fetchall()]
    if not audit_trail:
        audit_trail = [
            { "id": "AUD-101", "action": "VIEW ONLY DOSSIER ACCESSED", "description": f"View Only dossier accessed for senior citizen {citizen['name']} ({citizen['id']})", "timestamp": "Today, 07:40 PM" }
        ]

    conn.close()

    return {
        "citizen": citizen,
        "emergency_contacts": contacts,
        "sos_history": sos_history,
        "assistance_requests": assistance_history,
        "welfare_checks": welfare_history,
        "audit_trail": audit_trail
    }
