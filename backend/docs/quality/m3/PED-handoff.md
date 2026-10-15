# Person 2 contribution for PED v3.0

Updated: 15 October 2026
Contributor: Edward Goosen — 602882

Integrate these sections into the team's PED, preserving earlier milestones. This handoff is supporting material for the consolidated PED.

## Section 5 — automated verification contribution

The suite contains 35 top-level cases: 24 retained M2 cases and 11 M3 additions. The additions comprise six unit cases, three actual-server integration cases and two HTTP system journeys.

See test-plan.md, test-matrix.csv, before-fix.tap, after-fix.tap and run-manifest.json. Edward also ran the suite locally on Windows with Node.js 24.20.0. The 14 October run passed all 35 cases with no failures, cancellations or skips, taking 10445.88 ms. The frontend JavaScript syntax check passed.

These results describe the recorded local candidates. Albert's CI contribution requires its own workflow-run evidence; local results do not establish hosted CI success.

## Section 6 — applied quality strategy

Testing prioritises requester ownership, staff category permissions, atomic history, stale edits and real server integration because failures affect confidentiality and correctness.

Boundary value analysis covers title, description, location and due-time boundaries. Equivalence partitioning covers valid and invalid values. State-transition testing checks lifecycle order and mandatory reasons. Negative access tests check unauthorised reads and changes.

Manual browser checks supplement the automated suite. Test counts and selected successful journeys do not establish complete requirement acceptance.

## Section 7 — black-box, integration and system validation

M3-S01 exercises login, submission, assignment, internal notes, progress, resolution, closure, requester-visible data and logout. M3-S02 exercises invalid submission, isolation, rejection reasons and stale-edit conflicts. Both use an actual server process with synthetic disk databases and sessions. They are HTTP system journeys.

Browser checks on 12–13 October covered required-input handling, submission, requester and staff queue isolation, assignment, lifecycle transitions, logout and selected keyboard/focus/200% browser-zoom interactions.

Those checks exposed inconsistent request references and an empty resolution-note bypass. On 14 October, retests confirmed full CC references in requester/staff queues and staff details. Empty resolution and rejection notes were blocked without changing status; supplied summaries and reasons allowed the transitions.

See browser-acceptance.md for the original failures, subsequent passes and tested candidate identification. Longer references have not been retested at 200%. Browser name/version was not recorded. Full WCAG compliance and representative-user usability targets are not established.

## Section 9 — defects and quality interpretation

DEF-M3-001 to DEF-M3-003 concern ignored server configuration, static-path traversal and a hanging missing-file response. Automated evidence records their baseline failures and successful regression checks after correction.

DEF-M3-004 and DEF-M3-005 concern reference display and missing resolution/rejection notes. Corrections and successful browser retests are recorded in commit 16e5594, which is included in origin/main. Merge inclusion does not itself establish the content of peer reviews.

DEF-M3-006 remains open in the available defect register: complete UI histories/reporting have not been established. The original failed browser observations remain preserved.

Forced-crash recovery, target performance, TLS, secret scanning, operational alerting and timed recovery require their own evidence. Consult the defect register, technical-debt register and RTM rather than interpreting 35 passing cases as complete release acceptance.

## Release input and integration

The recorded local regression and selected browser retests pass. The team must integrate architecture and CI/release contributions, link actual workflow and staging results, resolve outstanding scope/change decisions and identify the final tested release commit.

The final readiness classification must reflect all team evidence and unresolved defects. CR-P2-001 still requires a recorded decision unless the team supplies an approved resolution.

Synchronise the JSON and Excel RTM before final submission. Integrate this contribution into the consolidated PED v3.0.

## Defence trace

FR-002: requester submission need -> atomic request and receipt creation -> creation/boundary/system tests -> browser submission and reference retests.

FR-010: controlled lifecycle -> transition rules and required notes -> automated lifecycle cases -> browser failure DEF-M3-005 -> frontend validation correction -> successful resolution/rejection retests.

NFR-002: static-file boundary -> M3-I02 reproduced traversal exposure -> ADR-P2-004 correction -> successful 404 regression. This evidence does not establish TLS or secret-scan compliance.
