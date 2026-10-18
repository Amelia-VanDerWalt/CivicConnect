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

## M4 baseline reconciliation and acceptance review — 17 October 2026

Assessed candidate: f52bb8fd6c15e4a72abf182a9b4fe43511f1027e.

### Scope baseline

Use PED v1.0 Section 4 and its 21 named acceptance-criterion entries
(AC-F01 to AC-F13 and AC-N01 to AC-N08).
The requirement set and ACCEPTED sign-off are present in historical
commit 7fa2794, dated 9 September 2026.

The separate CivicConnect Requirements.docx uses conflicting IDs and
remains labelled Proposed. Preserve it as a historical alternative;
do not silently substitute it for the accepted PED baseline.
Some historical decision references also use the alternative IDs.
Trace those references by wording and record the discrepancy.

No approved removal or requirement change has been established by this
review. CR-P2-001 remains pending and does not change the denominator.

### Current implementation findings

Source inspection of src/frontend/app.js confirms:
- Requester submission, request lists and status display exist.
- Staff category-scoped queues, details, self-assignment and status updates exist.
- Full requester details/activity-history views are absent.
- Staff details do not display all required fields or activity history.
- Full search/sort, reassignment, scheduling and separate note controls are absent.
- The Oversight browser interface is explicitly unavailable.

These findings support partial implementation assessments where applicable.
Backend API functionality alone does not establish complete browser workflows.

### Verification and next acceptance steps

The 17 October local run passed all 35 automated cases on the candidate
above. See edward-local-verification.md for the environment and result.

Historical browser evidence remains dated to its original candidate.
Reconfirm critical browser journeys and keyboard/zoom behaviour against
the final candidate before assigning final acceptance statuses.

Calculate scope completion from the 21 existing named acceptance entries:
Met = 1, Partially Met = 0.5, Not Met = 0.
Assess each complete entry consistently, retaining its wording and evidence.
Do not split entries or remove unmet criteria to improve the percentage.

Final scores, scope completion, team approval and release baseline
have not yet been established. DEF-M3-006 remains open.

## M4 provisional acceptance assessment — 17 October 2026

Candidate: f52bb8fd6c15e4a72abf182a9b4fe43511f1027e
Status: evidence-based proposal for team reconciliation, not final approval.

Assessment uses the 21 accepted named criteria without changing their wording
or denominator. Existing automated evidence and dated browser observations
are considered together. Historical evidence is not presented as a new run.

| Criterion | Assessment | Score | Evidence and limits |
|---|---|---|---|
| AC-F01 | Met | 1 | Login, access checks and logout tested; automated protected access after logout. |
| AC-F02 | Met | 1 | Creation/defaults/retrieval tests; browser confirmation in earlier checks; M4 submission and blank-title retention passed. |
| AC-F03 | Met | 1 | T02/T03 verify active categories, rejection and preserved historical labels. |
| AC-F04 | Met | 1 | Requester list/status and ownership isolation covered by existing tests. PR #29 adds details and public history; 17 October screenshots confirm submitted fields, receipt/assignment history and resolution feedback. Refresh/back passed. Separate final-candidate release verification remains pending. |
| AC-F05 | Partially Met | 0.5 | Persisted public/internal activities exist; dashboard does not display the required explanations and summaries. |
| AC-F06 | Partially Met | 0.5 | Category isolation tested; staff details omit required fields/history. |
| AC-F07 | Partially Met | 0.5 | API filtering/sorting tests pass, but complete staff browser search, combined filters and sorting controls are absent. API evidence alone does not establish the full staff workflow. |
| AC-F08 | Partially Met | 0.5 | Owner eligibility, required due time and reassignment audit tested; requester-facing notification remains incomplete. |
| AC-F09 | Partially Met | 0.5 | Priority/date validation and audit tested; CR-P2-001 date-rule discrepancy remains unresolved. |
| AC-F10 | Partially Met | 0.5 | Lifecycle and mandatory notes tested, including M4 browser journey; requester notification content remains incomplete. |
| AC-F11 | Partially Met | 0.5 | API note metadata, explicit visibility and immutable history are tested. Requester public history and internal-note privacy were checked on 17 October. Separate staff browser note/visibility controls remain absent. |
| AC-F12 | Partially Met | 0.5 | API report calculations, date validation and oversight permissions are tested. Oversight browser reporting is unavailable, so the complete user workflow is not accepted. |
| AC-F13 | Met | 1 | Audit metadata, prior/new values, immutability and requester restrictions covered by existing tests. |
| AC-N01 | Met | 1 | Selected role-matrix tests cover unauthorised requester/staff/oversight operations. |
| AC-N02 | Partially Met | 0.5 | Selected repository hygiene checks exist; TLS and complete repository/log/build-output coverage are not established. |
| AC-N03 | Partially Met | 0.5 | Rollback, stale edits and normal close/reopen persistence tested; forced-restart recovery not established. |
| AC-N04 | Not Met | 0 | Performance smoke evidence does not meet the specified workload and 15-minute test. |
| AC-N05 | Not Met | 0 | Representative-user unassisted timed study not established. |
| AC-N06 | Partially Met | 0.5 | Earlier selected keyboard/200% browser zoom checks passed; final-candidate font-scaling and complete workflow coverage not established. |
| AC-N07 | Not Met | 0 | Timed outage alerts and required diagnostic-log properties not established. |
| AC-N08 | Partially Met | 0.5 | Backup integrity/readback tested; timed full-system restoration not established. |

