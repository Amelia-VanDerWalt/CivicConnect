# CivicConnect Milestone 2 Person 2

This package covers Person 2's **data, technology and integration** contribution. It contains the initial database, backend API, persistence controls, three decision records, ERD and automated evidence. It intentionally contains no frontend: Person 3 owns that integration. Person 1 confirms architecture/deployment and formal ASR allocation.

The technology is a candidate for review, not a claim that your team already approved Node/SQLite. Compare it with any existing team stack before importing it.

## Setup and run

Install Node.js 24.19.0 or a compatible later **24.x** patch. The actual automated run used Node 24.19.0 with SQLite 3.53.3. Qualify a current supported patch before staging.

In this folder, run:

```sh
npm ci --ignore-scripts
npm run setup
npm test
npm start
```

No separate database installation or third-party runtime package is needed. Setup creates `data/civicconnect.sqlite`, migration version 1 and synthetic accounts. It prints random passwords **once** for `requester`, `requester2`, `staff`, `itstaff` and `oversight`. Save them privately; do not commit them. Rerunning setup does not reset existing accounts/data.

Open http://127.0.0.1:3000/health to check the backend. The root URL is not a web page. Use an API client or the Node example below until Person 3 integrates the UI. Staff handles Facilities (category 1); itstaff handles IT support (category 2); oversight is read-only.

## API demonstration without a frontend

Keep the server running in one terminal. Open another terminal here and run `node`. Paste the following one step at a time. Replace the password locally with the value printed during setup; never save the real password in this README or Git.

```js
const origin = 'http://127.0.0.1:3000';
const login = await fetch(origin + '/api/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json', Origin: origin},
  body: JSON.stringify({username: 'requester', password: 'PASTE YOUR LOCAL PASSWORD'})
});
const cookie = login.headers.get('set-cookie').split(';')[0];
const session = await login.json();
const created = await fetch(origin + '/api/requests', {
  method: 'POST',
  headers: {'Content-Type': 'application/json', Origin: origin, Cookie: cookie,
    'X-CSRF-Token': session.csrf},
  body: JSON.stringify({title: 'Broken light', description: 'Hallway light is not working', category_id: 1})
});
const request = await created.json();
console.log(created.status, request.reference);
const details = await fetch(origin + '/api/requests/' + request.id, {headers: {Cookie: cookie}});
console.log(await details.json());
```

The HTTP integration test T23 demonstrates the same authentication, creation, access rejection and logout sequence without saving a real password. `docs/api.md` lists the other endpoints, payloads and errors. In Postman or similar tools include Origin, keep the session cookie and copy csrf into X-CSRF-Token for authenticated POST requests.

## File map

| Path | Contribution |
|---|---|
| db/migrations/001_initial.sql | Initial relational schema, constraints, indexes and audit triggers |
| src/infrastructure/database.js | Connection configuration and schema version check |
| src/infrastructure/request-repository.js | SQL access, transaction wrapper, scoped queries and expected-version updates |
| src/application/request-service.js | Backend operation integration, access rules and report calculations |
| src/domain/policy.js | Input and lifecycle validation |
| src/http/app.js | API routing, origin/CSRF checks and response handling |
| src/infrastructure/auth.js | Salted password hashes and server-side sessions |
| scripts/setup.js and backup.js | Synthetic seed data and consistent backup |
| tests/civicconnect.test.js | 24 domain, persistence and API checks |
| docs/quality/test-results.tap | Actual test output |
| docs/decisions/ | Persistence, technology and interface ADRs |
| docs/diagrams/ | Editable ERD sources and rendered image |
| docs/requirements/ | source requirements and RTM data (separate workbook available) |

The request service/repository are backend implementation boundaries for Person 3 to review alongside their own design decisions. This package does not claim to complete Person 3's two design-pattern deliverables.

## Configuration and recovery

Defaults: HOST=127.0.0.1, PORT=3000, APP_ORIGIN=http://127.0.0.1:3000, DB_PATH=data/civicconnect.sqlite, COOKIE_SECURE=false. Copy `.env.example` to `.env` only for overrides. APP_ORIGIN must exactly match the intended client origin. A future same-origin UI must be served/proxied at that origin. Cross-origin frontend hosting is not enabled.

Use synthetic data over loopback HTTP. Staging requires an actual HTTPS proxy, Secure cookies, durable local disk and protected database access. COOKIE_SECURE=true does not install TLS. The backend blocks non-loopback insecure binding. No provider or paid resource has been provisioned.

`npm run backup` creates a consistent snapshot under backups/. Local backup creation is not an off-host backup schedule or proven disaster recovery. See docs/risk-additions.md for recovery obligations. data/, backups/ and .env are excluded from Git.

## Known limits and handoff

24 automated tests passed. Load targets, forced-crash recovery, actual RTO/RPO, complete security, UI/accessibility/usability and monitoring alerts are not established. Lists/reports filter scoped rows in memory. No admin UI, password reset, role elevation, request reopening, email/SMS, attachments or semantic duplicate-submission prevention is included.

Merge the Word contribution into the existing team PED and the RTM columns into the shared RTM. The original source was a Person 2 draft; the combined approved PED and actual A2 report were not supplied. Attach real A2 persistence/integration findings, reconcile CR-P2-001, and obtain genuine team reviews. Preserve existing repository files/history. Use actual issues and feature branches; substantive PRs need two independent teammate approvals. No GitHub contribution, approval or baseline sign-off has been fabricated.
