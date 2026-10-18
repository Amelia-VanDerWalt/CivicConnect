# Project Engineering Document v4.0 — CivicConnect Final Project (DRAFT)

**Document status:** M4 consolidation draft — final baseline, acceptance and team approval pending  
**Baseline:** PED v3.0 continued into v4.0; original M1 acceptance criteria remain the scope baseline  
**Historical M3 evidence baseline:** Person 3's merged contribution, PR #25, merge commit `4e988dcb8890dda9b15442ae4d4c2fe2ca3b2263`; current M4 evidence is reconciled below  
**Team:** Amelia van der Walt, Edward Goosen, Albert Du Plooy  
**Purpose:** Consolidate the Person 1 architecture/conformance work, Person 2 verification evidence and Person 3 CI/deployment/performance/release evidence into one M4 PED. PED v1.0, v2.0 and v3.0 remain historical records.

## Document control

| Version | Change | Status |
|---|---|---|
| v1.0 | Original PED and M1 requirements baseline; retained as historical record | Historical — superseded, not deleted |
| v2.0 | M2 architecture, design, requirements traceability and engineering baseline | Historical — superseded, not deleted |
| v3.0 review candidate | Consolidated M3 architecture/conformance, defects, testing, CI, staging, performance and release evidence | Historical M3 record |
| v4.0 draft | Updated M4 scope, acceptance, workflows, measured verification and closure reflection | Pending final SHA/CI, release decision and team approval |

This document preserves the M1/M2 baselines rather than silently rewriting them. CR-P2-001 (due date must be later than the current time) remains subject to a recorded team decision. The final tested commit and release classification must be recorded before the team declares M3 accepted.

## Historical M3 submission information

