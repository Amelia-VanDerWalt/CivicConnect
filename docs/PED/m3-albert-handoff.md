# M3 Person 3 — CI, Deployment and Release Readiness Handoff

**Project:** CivicConnect  
**Contributor:** Albert Du Plooy — 601969  
**Role:** Person 3 — CI, Deployment & Release Readiness  
**Purpose:** Supporting material for PED v3.0 Sections 4, 5, 8 and 10.  
**Status:** Working contribution for team integration into the shared PED v3.0. This file is not a replacement for PED v3.0.

---

## Section 4 — Construction / Configuration Contribution

### 4.1 Controlled repository and review process

CivicConnect uses GitHub as the controlled source repository. Substantive M3 changes are developed on feature/fix branches and merged into `main` through Pull Requests rather than direct implementation commits to the protected branch.

The repository uses review controls requiring two approving reviews from team members other than the author. The default branch also requires the CI status check `Build, Static/Security, Tests, Staging & Perf Gate` to pass before progression.

Person 3 work was completed through **PR #23 — “Added M3 CI pipeline, static/security checks, staging E2E and perf tests”** on branch `m3-albert-ci-release`.

The PR contained the following Person 3 commits:

- `f1f84ed3c01944c186d0d263bc380e64c64b35d8` — initial CI, static/security, staging and performance implementation.
- `d47b4e6f9f97346b105edeb1463a77b75d46756a` — corrected process cleanup and performance-script test discovery.

PR #23 received substantive peer review from Edward Goosen and Amelia van der Walt. Review feedback identified a reliability issue where child-process cleanup might not execute if server startup failed. The startup wait was moved inside protected `try/finally` handling before the PR was approved and merged.

This provides evidence of progressive development, meaningful peer review and review-driven correction.

### 4.2 Configuration and secrets handling

Runtime configuration is provided through environment variables rather than hard-coded deployment values. Relevant settings include:

- `HOST`
- `PORT`
- `APP_ORIGIN`
- `DB_PATH`
- `COOKIE_SECURE`

The simulated staging environment is represented by `backend/.env.staging.example` and uses a separate port and SQLite database from normal development.

The automated `backend/scripts/checks.js` verification performs:

- JavaScript syntax checks;
- selected static code-quality checks;
- checks for unignored `.env` and SQLite runtime artefacts;
- selected hard-coded secret/token pattern checks;
- `npm audit --audit-level=high`.

The latest verified CI evidence reported:

- 15 JavaScript files passed syntax/static quality checks;
- no exposed `.env` or SQLite runtime artefacts were detected;
- no selected hard-coded secret-token patterns were found;
- no high/critical npm dependency vulnerabilities were reported.

These checks provide useful M3 repository-hygiene and dependency evidence, but they are not a complete enterprise security assessment.

### 4.3 Simulated staging environment

CivicConnect uses a credible simulated staging environment rather than a public production deployment.

The environment is configured and verified using:

- `backend/.env.staging.example`
- `backend/scripts/staging-verify.js`
- `npm run staging:verify`

The staging environment:

- runs the real CivicConnect server;
- uses port `3001`, separate from normal development;
- uses an isolated staging SQLite database;
- verifies the static UI and `/health` endpoint;
- executes a critical Requester → Staff → Requester lifecycle;
- verifies that internal Staff notes are not exposed to the Requester;
- creates and validates a backup snapshot.

The critical staging journey is:

`Requester login → submit request → Staff login → assign → add internal note → In progress → Resolved → Closed → Requester verifies Closed status`

### 4.4 Rollback / recovery approach

The M3 rollback/recovery approach is intentionally simple:

1. Identify the last accepted Git release-candidate commit.
2. Create or retain a consistent SQLite backup snapshot before replacement.
3. Stop the failed candidate if verification fails.
4. Return to the previously accepted code revision.
5. Restore/use the verified database snapshot where data recovery is required.
6. Rerun health and critical-journey checks.

The current staging evidence verifies backup creation, SQLite integrity and retained request state. It does not prove the complete production RTO/RPO or off-site disaster-recovery target.

---

## Section 5 — CI & Automated Verification Contribution

### 5.1 CI workflow

The M3 CI workflow is stored in:

`.github/workflows/ci.yml`

Workflow name:

`CivicConnect M3 CI & Quality Gate`

Required job/status check:

`Build, Static/Security, Tests, Staging & Perf Gate`

The workflow runs on GitHub Actions using Node.js `24.19.0` and performs:

1. repository checkout;
2. clean dependency installation using `npm ci --ignore-scripts`;
3. static/security/dependency verification with `npm run check`;
4. automated verification with `npm test`;
5. simulated staging E2E and backup verification with `npm run staging:verify`;
6. performance/workload verification with `npm run perf`.

Any command returning a non-zero exit code fails the workflow. The required status-check rule on the default branch means the configured CI gate must pass before progression to `main`.

### 5.2 CI execution evidence

Person 3 PR #23 was merged to `main` as:

`e16919d74463cf5c4fba3a1bcf88dd2b14fe5223`

The repository later incorporated the remaining Person 1 and Person 2 M3 handoffs. The current `main` baseline after those merges is:

`53bf185a2938d20df5d0d12a1a3ea120d635d6f5`

GitHub Actions **run #11** executed successfully on this current `main` commit.

The CI evidence includes:

- static/security checks — **PASS**
- automated regression suite — **35/35 PASS**
- simulated staging E2E — **PASS**
- backup snapshot integrity/readability verification — **PASS**
- performance workload — **PASS**

Passing CI demonstrates that the configured checks succeed for the candidate. It does not establish complete requirement acceptance or production readiness by itself.

