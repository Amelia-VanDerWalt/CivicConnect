# Project Engineering Document v3.0 — CivicConnect M3

**Document status:** Consolidated M3 review candidate; not a final release approval  
**Baseline carried forward:** [PED v2.0](PED_v2.0.md) and its original M1 requirements  
**Repository snapshot reviewed:** `main` at `c0a72f6c05d87c9d0b6581dbc7c6bcefee4d2f16` (15 October 2026)  
**Team:** Amelia van der Walt, Edward Goosen, Albert Du Plooy

## Document control

| Version | Date | Change | Status |
|---|---|---|---|
| 3.0 review candidate | 15 October 2026 | M3 implementation conformance, controlled corrections, automated/browser evidence, CI/staging/performance verification and residual risks | Review required; do not treat as approved baseline |

PED v2.0 remains the controlled historical M2 baseline and retains the original requirements, acceptance criteria, stakeholder analysis, risk and architecture rationale. This M3 continuation records current evidence and does not silently replace original requirements. Any requirement change, including CR-P2-001 (due date must be later than current time), requires an explicit team decision and traceable approval.

## 1. M3 overview and architecture conformance

### 1.1 Purpose and system context

CivicConnect is a community service request management platform. It provides a browser frontend, a Node.js HTTP/JSON API and SQLite persistence. Requesters submit and monitor requests; authorised staff manage request queues and lifecycle changes; Oversight reporting is available through the API. The current browser UI does not provide all planned requester history, staff management or Oversight reporting workflows.

M3 aims to demonstrate traceability from requirements and architecture through implementation, verification and release decisions. Code presence, a passing selected test suite and successful simulated staging checks are distinct kinds of evidence; none alone proves complete requirement acceptance.

### 1.2 Selected architecture

The M2 architecture remains a **modular layered monolith**:

- **Presentation:** `src/frontend/` (HTML, CSS and JavaScript).
- **HTTP/API boundary:** `backend/src/server.js` and `backend/src/http/`.
- **Application orchestration:** `backend/src/application/`.
- **Domain rules:** `backend/src/domain/`.
- **Infrastructure and persistence:** `backend/src/infrastructure/` and `backend/db/`.
- **Persistence store:** SQLite.

The browser communicates with the same-origin server; it does not access SQLite directly. Role/scope checks and lifecycle validation must be enforced on the server. The layered monolith avoids the deployment, network and debugging overhead of distributed services for the current project scale.

### 1.3 Architecturally significant requirements

| Driver | Baseline requirements | Architectural consequence | M3 interpretation |
|---|---|---|---|
| Security / least privilege | FR-001, FR-006, FR-008, FR-012, FR-013, NFR-001, NFR-002 | Authenticate users, enforce backend role/category/request scope, protect sessions and mutation requests | Selected negative/API tests exist; production TLS and broad secret detection are not established by the current evidence |
| Data integrity | FR-008–FR-013, NFR-003 | Transactions, constraints, optimistic version checks, rollback and atomic activity recording | 35 local automated tests include persistence, stale-edit and lifecycle cases; forced-crash recovery is not established |
| Auditability | FR-005, FR-011, FR-013 | Chronological activity and protected audit history coordinated with mutations | Selected backend/system tests exercise activity and internal-note visibility; complete requester history UI remains a gap |
| Maintainability | Core FRs, ASR-004 | Separate HTTP, application, domain and persistence responsibilities | Current repository structure is consistent with the layered design |
| Usability/accessibility | FR-002, FR-004, FR-005, NFR-005, NFR-006 | Clear workflows, keyboard access, visible focus and zoom tolerance | Selected manual checks exist; full WCAG conformance and representative-user usability targets are not demonstrated |
| Performance | FR-007, FR-012, NFR-004 | Efficient reads/writes without unnecessary distributed infrastructure | M3 script tests a limited 200-record dataset, 50 reads and 10 writes; it is not equivalent to the full 5,000-record/20-concurrent-user acceptance workload |
| Availability/recovery | NFR-007, NFR-008 | Health check, backup, recovery and monitoring approach | Simulated staging and backup readability checks are scripted; production monitoring, off-site backup and timed recovery objectives are not established |
| Proportionality | Scope and constraints | Choose the simplest architecture satisfying demonstrated requirements | No replacement of the overall architecture is evidenced |