- **Team:** Amelia van der Walt, Edward Goosen and Albert Du Plooy.
- **Repository:** [CivicConnect on GitHub](https://github.com/Amelia-VanDerWalt/CivicConnect).
- **PED version:** v3.0 review candidate; team approval remains pending.
- **Final release-candidate SHA/tag:** **Pending.** Do not substitute the earlier baseline SHA for the final candidate. Record the exact submitted commit and tag, if created, after the final candidate is identified.
- **RTM location:** [Current machine-readable M3 RTM](../../backend/docs/requirements/rtm-data.json); PED v2.0 Section 7 remains the historical M2 RTM baseline. Reconcile the current M3 rows with the exact final candidate before acceptance.
- **CI/test evidence:** [GitHub Actions workflow runs](https://github.com/Amelia-VanDerWalt/CivicConnect/actions), [M3 test plan](../../backend/docs/quality/m3/test-plan.md), [test matrix](../../backend/docs/quality/m3/test-matrix.csv), [before-fix results](../../backend/docs/quality/m3/before-fix.tap), [after-fix results](../../backend/docs/quality/m3/after-fix.tap), and [run manifest](../../backend/docs/quality/m3/run-manifest.json). Run #11 is evidence for its recorded earlier baseline only; a fresh successful run for the final candidate is still required.
- **Staging/demo instructions:** From `backend/`, use Node.js 24.19.0 or a compatible later 24.x release, then run `npm ci --ignore-scripts`, `npm run setup`, `npm test`, `npm run check`, `npm run staging:verify`, `npm run perf`, and `npm start`. Use only local/synthetic demo data and privately generated credentials. `staging:verify` is simulated local staging, not a production deployment. Verify these instructions against the final candidate before submission.
- **Submission date:** 15 October 2026 (planned/documentation date; confirm the actual submission date when the team submits).

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
| Total measured workload duration | 943.37 ms |
| Reads successful | 50/50 |
| Read average | 4.51 ms |
| Read p95 | 6.81 ms |
| Read maximum | 13.08 ms |
| Writes successful | 10/10 |
| Write average | 5.05 ms |
| Write p95 | 9.99 ms |
| Write maximum | 9.99 ms |

These figures are the measurements reported for GitHub Actions run #11 on baseline commit [`53bf185a2938d20df5d0d12a1a3ea120d635d6f5`](https://github.com/Amelia-VanDerWalt/CivicConnect/commit/53bf185a2938d20df5d0d12a1a3ea120d635d6f5). The [GitHub Actions runs page](https://github.com/Amelia-VanDerWalt/CivicConnect/actions) provides the workflow history; the run-specific URL still needs confirmation because the available evidence identifies the run number and commit but not its Actions run ID. The small workload passed its configured read p95 threshold of 2,000 ms and write p95 threshold of 3,000 ms.

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

## 10. Release Evidence Summary

| Evidence area | Evidence currently recorded | Interpretation | Outstanding action / owner |
|---|---|---|---|
| Build / CI | Workflow `CivicConnect M3 CI & Quality Gate`; run #11 reported successful on baseline `53bf185a2938d20df5d0d12a1a3ea120d635d6f5` | The workflow and that baseline's reported run provide CI evidence, not proof for a later candidate | Run the required gate on the exact final candidate SHA and link that run — Person 3 / release owner |
| Regression | 35/35 automated tests reported passing locally on 14 October 2026; run #11 handoff reports 35/35 in CI | Supports the tested cases only; local and hosted evidence are distinct | Preserve environment/run metadata and verify candidate commit — Person 2 and Person 3 |
| API / integration | Three actual-server integration tests and two HTTP system journeys are described in the M3 evidence | Selected server, session, origin/CSRF and persistence paths are exercised; not every API or role path is proven | Map evidence to RTM and review uncovered endpoints — Person 2 |
| System / E2E | Two HTTP system journeys and recorded manual browser retests; simulated staging lifecycle and backup checks reported | Selected journeys pass according to the recorded evidence; not full browser automation or complete user acceptance | Repeat critical browser checks against final candidate and record browser/version — Person 2, with team review |
| Static / security | `npm run check` reportedly passed static/syntax, repository hygiene, selected secret-pattern and dependency-audit checks | Limited checks passed; this is not a full security assessment and does not prove production TLS | Verify the final CI result and complete deployment security checks before any production claim — Person 3 |
| Performance | Run #11: total 943.37 ms; read avg/p95/max 4.51/6.81/13.08 ms; write avg/p95/max 5.05/9.99/9.99 ms | Small workload of 200 seeded requests and 50 reads/10 writes only; formal NFR-004 workload remains unverified | Execute 5,000-record, 20-concurrent-user, 15-minute workload or record a formally approved deviation — Person 3 |
| Defects | `DEF-M3-001` to `DEF-M3-005` reported corrected/covered by selected retests; `DEF-M3-006` remains open | Fix evidence does not equal complete requirement acceptance; history/reporting UI remains incomplete | Team to decide whether `DEF-M3-006` blocks M3 scope; implement or formally record accepted demo limitation — Person 1 with team decision |
| Requirements / acceptance | `CR-P2-001` remains pending; several UI, TLS, recovery and accessibility criteria are partial/not demonstrated | No full release acceptance can be claimed | Record formal change decision and acceptance status in RTM/decision log; team owns decision |

## 11. Residual Risk Statement

The following risks remain open; none is represented as resolved by this PED update.

| Risk / item | Why it remains | Current mitigation / bounded claim | Next action and evidence to close | Responsible owner |
|---|---|---|---|---|
| `DEF-M3-006` — incomplete requester history/reporting UI | Complete requester activity/history and Oversight browser reporting journeys are not established | API capability and current UI can support only a bounded demo; do not claim full FR-004/FR-005/FR-012 acceptance | Decide whether it blocks the agreed M3 scope; implement and retest missing UI or record a formally approved scope/acceptance decision | Person 1 to trace scope; team to decide; implementation owner to be assigned |
| `CR-P2-001` — due-date rule | The test oracle uses a future-date rule, but formal requirement approval is pending | Treat the rule as proposed/implemented but not formally approved | Record the team's decision, update the controlled change record and RTM, and retest if the accepted rule differs | Person 2 to maintain change/RTM evidence; team to approve |
| NFR-004 performance | Run #11 measures a small 200-record workload, not 5,000 records with 20 concurrent users for 15 minutes | Report run #11 numbers only for the measured smoke workload | Run the full workload with reproducible parameters/results, or obtain explicit approval for a deviation | Person 3 |
| Production TLS / deployment security | Current evidence is local/simulated staging; production TLS is not proven | Restrict current claim to local/simulated staging; `COOKIE_SECURE` alone does not configure TLS | Configure deployment TLS and verify HTTPS, certificate and secure-cookie behavior in the target environment | Person 3 / deployment owner to be confirmed |
| Recovery objectives | Backup integrity/readability is reported, but timed restore, off-site retention and RTO/RPO are not demonstrated | Keep a consistent local backup and document rollback; this is not disaster-recovery acceptance | Run and time a restore/recovery drill, record RTO/RPO targets and evidence off-site retention if required | Person 3, with Person 1 review |
| Accessibility/usability | Selected keyboard/focus and zoom checks exist; complete WCAG and representative-user acceptance are absent | Claim only the specific checks recorded; do not claim full conformance | Recheck final candidate, capture browser/version and test results, and complete agreed accessibility/usability acceptance | Person 1 and Person 2; final acceptance by team |
| Final candidate CI and traceability | Run #11 belongs to an earlier baseline, not necessarily the exact submitted candidate | Preserve run #11 as historical evidence only | Identify exact candidate SHA/tag, run required CI on it, confirm success, and link the exact run and SHA in this PED | Person 3 / release owner |

## 12. Release-readiness decision

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

- [Current machine-readable M3 RTM](../../backend/docs/requirements/rtm-data.json); PED v2.0 Section 7 remains the historical M2 RTM baseline. The M3 rows are updated with the latest CI, security-check, performance-smoke and backup/staging evidence while keeping formal NFR-004 load compliance, production TLS and RTO/RPO marked unproven.
- [Risk Register](../risk/CivicConnect_Constraints_and_Risk_Register.md)
- [Defect Register](../Defect_Register.md)
- [Technical Debt Register](../Technical_Debt_Register.md)
- [AI Usage Register](../../AI_Usage_Register.md)
- [Engineering Decision Log / design decisions](../decisions/design-patterns.md); related persistence/integration ADRs are in [backend/docs/decisions](../../backend/docs/decisions/).
- [PED v1.0 — historical baseline](PED_v1.0.md)
- [PED v2.0 — M1/M2 baseline](PED_v2.0.md)
- [Person 1 architecture/conformance handoff](m3-person1-handoff.md)
- [Person 2 verification handoff](../../backend/docs/quality/m3/PED-handoff.md)
- [Person 3 CI/deployment/release handoff](m3-albert-handoff.md)
- [Person 2 test plan](../../backend/docs/quality/m3/test-plan.md)
- [Test matrix](../../backend/docs/quality/m3/test-matrix.csv)
- [Browser acceptance evidence](../../backend/docs/quality/m3/browser-acceptance.md)
- [CI workflow](../../.github/workflows/ci.yml)
- [GitHub Actions runs](https://github.com/Amelia-VanDerWalt/CivicConnect/actions)
- [PR #23 — CI pipeline](https://github.com/Amelia-VanDerWalt/CivicConnect/pull/23)
- [PR #25 — Person 3 handoff, merged](https://github.com/Amelia-VanDerWalt/CivicConnect/pull/25)

Preserve PED v1.0 and v2.0 as historical baselines. Update this PED, the RTM, registers and decision records together whenever a requirement, implementation, verification result or release decision changes.


---

## M4 updated evidence — 18 October 2026 (supersedes historical M3 findings)

**Status:** Current provisional assessment; final team acceptance and release approval remain pending. The earlier M3 sections and older provisional M4 scoring remain historical, not the current position.

### Scope and acceptance

The approved M1 baseline contains 21 named acceptance criteria. The latest [Person 2 handoff](../../backend/docs/quality/m3/PED-handoff.md) and [RTM](../../backend/docs/requirements/rtm-data.json) report **16 Met, 3 Partially Met and 2 Not Met**. Weighted scope completion is **(16 + 3 × 0.5) / 21 = 83.33%**. This supersedes the earlier 57.14%, 64.29% and 71.43% assessments. The numerical 80% target is exceeded provisionally, but unresolved Must criteria and final team approval still matter.

| M1 requirement | Latest criterion status | Final M4 implementation/evidence position |
|---|---|---|
| FR-001 | Met | Login/logout and role/ownership enforcement |
| FR-002 | Met | Request submission and persisted defaults |
| FR-003 | Met | Category validation and historical labels |
| FR-004 | Met | Requester details, own requests and public history |
| FR-005 | Met | Requester-visible public updates, feedback and privacy |
| FR-006 | Met | Staff scoped queue, details and history |
| FR-007 | Met | Staff browser search/filter/sort and reset |
| FR-008 | Met | Assignment/reassignment; API reassignment and audit checked |
| FR-009 | Partially Met | Scheduling exists; CR-P2-001 due-date decision pending |
| FR-010 | Met | Status lifecycle, resolution summary and requester feedback |
| FR-011 | Met | Public/Internal browser notes and visibility checks |
| FR-012 | Met | Read-only Oversight browser reporting and date filters |
| FR-013 | Met | Audit trail and requester restrictions |
| NFR-001 | Met | Selected role and scope checks |
| NFR-002 | Partially Met | Selected security checks; production TLS/full scanning unproven |
| NFR-003 | Met | Transactions, stale edits and forced application restart |
| NFR-004 | Met | Formal local 5,000-record, 20-user, 15-minute workload |
| NFR-005 | Not Met | Representative-user timed usability study absent |
| NFR-006 | Partially Met | Selected keyboard/zoom checks; full text-scaling coverage unproven |
| NFR-007 | Not Met | Timed outage alerting and full diagnostic-log evidence absent |
| NFR-008 | Met | Timed local restoration verified; off-site recovery unproven |

No M1 criterion is treated as removed through an approved change. Do not infer acceptance merely from implementation.

### Current M4 product and defect position

Requester details/public history, Staff filtering/sorting, reassignment, scheduling, separate note visibility and the read-only Oversight interface are implemented in the merged M4 workflow work. Selected browser verification was recorded on 18 October; see [browser evidence](../../backend/docs/quality/m3/browser-acceptance.md). Earlier descriptions of absent browser functionality in this PED refer to the **historical M3 baseline**.

The [Defect Register](../Defect_Register.md) now describes **DEF-M3-006 as ready for peer closure review**, not fully unresolved/unimplemented and not yet formally Closed. CR-P2-001 remains pending approval.

### Updated performance and recovery

The [formal M4 load evidence](../../backend/docs/quality/m3/m4-formal-load-results.md) reports **900.015 seconds**, **5,000 initial active records**, **20 concurrent virtual users**, **7,200 reads**, **1,800 writes**, read p95 **395.5 ms**, write p95 **42.86 ms**. This was local loopback HTTP testing, not a public production performance measurement.

The [recovery evidence](../../backend/docs/quality/m3/m4-api-recovery-results.md) reports local backup restoration in **1,262.77 ms** and forced application restart in **655.72 ms**, with acknowledged business records retained in those drills. Same-host snapshot restoration does not prove ongoing off-site backup, disaster-site RTO/RPO or power-loss resilience.

### Significant decisions and consequences

The layered modular monolith and SQLite remain a proportionate solution with clear HTTP, service/policy and persistence responsibilities. DES-001 retained data-driven category validation instead of premature Factory Method subclasses; DES-002 retained explicit service-coordinated audit updates instead of an Observer/event system. These choices support clarity and maintainability but do not remove operational scaling and deployment responsibilities.

### Residual risk, release and conclusion

Unresolved: CR-P2-001, production TLS/comprehensive security checks, representative-user usability, complete accessibility, 60-second outage alerting/diagnostic logging, off-site recovery and sustained backup scheduling. **Albert must still provide the frozen final commit/tag, matching hosted CI result and documented deployment/go/no-go decision.** Neither the provisional 83.33% scope score nor local verification authorizes public production release.

**Provisional conclusion:** CivicConnect now supports the principal Requester, Staff and Oversight journeys and demonstrates meaningful improvement from the M3 baseline. The local workload and recovery drills add concrete quality evidence, but remaining operational and acceptance gaps require transparent final team decisions. The project outcome must be reported against the final frozen candidate, not historical CI runs.

---
