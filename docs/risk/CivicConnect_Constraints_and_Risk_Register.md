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