### 1.4 Architecture conformance conclusion

The current implementation and M3 corrections retain the modular layered monolith and SQLite design. The documented M3 defects concerned server configuration, static-path handling, missing-file response completion, request-reference presentation and mandatory resolution/rejection notes. These are implementation corrections, not evidence of a replacement architecture.

This conclusion is limited to repository evidence reviewed at the snapshot above. A later release candidate must be identified by its exact commit and checked again.

## 2. M2 baseline-to-M3 conformance

### 2.1 Status definitions

- **Implemented:** corresponding code exists.
- **Verified for selected behavior:** named tests/checks passed for the described scope.
- **Partial:** some behavior exists but a complete requirement or user journey is not delivered.
- **Not demonstrated:** available evidence does not prove the acceptance criterion; this does not necessarily mean the feature is absent.
- **Known gap:** repository documentation explicitly records missing functionality.

### 2.2 Conformance summary

| Requirement area | Current evidence | Status / remaining limitation |
|---|---|---|
| FR-001 — authentication and roles | Backend authentication/authorization and automated tests; selected browser logout checks | Selected behavior verified; full security acceptance and production deployment are not implied |
| FR-002/003 — request submission and categories | 35-case local suite, HTTP system journeys, browser submission and reference retests | Selected behavior verified; final candidate must retain the evidence and UI input-retention scope must be checked |
| FR-004/005 — requester history and feedback | API data exists; selected requester status visibility checked | Partial: full activity/history views and all feedback highlights are not established |
| FR-006/008/010 — staff queue, assignment and lifecycle | Automated lifecycle/access tests and browser checks; mandatory resolution/rejection notes corrected and retested | Selected workflows verified; reassignment and full workflow controls remain incomplete |
| FR-007/009 — search/filter/sort, priority and due dates | API operations exist, but complete staff controls are not exposed in the current UI | Partial; do not equate API availability with complete user acceptance |
| FR-011 — work notes and visibility | Backend/system tests exercise internal-note isolation | Partial: complete public/internal note editing and full history UI remain incomplete |
| FR-012 — Oversight reporting | Read-only reporting API | Partial: Oversight browser interface is not implemented |
| FR-013/NFR-003 — audit and data integrity | Transaction/persistence/stale-version/rollback tests and system journeys | Selected behavior verified; forced-crash recovery and complete operational recovery objectives are not established |
| NFR-004 — performance | Person 3 added `npm run perf` smoke-test command and CI step | Limited workload only; full acceptance target (5,000 records, 20 concurrent users, 15 minutes, specified p95 limits) is not demonstrated by this smoke test |
| NFR-005/006 — usability/accessibility | Manual checks covered selected keyboard/focus and 200% zoom interactions | Not fully accepted: longer reference zoom retest, representative-user study and full WCAG compliance are absent |
| NFR-002 — secure transport/secrets | Static/security check script added; static path traversal regression fixed | Limited scan is not a comprehensive secret audit; production TLS is not established |
| NFR-007/008 — availability/recovery | Health endpoint and simulated staging backup verification script | Partial: no evidence of production alerting, off-site backup or timed RTO/RPO recovery |

## 3. Controlled changes, defects and deviations

### 3.1 M3 implementation corrections

| Defect | Baseline problem | Correction / evidence | Status and limit |
|---|---|---|---|
| DEF-M3-001 | Server ignored configured host/port/origin behavior | Before/after integration evidence; server configuration correction included in main | Corrected in repository; recheck in final CI candidate |
| DEF-M3-002 | Static path traversal could expose a file outside the static root | M3-I02 reproduced a 200 response before correction; regression now expects rejection/404 | Corrected in repository; custom scan coverage remains limited |
| DEF-M3-003 | Missing static resource could leave response hanging | M3-I03 reproduced timeout before correction; regression verifies completed missing-file response | Corrected in repository |
| DEF-M3-004 | UI showed an internal REQ-id instead of backend reference | 14 October browser retest confirmed full CC reference in requester/staff queues and staff details | Fixed and retested; original observations preserved |
| DEF-M3-005 | Blank resolution/rejection notes could bypass meaningful reason capture | 14 October browser retests confirmed blank notes are blocked and supplied summaries/reasons permit transitions | Fixed and retested; original failure preserved |
| DEF-M3-006 | Full requester activity/history and Oversight reporting workflows missing | API capability exists for some data/reporting; complete UI is not present | **Open**; affects complete scope/acceptance and requires a team decision |

