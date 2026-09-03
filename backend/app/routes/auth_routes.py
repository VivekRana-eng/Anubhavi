from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.database import get_db_connection, log_audit
from app.auth import create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Auth"])

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(req: LoginRequest):
    conn = get_db_connection()
    cursor = conn.cursor()

    req_email = req.email.strip().lower()
    req_pass = req.password.strip()

    # Query by exact email or alias
    cursor.execute("SELECT * FROM users WHERE LOWER(email) = ? OR LOWER(email) = REPLACE(?, '.com', '.demo') OR LOWER(email) = REPLACE(?, '.demo', '.com')", (req_email, req_email, req_email))
    user = cursor.fetchone()
    conn.close()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid police email or password")

    user_dict = dict(user)

    # Allow case-insensitive matching for demo passwords like sho@123 or SHO@123
    db_pass = user_dict["password_hash"]
    if req_pass.lower() != db_pass.lower() and req_pass != db_pass:
        raise HTTPException(status_code=400, detail="Invalid police email or password")

    token = create_access_token({"sub": user_dict["id"], "role": user_dict["role"]})

    # Log Audit
    log_audit(
        user_id=user_dict["id"],
        user_name=user_dict["name"],
        user_role=user_dict["role"],
        action=f"{user_dict['role']} LOGIN",
        description=f"User {user_dict['name']} logged in successfully as {user_dict['role']}"
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user_dict["id"],
            "name": user_dict["name"],
            "email": user_dict["email"],
            "role": user_dict["role"],
            "rank": user_dict["rank"],
            "police_id": user_dict["police_id"],
            "police_station_id": user_dict["police_station_id"]
        }
    }

@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return {"user": current_user}
