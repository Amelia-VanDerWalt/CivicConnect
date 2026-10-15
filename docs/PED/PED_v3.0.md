# Project Engineering Document v3.0 — CivicConnect M3

**Document status:** Consolidated review candidate; team approval still required  
**Baseline:** PED v2.0 and the original M1 requirements  
**Repository baseline:** Person 3's merged contribution, PR #25, merge commit `4e988dcb8890dda9b15442ae4d4c2fe2ca3b2263`  
**Team:** Amelia van der Walt, Edward Goosen, Albert Du Plooy  
**Purpose:** Consolidate the Person 1 architecture/conformance work, Person 2 verification evidence and Person 3 CI/deployment/performance/release evidence into one M3 PED. PED v1.0 and v2.0 remain historical records.

## Document control

| Version | Change | Status |
|---|---|---|
| 3.0 review candidate | M3 architecture/conformance, defects and controlled changes, construction/configuration, testing, CI, staging, performance and release readiness | Requires team review; not final production approval |

This document preserves the M2 baseline rather than silently rewriting it. CR-P2-001 (due date must be later than the current time) remains subject to a recorded team decision. The final tested commit and release classification must be recorded before the team declares M3 accepted.

## 1. M3 overview and architecture conformance

### 1.1 System and milestone objective

CivicConnect is a community service request management platform with a browser frontend, Node.js HTTP/JSON API and SQLite persistence. Requesters submit and monitor requests; authorised Staff manage request queues and lifecycle changes; Oversight reporting is available through the API. The complete requester history/feedback UI and Oversight browser interface are not implemented in the current evidence.

M3 must show traceability from requirements and architecture to implementation, tests, operational checks and release decisions. Code presence, local test success, hosted CI success and full requirement acceptance are different claims and must not be conflated.

### 1.2 Architecture carried forward from M2

The selected architecture remains a **modular layered monolith**:

- **Presentation:** `src/frontend/` (HTML, CSS and JavaScript).
- **HTTP/API boundary:** `backend/src/server.js` and `backend/src/http/`.
- **Application orchestration:** `backend/src/application/`.
- **Domain rules:** `backend/src/domain/`.
- **Infrastructure/persistence:** `backend/src/infrastructure/` and `backend/db/`.
- **Data store:** SQLite.

The browser communicates with the same-origin server and does not access SQLite directly. Server-side authorization and lifecycle checks remain authoritative. The modular monolith avoids unnecessary distributed-service deployment and network complexity at this project's current scale.

### 1.3 Architecturally significant requirements

| Driver | Requirements | Design implication | M3 interpretation |
|---|---|---|---|
| Security and least privilege | FR-001, FR-006, FR-008, FR-012, FR-013, NFR-001, NFR-002 | Authentication, role/scope checks, protected mutation requests and secret hygiene | Static/security checks and selected negative tests pass in reported CI evidence; production TLS is not established |
| Data integrity | FR-008–FR-013, NFR-003 | SQLite constraints, transactions, optimistic version checks, rollback and atomic activity recording | Selected persistence/stale-edit/lifecycle cases are covered; forced-crash recovery is not proven |
| Auditability | FR-005, FR-011, FR-013 | Record important actions with actor/context and coordinate activity with mutations | Selected tests and staging checks exist; full requester history UI remains a gap |
| Maintainability | Core FRs, ASR-004 | Separate HTTP, application, domain and persistence responsibilities | Repository structure is consistent with the layered design |
| Usability/accessibility | FR-002, FR-004, FR-005, NFR-005, NFR-006 | Understandable workflows, keyboard access, visible focus and zoom tolerance | Selected browser checks exist; full WCAG conformance and representative-user usability are not demonstrated |
| Performance | FR-007, FR-012, NFR-004 | Efficient request-list/report operations without premature distributed architecture | A small workload smoke test passes; full NFR-004 scale is not demonstrated |
| Availability/recovery | NFR-007, NFR-008 | Health check, backup and documented recovery approach | Simulated staging verifies backup integrity; production monitoring, off-site backup and timed RTO/RPO are not established |
| Proportionality | Scope and project constraints | Choose the simplest design that satisfies evidenced requirements | No overall architecture replacement is evidenced |

### 1.4 Architecture conformance conclusion

