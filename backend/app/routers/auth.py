from fastapi import APIRouter, HTTPException, status
from sqlalchemy import or_, select

from app.core.dependencies import CurrentUser, DBSession
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.schemas.user import UserResponse

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(data: RegisterRequest, db: DBSession):
    existing = db.scalar(
        select(User).where(or_(User.email == data.email, User.username == data.username))
    )
    if existing:
        raise HTTPException(status_code=409, detail="Username or email already exists")

    user = User(
        username=data.username,
        email=data.email,
        password_hash=hash_password(data.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: DBSession):
    user = db.scalar(select(User).where(User.email == data.email))
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    return TokenResponse(access_token=create_access_token(user.id))


@router.get("/me", response_model=UserResponse)
def me(current_user: CurrentUser):
    return current_user