---

## Section 8 — Performance / Reliability Contribution

### 8.1 Performance test design

The automated performance script is:

`backend/scripts/perf-check.js`

The exercise covers two performance-sensitive operations:

- authenticated Staff queue read/filter requests;
- authenticated Requester service-request creation.

The read/filter path is important because the Technical Debt Register records that list/report filtering currently occurs in application memory and does not use pagination.

### 8.2 Workload and environment

The test runs the real `server.js` process against an isolated SQLite database in WAL mode.

Workload:

- 200 pre-seeded service requests;
- 10 authenticated live write operations;
- 50 authenticated sequential read/filter operations;
- response status and completion checks;
- average, p95 and maximum response-time measurements;
- success/failure counts.

### 8.3 Verified performance results

The verified GitHub Actions performance evidence recorded:

| Measure | Result |
|---|---:|
| Dataset | 200 seeded requests + 10 live writes |
| Total measured workload duration | 873.93 ms |
| Read success | 50 / 50 |
| Read average | 3.38 ms |
| Read p95 | 3.86 ms |
| Read maximum | 11.87 ms |
| Write success | 10 / 10 |
| Write average | 3.70 ms |
| Write p95 | 5.72 ms |
| Write maximum | 5.72 ms |

The test compares read p95 against the existing `<= 2000 ms` target and write p95 against `<= 3000 ms`. The small M3 workload passed both thresholds.

### 8.4 Interpretation and limitations

The performance evidence demonstrates that the selected read/filter and write operations perform comfortably within the response-time thresholds for the small M3 workload.

It does **not** prove full NFR-004 acceptance. The formal requirement specifies 5,000 active records, 20 concurrent users and a 15-minute steady-state workload. The M3 exercise is therefore evidence of pilot/student-scale responsiveness, not municipal-scale performance compliance.

`TD-M3-001` remains relevant because application-memory filtering and the lack of pagination may create scalability concerns at larger data volumes.

### 8.5 Reliability / backup evidence

Reliability-related M3 evidence includes:

- successful clean CI installation;
- 35/35 automated tests;
- controlled startup/cleanup handling in verification scripts;
- staging health verification;
- successful critical E2E lifecycle;
- SQLite backup snapshot creation;
- successful `PRAGMA integrity_check`;
- confirmation that the completed staging request exists in the backup.

This demonstrates a working backup/snapshot control, but not a complete timed disaster-recovery or production-availability process.

---

## Section 10 — Release Readiness Contribution

### 10.1 Release evidence summary

| Evidence area | Result | Interpretation | Remaining concern / action |
|---|---|---|---|
| Build & CI | PASS | Required GitHub Actions quality gate completes successfully | Reconfirm on exact final M3 submission SHA |
| Repository / PR control | PASS | Feature branches, meaningful PR review, two approvals and protected `main` are demonstrated | Continue same process for final changes |
| Automated regression | PASS — 35/35 | Selected critical behaviour is regression-protected | Passing tests do not prove all acceptance criteria |
| API / integration | PASS for selected cases | Actual-server integration/configuration/static boundaries are exercised | Production environment behaviour remains outside scope |
| System / E2E | PASS for critical slice | Critical Requester/Staff lifecycle completes in automated/staging evidence | Full UI histories/reporting remain incomplete |
| Static / security | PASS with limitations | Static rules, repository hygiene and dependency audit pass | Custom secret patterns and non-production TLS remain limitations |
| Performance | PASS for small M3 workload | Selected operations are well below current response-time thresholds | Full NFR-004 scale is not demonstrated |
| Backup / recovery | PARTIAL PASS | Snapshot creation, integrity and retained data are verified | Full RTO/RPO/off-site recovery is not demonstrated |
| Defects | PARTIAL | DEF-M3-001 to DEF-M3-005 have correction/retest evidence | DEF-M3-006 remains open |
| Acceptance | PARTIAL | Important core behaviour is evidenced | Full UI scope, representative usability/accessibility and production operational targets remain incomplete |

### 10.2 Known limitations and residual risks

Important remaining limitations include:

- `DEF-M3-006`: incomplete UI histories/reporting and related frontend scope;
- full NFR-004 load target has not been executed;
- production TLS/public hosting is not established;
- full recovery-time/recovery-point targets are not demonstrated;
- representative-user usability and complete accessibility acceptance remain incomplete;
- the custom secrets check is intentionally limited compared with a dedicated enterprise scanner.

### 10.3 Provisional release classification

**Provisional Person 3 release position: CONDITIONALLY READY for controlled M3 staging/demo, subject to team confirmation.**

The core CI, automated regression, simulated staging, selected security/static and small-scale performance evidence is credible and repeatable.

However, this must not be described as an unconditional production `READY` decision.

`DEF-M3-006` is still recorded as a high-impact gap for complete core scope. If the team decides that this missing UI work is release-blocking for the agreed M3 candidate, the correct final classification must be **NOT READY** until the blocker is resolved. If the team formally accepts it as a known non-blocking limitation for the M3 release/demo scope, **CONDITIONALLY READY** remains defensible.

The final `READY / CONDITIONALLY READY / NOT READY` classification is a team decision and must be made against the exact final M3 release-candidate commit.

### 10.4 Final integration note

Before this content is integrated into the final PED v3.0:

- identify the exact final M3 release-candidate SHA/tag;
- confirm the required CI gate passes on that exact candidate;
- align the final RTM, Risk Register, Defect Register and Technical Debt Register with that candidate;
- record the team's final decision on `DEF-M3-006`;
- replace this provisional release position with the agreed team classification.
