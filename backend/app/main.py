"""FastAPI application entrypoint for the OrthoDent API."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, jobs, patients, scans
from app.core.config import get_settings

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create tables on startup so a fresh database is usable immediately.

    Alembic owns the schema in production; this keeps the demo runnable with
    a bare `uvicorn app.main:app` without a migration step.
    """
    from app.db import get_engine
    from app.models import Base

    engine = get_engine()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description=(
        "REST API для системы управления ортодонтическим лечением: "
        "пациенты, этапы лечения, STL-сканы и задания на производство."
    ),
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_PREFIX = "/api/v1"

app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(patients.router, prefix=API_PREFIX)
app.include_router(scans.router, prefix=API_PREFIX)
app.include_router(jobs.router, prefix=API_PREFIX)


@app.get("/health", tags=["service"])
async def health() -> dict[str, str]:
    """Liveness probe used by Docker healthchecks and CI."""
    return {"status": "ok"}


@app.get("/api/v1/health", tags=["service"])
async def health_v1() -> dict[str, str]:
    return {"status": "ok"}
