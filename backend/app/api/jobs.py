from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.api.deps import CurrentUser, DbDep, OwnedPatient
from app.models import RobotJob, TreatmentStage
from app.schemas import RobotJobOut
from app.services import queue

router = APIRouter(tags=["robot-jobs"])


@router.post(
    "/patients/{patient_id}/stages/{stage_id}/robot-jobs",
    response_model=RobotJobOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_robot_job(stage_id: str, patient: OwnedPatient, db: DbDep) -> RobotJob:
    stage = await db.get(TreatmentStage, stage_id)
    if stage is None or stage.patient_id != patient.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Stage not found")
    if stage.status not in ("planned",):
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            f"Stage in status '{stage.status}' cannot be sent to production",
        )
    active = await db.scalar(
        select(RobotJob).where(
            RobotJob.stage_id == stage.id, RobotJob.status.in_(["queued", "running"])
        )
    )
    if active is not None:
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            "An active robot job already exists for this stage",
        )

    job = RobotJob(stage_id=stage.id, status="queued")
    stage.status = "in_production"
    db.add(job)
    await db.commit()
    await db.refresh(job)

    try:
        queue.enqueue_robot_job(job.id)
    except Exception:  # noqa: BLE001 - broker down: keep job queued for manual retry
        job.error = "Task queue unavailable; job stays queued"
        await db.commit()
        await db.refresh(job)
    return job


@router.get("/robot-jobs/{job_id}", response_model=RobotJobOut)
async def get_robot_job(job_id: str, db: DbDep, user: CurrentUser) -> RobotJob:
    job = await db.get(RobotJob, job_id)
    if job is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Robot job not found")
    stage = await db.get(TreatmentStage, job.stage_id)
    if stage is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Robot job not found")
    # Reuse the same ownership rule as for patients.
    from app.api.deps import get_owned_patient

    await get_owned_patient(stage.patient_id, db, user)
    return job
