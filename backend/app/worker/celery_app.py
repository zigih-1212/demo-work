"""Celery application configuration.

This file creates and configures the Celery app for background task processing.
Redis is used as both broker and result backend for demo purposes.

In production, you would use:
- Redis or RabbitMQ for the broker
- Proper Redis cluster configuration
- Appropriate security settings for secrets
"""

from celery import Celery


def create_celery_app() -> Celery:
    """Create and configure the Celery application."""
    from app.core.config import get_settings

    settings = get_settings()

    app = Celery(
        "orthodent",
        broker=settings.redis_url,
        backend=settings.redis_url,
        include=["app.worker.tasks"],
    )

    app.conf.update(
        task_acks_late=True,
        task_reject_on_worker_lost=True,
        task_default_retry_delay=5,
        task_time_limit=300,
        task_soft_time_limit=240,
        worker_prefetch_multiplier=1,
        result_expires=3600,
    )

    return app


celery_app = create_celery_app()
