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
| Progress | Execute the specified browser check | Tester clarified this step was not executed | Not run |
| Blank resolution note | Execute the specified browser check | Tester clarified this step was not executed | Not run |
| Resolution | Execute the specified browser check | Tester clarified this step was not executed | Not run |
| Closure | Execute the specified browser check | Tester clarified this step was not executed | Not run |
| Requester status | Execute the specified browser check | Tester clarified this step was not executed | Not run |

These checks cover the selected browser journey only.
Confirmation-to-dashboard reference matching, rejection, role isolation,
keyboard/zoom behaviour and complete history/reporting were not established
by this M4 execution. Earlier checks retain their original dates and candidates.
DEF-M3-006 remains open. These results do not constitute team release approval.

### Correction to M4 browser evidence — 17 October 2026

The tester clarified that the remaining lifecycle checks had been assumed
to pass rather than executed. Their earlier Pass entries are withdrawn.
Submission and assignment remain confirmed. Automated lifecycle results
remain separate evidence; historical browser results retain their dates.

Screenshots of the uncommitted requester-history interface confirm:
- Dashboard references are clickable and show timestamped public notes.
- The selected request displays submitted details, priority and due date.
- Receipt and assignment history show timestamps, authors and notes.
- The request remains Assigned.

Refresh/back controls, internal-note isolation, later lifecycle feedback
and accessibility of the new view have not yet been confirmed.

## M4 requester history verification — 17 October 2026

Tester: Edward Goosen — 602882
Candidate: f76b4f0b0c0e9fa9d8e07eedfd4d36a259599c04 plus the source changes fingerprinted below.
Environment: Windows, Node.js 24.20.0; browser version not recorded.
URL: http://127.0.0.1:3018
Database: presentation-20261016-120301.sqlite

### Source SHA-256
- src/frontend/index.html: 73D5D3C9C43691883B27F65BEA81121407748A8EE770E404A607E9ADEEAA8617
- src/frontend/requester-history.js: 56268EED31CA714C53EFB8A9A67487FEC911CEFEF8428CE785847040B81F88A3
- backend/src/infrastructure/request-repository.js: 23DBB8DF97585E9C56AD28B27F2A5FB548D0DC3A463B681CDE7A9A737C68CC04

| Check | Observed result | Status |
|---|---|---|
| Dashboard feedback | Full references, public update labels, timestamps and notes displayed | Pass — screenshots |
| Request details | Submitted title/category/location/description, status, priority and due date displayed | Pass — screenshot |
| Public history | Receipt and assignment show author, timestamp and note | Pass — screenshot |
| Resolution feedback | Existing resolved request displays its summary; tester confirmed green resolution-history highlight | Pass — screenshot and tester confirmation |
| Refresh updates | Tester confirmed successful refresh | Pass |
| Back to My Requests | Tester confirmed return to dashboard | Pass |
| Internal-note history privacy | Staff saved a marked Internal note; refreshed requester history excludes it | Pass — terminal confirmation and screenshot |
| Internal-note dashboard privacy | Dashboard retains the latest public assignment note and excludes the Internal note | Pass — screenshot |

Automated regression: 35 passed, 0 failed, 0 cancelled, 0 skipped;
duration 7135.599 ms. This suite does not execute the new frontend DOM.

Earlier assumed M4 lifecycle passes were withdrawn in the correction above.
This execution inspected an existing resolved request; it did not perform
new progress/resolution/closure transitions.
Closed/rejected history, sign-out persistence, new-view keyboard/zoom and
cross-account browser checks remain unverified for this source revision.

## M4 completed-workflow browser checks — 18 October 2026

Tester: Edward Goosen — 602882.
Environment: Windows, Opera GX, Node.js 24.20.0.
Browser version: not recorded.
URL: http://127.0.0.1:3018.
Database: presentation-20261016-120301.sqlite.
Source: 11dc19df95590aa9daf518e0f04441cf389ad0ed plus uncommitted interface changes.
SHA-256:
- src/frontend/index.html: 735C7F41D1A517ECEDE97E55E944F49E87332061FF38F0814DCB918A575F40B1
- src/frontend/staff-workflows.js: D8EA64307B37489B43BE4F60EFE8CCBED2D3569804DA3FDE40C5AF6CA1951F96

Evidence: tester confirmations of the specifically requested steps.
The earlier withdrawn 17 October lifecycle claims remain withdrawn.

| Check | Observed result | Status |
|---|---|---|
| Combined search/status filter | M4 + Assigned returns the expected request | Pass |
| Empty search and reset | No results found; reset restores queue | Pass |
| Staff details | Submitted fields, owner, priority, due date and history displayed | Pass |
| Scheduling | High priority/future due date and reason saved; details/history updated | Pass |
| Public work note | Saved through explicit Requester-visible selection; requester sees it | Pass |
| Internal work note | Saved through explicit Internal selection; requester does not see it | Pass |
| Oversight reports | Category counts, ownership and MTTR fields displayed | Pass |
| Report date filter | 17 October creation-date filter and empty 2020 range behaved as expected | Pass |
| Oversight details | Details/history available; mutation forms absent | Pass |
| Lifecycle | Assigned -> In progress -> Resolved -> Closed succeeded | Pass |
| Blank resolution | Empty summary blocked save | Pass |
| Requester closure feedback | Closed status, summary and highlighted resolution/closure visible | Pass |
| Sign-out persistence | Closed request, summary and history remain after new login | Pass |
| Selected keyboard/200% zoom | Requester record/refresh/back and staff filters/details reachable with visible focus | Pass |

Installer regression and static/security checks completed successfully.
Exact run duration and detailed check output were not captured in this section.
Automated suite does not execute the frontend DOM.

Reassignment to a different eligible owner, new-interface rejection,
stale-edit UI recovery, independent report-metric reconciliation and
complete accessibility coverage were not established by these browser checks.
No representative-user study, formal load result or release approval is claimed.
