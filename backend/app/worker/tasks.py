"""Worker task definitions for async operations.

This module defines Celery tasks that run on worker nodes.
For testing/demo purposes, we keep stub implementations that demonstrate
the task structure and integration points.
"""

from app.worker.celery_app import celery_app


@celery_app.task(bind=True, max_retries=3, autoretry_for=(Exception,))
def process_scan_task(self, scan_id: str) -> str:
    """
    Task to process a patient scan (STL file).

    This task will be executed by Celery workers using Redis as broker.
    The real implementation would use the sync version of processing logic.

    Args:
        self: Celery task context for retrying
        scan_id: ID of the scan to process

    Returns:
        str: Final status ("ready", "failed")
    """
    # Placeholder - in production this would call the service layer
    return "pending"


@celery_app.task(bind=True, max_retries=3, autoretry_for=(Exception,))
def run_robot_job_task(self, job_id: str) -> str:
    """
    Task to execute a robot manufacturing job.

    Sends instructions to the aligner production robot and tracks results.

    Args:
        self: Celery task context for retrying
        job_id: ID of the robot job to execute

    Returns:
        str: Final status ("completed", "queued", "failed")
    """
    # Placeholder - in production this would call the service layer
    return "running"
