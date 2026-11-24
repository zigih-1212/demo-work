import os
import uuid

from fastapi import APIRouter, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy import select

from app.api.deps import DbDep, OwnedPatient
from app.core.config import get_settings
from app.models import Scan
from app.schemas import ScanOut
from app.services import queue

router = APIRouter(prefix="/patients/{patient_id}/scans", tags=["scans"])


@router.get("", response_model=list[ScanOut])
async def list_scans(patient: OwnedPatient, db: DbDep) -> list[Scan]:
    rows = await db.scalars(
        select(Scan)
        .where(Scan.patient_id == patient.id)
        .order_by(Scan.created_at.desc())
    )
    return list(rows)


@router.post("", response_model=ScanOut, status_code=status.HTTP_201_CREATED)
async def upload_scan(patient: OwnedPatient, db: DbDep, file: UploadFile) -> Scan:
    settings = get_settings()
    filename = file.filename or "scan.stl"
    if not filename.lower().endswith(".stl"):
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY, "Only .stl files are accepted"
        )

    data = await file.read()
    if len(data) == 0:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Empty file")
    if len(data) > settings.max_scan_bytes:
        raise HTTPException(
            status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, "Scan exceeds 50 MB limit"
        )

    patient_dir = os.path.join(settings.upload_dir, patient.id)
    os.makedirs(patient_dir, exist_ok=True)
    storage_path = os.path.join(patient_dir, f"{uuid.uuid4()}.stl")
    with open(storage_path, "wb") as fh:
        fh.write(data)

    scan = Scan(
        patient_id=patient.id,
        filename=filename,
        storage_path=storage_path,
        size_bytes=len(data),
        status="pending",
    )
    db.add(scan)
    await db.commit()
    await db.refresh(scan)

    try:
        queue.enqueue_scan_processing(scan.id)
    except Exception:  # noqa: BLE001 - broker down must not lose the uploaded scan
        scan.status = "failed"
        scan.error = "Task queue unavailable; retry processing later"
        await db.commit()
        await db.refresh(scan)
    return scan


@router.get("/{scan_id}", response_model=ScanOut)
async def get_scan(scan_id: str, patient: OwnedPatient, db: DbDep) -> Scan:
    scan = await db.get(Scan, scan_id)
    if scan is None or scan.patient_id != patient.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Scan not found")
    return scan


@router.get("/{scan_id}/file")
async def download_scan(scan_id: str, patient: OwnedPatient, db: DbDep) -> FileResponse:
    scan = await db.get(Scan, scan_id)
    if scan is None or scan.patient_id != patient.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Scan not found")
    if not os.path.exists(scan.storage_path):
        raise HTTPException(status.HTTP_410_GONE, "Scan file no longer stored")
    return FileResponse(
        scan.storage_path, media_type="model/stl", filename=scan.filename
    )
