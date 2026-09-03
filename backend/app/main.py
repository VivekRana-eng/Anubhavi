from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import os

from app.database import init_db
from app.seed import seed_demo_data
from app.websocket import manager

# Import routers
from app.routes.auth_routes import router as auth_router
from app.routes.sos_routes import router as sos_router
from app.routes.officer_routes import router as officer_router
from app.routes.citizen_routes import router as citizen_router
from app.routes.assistance_routes import router as assistance_router
from app.routes.welfare_routes import router as welfare_router
from app.routes.escalation_routes import router as escalation_router
from app.routes.analytics_routes import router as analytics_router
from app.routes.reports_routes import router as reports_router
from app.routes.audit_routes import router as audit_router

app = FastAPI(
    title="ANUBHAVI Police Command API",
    description="Senior Citizen Safety & Assistance Platform - SHO Console Backend",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize and seed database on startup
@app.on_event("startup")
def startup_event():
    init_db()
    # Seed demo data if database is fresh or for demo consistency
    seed_demo_data()

# Register API Routers
app.include_router(auth_router)
app.include_router(sos_router)
app.include_router(officer_router)
app.include_router(citizen_router)
app.include_router(assistance_router)
app.include_router(welfare_router)
app.include_router(escalation_router)
app.include_router(analytics_router)
app.include_router(reports_router)
app.include_router(audit_router)

@app.get("/api/health")
def health_check():
    return {"status": "ONLINE", "system": "ANUBHAVI SHO Command Console", "station": "Model Town PS"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Can process incoming client ping if needed
    except WebSocketDisconnect:
        manager.disconnect(websocket)
