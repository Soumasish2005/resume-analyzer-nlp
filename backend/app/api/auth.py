from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError
import uuid

from app.db.database import get_db
from app.models.user import User, Session as UserSession
from app.schemas.auth import (
    RegisterRequest, LoginRequest, TokenResponse,
    UserResponse, MessageResponse,
    ForgotPasswordRequest, ResetPasswordRequest
)
from app.security.jwt_handler import (
    create_access_token, create_refresh_token, decode_refresh_token
)
from app.security.dependencies import get_current_user
from app.core.config import settings

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ── POST /api/v1/auth/register ────────────────────────────────────────────────

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if payload.role not in ("seeker", "recruiter"):
        raise HTTPException(status_code=400, detail="Role must be 'seeker' or 'recruiter'")

    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        userID=str(uuid.uuid4()),
        name=payload.name,
        email=payload.email,
        passwordHash=pwd_context.hash(payload.password),
        role=payload.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# ── POST /api/v1/auth/login ───────────────────────────────────────────────────

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not pwd_context.verify(payload.password, user.passwordHash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(user.userID, user.role)
    refresh_token = create_refresh_token(user.userID)

    # Invalidate any previous active sessions for this user
    db.query(UserSession).filter(
        UserSession.userID == user.userID,
        UserSession.isActive == True
    ).update({"isActive": False})

    # Create new session record
    session = UserSession(
        sessionID=str(uuid.uuid4()),
        userID=user.userID,
        jwtToken=access_token,
        expiresAt=datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        isActive=True
    )
    db.add(session)
    db.commit()

    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


# ── POST /api/v1/auth/logout ──────────────────────────────────────────────────

@router.post("/logout", response_model=MessageResponse)
def logout(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(UserSession).filter(
        UserSession.userID == current_user.userID,
        UserSession.isActive == True
    ).update({"isActive": False})
    db.commit()
    return {"message": "Logged out successfully"}


# ── POST /api/v1/auth/refresh ─────────────────────────────────────────────────

@router.post("/refresh", response_model=TokenResponse)
def refresh_token(payload: dict, db: Session = Depends(get_db)):
    token = payload.get("refresh_token")
    if not token:
        raise HTTPException(status_code=400, detail="Refresh token required")

    try:
        user_id = decode_refresh_token(token)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    user = db.query(User).filter(User.userID == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    new_access = create_access_token(user.userID, user.role)
    new_refresh = create_refresh_token(user.userID)

    # Update session with new access token
    db.query(UserSession).filter(
        UserSession.userID == user_id,
        UserSession.isActive == True
    ).update({"jwtToken": new_access, "expiresAt": datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)})
    db.commit()

    return TokenResponse(access_token=new_access, refresh_token=new_refresh)


# ── POST /api/v1/auth/forgot-pass ────────────────────────────────────────────

@router.post("/forgot-pass", response_model=MessageResponse)
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    # Always return success to avoid email enumeration
    if user:
        # TODO: generate reset token, send email via SMTP/SendGrid
        pass
    return {"message": "If that email is registered, a reset link has been sent"}


# ── POST /api/v1/auth/reset-pass ─────────────────────────────────────────────

@router.post("/reset-pass", response_model=MessageResponse)
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    # TODO: validate reset token from email, update passwordHash
    # Placeholder — implement once email service is wired up
    raise HTTPException(status_code=501, detail="Password reset not yet implemented")


# ── GET /api/v1/auth/me ───────────────────────────────────────────────────────

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user