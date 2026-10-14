# Browser acceptance — pending human execution

These records are NOT passed by the HTTP system suite. Record tester, date, browser, exact candidate SHA, expected/actual, status and evidence. Use synthetic data, test DB and generated setup passwords.

| ID | Basis | Steps and expected result | Status |
|---|---|---|---|
| B01 | FR-002/004/008/010 | Requester logs in, submits Facilities request; Received shown. Staff assigns then advances In progress/Resolved/Closed using meaningful notes. Requester refresh shows final status. Inspect actual API unique reference against displayed reference. | Not run |
| B02 | FR-001/002/004/006/010 | Blank required input retains fields and prevents submission. Requester2 cannot see requester1's record. IT staff cannot act on Facilities request. Empty rejection/resolution reasons blocked by UI. Logout prevents protected navigation. | Not run |
| B03 | NFR-005/006 | Keyboard-only submit/lookup/staff journey with visible focus and 200% zoom. Separate representative-user study measures unassisted 80%/3-minute target. | Not run |

Known blockers: frontend uses REQ-id rather than full reference; requester detail/history and oversight UI incomplete; fallback status text may bypass meaningful reason capture. Person 1/3 implementation work is required. Attach actual observations, not anticipated results.

## Edward's browser execution — 12–13 October 2026

Tester: Edward Goosen — 602882
Browser: d controls usable | Pass — tested scope |
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
| Requester 200% zoom | Dashboard/form readable and usable | Tester confirme| Staff keyboard/focus and 200% zoom | Queue/details controls reachable and readable | Screenshot and tester confirmation | Pass — tested scope |

### Interpretation and remaining work

These results update the initial Not run checklist above; they do not mark every part of B01–B03 passed.

The resolution-summary failure and reference mismatch remain open.
Direct-resource browser isolation, rejection with an empty reason,
complete activity-history acceptance and representative-user usability
were not established by these checks.

Keyboard and browser-zoom checks do not establish full WCAG compliance.
Retest corrected defects and critical journeys on the final release candidate.
No passwords are included in this record.
