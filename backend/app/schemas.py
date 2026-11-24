from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


# --- Auth ---
class RegisterRequest(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=1, max_length=255)
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(ORMModel):
    id: str
    email: str
    full_name: str
    role: str


# --- Patients ---
class PatientCreate(BaseModel):
    full_name: str = Field(min_length=1, max_length=255)
    birth_year: int = Field(ge=1900, le=2100)
    diagnosis: str = ""


class PatientUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=1, max_length=255)
    diagnosis: str | None = None
    status: Literal["active", "completed", "archived"] | None = None


class PatientOut(ORMModel):
    id: str
    doctor_id: str
    full_name: str
    birth_year: int
    diagnosis: str
    status: str
    created_at: datetime


class Page(BaseModel):
    items: list[PatientOut]
    total: int
    limit: int
    offset: int


# --- Scans ---
class ScanOut(ORMModel):
    id: str
    patient_id: str
    filename: str
    size_bytes: int
    status: str
    error: str | None
    metrics_json: str | None
    created_at: datetime


# --- Stages ---
class StageCreate(BaseModel):
    position: int = Field(ge=1)
    description: str = ""
    wear_days: int = Field(default=14, ge=1, le=90)


class StageUpdate(BaseModel):
    description: str | None = None
    wear_days: int | None = Field(default=None, ge=1, le=90)
    status: (
        Literal["planned", "in_production", "produced", "in_treatment", "done"] | None
    ) = None


class StageOut(ORMModel):
    id: str
    patient_id: str
    position: int
    description: str
    wear_days: int
    status: str
    created_at: datetime


# --- Robot jobs ---
class RobotJobOut(ORMModel):
    id: str
    stage_id: str
    status: str
    attempts: int
    log_json: str | None
    error: str | None
    created_at: datetime
    updated_at: datetime
