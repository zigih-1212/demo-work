from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.api.deps import CurrentUser, DbDep
from app.core.security import create_access_token, hash_password, verify_password
from app.models import User
from app.schemas import LoginRequest, RegisterRequest, TokenResponse, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(body: RegisterRequest, db: DbDep) -> User:
    existing = await db.scalar(select(User).where(User.email == body.email))
    if existing is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "Email already registered")
    user = User(
        email=body.email,
        full_name=body.full_name,
        password_hash=hash_password(body.password),
        role="doctor",
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, db: DbDep) -> TokenResponse:
    user = await db.scalar(select(User).where(User.email == body.email))
    if user is None or not verify_password(body.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")
    return TokenResponse(access_token=create_access_token(user.id, user.role))


@router.get("/me", response_model=UserOut)
async def me(user: CurrentUser) -> User:
    return user
