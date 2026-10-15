# M3 Person 1 — Implementation and Architecture Handoff

**Project:** CivicConnect  
**Owner:** Person 1 — Architecture and implementation conformance  
**Status:** Working draft for team review; not a release approval  
**Baseline reference:** `docs/PED/PED_v2.0.md`, architecture documents, design decisions, requirements and current repository implementation  
**Purpose:** Provide the Person 1 contribution for PED v3.0 sections 1–4. Integrate into the shared PED after the team checks the evidence and Person 3's release/CI work. This file is an evidence-oriented handoff, not a substitute for the shared PED.

## 1. M3 Overview

CivicConnect is a browser-based community service request management platform. Its M2 implementation uses an HTML/CSS/JavaScript frontend, a Node.js server exposing a same-origin JSON API, and SQLite persistence. The system supports Requester and Staff workflows and provides read-only Oversight reporting through the API. The Oversight browser interface and several planned staff/requester workflows remain incomplete, so the repository must not be described as a complete production system.

### 1.1 M3 objective

M3 should demonstrate that the implemented release candidate is traceable to the M2 requirements and architecture, that changes from the M2 baseline are visible and justified, and that construction and verification evidence is reproducible. This section records implementation conformance only where repository documentation or implementation descriptions support the claim. It does not assert that a requirement has passed acceptance merely because code exists.

### 1.2 Architecture carried forward from M2

The selected design is a modular layered monolith:

- **Presentation:** browser UI in `src/frontend/`.
- **HTTP/API boundary:** same-origin JSON routes and the server in `backend/src/http/` and `backend/src/server.js`.
- **Application:** use-case orchestration and request operations in `backend/src/application/`.
- **Domain:** request policy and business rules in `backend/src/domain/`.
- **Infrastructure/persistence:** SQLite access and transactions in `backend/src/infrastructure/` and `backend/db/`.
- **Data store:** local SQLite database.

The browser does not connect directly to SQLite. Security-sensitive decisions, request lifecycle validation and persistence are enforced server-side rather than trusted to the browser alone.

### 1.3 Architecturally significant requirements

| Driver | Related baseline requirements | Design implication | M3 evidence to retain |
|---|---|---|---|
| Security and least privilege | FR-001, FR-006, FR-008, FR-012, FR-013, NFR-001, NFR-002 | Authenticate users; enforce role and request-scope checks at the backend; protect mutation requests and secrets | API/negative tests, configuration review, security scan and deployment evidence |
| Data integrity | FR-008–FR-013, NFR-003 | Use controlled transactions, constraints and conflict handling; reject invalid lifecycle changes | Database schema, service/repository implementation, rollback/concurrency tests |
| Auditability | FR-005, FR-011, FR-013 | Record important actions with actor/time/context and keep history protected from normal edits | Activity-writing code and tests proving audit state changes with the request |
| Maintainability | Core functional requirements; ASR-004 | Keep HTTP handling, application orchestration, domain policy and persistence responsibilities distinct | Source tree and review of responsibility boundaries |
| Usability/accessibility | FR-002, FR-004, FR-005, NFR-005, NFR-006 | Keep core requester tasks understandable and keyboard/zoom support testable | UI acceptance evidence; incomplete workflows must remain listed as gaps |
| Performance | FR-007, FR-012, NFR-004 | Support efficient list/detail/report retrieval without unnecessary distributed infrastructure | Person 3's measured performance evidence and stated workload/limitations |
| Availability/recovery | NFR-007, NFR-008 | Make health, backup and recovery behavior explicit; do not imply production monitoring exists | Backup/recovery evidence and Person 3's environment/release evidence |
| Proportionality | Scope baseline and project constraints | Prefer a simple single-host architecture unless measured requirements justify more | Existing architecture and decision records |

## 2. M2 Baseline Conformance

### 2.1 Conformance method

Use the following status meanings consistently:

- **Implemented (code present):** corresponding behavior is present in the repository.
- **Initially verified:** named tests or checks exercise the behavior.
- **Partially implemented:** some behavior exists, but the full requirement or user workflow is not delivered.
- **Not demonstrated:** evidence has not been supplied or checked; this is not proof that the behavior is absent.
- **Not implemented / known gap:** repository documentation explicitly identifies the capability as unavailable.