### 3.2 Architecture decisions carried forward

- **DES-001:** retain a shared Request model and data-driven category validation rather than Factory Method classes because categories are currently labels, not distinct behavioral subclasses. Revisit only if category-specific behavior materially diverges.
- **DES-002:** retain direct application-service coordination for the mandatory audit/activity reaction rather than introducing an Observer mechanism for a single fixed reaction. Revisit if multiple independent reactions or external integrations are introduced.

These are M2 decisions carried into M3, not newly invented M3 decisions.

### 3.3 Requirement change and residual gaps

CR-P2-001 proposes that due dates must be strictly later than the current time. The implementation and test oracle follow that rule, but the PED records the requirement change as awaiting a formal team decision. Passing a test for the implemented rule does not constitute approval of the change.

GAP-001 to GAP-005 concern incomplete requester history/feedback, staff filtering/reassignment/scheduling/note controls and Oversight UI. GAP-006 to GAP-008 concern production TLS, full performance/recovery evidence and CI/release gate verification. These remain visible until resolved or formally accepted as limitations.

## 4. Construction and configuration

### 4.1 Repository responsibility map

| Area | Path | Responsibility |
|---|---|---|
| Frontend | `src/frontend/` | Browser interaction and same-origin API calls |
| HTTP/server | `backend/src/server.js`, `backend/src/http/` | Server startup, HTTP routing, origin/CSRF and response handling |
| Application | `backend/src/application/` | Use-case orchestration and request operations |
| Domain | `backend/src/domain/` | Input and lifecycle policy |
| Persistence | `backend/src/infrastructure/`, `backend/db/` | SQLite access, schema, transactions and version checks |
| Tests | `backend/tests/` | Unit/component, integration and HTTP/system cases |
| Quality evidence | `backend/docs/quality/m3/` | Test plan, matrix, before/after TAP, run manifest, browser checks and defects |
| CI | `.github/workflows/ci.yml` | Automated quality gate definition |
| Engineering records | `docs/`, `AI_Usage_Register.md` | Architecture, requirements, decisions, risks and AI disclosure |

### 4.2 Reproducible local commands

Run from `backend/` using Node.js 24.19.0 or a compatible later 24.x release:

```bash
npm ci --ignore-scripts
npm run setup
npm test
npm run check
npm run staging:verify
npm run perf
npm start
```

The setup command creates local SQLite data and prints generated demo passwords once. Store those credentials privately and do not commit them. `npm run staging:verify` runs a local simulated staging journey on a separate port; it does not provision public cloud or production infrastructure.

### 4.3 Configuration and security boundaries

- Defaults use loopback binding and a local SQLite file. A staging example uses a separate port/database.
- `COOKIE_SECURE=false` is suitable only for local HTTP testing. Setting it to true does not install TLS; production TLS needs an actual HTTPS proxy/termination configuration.
- Keep databases, backups, generated credentials and environment-specific secrets out of version control.
- Mutation requests use origin/CSRF checks. Backend authorization remains authoritative; hiding a frontend control is not a security boundary.
- The custom `npm run check` script checks JavaScript syntax, selected code patterns, selected secret patterns and `npm audit`. It is not a comprehensive security assessment or universal secret scanner.
- A local backup and successful readability check do not prove off-site retention, forced-crash recovery, RTO or RPO compliance.

## 5. Automated verification

### 5.1 Test scope and recorded result

