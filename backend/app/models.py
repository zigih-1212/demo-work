import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


def _uuid() -> str:
    return str(uuid.uuid4())


def _now() -> datetime:
    return datetime.now(timezone.utc)


class Base(DeclarativeBase):
    pass


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_now, onupdate=_now
    )


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(255))
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(20), default="doctor")  # doctor | admin

    patients: Mapped[list["Patient"]] = relationship(back_populates="doctor")


class Patient(Base, TimestampMixin):
    __tablename__ = "patients"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    doctor_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    full_name: Mapped[str] = mapped_column(String(255))
    birth_year: Mapped[int] = mapped_column(Integer)
    diagnosis: Mapped[str] = mapped_column(Text, default="")
    # active | completed | archived
    status: Mapped[str] = mapped_column(String(20), default="active", index=True)

    doctor: Mapped[User] = relationship(back_populates="patients")
    scans: Mapped[list["Scan"]] = relationship(
        back_populates="patient", cascade="all, delete-orphan"
    )
    stages: Mapped[list["TreatmentStage"]] = relationship(
        back_populates="patient",
        cascade="all, delete-orphan",
        order_by="TreatmentStage.position",
    )


class Scan(Base, TimestampMixin):
    """Intraoral STL scan uploaded for a patient; processed asynchronously by Celery."""

    __tablename__ = "scans"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    patient_id: Mapped[str] = mapped_column(ForeignKey("patients.id"), index=True)
    filename: Mapped[str] = mapped_column(String(255))
    storage_path: Mapped[str] = mapped_column(String(512))
    size_bytes: Mapped[int] = mapped_column(Integer)
    # pending | processing | ready | failed
    status: Mapped[str] = mapped_column(String(20), default="pending", index=True)
    error: Mapped[str | None] = mapped_column(Text, nullable=True)
    # Filled by the worker: triangle count, bounding box (mm), estimated volume (mm^3).
    metrics_json: Mapped[str | None] = mapped_column(Text, nullable=True)

    patient: Mapped[Patient] = relationship(back_populates="scans")


class TreatmentStage(Base, TimestampMixin):
    """One aligner step in the treatment plan."""

    __tablename__ = "treatment_stages"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    patient_id: Mapped[str] = mapped_column(ForeignKey("patients.id"), index=True)
    position: Mapped[int] = mapped_column(Integer)
    description: Mapped[str] = mapped_column(Text, default="")
    wear_days: Mapped[int] = mapped_column(Integer, default=14)
    # planned | in_production | produced | in_treatment | done
    status: Mapped[str] = mapped_column(String(20), default="planned", index=True)

    patient: Mapped[Patient] = relationship(back_populates="stages")
    robot_jobs: Mapped[list["RobotJob"]] = relationship(
        back_populates="stage", cascade="all, delete-orphan"
    )


class RobotJob(Base, TimestampMixin):
    """Production request sent to the aligner manufacturing robot (simulated)."""

    __tablename__ = "robot_jobs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    stage_id: Mapped[str] = mapped_column(ForeignKey("treatment_stages.id"), index=True)
    # queued | running | completed | failed
    status: Mapped[str] = mapped_column(String(20), default="queued", index=True)
    attempts: Mapped[int] = mapped_column(Integer, default=0)
    log_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    error: Mapped[str | None] = mapped_column(Text, nullable=True)

    stage: Mapped[TreatmentStage] = relationship(back_populates="robot_jobs")