Do not equate code presence with acceptance. Person 2's test results and Person 3's CI/staging results must be linked before the team makes acceptance or release-readiness claims.

### 2.2 Baseline-to-implementation table

| M2 baseline area | Intended architecture/design | Current implementation position from repository documentation | Conformance assessment / evidence needed |
|---|---|---|---|
| Sign-in, sign-out and role-based access (FR-001, NFR-001) | Backend authentication and authorization; protected API | Backend session authentication and role-aware API are documented; Requester and Staff browser workflows exist | **Implemented / initially verified per existing backend test evidence.** Link current authentication and unauthorized-access tests and verify the current release candidate |
| Request submission and categories (FR-002, FR-003) | UI → API → application service → repository → SQLite | Requester UI supports title, description, active category and optional location; new requests default to Normal / Received | **Implemented / initially verified.** Link submission/category tests; verify confirmation and persisted record |
| Requester history and feedback (FR-004, FR-005) | Request-scoped queries and activity history | Requester can view own requests and status; README identifies activity/history views as incomplete | **Partial.** Do not claim full history/feedback acceptance; identify remaining UI coverage |
| Staff queue, detail, assignment and status lifecycle (FR-006, FR-008, FR-010) | Role/category-scoped queries; controlled server-side transitions | Staff can view authorized queues/details, assign Received requests to themselves, and update status; invalid transitions are rejected server-side | **Partial.** Reassignment and some workflow controls remain unavailable in the frontend; link API and lifecycle tests |
| Search/filter/sort and full assignment controls (FR-007, FR-008) | Authorized query operations and eligible-owner rules | README identifies full staff search/filter/sort and reassignment controls as not yet exposed in the frontend | **Known UI gap.** Avoid claiming full FR-007/FR-008 acceptance |
| Priority and due-date management (FR-009) | Validated values, due-date constraints and audit history | Backend API includes a scheduling endpoint; README identifies full priority/due-date editing as unavailable in the frontend | **Partial.** API availability is not proof of complete user workflow; link validation tests and record UI gap |
| Work notes and visibility (FR-011) | Explicit public/internal visibility and append-only history | Backend activity/work-note behavior is described in engineering documentation; README identifies full public/internal note editing as unavailable in frontend | **Partial.** Confirm API-level visibility tests and retain the frontend limitation |
| Oversight reporting (FR-012) | Read-only aggregate reporting API | Oversight reporting is available through the API; Oversight browser interface is not implemented | **Partial.** Do not claim a complete Oversight user journey |
| Audit trail (FR-013) | Activity entries coordinated with successful request mutations | Backend documentation describes activity/audit handling and tests | **Implemented / initially verified only to the extent covered by named tests.** Link the relevant tests and confirm failure/rollback behavior |
| Persistence and consistency (NFR-003) | SQLite constraints, transactions, version checks and rollback | Repository documentation describes foreign keys, constraints, transactions, optimistic version checking and append-only activity history controls | **Implemented / initially verified.** Link persistence, stale-record and rollback tests; retain restart/recovery limitations |
| Performance target (NFR-004) | Efficient reads/writes under the specified workload | The M2 requirement specifies a workload and response-time target; full performance/load target is documented as not yet fully verified | **Not demonstrated.** Person 3 owns the measured performance scenario and limitations |
| Accessibility/usability (NFR-005, NFR-006) | Usable, keyboard-accessible and zoom-tolerant UI | Existing UI exists, but the full acceptance criterion needs user/interaction evidence | **Not demonstrated as fully accepted.** Link actual UI evidence or record the gap |
| Availability/recovery (NFR-007, NFR-008) | Health checks, backup and documented recovery approach | A local health endpoint and local SQLite backup command are documented; production monitoring and disaster-recovery targets are not fully demonstrated | **Partial.** A local backup alone does not prove off-site backup, RTO or RPO compliance |
| Secure transport / production deployment (NFR-002) | TLS, controlled configuration, no committed secrets | README states production HTTPS/TLS has not been established | **Known deployment gap.** Person 3 must record the actual M3 environment and residual risk; do not claim production TLS |

