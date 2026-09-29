# ADR P2 003 Same origin API and server enforced access

Date: 16 September 2026. Status: implemented in review candidate; team acceptance pending. Requirements: FR-001, FR-004 to FR-006, FR-011 to FR-013, NFR-001 and NFR-002.

## Context and alternatives

The browser must submit commands, display requests and retrieve role-scoped information. Alternatives are server-rendered forms, a same-origin JSON API, or separately hosted frontend/backend services with cross-origin credentials. Choose a same-origin API because the present application has one deployment boundary and no justified external client or service integration.

## Contract and security

GET requests retrieve data. POST commands submit requests, assign, schedule, change status and append notes. Mutations require JSON, an exact Origin match, a valid session and a session-bound CSRF token (login requires origin validation). Resource authorization remains on the server. Requesters see their own records and public activities; staff access assigned categories; oversight is read-only. Unauthorized resource IDs return 404. Invalid payloads return 400, missing authentication 401, forbidden operations 403, stale versions 409, large bodies 413, wrong media types 415 and login throttling 429.

The source guidance supports per-request authorization [S08] and CSRF protection for cookie sessions [S09]. Implementation uses random session tokens, stores their hashes server-side, and expires sessions after eight hours. Passwords use salted scrypt with N=131072, r=8, p=1 [S10]. Login responses avoid distinguishing unknown users from wrong passwords. HTTPS is required for staging; local synthetic development uses loopback HTTP.

## Trade-offs and evolution

No email/SMS, broker or external integration is needed for the supplied R3 in-app feedback rule. A committed activity is visible on refresh. Adding external delivery later needs failure/retry and consistency decisions, potentially a transactional outbox, not a fire-and-forget call inside the database transaction.

The current API has no external compatibility promise. A breaking contract change must update the UI, tests, API document, RTM and ADR together. Consider /api/v1 when independent clients exist. The API accepts expected record versions and never silently retries a conflicting write. In-memory login throttling resets on process restart and groups clients behind a reverse proxy; production abuse controls remain a risk. Tests T04-T05, T09, T13 and T22-T23. Sources S08-S10. Actual A2 integration cross-reference pending.
