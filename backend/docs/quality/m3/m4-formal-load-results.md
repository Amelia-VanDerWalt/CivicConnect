# M4 load verification

Executed: 2026-10-18T16:45:00.375Z
Result: PASS
Environment: v24.20.0 win32/x64
Base commit: 11dc19df95590aa9daf518e0f04441cf389ad0ed

Initial active records: 5000. Concurrent virtual users: 20.
10 Requesters and 10 Staff; one distinct account/session per virtual user
Each round has 100 operations: 80 reads and 20 writes. Each user performs 5 sequential actions, paced every 2 seconds; rounds start no faster than every 10 seconds. No fixed throughput requirement is assumed.
Synthetic authenticated sessions provisioned in the isolated fixture; login/TLS/browser rendering are outside the measured workload.

Measured duration: 900.015 seconds.
Reads: {"count":7200,"averageMs":135.68,"p95Ms":395.5,"maxMs":1831.79}
Writes: {"count":1800,"averageMs":26.83,"p95Ms":42.86,"maxMs":159.83}
Final active records: 6800

Exact source hashes and any failures are in m4-formal-load-results.json.

## Limits

- Loopback HTTP on this single test host; no production network/TLS or municipal deployment claim.
- Database grows as acknowledged writes are added. Think time is excluded from request latency.
- Search/list/detail response content and created-record fields are asserted, not status alone.
- An abbreviated diagnostic run cannot satisfy AC-N04.