The M3 suite contains **35 top-level cases**: 24 retained M2 cases and 11 M3 additions. The additions include six pure unit cases, three actual-server integration cases and two HTTP system journeys. The local run recorded on 14 October 2026 used Windows with Node.js 24.20.0 and reported 35 passed, 0 failed, 0 cancelled and 0 skipped in 10,445.88 ms. The frontend JavaScript syntax check passed.

Evidence is retained in `backend/docs/quality/m3/test-plan.md`, `test-matrix.csv`, `before-fix.tap`, `after-fix.tap` and `run-manifest.json`. The local result describes that tested candidate; it must not be represented as a hosted CI run or final release SHA.

### 5.2 Coverage interpretation

The suite prioritises requester ownership, staff category permissions, request lifecycle, mandatory reasons, atomic history, stale edits and the actual HTTP entry point. It includes boundary value analysis, equivalence partitioning, state-transition checks and negative access tests.

The 35-case suite is selected evidence, not proof that all acceptance criteria pass. In particular, a backend HTTP system journey is not the same as a complete browser user journey, usability study or full operational recovery test.

## 6. Applied quality strategy

Risk-based testing prioritises confidentiality, data integrity and workflow correctness:

- **Equivalence partitioning:** valid versus invalid categories, identifiers, enum values and required fields.
- **Boundary value analysis:** title, description, location and due-time boundaries.
- **State-transition testing:** valid lifecycle order, terminal states and mandatory rejection/resolution notes.
- **Negative authorization testing:** cross-requester reads and out-of-scope staff actions.
- **Integration/system testing:** actual server process, session cookie, CSRF/origin handling and persistent SQLite state.
- **Browser checks:** selected form validation, isolation, lifecycle, reference display, logout, keyboard/focus and zoom interactions.
- **Static/security checks:** syntax and selected code rules, repository hygiene and dependency audit script.

Coverage limits are explicit: browser/version metadata was not reliably recorded; longer request references have not been retested at 200% zoom; full WCAG conformance and representative-user usability targets are not demonstrated.

## 7. Black-box, integration and system validation

### 7.1 Automated journeys

- **M3-S01:** login, request submission, staff assignment, internal note, progress, resolution, closure, requester-visible projection and logout.
- **M3-S02:** invalid submission, isolation checks, rejection reason and stale-edit conflict.

Both journeys use a real server process, synthetic accounts, isolated disk databases and HTTP sessions. They are HTTP system journeys, not browser automation.

### 7.2 Browser evidence

Edward's recorded browser checks on 12–13 October covered required-input handling, submission, requester and staff queue isolation, assignment, lifecycle transitions, logout and selected keyboard/focus/200% zoom interactions. The initial failures for request-reference display and blank resolution/rejection notes were preserved.

Correction retests on 14 October confirmed the full backend CC reference in requester/staff queues and staff details. Blank resolution and rejection notes were blocked without changing status; supplied summaries and reasons allowed the transitions. The frontend syntax check and 35 automated tests passed on the recorded local candidate.

### 7.3 Remaining validation gaps

DEF-M3-006 remains open: complete requester activity/history and Oversight reporting UI are not established. Direct-resource browser isolation, complete public/internal history, representative-user usability, full WCAG compliance and final-candidate browser rechecks are not all established by the current evidence.

## 8. CI, simulated staging, performance and release controls

### 8.1 CI quality gate

Person 3's merged `.github/workflows/ci.yml` defines a GitHub Actions job on push and pull request. It installs from the lockfile with Node.js 24.19.0, then runs:

1. `npm run check`
2. `npm test`
3. `npm run staging:verify`
4. `npm run perf`

**Evidence status:** The workflow definition exists in the repository. At the time this document was prepared, the available GitHub workflow-run/status lookup returned no run associated with the reviewed merge commit. Therefore this PED does **not** claim a successful hosted CI run. The team must link the actual successful workflow run for the final PR/release candidate.

### 8.2 Simulated staging and backup

The staging verification script creates an isolated local database/server, exercises a requester-to-staff lifecycle, checks requester visibility of the final closed state and internal-note isolation, and verifies a backup snapshot is readable. This is useful repeatable simulated-staging evidence. It is not a deployed staging environment, public HTTPS verification, off-site backup proof or a timed disaster-recovery test.

