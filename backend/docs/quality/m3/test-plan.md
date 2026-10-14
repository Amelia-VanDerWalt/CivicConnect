# M3 Person 2 test plan and quality strategy

Owner: Edward Goosen, 602882. Executed 12 October 2026 on Node 24.19.0/Linux. Source baseline: main c21cacd; exact full source SHA is recorded in run-manifest.json. Changes are a review candidate, not the final M3 release baseline.

## Risk-based selection

Prioritise unauthorised reads/changes (NFR-001, RISK-006), partial updates and stale edits (NFR-003/RISK-007), workflow/reason correctness (FR-010), and the actual entry point (M2-R01/02/08). The 24 M2 regression cases remain. Eleven M3 cases add six pure unit tests, three actual-process integration tests and two complete HTTP system journeys. Do not claim a larger count by counting assertions or parameter values as separate top-level tests.

The matrix contains 35 top-level cases: >=5 unit/component (six new pure unit plus existing service/repository cases), >=5 black-box functional (T02/T04/T05/T06/T07/T08/T13/T14/T16/T21/T24), >=3 API/integration (T22/T23 and M3-I01..03), and two system journeys (M3-S01/02). At least three negative cases and five Must requirements are covered. Legitimate overlap is labelled, not added to the total.

## Technique reasoning

Boundary Value Analysis: documented title limit 120, description4000, location200 and future-time boundary. Equivalence Partitioning: valid enum members versus invalid/case/null and valid numeric IDs versus invalid types/ranges. State transitions: required lifecycle order and terminal states. Role/category/ownership cases are decision-based access checks. The future-date oracle follows implemented CR-P2-001; passing it does not approve that requirement change.

Inputs and expected outcomes are recorded in test-matrix.csv and derived from M1 acceptance criteria, API limits, lifecycle and M2 risks. Tests run with generated synthetic accounts and isolated temporary databases; passwords are never in reports. System tests spawn the real server and use HTTP through sessions, service and persistent SQLite. They cover backend system journeys, not browser clicks or usability. T17 provides database reopen evidence separately, not forced-crash recovery.

## Execution

From backend: npm.cmd test. For evidence: node --test --test-reporter=tap > docs/quality/m3/local-results.tap (PowerShell also supports the redirect). Keep author-generated evidence files intact; use a new local-results.tap for your own run. Each case fails on an explicit assertion and cleanup removes temporary DBs/processes.

## Results and limitations

Before the fix: the eleven new tests had 8 passes and 3 failures. M3-I01 confirmed hard-coded3000; M3-I02 confirmed raw traversal returned200 for backend/package.json; M3-I03 timed out on missing favicon. No secrets were accessed. After correction: all 35 pass, zero skipped, about 9.56 seconds. after-fix.tap is complete raw evidence. run-manifest.json hashes tested code and reports.

Pending browser records are in browser-acceptance.md. CI/staging/performance/static/security pipeline evidence belongs to Person 3's handoff and must execute on the team's identified candidate. No arbitrary coverage target, municipal-scale claim or full release-readiness approval follows from this suite.
