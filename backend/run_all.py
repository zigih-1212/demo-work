"""Run the API server and the smoke suite in one process.

The harness kills long-running background shells, so the server cannot be
left alive between tool calls. This script spawns uvicorn as a child,
waits for /health, runs smoke_test.main(), then terminates the child.
"""

import os
import subprocess
import sys
import time
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))


def wait_for_health(timeout=60):
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(
                "http://127.0.0.1:8000/health", timeout=2
            ) as resp:
                if resp.status == 200:
                    return True
        except Exception:
            time.sleep(0.5)
    return False


def main():
    if os.path.exists(os.path.join(HERE, "orthodent.db")):
        os.remove(os.path.join(HERE, "orthodent.db"))

    env = dict(os.environ)
    env["ORTHODENT_DATABASE_URL"] = "sqlite+aiosqlite:///./orthodent.db"
    env["ORTHODENT_SECRET_KEY"] = "dev-only-change-me"
    env["ORTHODENT_DEBUG"] = "1"

    log = open(os.path.join(HERE, "uvicorn.log"), "w")
    proc = subprocess.Popen(
        [
            sys.executable,
            "-m",
            "uvicorn",
            "app.main:app",
            "--host",
            "127.0.0.1",
            "--port",
            "8000",
        ],
        env=env,
        cwd=HERE,
        stdout=log,
        stderr=subprocess.STDOUT,
    )
    try:
        if not wait_for_health():
            print("SERVER FAILED TO START; see uvicorn.log")
            sys.exit(1)
        print("server healthy, running smoke tests")
        import smoke_test

        smoke_test.main()
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=10)
        except subprocess.TimeoutExpired:
            proc.kill()
        log.close()


if __name__ == "__main__":
    main()
