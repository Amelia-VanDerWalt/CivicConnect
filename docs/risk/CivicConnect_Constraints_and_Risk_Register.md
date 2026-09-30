# CivicConnect Constraints and Risk Register

Prepared by: Edward Goosen — 602882  
Status: Draft for team review  
Milestone: 1

## 1. Project Constraints

| Constraint | Application to CivicConnect | Interaction and trade-off |
|---|---|---|
| Team size | The project must be completed by exactly three students. | Limited capacity requires clear work allocation, peer review and controlled scope. |
| Schedule | CivicConnect must progress through four milestones within the SEN381 delivery period. | Adding functionality reduces the time available for testing, security and documentation. |
| Cost and resources | Free or low-cost services should be preferred, but their limitations and future operational costs must be recorded. | Lower cost may introduce restrictions involving storage, performance, availability or deployment. |
| Scope | Agreed functionality must be baselined and changed through a controlled process. | New features may provide value but increase design, implementation, testing and maintenance work. |
| Quality | Quality expectations must be measurable and later supported by evidence. | Schedule pressure must not result in silently removing testing or lowering acceptance criteria. |
| Security | Security must be considered throughout the lifecycle. Credentials and sensitive information must not be committed to GitHub. | Stronger security controls require additional development and testing but reduce exposure risks. |
| Technology | No programming language, architecture or platform is prescribed during Milestone 1. | Technology selection must be deferred until alternatives can be evaluated against requirements and constraints. |

## 2. Initial Assumptions

- Team members will continue to have access to GitHub and the required university resources.
- Representative requesters, staff and management will be available for later requirements validation.
- Service categories and detailed permission rules will be confirmed before implementation.
- A free or low-cost platform will be sufficient for the academic prototype.
- Proposed operational and performance targets remain subject to team review.

If an assumption proves false, its effect will be assessed and recorded as a risk, issue or controlled change.

## 3. Initial Risk Register

| Risk ID | Description | Cause | Probability | Impact | Priority | Mitigation | Contingency | Owner | Status |
|---|---|---|---|---|---|---|---|---|---|
| RISK-001 | Uncontrolled scope growth could prevent completion of the agreed core system. | Additional features are accepted without analysing their effects. | High | High | Critical | Baseline the core scope and assess every proposed change. | Defer non-essential functionality and prioritise Must requirements. | Edward | Open |
| RISK-002 | The team may implement incorrect or incomplete functionality. | Stakeholder needs, categories or business rules remain unclear. | Medium | High | High | Use clear requirements, acceptance criteria and team reviews. | Pause affected work, clarify the requirement and use change control. | Amelia | Open |
| RISK-003 | The project may be delivered late. | A three-person team has limited capacity and dependent tasks. | High | High | Critical | Allocate owners, use small GitHub issues and monitor milestone dates. | Reduce optional scope and reassign critical work without removing required testing or security. | Edward | Open |
| RISK-004 | The selected technology may exceed the team’s current skills. | The final stack could involve unfamiliar tools or a steep learning curve. | Medium | Medium | Medium | Compare alternatives against team capability before selection. | Choose a simpler supported alternative and record the trade-off. | Albert | Open |
| RISK-005 | Independently produced work may conflict during integration. | Team members use inconsistent terminology, identifiers or interfaces. | Medium | High | High | Agree naming standards, synchronise branches and require pull-request reviews. | Resolve conflicts on a separate branch and repeat the affected reviews. | Albert | Open |
| RISK-006 | Users may gain unauthorised access to service requests or management information. | Role permissions or backend access checks are incomplete. | Medium | High | High | Define role-based access requirements and test every protected action. | Disable affected access, investigate logs, correct permissions and retest. | Albert | Open |
| RISK-007 | Service-request information may be lost or corrupted. | Failed updates, inadequate backups or concurrent changes are handled incorrectly. | Medium | High | High | Plan transactional persistence, backups and recovery testing. | Restore the latest verified backup and record the event as an issue. | Albert | Open |
| RISK-008 | AI-assisted content may introduce unsupported requirements or claims. | AI output is accepted without checking the official briefs. | Medium | Medium | Medium | Record AI use and verify output against primary project documents. | Reject or correct unsupported content and update affected artefacts. | Edward | Monitoring |
| RISK-009 | Free services may not meet later operational needs. | Free tiers may impose storage, performance or availability limitations. | Medium | Medium | Medium | Research platform limits and record likely operational costs. | Select another service or reduce non-essential resource usage through change control. | Albert | Open |

## 4. Highest-Priority Risk

RISK-001, uncontrolled scope growth, is treated as the highest-priority risk because it can increase schedule pressure, cost, complexity, security exposure, testing effort and integration work simultaneously. Every additional CivicConnect feature creates further obligations to specify, implement, secure, test and maintain it.

The main mitigation is to baseline a controlled set of Must requirements and require an impact assessment before accepting additional functionality. If this risk begins to materialise, optional features will be deferred instead of silently reducing required quality or security work.

RISK-003 is also Critical because the three-person team must complete four controlled milestones. These risks are connected because uncontrolled scope directly increases the probability of schedule failure.

