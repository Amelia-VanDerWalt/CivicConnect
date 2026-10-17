# CivicConnect Defect Register

12 October 2026; Person2 verification. Status "fixed locally" is not team approval or release acceptance. Source snapshot c21cacd.

| ID | Severity / impact | Basis and reproduction | Actual vs expected | Correction | Regression evidence | Status |
|---|---|---|---|---|---|---|
| DEF-M3-001 | High: environment configuration unreliable | M2-R02; set PORT=0 and configured APP_ORIGIN, start actual server | Always3000; expected configured binding/origin | Restore HOST/PORT/origin/secure forwarding and graceful close | before-fix.tap M3-I01 fails; after-fix.tap passes | Fix merged; M4 automated regression passed |
| DEF-M3-002 | High: files outside static root exposed | NFR-002/M2-R01; raw GET /../../backend/package.json |200; expected404 | Validate decoded raw path before URL normalisation; reject traversal/backslash/null, enforce resolved-root containment and extension allowlist | M3-I02 red-to-green; harmless public package file only | Fix merged; M4 automated regression passed |
| DEF-M3-003 | Medium: missing favicon response hangs | M2-R08; GET /favicon.ico | No completion;expected404 | End all static failure responses; health query correctly delegated | M3-I03 red-to-green | Fix merged; M4 automated regression passed |
| DEF-M3-004 | Medium: inconsistent request identifier | FR-002/004; frontend displayed REQ-id instead of the unique reference | Original browser check confirmed mismatch; retest displays full CC reference in requester/staff queues and staff details | Use request.reference in both queues and the details heading | Edward browser retest, 14 October 2026; see browser-acceptance.md | Fix merged; 14 October browser retest passed; M4 reference comparison not established |
| DEF-M3-005 | High: missing meaningful rejection/resolution reason | FR-010; empty frontend note replaced with generic Status updated | Original resolution check failed; retest blocks blank notes and accepts supplied summaries/reasons | Trim notes and block Resolved/Rejected when blank before sending an API request | Edward browser retest, 14 October 2026; see browser-acceptance.md | Fix merged; M4 blank-resolution validation passed; rejection retest remains dated 14 October |
| DEF-M3-006 | High for complete core scope: missing UI histories/reporting | FR-004/005/006/011/012 | API exists; corresponding screens/history remain incomplete | Person1/3 complete agreed UI scope | Browser acceptance and RTM pending | Open; incomplete browser scope; team decision required |

Register new issues/PR links after they exist. No issue numbers or approvals invented. Fixed defects remain regression cases; open defects affect readiness.

## M4 defect review — 17 October 2026

Candidate: f52bb8fd6c15e4a72abf182a9b4fe43511f1027e.

DEF-M3-001 to DEF-M3-003 corrections are merged through PR #20.
Their actual-server regression cases passed in the 17 October 35-test run.

DEF-M3-004 and DEF-M3-005 corrections are included in this candidate.
Reference and resolution/rejection browser retests retain their original
14 October date. The M4 browser journey additionally confirmed that blank
resolution notes are blocked and valid resolution/closure succeeds.

DEF-M3-006 remains open. Backend/API capability does not complete the
missing requester history, feedback, staff controls and Oversight interface.
The team must record ownership and its final scope/release decision.

These positions update the earlier snapshot; original failures and
historical evidence remain intact. No final release approval is claimed.