The M3 implementation and CI work retain the modular layered monolith and SQLite design. The recorded corrections address server configuration, static-path traversal, missing-resource response completion, request-reference presentation and mandatory resolution/rejection notes. These are implementation fixes, not evidence of a new overall architecture.

## 2. M2 baseline-to-M3 conformance

### 2.1 Status meanings

- **Implemented:** corresponding code exists.
- **Verified for selected behaviour:** named automated or manual checks pass for the described scope.
- **Partial:** some behaviour exists, but the complete requirement or user journey is not delivered.
- **Not demonstrated:** evidence does not prove acceptance; this is not necessarily proof that functionality is absent.
- **Known gap:** repository records explicitly identify missing functionality.

### 2.2 Conformance summary

| Requirement area | Evidence and implementation position | Status / limitation |
|---|---|---|
| FR-001 — authentication and roles | Backend session authentication/authorization, automated tests and selected browser logout checks | Selected behaviour verified; this does not establish complete security acceptance |
| FR-002/FR-003 — submission and categories | Automated tests, HTTP system journeys and browser submission checks | Selected behaviour verified |
| FR-004/FR-005 — requester history and feedback | API data and selected requester status visibility | Partial: complete activity/history views and all feedback highlights are not established |
| FR-006/FR-008/FR-010 — staff queue, assignment and lifecycle | Automated access/lifecycle tests, simulated staging journey, request-reference and mandatory-note retests | Selected workflows verified; reassignment and full workflow controls remain incomplete |
| FR-007/FR-009 — search/filter/sort, priority and due dates | API operations exist but complete Staff controls are not exposed in the current UI | Partial; API availability is not complete user acceptance |
| FR-011 — work notes and visibility | Backend tests and staging check that internal Staff notes are not exposed to Requesters | Partial: complete note editing/history UI remains incomplete |
| FR-012 — Oversight reporting | Read-only reporting API | Partial: Oversight browser interface is absent |
| FR-013/NFR-003 — audit and integrity | Transaction/persistence/stale-version/rollback tests and staging journey | Selected behaviour verified; forced-crash recovery and full recovery objectives not established |
| NFR-004 — performance | Hosted smoke-test evidence for 200 seeded records, 50 reads and 10 writes | Small-workload target passed; formal 5,000-record/20-user/15-minute scenario not demonstrated |
| NFR-005/NFR-006 — usability/accessibility | Selected keyboard/focus and 200% zoom interactions | Partial; longer-reference zoom retest, representative-user study and full WCAG conformance are absent |
| NFR-002 — secure transport/secrets | Static/security checks, repository hygiene and dependency audit | Limited scan passed; production TLS and comprehensive secret scanning are not established |
| NFR-007/NFR-008 — availability/recovery | Health endpoint and simulated staging backup/integrity verification | Partial; production alerting, off-site backup and timed RTO/RPO not demonstrated |

## 3. Controlled changes, defects and deviations

### 3.1 M3 defect and correction record

| ID | Issue | Correction / evidence | Status |
|---|---|---|---|
| DEF-M3-001 | Server ignored configurable host/port/origin behaviour | Server configuration correction and before/after integration evidence | Corrected in repository; recheck on final candidate |
| DEF-M3-002 | Static path traversal could access outside the intended static root | Regression test now expects rejection/404 after correction | Corrected in repository; custom scan remains limited |
| DEF-M3-003 | Missing static resource could leave the response hanging | Regression verifies the missing-file response completes | Corrected in repository |
| DEF-M3-004 | UI displayed internal REQ ID rather than full backend request reference | Browser retest confirmed full CC reference in requester/staff queues and staff details | Corrected and retested on recorded candidate |
| DEF-M3-005 | Blank resolution/rejection notes could bypass meaningful reason capture | Browser retests confirmed blank notes blocked without status change; valid summary/reason permits transition | Corrected and retested on recorded candidate |
| DEF-M3-006 | Complete requester activity/history and Oversight reporting UI not established | Existing API capabilities do not complete the browser user journeys | **Open**; team must decide whether release-blocking or formally accepted for demo scope |

### 3.2 Architecture decisions carried forward

