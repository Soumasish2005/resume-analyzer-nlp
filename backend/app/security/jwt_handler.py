from datetime import datetime, timedelta
from jose import JWTError, jwt
from app.core.config import settings

# ── Token creation ────────────────────────────────────────────────────────────

def create_access_token(user_id: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "role": role,
        "type": "access",
        "exp": datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "type": "refresh",
        "exp": datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

# ── Token decoding ────────────────────────────────────────────────────────────

def decode_token(token: str) -> dict:
    """
    Decodes and validates a JWT token.
    Raises JWTError if token is expired or tampered.
    """
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        raise JWTError("Token is invalid or expired")

def decode_refresh_token(token: str) -> str:
    """
    Validates a refresh token and returns the user_id (sub).
    """
    payload = decode_token(token)
    if payload.get("type") != "refresh":
        raise JWTError("Not a refresh token")
    return payload["sub"]