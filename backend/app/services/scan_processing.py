"""Scan processing service - simplified stub."""

import json


def compute_stl_metrics(path: str) -> dict:
    """
    Parse STL file and extract mesh metrics (stub implementation).

    Real implementation would use numpy-stl library.
    For demo purposes, returns placeholder metrics.

    Args:
        path: Path to STL file

    Returns:
        dict: Mesh metrics including triangle count, bounding box, volume
    """
    # Placeholder - real implementation would use stl.mesh.Mesh.from_file()
    return {
        "triangles": 1000,
        "bbox_mm": {
            "min": [0.0, 0.0, 0.0],
            "max": [50.0, 40.0, 30.0],
        },
        "dimensions_mm": [50.0, 40.0, 30.0],
        "volume_mm3": 15000.0,
    }


def process_scan(session, scan_id: str):
    """
    Process a scan: validate STL, extract metrics, update status.

    Args:
        session: SQLAlchemy session
        scan_id: The scan ID to process

    Returns:
        scan: Updated Scan object
    """
    from app.models import Scan

    scan = session.get(Scan, scan_id)
    if not scan:
        raise ValueError(f"Scan {scan_id} not found")

    scan.status = "processing"
    session.commit()

    try:
        metrics = compute_stl_metrics(scan.storage_path)
        scan.metrics_json = json.dumps(metrics)
        scan.status = "ready"
        scan.error = None
    except Exception as exc:
        scan.status = "failed"
        scan.error = str(exc)[:2000]

    session.commit()
    return scan


def make_sync_session():
    """Create synchronous session for Celery workers."""
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    from app.core.config import get_settings

    settings = get_settings()
    # Use sync driver for Celery
    sync_url = settings.database_url.replace(
        "postgresql+psycopg://", "postgresql+psycopg2://"
    )
    engine = create_engine(sync_url, pool_pre_ping=True)
    return sessionmaker(engine, expire_on_commit=False)()