### 8.3 Performance evidence and limitation

The performance script is a workload smoke test using 200 pre-seeded requests, 10 writes and 50 reads. It reports average, p95 and maximum latency and fails if observed p95 exceeds the configured limits.

This workload is materially smaller than NFR-004's acceptance scenario of 5,000 active records, 20 concurrent users and a 15-minute steady-state mix. No result from the smaller smoke test should be described as proof that the full NFR-004 criterion passes. The actual run output for the final candidate must be retained and the full acceptance workload still needs evidence.

### 8.4 Release controls

The final candidate SHA, actual workflow URL/result, branch protection/required checks, peer review outcomes, staging evidence and release-readiness decision must be recorded before approval. A merged PR or a defined workflow alone is not evidence that all controls passed.

## 9. Defects, residual risks and readiness

### 9.1 Defect summary

- **DEF-M3-001 to DEF-M3-003:** server configuration, static path traversal and hanging missing-resource response; baseline failures and regression corrections are recorded.
- **DEF-M3-004 to DEF-M3-005:** request-reference display and mandatory status-note validation; browser correction retests passed on the recorded local candidate.
- **DEF-M3-006:** incomplete requester activity/history and Oversight reporting UI; remains open and affects complete scope acceptance.

### 9.2 Residual risks

| Risk / gap | Current position | Required next evidence or decision |
|---|---|---|
| Full UI scope | Requester history/feedback and Oversight screens incomplete; several staff controls are not exposed | Agree whether to implement within scope or record a formal accepted limitation |
| Hosted CI | Workflow definition merged; no run result was available to this review | Link successful run for final candidate and resolve failures if any |
| Performance | Small smoke-test command exists | Run and retain result; execute the full NFR-004 workload or explicitly record deviation |
| Security | Static-path regression and limited custom scan exist | Review scan limits, record dependency-audit result, establish TLS for any non-local deployment |
| Recovery | Local backup/readability check exists | Demonstrate restore/recovery and evaluate RTO/RPO; do not claim production monitoring |
| Usability/accessibility | Selected browser checks exist | Recheck on final candidate; document browser/version, full zoom and representative-user evidence |
| Change control | CR-P2-001 is implemented in test oracle but approval is pending | Record explicit team decision and update requirements/RTM consistently |
| Final baseline | M3 handoffs and CI changes are merged, but this document is a review candidate | Identify exact tested release SHA and obtain genuine team review/approval |

### 9.3 Readiness statement

The repository contains useful M3 implementation corrections, 35 passing local automated tests on the recorded candidate, selected browser retests and a defined CI/staging/performance pipeline. The reviewed evidence does **not** establish final release readiness: no hosted workflow result was available for the reviewed merge SHA, the full performance workload is not demonstrated, DEF-M3-006 remains open, and production TLS, timed recovery and complete usability/accessibility acceptance remain unproven.

The team should not label this PED or the application “accepted” until these decisions and evidence gaps are addressed or formally accepted by the responsible team members.

## Sources and evidence navigation

- [PED v2.0 — M1/M2 baseline](PED_v2.0.md)
- [Person 1 architecture handoff](m3-person1-handoff.md)
- [Architecture](../../architecture.md) and [continued architecture](../../architecture_continued.md)
- [Design patterns](../decisions/design-patterns.md) and [design quality](../design-quality.md)
- [Person 2 M3 test plan](../../backend/docs/quality/m3/test-plan.md)
- [Person 2 quality evidence README](../../backend/docs/quality/m3/README.md)
- [Person 2 M3 handoff](../../backend/docs/quality/m3/PED-handoff.md)
- [Browser acceptance evidence](../../backend/docs/quality/m3/browser-acceptance.md)
- [CI workflow](../../.github/workflows/ci.yml)
- [AI Usage Register](../../AI_Usage_Register.md)

**Maintenance rule:** preserve PED v1.0 and v2.0 as historical baselines. Update this M3 document, the RTM, defect/debt registers and decision records together when a requirement, implementation, verification result or release decision changes.
