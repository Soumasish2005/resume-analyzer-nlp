from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User, Session as UserSession
from app.security.jwt_handler import decode_token

bearer_scheme = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    FastAPI dependency — extracts and validates the JWT from
    the Authorization header, then returns the current User object.
    Inject this into any route that requires authentication.
    """
    token = credentials.credentials

    try:
        payload = decode_token(token)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token is invalid or expired")

    # Check session is still active (covers logout invalidation)
    session = db.query(UserSession).filter(
        UserSession.userID == user_id,
        UserSession.jwtToken == token,
        UserSession.isActive == True
    ).first()

    if not session:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired or logged out")

    user = db.query(User).filter(User.userID == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return user


def require_role(required_role: str):
    """
    Role-based access control dependency factory.
    Usage: Depends(require_role("recruiter"))
    """
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access restricted to {required_role}s only"
            )
        return current_user
    return role_checker