# Browser acceptance — pending human execution

These records are NOT passed by the HTTP system suite. Record tester, date, browser, exact candidate SHA, expected/actual, status and evidence. Use synthetic data, test DB and generated setup passwords.

| ID | Basis | Steps and expected result | Status |
|---|---|---|---|
| B01 | FR-002/004/008/010 | Requester logs in, submits Facilities request; Received shown. Staff assigns then advances In progress/Resolved/Closed using meaningful notes. Requester refresh shows final status. Inspect actual API unique reference against displayed reference. | Not run |
| B02 | FR-001/002/004/006/010 | Blank required input retains fields and prevents submission. Requester2 cannot see requester1's record. IT staff cannot act on Facilities request. Empty rejection/resolution reasons blocked by UI. Logout prevents protected navigation. | Not run |
| B03 | NFR-005/006 | Keyboard-only submit/lookup/staff journey with visible focus and 200% zoom. Separate representative-user study measures unassisted 80%/3-minute target. | Not run |

Known blockers: frontend uses REQ-id rather than full reference; requester detail/history and oversight UI incomplete; fallback status text may bypass meaningful reason capture. Person 1/3 implementation work is required. Attach actual observations, not anticipated results.