- **DES-001 — category-dependent request creation:** retain a shared Request model and data-driven category validation rather than Factory Method classes because categories are data labels rather than distinct behavioural subclasses. Revisit only if category-specific behaviour materially diverges.
- **DES-002 — state change and audit coordination:** retain direct application-service coordination for the mandatory activity/audit write rather than Observer for a single fixed reaction. Revisit if multiple independent reactions or external integrations are introduced.

These are M2 decisions carried forward, not new M3 architecture changes.

### 3.3 Requirement change and residual gaps

CR-P2-001 proposes that due dates must be strictly later than the current time. The implementation/test oracle follows that rule, but the available records say formal team approval is pending. Passing a test for the implemented rule does not constitute approval of the requirement change.

Other gaps include incomplete requester history/feedback, Staff filtering/reassignment/scheduling/note controls, Oversight UI, full NFR-004 workload, production TLS, timed recovery and complete usability/accessibility evidence. Keep these visible until resolved or formally accepted.

## 4. Construction and configuration

### 4.1 Repository responsibilities

| Area | Location | Responsibility |
|---|---|---|
| Frontend | `src/frontend/` | Browser interaction and same-origin API calls |
| HTTP/server | `backend/src/server.js`, `backend/src/http/` | Startup, HTTP routes, origin/CSRF and response handling |
| Application | `backend/src/application/` | Use-case orchestration and request operations |
| Domain | `backend/src/domain/` | Input validation and lifecycle policy |
| Persistence | `backend/src/infrastructure/`, `backend/db/` | SQLite access, schema, transactions and version checks |
| Tests | `backend/tests/` | Unit/component, integration and HTTP/system verification |
| M3 quality evidence | `backend/docs/quality/m3/` | Test plan, matrix, before/after TAP, browser evidence and run manifest |
| CI workflow | `.github/workflows/ci.yml` | Automated quality gate definition |
| M3 handoffs | `docs/PED/m3-person1-handoff.md`, `docs/PED/m3-albert-handoff.md`, `backend/docs/quality/m3/PED-handoff.md` | Person 1, Person 3 and Person 2 evidence |

### 4.2 Repository/review controls

Person 3's handoff records feature/fix branches and pull requests, two approving reviews by team members other than the author, and the required status check named **Build, Static/Security, Tests, Staging & Perf Gate**. It also records substantive review on PR #23 and a correction to process cleanup after feedback. The team should verify that these branch-protection settings remain enabled on the final candidate.

### 4.3 Configuration and local commands

Runtime configuration is documented through environment variables including `HOST`, `PORT`, `APP_ORIGIN`, `DB_PATH` and `COOKIE_SECURE`. The simulated staging example uses a separate port/database. Run from `backend/` with Node.js 24.19.0 or compatible later 24.x:

```bash
npm ci --ignore-scripts
npm run setup
npm test
npm run check
npm run staging:verify
npm run perf
npm start
```

Setup creates local SQLite data and prints generated demo passwords once. Store credentials privately and never commit them. Simulated staging is a local verification environment, not a public cloud deployment.

### 4.4 Security and configuration limits

- Keep databases, backups, generated credentials and environment-specific secrets out of version control.
- `COOKIE_SECURE=false` is for local HTTP testing only. Setting it to true does not itself configure TLS.
- Backend authorization is authoritative; hiding a frontend control is not an access-control boundary.
- `npm run check` performs syntax/static checks, repository hygiene checks, selected secret-pattern checks and `npm audit --audit-level=high`. It is not a comprehensive security assessment.
- Production HTTPS/TLS, public hosting, production monitoring and off-site backup are not established by the current evidence.

## 5. CI and automated verification

### 5.1 Workflow and gate

The workflow `.github/workflows/ci.yml` is named **CivicConnect M3 CI & Quality Gate**. It runs on push and pull-request events, uses GitHub Actions with Node.js 24.19.0, and runs these steps in `backend/`:

1. Clean dependency installation via `npm ci --ignore-scripts`.
2. Static/security/dependency checks via `npm run check`.
3. Automated regression via `npm test`.
4. Simulated staging E2E and backup verification via `npm run staging:verify`.
5. Performance smoke test via `npm run perf`.

A failing command fails the job. The workflow definition is merged; this is distinct from the result of a particular workflow run.

### 5.2 Reported successful CI run

