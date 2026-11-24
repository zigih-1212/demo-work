from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy import func, select

from app.api.deps import CurrentUser, DbDep, OwnedPatient
from app.models import Patient, TreatmentStage
from app.schemas import (
    Page,
    PatientCreate,
    PatientOut,
    PatientUpdate,
    StageCreate,
    StageOut,
    StageUpdate,
)

router = APIRouter(prefix="/patients", tags=["patients"])


@router.get("", response_model=Page)
async def list_patients(
    db: DbDep,
    user: CurrentUser,
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    status_filter: str | None = Query(default=None, alias="status"),
) -> Page:
    query = select(Patient)
    if user.role != "admin":
        query = query.where(Patient.doctor_id == user.id)
    if status_filter:
        query = query.where(Patient.status == status_filter)
    total = await db.scalar(select(func.count()).select_from(query.subquery())) or 0
    rows = await db.scalars(
        query.order_by(Patient.created_at.desc()).limit(limit).offset(offset)
    )
    return Page(items=list(rows), total=total, limit=limit, offset=offset)


@router.post("", response_model=PatientOut, status_code=status.HTTP_201_CREATED)
async def create_patient(body: PatientCreate, db: DbDep, user: CurrentUser) -> Patient:
    patient = Patient(doctor_id=user.id, **body.model_dump())
    db.add(patient)
    await db.commit()
    await db.refresh(patient)
    return patient


@router.get("/{patient_id}", response_model=PatientOut)
async def get_patient(patient: OwnedPatient) -> Patient:
    return patient


@router.patch("/{patient_id}", response_model=PatientOut)
async def update_patient(
    body: PatientUpdate, patient: OwnedPatient, db: DbDep
) -> Patient:
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(patient, field, value)
    await db.commit()
    await db.refresh(patient)
    return patient


# --- Treatment stages nested under a patient ---


@router.get("/{patient_id}/stages", response_model=list[StageOut])
async def list_stages(patient: OwnedPatient, db: DbDep) -> list[TreatmentStage]:
    rows = await db.scalars(
        select(TreatmentStage)
        .where(TreatmentStage.patient_id == patient.id)
        .order_by(TreatmentStage.position)
    )
    return list(rows)


@router.post(
    "/{patient_id}/stages", response_model=StageOut, status_code=status.HTTP_201_CREATED
)
async def create_stage(
    body: StageCreate, patient: OwnedPatient, db: DbDep
) -> TreatmentStage:
    duplicate = await db.scalar(
        select(TreatmentStage).where(
            TreatmentStage.patient_id == patient.id,
            TreatmentStage.position == body.position,
        )
    )
    if duplicate is not None:
        raise HTTPException(
            status.HTTP_409_CONFLICT, f"Stage position {body.position} already exists"
        )
    stage = TreatmentStage(patient_id=patient.id, **body.model_dump())
    db.add(stage)
    await db.commit()
    await db.refresh(stage)
    return stage


@router.patch("/{patient_id}/stages/{stage_id}", response_model=StageOut)
async def update_stage(
    stage_id: str, body: StageUpdate, patient: OwnedPatient, db: DbDep
) -> TreatmentStage:
    stage = await db.get(TreatmentStage, stage_id)
    if stage is None or stage.patient_id != patient.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Stage not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(stage, field, value)
    await db.commit()
    await db.refresh(stage)
    return stage