### 2.3 Architecture conformance conclusion

The current documented implementation remains consistent with the M2 choice of a modular layered monolith and SQLite-backed persistence. No evidence reviewed for this handoff establishes a replacement of the overall architecture. The major conformance issue is not a proven architectural redesign; it is incomplete delivery or incomplete acceptance evidence for several user-facing workflows and operational quality requirements.

This is a provisional conclusion based on repository documentation. Confirm it against the final M3 branch/release candidate and actual code before merging this section into the approved PED.

## 3. Controlled Changes and Deviations

### 3.1 Change-record rule

Only record a change as an actual deviation when the team can identify the earlier baseline, the implementation difference and the evidence supporting it. A missing feature is not automatically an architectural change. If the team cannot establish that a decision changed, record it as an unresolved conformance gap rather than inventing a change.

### 3.2 Known gaps and follow-up records

| ID | Baseline / expectation | Observed implementation position | Classification | Impact / decision needed | Owner / evidence |
|---|---|---|---|---|---|
| GAP-001 | FR-004/FR-005: complete requester history and meaningful persisted feedback | README states requester activity/history views are incomplete | Delivery/conformance gap; not yet an architectural deviation | Document which acceptance criteria remain unmet; implement or explicitly report residual scope | Person 1 to trace requirement; Person 2 to link tests |
| GAP-002 | FR-007: staff search, filtering and sorting | Full functionality is not exposed through the current frontend | Delivery/conformance gap | Do not report full acceptance based solely on backend/API capability | Person 1 + Person 2 |
| GAP-003 | FR-008/FR-009: reassignment, priority and due-date controls | API endpoints exist, but complete frontend controls are not available | Partial workflow | Confirm backend behavior and record frontend limitation; any scope change requires team approval | Person 1 + Person 2 |
| GAP-004 | FR-011: public/internal work-note workflow | Full public/internal note editing is not exposed through frontend | Partial workflow | Verify visibility enforcement and document UI gap | Person 1 + Person 2 |
| GAP-005 | FR-012: management reporting | API exists; Oversight browser UI is absent | Partial workflow | Keep API and UI claims separate; assess acceptance scope | Person 1 + Person 2 |
| GAP-006 | NFR-002: encrypted transport / TLS | README says production HTTPS/TLS deployment is not established | Operational conformance gap | Person 3 to document the actual test/staging setup and residual risk | Person 3 |
| GAP-007 | NFR-004, NFR-007, NFR-008: performance, monitoring and recovery targets | Full performance/load, production monitoring and disaster recovery are not fully demonstrated | Evidence / operational gap | Provide measured results and a bounded recovery/rollback statement; do not infer compliance | Person 3 |
| GAP-008 | M3 controlled construction and release gates | M2 PED records that no active GitHub Actions workflow existed in the inspected M2 snapshot; M3 status must be checked against current branch | Pending verification, not a claim of current absence | Confirm workflow, required checks, branch protection and review evidence after Person 3's work | Person 3 |

### 3.3 Architecture decisions carried forward

**DES-001 — Category-dependent request creation.** The M2 decision uses a shared Request model and data-driven category validation rather than Factory Method classes. The recorded rationale is that categories are data labels rather than distinct behavioral subclasses. This avoids unnecessary classes and keeps the model proportionate. Revisit only if category-specific behavior becomes materially different.

**DES-002 — Request state change and audit coordination.** The M2 decision uses direct application-service coordination for the required activity/audit write rather than an Observer/event mechanism. This keeps the mandatory reaction explicit and transactionally coordinated for the current small set of reactions. The trade-off is tighter coupling; reconsider an event-based approach if multiple independent reactions or external integrations are introduced.

These are carried-forward M2 decisions, not new M3 changes. Any implementation change to them should be recorded with the problem, alternatives, decision, consequences and code/test evidence.

### 3.4 Significant change log

No new architecture-changing decision is asserted by this handoff. Before PED v3.0 is approved, the team should add rows below only for verified changes made during M3.