Person 3's merged handoff records **GitHub Actions run #11** as successful on the then-current main baseline `53bf185a2938d20df5d0d12a1a3ea120d635d6f5`. Reported results:

- Static/security checks: **PASS**.
- Automated regression suite: **35/35 PASS**.
- Simulated staging E2E: **PASS**.
- Backup snapshot integrity/readability: **PASS**.
- Performance smoke test: **PASS**.

The run evidence was reported in the merged Person 3 handoff. The final submission should include a direct URL to run #11 and a fresh successful run for the exact final M3 release-candidate SHA. The run's success does not establish full requirement acceptance or production readiness.

### 5.3 Automated suite

Person 2's recorded local suite contains **35 top-level cases**: 24 retained M2 cases and 11 M3 additions (six unit, three actual-server integration and two HTTP system journeys). The 14 October local run on Windows/Node.js 24.20.0 recorded 35 passed, 0 failed, 0 cancelled and 0 skipped in 10,445.88 ms; frontend JavaScript syntax also passed. This is local evidence and should not be represented as a hosted CI run.

See `backend/docs/quality/m3/test-plan.md`, `test-matrix.csv`, `before-fix.tap`, `after-fix.tap` and `run-manifest.json`.

## 6. Applied quality strategy

Testing prioritises confidentiality, data integrity and workflow correctness:

- **Equivalence partitioning:** valid/invalid categories, identifiers, enum values and required fields.
- **Boundary value analysis:** title, description, location and due-time boundaries.
- **State-transition testing:** lifecycle order, terminal states and mandatory resolution/rejection reasons.
- **Negative authorization testing:** cross-requester reads and out-of-scope Staff actions.
- **Integration/system testing:** real server process, session cookie, CSRF/origin handling and persistent SQLite state.
- **Browser checks:** selected form validation, isolation, lifecycle, reference display, logout, keyboard/focus and zoom interactions.
- **Static/security checks:** syntax and selected code rules, repository hygiene and dependency audit.

Selected test success is not proof that every acceptance criterion passes. Browser/version metadata was not reliably recorded, longer request references have not been retested at 200% zoom, and full WCAG/representative-user acceptance is not demonstrated.

## 7. Black-box, integration and system validation

### 7.1 Automated journeys

- **M3-S01:** login, submission, assignment, internal note, progress, resolution, closure, requester-visible projection and logout.
- **M3-S02:** invalid submission, isolation checks, rejection reason and stale-edit conflict.

Both use a real server process, synthetic accounts, isolated disk databases and HTTP sessions. They are HTTP system journeys, not browser automation.

### 7.2 Browser evidence

Recorded browser checks on 12–13 October covered required-input handling, submission, requester/staff queue isolation, assignment, lifecycle transitions, logout and selected keyboard/focus/200% zoom interactions. Initial failures around request references and blank resolution/rejection notes were retained. Retests on 14 October confirmed the full CC reference and blocked blank notes without changing status; valid summaries/reasons allowed the transitions.

### 7.3 Remaining validation gaps

DEF-M3-006 remains open. Direct-resource browser isolation, complete public/internal history, representative-user usability, full WCAG conformance, longer-reference zoom and final-candidate browser rechecks are not all established by the available evidence.

## 8. Performance and reliability

### 8.1 Workload and measured results

Person 3's `backend/scripts/perf-check.js` runs the real server against an isolated SQLite database in WAL mode. It measures authenticated Staff queue read/filter operations and Requester request-creation writes.

| Measure | Reported CI result |
|---|---:|
| Dataset | 200 seeded requests + 10 live writes |
| Total measured workload duration | 873.93 ms |
| Reads successful | 50/50 |
| Read average | 3.38 ms |
| Read p95 | 3.86 ms |
| Read maximum | 11.87 ms |
| Writes successful | 10/10 |
| Write average | 3.70 ms |
| Write p95 | 5.72 ms |
| Write maximum | 5.72 ms |

The small workload passed its configured read p95 threshold of 2,000 ms and write p95 threshold of 3,000 ms.

### 8.2 Interpretation

These results demonstrate responsiveness for the selected small workload only. They do **not** prove NFR-004's formal target of 5,000 active records, 20 concurrent users and a 15-minute steady-state workload. `TD-M3-001` remains relevant because list/report filtering occurs in application memory and does not use pagination.

