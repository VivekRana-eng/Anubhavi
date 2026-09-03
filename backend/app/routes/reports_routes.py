from fastapi import APIRouter
from fastapi.responses import Response, HTMLResponse
import io
import csv
from app.database import get_db_connection

router = APIRouter(prefix="/api/reports", tags=["Reports & Logs"])

@router.get("")
def list_reports():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM sos_cases ORDER BY created_at DESC")
    cases = [dict(r) for r in cursor.fetchall()]
    conn.close()

    return {
        "reports": [
            {"id": "REP-SOS-01", "name": "Emergency SOS Response Log", "category": "SOS", "generated_at": "Today, 04:00 PM", "cases_count": len(cases)},
            {"id": "REP-AST-02", "name": "Senior Welfare & Assistance Register", "category": "Assistance", "generated_at": "Today, 02:00 PM", "cases_count": 8},
            {"id": "REP-WEL-03", "name": "Monthly Welfare Check Performance", "category": "Welfare", "generated_at": "Yesterday", "cases_count": 42},
            {"id": "REP-OFF-04", "name": "Officer Response Time & Beat Patrol Roster", "category": "Performance", "generated_at": "01 Sep 2026", "cases_count": 14},
            {"id": "REP-ESC-05", "name": "Statutory 24h Escalation Audit Summary", "category": "Escalation", "generated_at": "28 Aug 2026", "cases_count": 3}
        ],
        "cases": cases
    }

@router.get("/export-csv")
def export_cases_csv():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM sos_cases ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()

    output = io.StringIO()
    writer = csv.writer(output)

    # Write CSV Header
    writer.writerow([
        "Case ID", "Citizen Name", "Age", "Mobile", "Address", "Emergency Type",
        "Created At", "Accepted At", "Accepted By", "Assigned Officer ID", "Status", "Escalation Deadline", "Notes"
    ])

    for r in rows:
        d = dict(r)
        writer.writerow([
            d["id"], d["citizen_name"], d["citizen_age"], d["citizen_mobile"], d["location_address"],
            d["emergency_type"], d["created_at"], d["accepted_at"] or "", d["accepted_by"] or "",
            d["assigned_officer_id"] or "", d["status"], d["escalation_deadline"], d["notes"] or ""
        ])

    csv_content = output.getvalue()
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=anubhavi_sos_cases_export.csv"}
    )

@router.get("/pdf-summary", response_class=HTMLResponse)
def print_pdf_summary():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM sos_cases ORDER BY created_at DESC")
    cases = [dict(r) for r in cursor.fetchall()]
    conn.close()

    rows_html = ""
    for c in cases:
        rows_html += f"""
        <tr>
            <td style="padding: 8px; border: 1px solid #ccc; font-weight: bold;">{c['id']}</td>
            <td style="padding: 8px; border: 1px solid #ccc;">{c['citizen_name']} ({c['citizen_age']}y)</td>
            <td style="padding: 8px; border: 1px solid #ccc;">{c['emergency_type']}</td>
            <td style="padding: 8px; border: 1px solid #ccc;">{c['location_address']}</td>
            <td style="padding: 8px; border: 1px solid #ccc;">{c['status']}</td>
            <td style="padding: 8px; border: 1px solid #ccc;">{c['created_at']}</td>
        </tr>
        """

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>ANUBHAVI Police Station Official Report</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 40px; color: #131b2e; }}
            h1 {{ color: #0f1e36; margin-bottom: 4px; }}
            .sub {{ color: #64748b; font-size: 14px; margin-bottom: 24px; }}
            table {{ width: 100%; border-collapse: collapse; margin-top: 16px; }}
            th {{ background: #0f1e36; color: white; padding: 10px; text-align: left; }}
            @media print {{
                .no-print {{ display: none; }}
            }}
        </style>
    </head>
    <body>
        <div class="no-print" style="margin-bottom: 16px;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #0f1e36; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">🖨️ PRINT OFFICIAL POLICE REPORT (PDF)</button>
        </div>
        <h1>ANUBHAVI – Senior Citizen Emergency Response Summary</h1>
        <div class="sub">Model Town Police Station • District Central, Ludhiana • Official CCTNS Extract</div>
        <hr/>
        <table>
            <thead>
                <tr>
                    <th>Case ID</th>
                    <th>Citizen Details</th>
                    <th>Emergency Type</th>
                    <th>Location</th>
                    <th>Current Status</th>
                    <th>Timestamp</th>
                </tr>
            </thead>
            <tbody>
                {rows_html}
            </tbody>
        </table>
        <div style="margin-top: 40px; text-align: right;">
            <p><strong>Insp. Raj Kumar</strong><br/>Station House Officer (SHO)<br/>Model Town Police Station</p>
        </div>
    </body>
    </html>
    """
    return HTMLResponse(content=html)