| Change ID | Original decision/baseline | Problem discovered | New decision | Consequence/trade-off | Evidence/status |
|---|---|---|---|---|---|
| — | No verified new architectural change recorded in this handoff | — | No new decision claimed | Prevents undocumented or speculative change history | Team to update after final M3 comparison |

## 4. Construction and Configuration Notes

### 4.1 Repository structure and responsibilities

| Area | Location | Responsibility / conformance note |
|---|---|---|
| Frontend | `src/frontend/` | HTML/CSS/JavaScript browser interface; communicates through same-origin API |
| HTTP entry point | `backend/src/server.js`, `backend/src/http/` | Starts server and exposes HTTP/API boundary |
| Application services | `backend/src/application/` | Orchestrates request use cases and repository operations |
| Domain policy | `backend/src/domain/` | Encapsulates request lifecycle and business policy |
| Persistence | `backend/src/infrastructure/`, `backend/db/` | SQLite operations, transaction handling and schema/migrations |
| Tests | `backend/tests/` | Backend unit/component, integration and HTTP/system verification; see Person 2's M3 test plan |
| Engineering documentation | `docs/`, `backend/docs/` | Requirements, decisions, architecture, API/data model, quality evidence and PED |
| Setup / backup | `backend/scripts/` | Local database initialization and backup utilities |

### 4.2 Local construction commands

Run commands from the `backend/` directory unless otherwise stated.

```bash
npm ci --ignore-scripts
npm run setup
npm test
npm start
```

The setup process creates the local SQLite database and demonstration accounts. It generates account passwords for display once; save credentials privately and never commit them. The application is documented as available at `http://127.0.0.1:3000`, with `/health` as the health endpoint. These are local-development instructions, not evidence of a deployed staging environment.

### 4.3 Configuration and security boundaries

- Keep generated databases, backups, credentials and environment-specific secrets out of version control.
- Do not paste generated demo passwords into the PED, issue comments, screenshots or AI register.
- Authenticated mutation requests use the CSRF token returned by the session/login response, as documented in the README.
- Server-side role/scope checks remain authoritative; hiding a UI control is not an authorization control.
- Record the actual Node.js version and test commands used for the final M3 candidate. The README specifies Node.js 24.19.0 or a compatible later 24.x version; verify the team's execution environment before claiming reproducibility.
- The repository documents local binding and no established production TLS. Describe the environment honestly and let Person 3 record staging/simulated-staging evidence and release risk.
- The backup command demonstrates a local snapshot mechanism only; it does not by itself demonstrate off-site backup, recovery-time objective or recovery-point objective compliance.

### 4.4 Evidence checklist before marking this section complete

- [ ] Compare the final M3 candidate with the M2 baseline and confirm the current commit/branch identifier.
- [ ] Link every conformance row to specific source files, tests, or evidence artifacts where available.
- [ ] Have Person 2 confirm test names/results and distinguish local execution from CI execution.
- [ ] Have Person 3 confirm workflow, branch protection/review, configuration, staging, performance, rollback and release evidence.
- [ ] Confirm all gaps are either resolved with evidence or retained as explicit limitations/residual risks.
- [ ] Record any real architectural change in the controlled-change table; do not manufacture changes to fill it.
- [ ] Integrate reviewed content into the shared PED v3.0 and preserve PED v2.0 as history.
- [ ] Ensure each team member can defend at least one complete requirement → implementation → test → evidence → defect/risk → release trace.

## Sources in the repository

- `docs/PED/PED_v2.0.md` — M2 requirements, architecture baseline, traceability and known verification limits.
- `architecture.md` and `architecture_continued.md` — ASRs and architectural rationale.
- `docs/decisions/design-patterns.md` and `docs/design-quality.md` — DES-001, DES-002, coupling/cohesion and design principles.
- `README.md` and `backend/README.md` — current documented behavior, commands and limitations.
- `backend/docs/quality/m3/PED-handoff.md` and `backend/docs/quality/m3/README.md` — Person 2's M3 test evidence and outstanding Person 3 handoff.
