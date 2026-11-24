"""Robot orchestration service - simplified stub for demonstration."""

import json
import time
from datetime import datetime, timezone


def run_robot_job(session, job_id: str, simulate_delay: float = 0.5):
    """
    Process a robot job (stub implementation).

    Real implementation would communicate with manufacturing robot.
    For demo purposes, simulates success with configurable delay.

    Args:
        session: SQLAlchemy session
        job_id: The job ID to process
        simulate_delay: Simulated processing time in seconds

    Returns:
        job: Updated RobotJob object
    """
    from app.models import RobotJob, TreatmentStage

    job = session.get(RobotJob, job_id)
    if not job:
        raise ValueError(f"Robot job {job_id} not found")

    job.status = "running"
    job.attempts += 1
    session.commit()

    try:
        # Simulate robot operation
        time.sleep(simulate_delay)

        log = json.loads(job.log_json) if job.log_json else []
        steps = ["gcode_upload", "thermoforming", "trimming", "quality_check"]

        for step in steps:
            log.append({"step": step, "attempt": job.attempts, "ok": True})

        job.log_json = json.dumps(log)
        job.status = "completed"
        job.error = None

        # Update stage status
        stage = session.get(TreatmentStage, job.stage_id)
        if stage and stage.status == "in_production":
            stage.status = "produced"

    except Exception as exc:
        job.status = "failed"
        job.error = str(exc)[:2000]

    session.commit()
    return job
