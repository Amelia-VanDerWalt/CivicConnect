# Browser acceptance — execution and retests

These records are NOT passed by the HTTP system suite. Record tester, date, browser, exact candidate SHA, expected/actual, status and evidence. Use synthetic data, test DB and generated setup passwords.

| ID | Basis | Steps and expected result | Status |
|---|---|---|---|
| B01 | FR-002/004/008/010 | Requester logs in, submits Facilities request; Received shown. Staff assigns then advances In progress/Resolved/Closed using meaningful notes. Requester refresh shows final status. Inspect actual API unique reference against displayed reference. | Not run |
| B02 | FR-001/002/004/006/010 | Blank required input retains fields and prevents submission. Requester2 cannot see requester1's record. IT staff cannot act on Facilities request. Empty rejection/resolution reasons blocked by UI. Logout prevents protected navigation. | Not run |
| B03 | NFR-005/006 | Keyboard-only submit/lookup/staff journey with visible focus and 200% zoom. Separate representative-user study measures unassisted 80%/3-minute target. | Not run |

Initial blockers: reference mismatch and generic status-note fallback were identified before correction. Their retests are recorded below. Requester detail/history and oversight UI remain incomplete.

## Edward's browser execution — 12–13 October 2026

Tester: Edward Goosen — 602882
Browser: browser name/version was not reliably recorded.
Environment: Windows, Node.js 24.20.0
URL: http://127.0.0.1:3018
Tested commit: df237bd477c36cc94ce77d09047bb65db43df139
Test database: m3-browser-20261012-153500.sqlite
Evidence: tester observations and screenshots reviewed during the guided checks.

| Check | Expected result | Actual result | Status |
|---|---|---|---|
| Empty title | Submission blocked; entered text retained | Tester confirmed both | Pass |
| Valid submission | Request appears as Received | Facilities request REQ-1 appeared as Received | Pass |
| Requester queue isolation | requester2 cannot see requester1's request | Dashboard empty | Pass |
| Staff category queue isolation | IT staff cannot see Facilities request | No requests found | Pass |
| Facilities staff access | Authorised staff can view request details | Request visible and details opened | Pass |
| Invalid lifecycle jump | Received to Closed rejected | Cannot move Received to Closed error | Pass |
| Assignment | Request becomes Assigned | Tester confirmed successful assignment | Pass |
| Progress | Assigned to In progress succeeds | Tester confirmed successful transition | Pass |
| Empty resolution summary | Resolution blocked | Request became Resolved despite empty user note | Fail — DEF-M3-005 |
| Closure | Resolved to Closed succeeds | Request became Closed | Pass |
| Requester status visibility | Requester sees final Closed status | Screenshot shows Closed | Pass |
| Reference display | Dashboard uses backend unique reference | Dashboard displays REQ-1; full confirmation reference not captured | Defect — DEF-M3-004 |
| Logout and refresh | Login screen; protected data unavailable | Login screen displayed without request data | Pass |
| Browser Back after logout | Attempt return to protected view | Back button disabled | Not applicable |
| Requester keyboard/focus | Tested controls reachable with visible focus | Tester confirmed login and submission-form navigation | Pass — tested scope |
| Requester 200% zoom | Dashboard/form readable and usable | Tester confirmed controls usable | Pass — tested scope |
| Staff keyboard/focus and 200% zoom | Queue/details controls reachable and readable | Screenshot and tester confirmation | Pass — tested scope |

### Interpretation and remaining work

These results update the initial Not run checklist above; they do not mark every part of B01–B03 passed.

The original resolution-summary failure and reference mismatch are preserved above. Corrections and subsequent retests are recorded below.
Direct-resource browser isolation, rejection with an empty reason,
complete activity-history acceptance and representative-user usability
were not established by these checks.

Keyboard and browser-zoom checks do not establish full WCAG compliance.
Retest corrected defects and critical journeys on the final release candidate.
No passwords are included in this record.

## Edward's correction retests — 14 October 2026

Tester: Edward Goosen — 602882
Environment: Windows PowerShell, Node.js 24.20.0
URL: http://127.0.0.1:3018
Test database: m3-browser-20261012-153500.sqlite
Base commit: 9b9878aa294fe135e57ac4bb8ab0c8845f405cf0
Candidate: base commit plus uncommitted src/frontend/app.js corrections.
Frontend file SHA-256: 32769F15F3E93499496D8D600CF6D5D880A4C8991549E6FACC866535C970573E
Browser name/version: not recorded.
Evidence: screenshots and tester confirmations during guided browser checks.

| Check | Expected result | Actual result | Status |
|---|---|---|---|
| Requester reference | Display full backend CC reference | Tester confirmed full reference displayed | Pass — DEF-M3-004 |
| Staff queue reference | Display full backend CC reference | Screenshot confirmed full reference displayed | Pass — DEF-M3-004 |
| Staff details reference | Match the queue's full CC reference | Tester confirmed matching reference | Pass — DEF-M3-004 |
| Empty resolution summary | Show validation error and retain In progress | Tester confirmed error and unchanged status | Pass — DEF-M3-005 |
| Supplied resolution summary | Allow transition to Resolved | Tester confirmed successful update | Pass — DEF-M3-005 |
| Empty rejection reason | Show validation error and retain Received | Tester confirmed both rejection checks passed | Pass — DEF-M3-005 |
| Supplied rejection reason | Allow transition to Rejected | Tester confirmed successful rejection | Pass — DEF-M3-005 |

Automated regression: npm.cmd test; 35 passed, 0 failed, 0 cancelled,
0 skipped; duration 10445.88 ms.
Frontend syntax: node --check src/frontend/app.js completed without errors.
The automated suite does not execute the frontend DOM validation; the
browser checks above provide evidence for those corrections.

DEF-M3-004 and DEF-M3-005 are fixed and retested, pending peer review.
DEF-M3-006 remains open. Full activity-history/reporting acceptance,
representative-user usability and full WCAG compliance are not established.
The longer references have not been retested at 200% zoom.
No credentials are included.

## M4 critical browser verification — 17 October 2026

Tester: Edward Goosen — 602882
Tested commit: f52bb8fd6c15e4a72abf182a9b4fe43511f1027e
Environment: Windows; Node.js 24.20.0
URL: http://127.0.0.1:3018
Database: presentation-20261016-120301.sqlite
Browser name/version: not recorded.
Evidence: tester confirmations during guided browser execution.

| Check | Expected result | Actual result | Status |
|---|---|---|---|
| Blank title | Block submission and retain description | Tester confirmed both | Pass |
| Valid submission | Create a request with Received status | Received request confirmed | Pass |
| Assignment | Authorised staff assigns the request | Assigned status confirmed | Pass |
| Progress | Assigned request advances to In progress | Tester confirmed transition | Pass |
| Blank resolution note | Block resolution without changing status | Tester confirmed validation blocked update | Pass |
| Resolution | Supplied summary allows Resolved status | Tester confirmed transition | Pass |
| Closure | Resolved request advances to Closed | Tester confirmed transition | Pass |
| Requester status | Requester sees final Closed status | Tester confirmed Closed displayed | Pass |

These checks cover the selected browser journey only.
Confirmation-to-dashboard reference matching, rejection, role isolation,
keyboard/zoom behaviour and complete history/reporting were not established
by this M4 execution. Earlier checks retain their original dates and candidates.
DEF-M3-006 remains open. These results do not constitute team release approval.