Met: 6. Partially Met: 12. Not Met: 3.
Weighted score: 12 / 21.
Provisional scope completion: 57.14%.

Criterion scores do not erase broader requirement-level interface gaps.
DEF-M3-006 remains open. No approved scope removal has been established.

Before finalising: reconcile Person 1/3 evidence, resolve CR-P2-001,
confirm final-candidate applicability and obtain team review.
Do not describe this provisional result as meeting the 80% target.

### Team evidence reconciliation — 17 October 2026

Reviewed m3-albert-handoff.md, m3-person1-handoff.md and the consolidated
PED_v3.0.md against candidate f52bb8fd6c15e4a72abf182a9b4fe43511f1027e.

Person 3 reports historical CI regression, staging lifecycle, selected
security checks, backup integrity and performance-smoke passes.
These strengthen existing partial evidence but do not establish TLS,
forced-restart recovery, timed restoration, representative-user usability,
outage alerts or the specified NFR-004 load scenario.

The corrected performance figures in the consolidated PED and Person 3
handoff supersede the older figures in the Person 1 handoff:
200 seeded requests, 50 reads and 10 writes; duration 943.37 ms;
read p95 6.81 ms; write p95 9.99 ms.
These results belong to the recorded earlier CI candidate, not a new M4 run.
The exact historical Actions run URL still requires confirmation.

Both contributions identify incomplete browser workflows.
DEF-M3-006 remains open and CR-P2-001 remains pending.
Accepting a demo limitation does not automatically remove an approved
criterion or make it Met.

No additional evidence reviewed changes the provisional acceptance scores.
The 57.14% assessment remains subject to team review, particularly where
API-level criterion satisfaction differs from complete browser delivery.
Final release approval and final-candidate CI remain separate.

## M4 scope delivery and team handoff — 17 October 2026

Application candidate tested: f52bb8fd6c15e4a72abf182a9b4fe43511f1027e.
Evidence commit: 8513165; documentation/RTM updates only.
Status: Person 2 assessment for integration into PED v4.0; team review pending.

Implementation status describes delivered capability.
Acceptance scores describe how far the complete named criterion is evidenced.
An implemented feature can still lack acceptance evidence, and an API-level
criterion can pass while the broader browser workflow remains partial.

### Baseline-to-final scope position

| Requirement | Delivery status | Delivered capability / remaining gap |
|---|---|---|
| FR-001 | IMPLEMENTED | Session login/logout and backend role checks; Requester/Staff browser login. Oversight reporting UI gap is recorded under FR-012. |
| FR-002 | IMPLEMENTED | Submission, generated defaults/reference, confirmation and persistence; selected required-field browser validation verified. |
| FR-003 | IMPLEMENTED | Active category selection, invalid/inactive rejection and historical category-label preservation. |
| FR-004 | PARTIALLY IMPLEMENTED | Own-request list and status exist; full requester details/history view absent. |
| FR-005 | PARTIALLY IMPLEMENTED | Persistent activities exist; required requester-facing explanations/highlights are incomplete. |
| FR-006 | PARTIALLY IMPLEMENTED | Scoped staff queue/details exist; required fields/history are missing from details. |
| FR-007 | PARTIALLY IMPLEMENTED | API search/filter/sort exists; complete staff browser controls absent. |
| FR-008 | PARTIALLY IMPLEMENTED | Self-assignment and API eligibility/reassignment exist; full browser assignment controls and requester feedback incomplete. |
| FR-009 | PARTIALLY IMPLEMENTED | Scheduling API and audit exist; browser controls absent and CR-P2-001 unresolved. |
| FR-010 | PARTIALLY IMPLEMENTED | Controlled lifecycle and required notes work; requester notification presentation incomplete. |
| FR-011 | PARTIALLY IMPLEMENTED | API supports explicit note visibility and append-only history; separate browser work-note controls absent. |
| FR-012 | PARTIALLY IMPLEMENTED | Read-only reporting API exists; Oversight browser interface absent. |
| FR-013 | IMPLEMENTED | Application audit records and normal-operation immutability; not protection against database administrators. |
| NFR-001 | IMPLEMENTED | Backend role/ownership/category controls; selected negative tests pass. Broader security assurance is separate. |
| NFR-002 | PARTIALLY IMPLEMENTED | Credential/configuration safeguards and limited scans exist; TLS and complete scanning not established. |
| NFR-003 | IMPLEMENTED | Transactions, rollback, persistence and stale-version controls exist; forced-restart acceptance evidence remains incomplete. |
| NFR-004 | PARTIALLY IMPLEMENTED | Read/write operations and a small performance workload exist; required scale/duration target not established. |
| NFR-005 | PARTIALLY IMPLEMENTED | Submission/status workflows exist; representative-user usability target not established. |
| NFR-006 | PARTIALLY IMPLEMENTED | Selected keyboard/focus/browser-zoom checks exist; complete final-candidate font-scaling/workflow coverage not established. |
| NFR-007 | PARTIALLY IMPLEMENTED | Health endpoint exists; required outage alerting and diagnostic-log acceptance not established. |
| NFR-008 | PARTIALLY IMPLEMENTED | Backup/snapshot integrity controls exist; full timed recovery and recovery-point objectives not established. |

