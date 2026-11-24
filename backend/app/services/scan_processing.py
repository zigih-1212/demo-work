"""Scan processing service: real STL mesh metrics, no external STL library.

Binary STL layout: 80-byte header + uint32 triangle count + N * 50-byte records.
ASCII STL starts with "solid" and contains repeated "facet normal" blocks.
Both are handled so clinic exports from any slicer work.
"""

import json
import re
import struct
from typing import Any

import numpy as np

_BINARY_RECORD = 50
_BINARY_HEADER = 84


def _parse_binary_stl(raw: bytes) -> np.ndarray | None:
    """Return (n, 3, 3) array of triangle vertices for binary STL, else None."""
    if len(raw) < _BINARY_HEADER:
        return None
    count = struct.unpack("<I", raw[80:84])[0]
    if count == 0 or len(raw) != _BINARY_HEADER + count * _BINARY_RECORD:
        return None
    records = np.frombuffer(
        raw, dtype=np.uint8, count=count * _BINARY_RECORD, offset=_BINARY_HEADER
    )
    records = records.reshape(count, _BINARY_RECORD)
    floats = records[:, :48].copy().view(np.float32).reshape(count, 4, 3)
    # columns: normal, v0, v1, v2 - normals are not needed for metrics
    return floats[:, 1:4]


def _parse_ascii_stl(raw: bytes) -> np.ndarray | None:
    """Return (n, 3, 3) array of triangle vertices for ASCII STL, else None."""
    text = raw.decode("utf-8", errors="ignore")
    numbers = re.findall(
        r"vertex\s+([+\-\d.eE]+)\s+([+\-\d.eE]+)\s+([+\-\d.eE]+)", text
    )
    if not numbers:
        return None
    vertices = np.array(
        [[float(a), float(b), float(c)] for a, b, c in numbers], dtype=np.float64
    )
    if vertices.shape[0] % 3 != 0:
        return None
    return vertices.reshape(-1, 3, 3)


def compute_stl_metrics(path: str) -> dict[str, Any]:
    """
    Parse an STL file and extract real mesh metrics.

    Args:
        path: Path to the STL file.

    Returns:
        dict: triangle count, bounding box (mm), dimensions (mm), volume (mm^3).

    Raises:
        ValueError: if the file is not a readable STL.
    """
    with open(path, "rb") as fh:
        raw = fh.read()

    triangles = _parse_binary_stl(raw)
    if triangles is None:
        triangles = _parse_ascii_stl(raw)
    if triangles is None or len(triangles) == 0:
        raise ValueError("File is not a valid STL mesh (no triangles found)")

    vertices = triangles.reshape(-1, 3)
    mins = vertices.min(axis=0)
    maxs = vertices.max(axis=0)

    # Signed volume via the divergence theorem; abs() because winding order
    # is not guaranteed across exports.
    v0, v1, v2 = triangles[:, 0], triangles[:, 1], triangles[:, 2]
    volume = float(np.abs(np.einsum("ij,ij->i", v0, np.cross(v1, v2)).sum() / 6.0))

    return {
        "triangles": int(len(triangles)),
        "bbox_mm": {
            "min": mins.tolist(),
            "max": maxs.tolist(),
        },
        "dimensions_mm": (maxs - mins).tolist(),
        "volume_mm3": round(volume, 3),
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
    """Create a synchronous session for Celery workers or sync fallbacks.

    Derives the sync URL from the async one: psycopg3 handles both modes,
    and SQLite just drops the ``+aiosqlite`` driver suffix.
    """
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker

    from app.core.config import get_settings

    url = get_settings().database_url
    if url.startswith("sqlite+aiosqlite://"):
        url = url.replace("sqlite+aiosqlite://", "sqlite://")
    engine = create_engine(url, pool_pre_ping=True)
    return sessionmaker(engine, expire_on_commit=False)()
