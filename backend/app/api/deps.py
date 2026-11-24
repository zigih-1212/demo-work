from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_access_token
from app.db import get_db
from app.models import Patient, User

bearer_scheme = HTTPBearer(auto_error=False)

DbDep = Annotated[AsyncSession, Depends(get_db)]


async def get_current_user(
    db: DbDep,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
) -> User:
    if credentials is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not authenticated")
    try:
        payload = decode_access_token(credentials.credentials)
    except jwt.PyJWTError:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED, "Invalid or expired token"
        ) from None
    user = await db.get(User, payload.get("sub", ""))
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User not found")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


async def get_owned_patient(patient_id: str, db: DbDep, user: CurrentUser) -> Patient:
    """Object-level authorization: doctors only see their own patients (BOLA guard)."""
    patient = await db.get(Patient, patient_id)
    if patient is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Patient not found")
    if user.role != "admin" and patient.doctor_id != user.id:
        # 404, not 403: do not leak existence of other doctors' patients.
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Patient not found")
    return patient


OwnedPatient = Annotated[Patient, Depends(get_owned_patient)]
