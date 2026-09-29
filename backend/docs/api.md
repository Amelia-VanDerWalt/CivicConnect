# Current API contract

Base path: `/api`. Same-origin browser client; JSON request/response bodies. Cookie session supplies identity; caller-provided user IDs never replace authenticated identity. All protected routes require authentication. POST requests require exact Origin and, except login, X-CSRF-Token from login or GET /api/me.

| Method and path | Role | Input | Result |
|---|---|---|---|
| POST /login | Public | username, password | user and csrf; HttpOnly session cookie |
| GET /me | Authenticated | None | user and csrf |
| POST /logout | Authenticated | Empty JSON object | Session invalidated, cookie expired |
| GET /categories | Authenticated | None | Active category id/name pairs |
| GET /staff | Staff | None | Eligible staff id/name/category mappings within caller scope |
| POST /requests | Requester | title, description, category_id; optional location | 201 with created request and reference |
| GET /requests | All roles | Optional q, status, category, owner, priority, from, to, sort, direction | Permission-scoped request list |
| GET /requests/{id} | Authorized reader | Request ID | Details and permitted activities |
| POST /requests/{id}/assign | In-scope Staff | version, owner_id, priority, due_at, note | Assignment/reassignment and audit |
| POST /requests/{id}/schedule | In-scope Staff | version, priority, due_at, note | Priority/due change and audit |
| POST /requests/{id}/status | In-scope Staff | version, status, note | Allowed transition and audit |
| POST /requests/{id}/note | In-scope Staff | version, note, visibility | Public or Internal note and audit |
| GET /reports | Oversight | Optional from and to | Category counts, ownership counts and MTTR |
| GET /health | Public, outside /api | None | Minimal database/process health result |

Search matches reference/title substrings case-insensitively. Dates use YYYY-MM-DD UTC creation boundaries. sort is created_at or due_at; direction is asc or desc. Unscheduled rows sort last. M2 lists are not paginated. Unknown filtering values produce no matches; unknown sort/direction fall back to created_at/descending.

Submission example:

```json
{"title":"Broken hallway light","description":"The light outside the study room is off.","category_id":1,"location":"Community centre"}
```

Assignment example (replace IDs/version with values retrieved from the server, and choose a future due time):

```json
{"version":1,"owner_id":3,"priority":"High","due_at":"2030-09-17T10:00:00.000Z","note":"Facilities inspection required"}
```

The status route cannot perform assignment: assigning requires an owner and due time. Allowed status route targets depend on current status: Received to Rejected; Assigned to In progress; In progress to Resolved; Resolved to Closed. Assignment changes Received to Assigned. Rejection and resolution require nonempty notes. No reopening exists.

Errors use `{ "error": "message", "correlation": "id" }`. HTTP 400 means validation; 401 authentication; 403 forbidden/CSRF/origin; 404 unavailable resource; 409 stale record version; 413 body too large; 415 content type; 429 login throttle; 500 unexpected internal error; 503 database busy where identified. Clients must refresh after 409 and review current values before resubmission. Generic server errors do not expose SQL or payloads.

Bodies are limited to 16 KiB. Title is 1-120 characters, description 1-4000, location 0-200 and note up to 2000. priority is Low, Normal or High; visibility is explicitly Public or Internal. Numeric IDs and version must be positive safe integers. Due times require a timezone and must be future times under proposed CR-P2-001.

Breaking API changes require an ADR/change record and synchronized client/tests/RTM update. A versioned public API and external integrations are deferred until an independent client is justified.
