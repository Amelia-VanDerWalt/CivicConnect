# CivicConnect Defect Register

12 October 2026; Person2 verification. Status "fixed locally" is not team approval or release acceptance. Source snapshot c21cacd.

| ID | Severity / impact | Basis and reproduction | Actual vs expected | Correction | Regression evidence | Status |
|---|---|---|---|---|---|---|
| DEF-M3-001 | High: environment configuration unreliable | M2-R02; set PORT=0 and configured APP_ORIGIN, start actual server | Always3000; expected configured binding/origin | Restore HOST/PORT/origin/secure forwarding and graceful close | before-fix.tap M3-I01 fails; after-fix.tap passes | Fixed locally; peer review pending |
| DEF-M3-002 | High: files outside static root exposed | NFR-002/M2-R01; raw GET /../../backend/package.json |200; expected404 | Validate decoded raw path before URL normalisation; reject traversal/backslash/null, enforce resolved-root containment and extension allowlist | M3-I02 red-to-green; harmless public package file only | Fixed locally; peer review pending |
| DEF-M3-003 | Medium: missing favicon response hangs | M2-R08; GET /favicon.ico | No completion;expected404 | End all static failure responses; health query correctly delegated | M3-I03 red-to-green | Fixed locally; peer review pending |
| DEF-M3-004 | Medium: inconsistent request identifier | FR-002/004; frontend table renders REQ-id | Should consistently show backend unique reference | Frontend owner to use reference | Browser B01 pending | Open; code-inspection finding |
| DEF-M3-005 | High: missing meaningful rejection/resolution reason | FR-010; empty frontend note replaced with generic Status updated | Backend sees nonempty placeholder; intended reason/summary is absent | UI must require meaningful user input for these states | Browser B02 pending; API T07/T08 verify truly empty rejection | Open; code-inspection finding |
| DEF-M3-006 | High for complete core scope: missing UI histories/reporting | FR-004/005/006/011/012 | API exists; corresponding screens/history remain incomplete | Person1/3 complete agreed UI scope | Browser acceptance and RTM pending | Open; scope decision required |

Register new issues/PR links after they exist. No issue numbers or approvals invented. Fixed defects remain regression cases; open defects affect readiness.