### 8.3 Staging, backup and rollback

The simulated staging script runs the real server on a separate port with an isolated SQLite database, checks the UI and `/health`, exercises a Requester → Staff → Requester lifecycle, verifies internal-note isolation and creates a backup snapshot. Reported checks include SQLite `PRAGMA integrity_check` and confirmation that the completed request remains in the backup.

Documented rollback approach: identify the last accepted Git candidate, retain a consistent SQLite backup, stop a failed candidate, return to the previous accepted code revision, restore the snapshot if needed, and rerun health and critical-journey checks. This does not prove production RTO/RPO, off-site disaster recovery or timed recovery.

## 9. Defects, residual risks and technical debt

| Risk / gap | Current evidence | Required action |
|---|---|---|
| DEF-M3-006 — incomplete UI histories/reporting | API supports some data/reporting; complete requester history and Oversight browser UI not established | Team decides whether this blocks M3 scope or formally accepts it as a demo limitation |
| CR-P2-001 — due-date rule | Test oracle follows future-date rule; formal decision pending in handoff | Record team decision and align requirements/RTM |
| NFR-004 performance | Small workload smoke test passed | Run formal 5,000-record/20-user/15-minute workload or record approved deviation |
| TLS / deployment | Local/simulated staging only | Configure and verify TLS before any non-local production claim |
| Recovery | Backup integrity/readability check passes | Demonstrate restore and assess RTO/RPO/off-site retention |
| Usability/accessibility | Selected manual checks | Recheck final candidate; record browser/version and complete required acceptance evidence |
| Security scanning | Custom static and selected secret checks pass | Preserve limitations; perform additional review if required by scope |
| Final candidate | Run #11 relates to earlier main baseline | Record exact release SHA and attach a fresh passing CI run for that SHA |

### 9.1 Readiness position

Person 3's handoff recommends **CONDITIONALLY READY for controlled M3 staging/demo**, subject to team confirmation, not unconditional production readiness. That classification is defensible only if the team formally decides DEF-M3-006 is non-blocking for the agreed demo scope. If the missing UI is release-blocking, the correct classification is **NOT READY** until resolved.

The current evidence supports passing selected automated, CI, simulated staging and small-scale performance checks. It does not establish complete requirement acceptance, the formal NFR-004 workload, production TLS, timed recovery or complete accessibility/usability acceptance.

## 10. Release-readiness decision

Before approving the release, the team must:

- [ ] Identify the exact final M3 release-candidate SHA/tag.
- [ ] Link GitHub Actions run #11 and attach a fresh successful CI run for the final candidate.
- [ ] Confirm the required status check and two-review branch-protection controls are still enabled.
- [ ] Align the RTM, risk register, defect register and technical-debt register with the final candidate.
- [ ] Record the team's decision on DEF-M3-006 and CR-P2-001.
- [ ] Decide whether full NFR-004 load, TLS, timed recovery and accessibility/usability evidence are required before this submission.
- [ ] Obtain actual team review and record the final **READY / CONDITIONALLY READY / NOT READY** decision.

**Current document status:** consolidated review candidate, not an approved release decision.

## Evidence and supporting documents

- [PED v2.0 — M1/M2 baseline](PED_v2.0.md)
- [Person 1 architecture/conformance handoff](m3-person1-handoff.md)
- [Person 2 verification handoff](../../backend/docs/quality/m3/PED-handoff.md)
- [Person 3 CI/deployment/release handoff](m3-albert-handoff.md)
- [Person 2 test plan](../../backend/docs/quality/m3/test-plan.md)
- [Browser acceptance evidence](../../backend/docs/quality/m3/browser-acceptance.md)
- [CI workflow](../../.github/workflows/ci.yml)
- [GitHub Actions runs](https://github.com/Amelia-VanDerWalt/CivicConnect/actions)
- [PR #23 — CI pipeline](https://github.com/Amelia-VanDerWalt/CivicConnect/pull/23)
- [PR #25 — Person 3 handoff, merged](https://github.com/Amelia-VanDerWalt/CivicConnect/pull/25)

Preserve PED v1.0 and v2.0 as historical baselines. Update this PED, the RTM, registers and decision records together whenever a requirement, implementation, verification result or release decision changes.
