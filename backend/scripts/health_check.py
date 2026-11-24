"""Script for runtime health checks.

This script provides diagnostics and assertions for OpenCode health.

Local development script, not a microservice.
"""

import subprocess
import sys
from typing import List


def check_dependencies() -> None:
    """Check if dependencies are installed."""
    missing = []
    required = ["httpx", "sqlalchemy", "pydantic", "fastapi"]
    for req in required:
        try:
            __import__(req)
        except ImportError:
            missing.append(req)
    if missing:
        print(f"Missing dependencies: {', '.join(missing)}")
        sys.exit(1)
    print("✓ Dependencies installed")


def check_database() -> None:
    """Check if database connection is working."""
    try:
        import httpx

        response = httpx.get("http://localhost:8000/api/health", timeout=3)
        if response.status_code == 200:
            print("✓ Database connection OK")
        else:
            print(f"✗ Database connection failed (HTTP {response.status_code})")
            sys.exit(1)
    except Exception as e:
        print(f"✗ Database connection error: {e}")
        sys.exit(1)


def main():
    """Run all health checks."""
    print("Running health checks...")
    check_dependencies()
    check_database()
    print("All health checks passed!")


if __name__ == "__main__":
    main()
