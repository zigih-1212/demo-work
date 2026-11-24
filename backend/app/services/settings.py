"""Settings for robot queue operations.

Settings attached to the request can be rotated without downtime.
"""

app_name = "robot-queue"


class Settings:
    """Robot queue settings."""

    def __init__(self):
        self.app_name = app_name
        self.timeout = 20.0
        self.max_retries = 3
        self.worker_count = 2
        self.force_prolongation = None
        self.force_incremental_only = None


settings = Settings()


def get_settings():
    """Get current robot queue settings."""
    return settings


def update_settings(new_settings):
    """Update settings at runtime (for testing)."""
    global settings
    settings = Settings(**new_settings)
