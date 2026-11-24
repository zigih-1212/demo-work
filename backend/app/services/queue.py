"""Queue dispatch helpers - sync execution for testing without Redis."""

from app.services.robot import run_robot_job
from app.services.scan_processing import make_sync_session, process_scan


def enqueue_scan_processing(scan_id: str) -> None:
    """
    Queue scan processing (sync execution for testing).

    In production with Celery, this would call process_scan_task.delay(scan_id).
    For demo/testing, executes directly.
    """
    session = make_sync_session()
    try:
        process_scan(session, scan_id)
    finally:
        session.close()


def enqueue_robot_job(job_id: str) -> None:
    """
    Queue robot job (sync execution for testing).

    In production with Celery, this would call run_robot_job_task.delay(job_id).
    For demo/testing, executes directly.
    """
    session = make_sync_session()
    try:
        run_robot_job(session, job_id, simulate_delay=0.5)
    finally:
        session.close()
