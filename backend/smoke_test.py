"""End-to-end smoke test for the OrthoDent API.

Run while uvicorn is serving on 127.0.0.1:8000:
    python smoke_test.py

Exercises the full happy path plus the BOLA guard (cross-doctor access must
return 404, not 403, so object existence is not leaked).
"""

import json
import urllib.error
import urllib.request

BASE = "http://127.0.0.1:8000/api/v1"


def call(method, path, token=None, body=None, is_json=True, headers=None):
    url = BASE + path
    hdrs = dict(headers or {})
    if token:
        hdrs["Authorization"] = f"Bearer {token}"
    data = None
    if body is not None:
        if is_json:
            data = json.dumps(body).encode()
            hdrs.setdefault("Content-Type", "application/json")
        else:
            data = body  # raw bytes / FormData
    req = urllib.request.Request(url, data=data, headers=hdrs, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            raw = resp.read()
            return resp.status, (json.loads(raw) if raw else None)
    except urllib.error.HTTPError as e:
        raw = e.read()
        try:
            return e.code, json.loads(raw) if raw else None
        except Exception:
            return e.code, raw.decode(errors="replace")


def main():
    results = []

    def check(name, ok, detail=""):
        results.append((name, ok, detail))
        print(
            f"{'PASS' if ok else 'FAIL'}  {name}" + (f"  -> {detail}" if detail else "")
        )

    # 1. Register doctor A
    status, body = call(
        "POST",
        "/auth/register",
        body={
            "email": "doc.a@example.com",
            "password": "password123",
            "full_name": "Doctor A",
        },
    )
    check("register doctor A", status == 201, f"{status} {body}")

    # 2. Register doctor B
    status, body = call(
        "POST",
        "/auth/register",
        body={
            "email": "doc.b@example.com",
            "password": "password123",
            "full_name": "Doctor B",
        },
    )
    check("register doctor B", status == 201, f"{status} {body}")

    # 3. Duplicate registration -> 409
    status, body = call(
        "POST",
        "/auth/register",
        body={
            "email": "doc.a@example.com",
            "password": "password123",
            "full_name": "Doctor A",
        },
    )
    check("duplicate register -> 409", status == 409, f"{status}")

    # 4. Login A
    status, body = call(
        "POST",
        "/auth/login",
        body={"email": "doc.a@example.com", "password": "password123"},
    )
    check("login doctor A", status == 200 and "access_token" in body, f"{status}")
    token_a = body["access_token"]

    # 5. Login B
    status, body = call(
        "POST",
        "/auth/login",
        body={"email": "doc.b@example.com", "password": "password123"},
    )
    token_b = body["access_token"]
    check("login doctor B", status == 200, f"{status}")

    # 6. /auth/me
    status, body = call("GET", "/auth/me", token=token_a)
    check(
        "GET /auth/me",
        status == 200 and body.get("email") == "doc.a@example.com",
        f"{status}",
    )

    # 7. Unauthenticated request -> 401
    status, _ = call("GET", "/auth/me")
    check("no token -> 401", status == 401, f"{status}")

    # 8. Create patient for A
    status, patient = call(
        "POST",
        "/patients",
        token=token_a,
        body={"full_name": "Пациент Тестов", "birth_year": 1990, "diagnosis": "Тест"},
    )
    check("create patient", status == 201, f"{status} {patient}")
    pid = patient["id"]

    # 9. List patients
    status, page = call("GET", "/patients", token=token_a)
    check(
        "list patients",
        status == 200 and page["total"] >= 1,
        f"{status} total={page.get('total')}",
    )

    # 10. BOLA: doctor B must NOT see A's patient -> 404
    status, _ = call("GET", f"/patients/{pid}", token=token_b)
    check("BOLA guard: other doctor -> 404", status == 404, f"{status}")

    # 11. Create stage
    status, stage = call(
        "POST",
        f"/patients/{pid}/stages",
        token=token_a,
        body={"position": 1, "description": "Выравнивание", "wear_days": 14},
    )
    check("create stage", status == 201, f"{status}")
    sid = stage["id"]

    # 12. Duplicate stage position -> 409
    status, _ = call(
        "POST",
        f"/patients/{pid}/stages",
        token=token_a,
        body={"position": 1, "description": "dup", "wear_days": 14},
    )
    check("duplicate stage position -> 409", status == 409, f"{status}")

    # 13. Upload scan (minimal ASCII STL)
    stl = (
        "solid test\n"
        "  facet normal 0 0 1\n"
        "    outer loop\n"
        "      vertex 0 0 0\n vertex 1 0 0\n vertex 0 1 0\n"
        "    endloop\n  endfacet\n"
        "endsolid test\n"
    ).encode()
    boundary = "----OrthoDentBoundary"
    payload = (
        (
            f"--{boundary}\r\n"
            f'Content-Disposition: form-data; name="file"; filename="test.stl"\r\n'
            f"Content-Type: model/stl\r\n\r\n"
        ).encode()
        + stl
        + f"\r\n--{boundary}--\r\n".encode()
    )
    status, scan = call(
        "POST",
        f"/patients/{pid}/scans",
        token=token_a,
        body=payload,
        is_json=False,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
    )
    check("upload scan", status == 201, f"{status} {scan}")
    scan_id = scan["id"]

    # 14. Scan status should transition to ready (sync queue)
    status, scan2 = call("GET", f"/patients/{pid}/scans/{scan_id}", token=token_a)
    check(
        "scan processed -> ready",
        status == 200 and scan2["status"] == "ready",
        f"{status} status={scan2.get('status')} err={scan2.get('error')}",
    )

    # 15. Non-STL extension -> 422
    boundary2 = "----OrthoDentBoundary2"
    payload2 = (
        f"--{boundary2}\r\n"
        f'Content-Disposition: form-data; name="file"; filename="bad.txt"\r\n'
        f"Content-Type: text/plain\r\n\r\nhello\r\n--{boundary2}--\r\n"
    ).encode()
    status, _ = call(
        "POST",
        f"/patients/{pid}/scans",
        token=token_a,
        body=payload2,
        is_json=False,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary2}"},
    )
    check("non-STL upload -> 422", status == 422, f"{status}")

    # 16. Send stage to production (robot job)
    status, job = call(
        "POST", f"/patients/{pid}/stages/{sid}/robot-jobs", token=token_a
    )
    check("create robot job", status == 201, f"{status} {job}")
    jid = job["id"]

    # 17. Job should complete
    status, job2 = call("GET", f"/robot-jobs/{jid}", token=token_a)
    check(
        "robot job completed",
        status == 200 and job2["status"] == "completed",
        f"{status} status={job2.get('status')} err={job2.get('error')}",
    )

    # 18. Stage moved to produced
    status, stages = call("GET", f"/patients/{pid}/stages", token=token_a)
    check(
        "stage status -> produced",
        status == 200 and stages[0]["status"] == "produced",
        f"{status} {stages[0]['status'] if stages else '?'}",
    )

    # 19. Robot job on non-planned stage -> 409
    status, _ = call("POST", f"/patients/{pid}/stages/{sid}/robot-jobs", token=token_a)
    check("robot job on produced stage -> 409", status == 409, f"{status}")

    # 20. PATCH patient
    status, upd = call(
        "PATCH", f"/patients/{pid}", token=token_a, body={"status": "completed"}
    )
    check(
        "patch patient status",
        status == 200 and upd["status"] == "completed",
        f"{status}",
    )

    # 21. Invalid email -> 422
    status, _ = call(
        "POST",
        "/auth/register",
        body={"email": "not-an-email", "password": "password123", "full_name": "X"},
    )
    check("invalid email -> 422", status == 422, f"{status}")

    # 22. Short password -> 422
    status, _ = call(
        "POST",
        "/auth/register",
        body={"email": "x@example.com", "password": "short", "full_name": "X"},
    )
    check("short password -> 422", status == 422, f"{status}")

    failed = [r for r in results if not r[1]]
    print(f"\n=== {len(results) - len(failed)}/{len(results)} passed ===")
    if failed:
        print("FAILED:", ", ".join(n for n, _, _ in failed))
        raise SystemExit(1)
    print("ALL SMOKE TESTS PASSED")


if __name__ == "__main__":
    main()
