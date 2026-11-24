from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="ORTHODENT_", env_file=".env", extra="ignore"
    )

    app_name: str = "OrthoDent API"
    debug: bool = False

    # Async URL for the API (psycopg3), sync URL for Celery workers.
    database_url: str = (
        "postgresql+psycopg://orthodent:orthodent@localhost:5432/orthodent"
    )
    sync_database_url: str = (
        "postgresql+psycopg://orthodent:orthodent@localhost:5432/orthodent"
    )
    redis_url: str = "redis://localhost:6379/0"

    secret_key: str = "change-me-in-production"
    access_token_ttl_minutes: int = 60 * 12
    algorithm: str = "HS256"

    upload_dir: str = "uploads"
    max_scan_bytes: int = 50 * 1024 * 1024  # 50 MB STL limit

    cors_origins: list[str] = ["http://localhost:5173"]


@lru_cache
def get_settings() -> Settings:
    return Settings()
