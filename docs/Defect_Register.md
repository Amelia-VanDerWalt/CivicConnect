# CivicConnect Defect Register

12 October 2026; Person2 verification. Status "fixed locally" is not team approval or release acceptance. Source snapshot c21cacd.

| ID | Severity / impact | Basis and reproduction | Actual vs expected | Correction | Regression evidence | Status |
|---|---|---|---|---|---|---|
| DEF-M3-001 | High: environment configuration unreliable | M2-R02; set PORT=0 and configured APP_ORIGIN, start actual server | Always3000; expected configured binding/origin | Restore HOST/PORT/origin/secure forwarding and graceful close | before-fix.tap M3-I01 fails; after-fix.tap passes | Fix merged; M4 automated regression passed |
| DEF-M3-002 | High: files outside static root exposed | NFR-002/M2-R01; raw GET /../../backend/package.json |200; expected404 | Validate decoded raw path before URL normalisation; reject traversal/backslash/null, enforce resolved-root containment and extension allowlist | M3-I02 red-to-green; harmless public package file only | Fix merged; M4 automated regression passed |
| DEF-M3-003 | Medium: missing favicon response hangs | M2-R08; GET /favicon.ico | No completion;expected404 | End all static failure responses; health query correctly delegated | M3-I03 red-to-green | Fix merged; M4 automated regression passed |
| DEF-M3-004 | Medium: inconsistent request identifier | FR-002/004; frontend displayed REQ-id instead of the unique reference | Original browser check confirmed mismatch; retest displays full CC reference in requester/staff queues and staff details | Use request.reference in both queues and the details heading | Edward browser retest, 14 October 2026; see browser-acceptance.md | Fix merged; 14 October browser retest passed; M4 reference comparison not established |
| DEF-M3-005 | High: missing meaningful rejection/resolution reason | FR-010; empty frontend note replaced with generic Status updated | Original resolution check failed; retest blocks blank notes and accepts supplied summaries/reasons | Trim notes and block Resolved/Rejected when blank before sending an API request | Edward browser retest, 14 October 2026; see browser-acceptance.md | Fix merged; resolution/rejection browser retests dated 14 October; M4 browser retest not executed |
| DEF-M3-006 | High for complete core scope: incomplete browser workflows | FR-004/005/006/008/009/011/012 | Requester details/public history/latest feedback now added on this branch; staff and Oversight workflows remain incomplete | Requester-history correction implemented; remaining work needs team allocation | 17 October selected browser checks and 35-test regression; see browser-acceptance.md | Open; partially addressed; peer review pending |

Register new issues/PR links after they exist. No issue numbers or approvals invented. Fixed defects remain regression cases; open defects affect readiness.

## M4 defect review — 17 October 2026

Candidate: f52bb8fd6c15e4a72abf182a9b4fe43511f1027e.

DEF-M3-001 to DEF-M3-003 corrections are merged through PR #20.
Their actual-server regression cases passed in the 17 October 35-test run.

DEF-M3-004 and DEF-M3-005 corrections are included in this candidate.
Reference and resolution/rejection browser retests retain their original
14 October date. The earlier M4 claim is withdrawn: checks that blank
resolution notes are blocked and valid resolution/closure succeeds were not executed.

DEF-M3-006 remains open. Backend/API capability does not complete the
missing requester history, feedback, staff controls and Oversight interface.
The team must record ownership and its final scope/release decision.

These positions update the earlier snapshot; original failures and
historical evidence remain intact. No final release approval is claimed.

## M4 completed-interface review position — 18 October 2026

The previously missing requester/staff/Oversight interfaces are implemented
on feature/m4-complete-workflows. Selected browser workflow checks passed.
Additional API reassignment, rejection, privacy, role and conflict checks passed.

DEF-M3-006 is ready for peer closure review, not silently closed.
Its final disposition must account for the complete baseline scope and
remaining due-date/accessibility/operational acceptance gaps.
See browser-acceptance.md and m4-api-recovery-results.md.

## Team closure of DEF-M3-006 — 18 October 2026

Current status: CLOSED, superseding the earlier open/peer-review position.

Edward Goosen, Albert Du Plooy and Amelia van der Walt confirmed closure
in PR #28: https://github.com/Amelia-VanDerWalt/CivicConnect/pull/28

The merged requester details/history, Staff controls and Oversight reports
resolve the original missing-interface defect. Evidence is recorded in
browser-acceptance.md and m4-api-recovery-results.md; implementation
commit 0230ddc is included in main.

Closure applies to this interface defect. TLS, accessibility, usability,
monitoring and production/off-site recovery limitations remain separately
tracked. Closure does not establish production readiness.
