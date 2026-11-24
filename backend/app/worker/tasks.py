"""Celery worker tasks for background processing.

The API falls back to synchronous execution when the broker is unreachable
(see app.services.queue), so these tasks are the production path only.
"""

from app.worker.celery_app import celery_app


@celery_app.task(
    bind=True, max_retries=3, autoretry_for=(Exception,), default_retry_delay=30
)
def process_scan_task(self, scan_id: str) -> str:
    """
    Parse an uploaded STL, compute mesh metrics, mark the scan ready.

    Args:
        self: Celery task context for retrying
        scan_id: ID of the scan to process

    Returns:
        str: Final scan status ("ready" or "failed")
    """
    from app.services.scan_processing import make_sync_session, process_scan

    session = make_sync_session()
    try:
        scan = process_scan(session, scan_id)
        return scan.status
    except Exception as exc:
        raise self.retry(exc=exc)
    finally:
        session.close()


@celery_app.task(
    bind=True, max_retries=3, autoretry_for=(Exception,), default_retry_delay=30
)
def run_robot_job_task(self, job_id: str) -> str:
    """
    Execute a robot manufacturing job for an aligner stage.

    Args:
        self: Celery task context for retrying
        job_id: ID of the robot job to execute

    Returns:
        str: Final job status ("completed" or "failed")
    """
    from app.services.robot import make_sync_session, run_robot_job

    session = make_sync_session()
    try:
        job = run_robot_job(session, job_id, simulate_delay=0.5)
        return job.status
    except Exception as exc:
        raise self.retry(exc=exc)
    finally:
        session.close()