## 5. Review and Maintenance

This Risk Register is a live engineering artefact and must be reviewed at every milestone. If a risk materialises, it becomes an issue and must be linked to the relevant requirement, decision, GitHub issue or change record. Probability, impact, priority, ownership and status must be updated when new evidence becomes available.

## Milestone 2 Update — 30 September 2026

Status: Pending team review. These additions retain the existing M1 risks and match PED v2.0 section 18. Owners and ratings require team confirmation.

### Updated Assumptions and Dependencies

- The selected stack is Node.js 24.x, SQLite and vanilla HTML/CSS/JavaScript. The current package requires Node.js >=24.19.0 and <25.
- SQLite assumes one application host with persistent storage.
- Each team member must demonstrate setup and understanding of the selected stack.
- The browser and API use the same origin.
- Operational categories and staff eligibility still require confirmation.
- HTTPS, external monitoring and separate backup storage are proposed deployment dependencies.
- Hosting costs, target performance and recovery times have not been verified.

### Additional M2 Risks

| Risk ID | Description and cause | Probability | Impact | Priority | Mitigation | Contingency | Owner | Status |
|---|---|---|---|---|---|---|---|---|
| M2-R01 | Static-file delivery does not check that resolved paths remain inside the frontend directory; files outside it may become reachable. | Medium | High | High | Restrict paths to the frontend root and test traversal rejection with harmless fixtures. Links: RISK-006; NFR-001/002. | Disable affected static delivery until corrected. | Albert + Edward | Open — code-inspection finding |
| M2-R02 | Merged startup ignores earlier configuration options and removed earlier shutdown handling, creating differences between runtime behaviour and documentation. | High | High | Critical | Restore configuration forwarding and graceful shutdown; check the actual entry point and update the guide. Links: RISK-005; ADR-P2-003. | Limit use to the documented local binding until corrected. | Albert + Edward | Materialised — correction pending |
| M2-R03 | SQLite host/disk failure or writer contention could affect all users. | Medium | High | High | Verify persistent storage, separate backups, recovery and target workload. Links: RISK-007/009; NFR-003/004/008. | Restore a verified snapshot; reconsider persistence when justified. | Edward | Open — initial controls only |
| M2-R04 | Custom HTTP and authentication code increases maintenance responsibility and the chance of missed security cases. | Medium | High | High | Retain negative access tests and verify TLS, payload limits and secret handling. Links: RISK-004/006; NFR-001/002. | Restrict affected functionality and reconsider framework support as scope grows. | Edward | Open — partially mitigated |
| M2-R05 | Browser behaviour differs from acceptance criteria, including missing histories, reference display and fallback rejection/resolution notes. | High | High | Critical | Correct note validation and reference display; complete required UI features and browser checks. Links: RISK-002/005; FR-004/005/006/008/009/010/011/012. | Identify incomplete features clearly and demonstrate verified behaviour. | Albert | Materialised — correction pending |
| M2-R06 | The implemented future-time due-date rule differs from FR-009's later-than-creation wording. | High | Medium | High | Review CR-P2-001 and align the approved rule, acceptance criteria and implementation. Links: RISK-002; FR-009. | Keep the change pending until the team records its decision. | Shared team | Pending change decision |
| M2-R07 | Manual quality claims lack dated, reproducible evidence. | Medium | High | High | Record tester, environment, steps and results; complete usability, accessibility, load and recovery checks. Links: RISK-008; NFR-004/005/006/007/008. | Mark unsupported claims unverified and schedule missing checks. | Shared team | Open |
| M2-R08 | API tests exclude the merged static wrapper, allowing entry-point integration defects to pass. | High | High | Critical | Add checks for frontend assets, configuration and rejection paths. Links: RISK-005/006; NFR-001/002. | Run integration checks before accepting server entry-point changes. | Albert + Edward | Open |
| M2-R09 | A merge may be mistaken for shared baseline approval, branch protection or automated CI gates. | Medium | High | High | Verify two substantive peer reviews and repository settings; introduce a PR test gate. Links: RISK-005/008. | Keep baseline approval pending until evidence is recorded. | Amelia | Open |

### Review of Existing Risks

- RISK-001 and RISK-003 remain Critical: control scope and protect time for required verification.
- RISK-004 remains open: the stack is selected, but capability must be demonstrated by all members.
- RISK-005 has materialised in the startup/documentation mismatch; corrective work is pending.
- RISK-006 remains open: selected API access checks pass, but static delivery needs correction.
- RISK-007 remains open: transaction and snapshot tests pass, but forced-crash and timed recovery checks remain pending.
- RISK-008 remains Monitoring: AI assistance is recorded and human review is still required.
- RISK-002 and RISK-009 remain open pending business-rule and hosting confirmation.

### Evidence and Review Boundary

The inspected main snapshot was commit 1afade59adb1bf1ae57fc4d88b1032ee4dc65e0f. On 30 September 2026, all 24 backend tests passed on Node.js 24.19.0.

These tests do not establish complete browser acceptance, production TLS, target-load performance, outage alerts or timed recovery. Keep this register aligned with PED v2.0 section 18. Formal M2 approval remains pending.
