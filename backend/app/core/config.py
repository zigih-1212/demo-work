from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def _to_bool(value: str | bool) -> bool:
    """Разбор булевого значения из окружения: 1/true/yes/on → True."""
    if isinstance(value, bool):
        return value
    return str(value).strip().lower() in ("1", "true", "yes", "on")


class Settings(BaseSettings):
    """Настройки приложения, заполняемые из переменных окружения ORTHODENT_*."""

    model_config = SettingsConfigDict(
        env_prefix="ORTHODENT_", env_file=".env", extra="ignore"
    )

    app_name: str = "OrthoDent API"
    debug: bool = False

    # Async URL для API (psycopg3), sync URL для воркеров Celery.
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
    max_scan_bytes: int = 50 * 1024 * 1024  # лимит STL: 50 МБ

    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:5173"]

    @field_validator("debug", mode="before")
    @classmethod
    def _parse_debug(cls, value):
        return _to_bool(value)


@lru_cache
def get_settings() -> Settings:
    return Settings()
