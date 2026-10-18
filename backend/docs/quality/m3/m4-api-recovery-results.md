# M4 API and local recovery verification

Executed: 2026-10-18T16:39:34.331Z
Environment: v24.20.0 win32/x64
Base commit: 11dc19df95590aa9daf518e0f04441cf389ad0ed
Overall result: PASS

Exact source SHA-256 values are in m4-api-recovery-results.json.

| Check | Result | Duration (ms) | Evidence |
|---|---|---:|---|
| Assignment, eligibility and actual reassignment | PASS | 151.82 | Owner changed 3 to 5; old/new audit values and requester-visible update verified; invalid assignment made no change. |
| Notes, lifecycle, blank resolution and stale-edit conflict | PASS | 234.15 |  |
| Rejection reason, cross-account/category isolation and Oversight read-only | PASS | 157.33 |  |
| Forced application termination preserves acknowledged business state | PASS | 655.83 | Zero acknowledged request/activity loss; integrity and role/category/account data match; restart/read check 655.72 ms. |
| Timed application restoration from a local SQLite backup | PASS | 1262.9 | Health, account logins, requests, activities, category permissions and report counts restored in 1262.77 ms; zero acknowledged business-record loss in this drill. |

## Limits

- Isolated synthetic database and temporary child servers only; demonstration database untouched.
- HTTP/API and recovery checks, not browser interaction or representative-user usability.
- Forced application-process termination is not a host power-loss or disk-failure test.
- Timed restoration uses a fresh local snapshot and the same code/host; no off-site retention, scheduled 24-hour backup operation or disaster-site recovery is established.
- No new load, TLS, outage-alert or final release approval evidence is created.
