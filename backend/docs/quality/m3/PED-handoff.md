# Person 2 additions for the existing PED v3.0

Integrate these sections into the team's existing PED, preserving history. This file is a handoff, not a separate M3 submission report.

## Section5 — automated verification contribution

35 meaningful top-level cases:24 retained M2 plus11 M3. Six new unit cases, three actual-server integration cases and two complete HTTP system journeys. See test-plan.md, test-matrix.csv and after-fix.tap. Person 3 must connect the commands to genuine CI and record the run/quality gate. Local green evidence is not a hosted CI run.

## Section6 — applied quality strategy

Prioritise ownership/category permissions, atomic history, stale changes and real entry integration because failure affects confidentiality/correctness. Use BVA for API length/time boundaries, EP for valid/invalid types/categories, state transitions for lifecycle, and negative authorised/unauthorised comparisons. Counts establish workload, not completeness.

## Section7 — black-box/integration/system validation

Existing service functional cases and the new units/integration tests exercise EP/BVA/state techniques. M3-S01 follows login→submit→assign→internal note→progress→resolve→close→requester-visible projection→logout. M3-S02 follows invalid submit→isolation checks→rejection reason→stale conflict. Both start the real process with synthetic disk DBs and sessions. Browser clicks/history accessibility are separately pending in browser-acceptance.md; do not relabel HTTP journeys as browser E2E.

## Section9 — defects and quality interpretation

Three baseline failures reproduced before fixing: configuration, path traversal and hanging404. DEF-M3-001..003 fixed locally with regression evidence. DEF-M3-004..006 remain frontend acceptance concerns. Test suite 35/35 passes on Node 24.19.0/Linux; forced-crash, complete browser/quality acceptance, staging and target performance are not established. Exact source hashes and raw evidence are in run-manifest.json.

## Release input — Person 3/team owns final judgement

Local backend regression passes. Full team release is not yet established: CI, staging/performance/static/security checks and browser acceptance must be supplied; open UI defects and CR-P2-001 need decisions. Use Defect_Register.md, Technical_Debt_Register.md and existing RTM additions. The team must identify the final tested release SHA and approve the readiness classification after integrating contributions.

## Defence trace

FR-002/AC-F02 → requester need → RequestService/create → requests+activities transaction → T01/T02/T23/M3-S01/U01/U02 → TAP results → remaining browser confirmation/input-retention gap. NFR-002/M2-R01 → actual static boundary → M3-I02 baseline200 exposure → ADR-P2-004 correction →404 regression→peer-review pending. Explain the evidence's limits rather than only saying35 tests passed.