No item is classified CHANGED/REMOVED THROUGH APPROVED CHANGE:
no supporting approval has been established.
Partial implementation does not mean the quality target has been achieved.
Use the separate 21-criterion assessment for the completion calculation,
not the number of IMPLEMENTED rows in this table.

### Integration and outstanding actions

Proposed responsibilities below follow existing team roles and require confirmation.

| Action | Proposed owner | Completion evidence |
|---|---|---|
| Review the 21 criterion scores and their evidence limits | All three members | Substantive PR review and recorded assessment decision |
| Resolve missing browser workflows and DEF-M3-006 | Amelia coordinates; implementation allocation agreed by team | Completed/retested workflows or explicitly recorded residual scope; no automatic acceptance credit |
| Decide CR-P2-001 | Team; Edward maintains traceability | Recorded decision and aligned requirement, implementation and tests |
| Supply exact release SHA/tag and matching CI/staging evidence | Albert | Direct run links tied to final candidate |
| Resolve operational verification gaps within agreed scope | Albert coordinates | Actual load, TLS, monitoring and recovery evidence where completed; otherwise explicit unmet/partial criteria |
| Resolve representative-user/accessibility evidence gaps | Amelia and Edward | Dated actual observations, environment and measured results |
| Consolidate PED v4.0 | Amelia, using all contributions | Scope table, calculated acceptance result, residual risks and team release decision |

Current provisional acceptance result: 12/21 = 57.14%.
It is below the 80% target. Additional implementation or valid evidence is
needed to improve it; a review or accepted limitation alone does not do so.

Person 2 has prepared local regression evidence, selected browser checks,
the provisional acceptance assessment, synchronised RTM and register updates.
Team review, final evidence reconciliation and release approval remain pending.

## M4 requester-history correction follow-up — 17 October 2026

Requester details, public activity history and latest dashboard feedback
are now implemented on the requester-history branch.
Selected details, public history, resolution highlighting, refresh/back
and internal-note privacy checks passed; see browser-acceptance.md.

This supersedes earlier claims that requester details/history are absent
for this branch only. Staff controls/details and Oversight UI remain gaps.
DEF-M3-006 is partially addressed, not closed.

Correction: the initial M4 browser lifecycle passes were assumed rather
than executed and are withdrawn. Historical 14 October browser evidence
and actual automated results remain separate.

The earlier RTM scores and 57.14% assessment describe the preceding candidate.
They have not been upgraded for this branch. Reassess affected criteria,
synchronise JSON/Excel and record the final candidate after verification.

## PR #28 acceptance review correction — 18 October 2026

This correction supersedes the earlier API-only scoring interpretation
and its 64.29% total. Earlier sections retain their original dates;
their assessment table and current totals have been corrected.

Reviewed application revision: 979edcc, including requester-history PR #29.
FR-004 remains Met using the added details/history and existing isolation
evidence. FR-007, FR-011 and FR-012 are Partially Met because their full
browser workflows remain incomplete.

Current provisional result: 6 Met, 12 Partially Met, 3 Not Met.
Weighted score: 12/21 = 57.14%.
The accepted denominator remains 21. No requirements were removed.

The 17 October 35-test results and selected browser observations retain
their recorded source revisions/hashes. No new 18 October test run,
final-candidate CI success or release approval is claimed.
Assumed M4 lifecycle checks remain withdrawn.
DEF-M3-006 and CR-P2-001 remain open.

The JSON is updated here; Excel must be synchronised and verified before
this correction is committed.
