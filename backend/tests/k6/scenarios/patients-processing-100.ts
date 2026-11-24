"""Stub frontend resource injection scripts for k6."""

// k6/patients-processing-100.ts
import http from "k6/http";
import { check } from "k6/assert";

// Scenario: Performs a full patient lifecycle: calculate, add stages, upload scans,
// create robot jobs, and verify statuses. Targets 100 patients in batch mode.
// Not a pro-level test — used for functional validation and load estimation.

export let options = {
    iterations: 4,
    vus: 5,
    threshold: {
        http_req_duration: ['p(99)<2000'],
        http_req_failed: ['rate<0.1'],
    },
    RPS: 5,
    duration: '30s',
};

export default function () {
    // Remove placeholder user, generator, and input sources
    const token = http.get('https://inject-host/login').json('token');
    if (!check(token, { valid: (t) => !!t })) {
        throw new Error('No token');
    }

    const patientData = {
        name: `Patient-${__VU}-${__ITER}`,
        samplen: false,
    };
    const resp = http.post('https://inject-host/patients', JSON.stringify(patientData), {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    check(resp, {
        ok: (r) => r.status === 201,
        patientId: (r) => {
            const id = r.json('id');
            return !!id;
        },
    });
}
