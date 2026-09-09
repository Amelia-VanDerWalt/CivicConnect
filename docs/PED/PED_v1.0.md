# Project Engineering Document (PED v1.0)
**Project:** CivicConnect
**Team:** Albert Du Plooy - 601969, Amelia van der Walt - 601649, Edward Goosen - 602882

## Document Control
| Version | Date | Changes | Author(s) |
| :--- | :--- | :--- | :--- |
| 1.0 | 2026-09-09 | Initial baseline formulation for Milestone 1 | Albert, Amelia, Edward |

---

## 1. Problem Statement & Business Need
### 1.1 Problem Statement
CivicConnect addresses the current fragmented management of community service requests. The organization currently relies on multiple communication and record-keeping channels, including email, telephone calls, WhatsApp messages, spreadsheets and paper-based records.

This fragmented process creates several operational problems. Service requests can be duplicated, overlooked, incorrectly assigned or lost between communication channels. Requesters have limited visibility of the progress of their requests, while staff experience difficulties with prioritization, ownership and coordination. Management also lacks reliable information about outstanding, overdue, resolved, and closed work.

The absence of a single controlled record also weakens accountability because changes to request status and actions taken are difficult to track consistently. Reporting is manual and difficult to audit, while sensitive information may be handled inconsistently across informal communication channels.

### 1.2 Business Need
The organization requires a controlled digital platform that provides a reliable, traceable and usable method for submitting, managing, monitoring and reporting on service requests.

CivicConnect should therefore establish a single controlled lifecycle for service requests. The intended business value is to:
* Improve visibility of request progress.
* Reduce the likelihood of requests being overlooked or lost.
* Improve assignment and accountability.
* Provide staff with structured ways to manage requests.
* Provide management with useful service performance information.
* Improve consistency or reporting.
* Provide a controlled record of request activity.
* Reduce reliance on fragmented informal communication channels.

This solution must achieve these improvements without creating an unsustainable technical, operational or financial burden.

---

## 2. Stakeholder Analysis
### 2.1 Stakeholder Identification
| ID | Stakeholder | Role/Interest | Main Needs | Influence | Interest |
| :--- | :--- | :--- | :--- | :--- | :--- |
| STK-001 | Requester | Submits and monitors service request | Easy submission, status visibility, request history and meaningful feedback | Medium | High |
| STK-002 | Service Staff | Processes and resolves requests | Request details, prioritization, assignment, controlled status updates and resolution recording | High | High |
| STK-003 | Management / Oversight | Monitors service performance | Visibility of open, overdue, resolved and closed work and useful reporting information | High | High |
| STK-004 | Project Team | Engineers and maintains CivivConnect | Clear requirements, controlled scope, traceability and feasible engineering constraints | High | High |
| STK-005 | Academic Assessor / Lecturer | Evaluates engineering evidence | Traceable, controlled and defensible project evidence | high | Medium |

### 2.2 Stakeholder Needs
**STK-001 Requester**
The Requester needs to:
* Submit a new service request with the appropriate information.
* Categorise the request using a controlled category mechanism.
* View the current status of submitted requests.
* View previously submitted requests.
* Receive meaningful feedback when a request is accepted, rejected, updated or completed.

**STK-002 Service Staff**
Service staff need to:
* View service requests relevant to their authorization.
* Search, filter or sort requests.
* View full request details.
* Accept or be assigned responsibility for requests.
* Update request status though controlled transitions.
* Record relevant actions, comments or resolution information.
* Resolve or close request where authorized.

**STK-003 Management/Oversight**
Management needs to:
* View useful service activity information.
* Identify open, overdue, resolved and closed requests.
* Review requests by category, status or other justified dimensions.
* Access sufficient information for accountability and service performance analysis.

**STK-004 Project Team**
The engineering team needs:
* A controlled and agreed scope.
* Clear functional and non-functional requirements.
* Testable acceptance criteria.
* Traceability between stakeholders, requirements and later engineering evidence.
* Requirements that are feasible within project constraints.

**STK-005 Academic Assessor/Lecturer**
The project evidence needs to demonstrate:
* Controlled requirements.
* Traceability.
* Evidence of individual contribution.
* Engineering reasoning.
* Appropriate configuration management and baseline control.

### 2.3 Stakeholder Conflicts and Competing Expectations
* **Conflict 1 - Ease of use vs information completeness:** Requesters need a simple and usable submission process. Staff need sufficient information to process requests correctly. *Engineering implication:* The request submission requirements must collect information necessary for processing without unnecessarily increasing requester effort.
* **Conflict 2 - Visibility vs security:** Requesters need visibility of their requests, while sensitive request information must not be exposed to unauthorised users. *Engineering implication:* Requirements for request visibility must be considered together with authorisation and security requirements.
* **Conflict 3 - Management reporting vs project scope:** Management may benefit from increasingly detailed reporting, but every additional reporting feature increase requirements, implementation, testing and maintenance obligations. *Engineering implication:* Reporting requirements must remain within the approved scope unless additional functionality is justified and formally controlled.
* **Conflict 4 - Feature breadth vs delivery constraints:** Stakeholders may benefit from additional functionality, but the project has fixed schedule, resource, quality and cost constraints. *Engineering implication:* The team should prioritise the minimum business capabilities and avoid uncontrolled scope expansion.

---

## 3. Scope Baseline
CivicConnect will provide a controlled digital platform for managing community service requests. The platform will support the core lifecycle of a service request from submission through management, status tracking and resolution/closure, together with appropriate information for management oversight.

### 3.1 In-Scope
**Requester functionality:**
* Creation of a new service request.
* Capturing appropriate request information.
* Categorisation of service requests.
* Viewing the current status of submitted requests.
* Viewing previously submitted requests.
* Providing meaningful feedback when a request is accepted, rejected, updated or completed.

**Staff Functionality:**
* Viewing service requests relevant to authorised staff.
* Searching, filtering and/or sorting requests.
* Viewing complete request details.
* Assigning or accepting responsibility for requests.
* Controlled request status updates.
* Recording relevant actions and comments.
* Recording resolution information.
* Resolving or closing requests where authorised.

**Management/oversight functionality:**
* Viewing useful service activity information.
* Identifying open request.
* Identifying overdue requests.
* Identifying resolved requests.
* Identifying closed requests.
* Viewing information by category or status where justified.
* Supporting accountability and service performance analysis.

**Engineering scope:**
* Requirements engineering, traceability, and quality requirements.
* Security considerations, risk management, and controlled change.
* Verification and testing in later milestones.
* Controlled deployment and operational considerations in later milestones.

### 3.2 Out-of-Scope for the Current Baseline
The following are not committed as part of the Milestone 1 scope baseline unless later approved through controlled change:
* Unspecified advanced reporting functionality.
* Unspecified external service integrations.
* Features not justified by stakeholder value.
* Functionality unrelated to the core service request lifecycle.
* Additional functionality introduced solely because it is technically interesting.
* Features that would materially increase scope without corresponding schedule, resource, quality, security, and cost analysis.

Milestone 1 is a foundation milestone and does not require final technology-stack selection, final architecture, detailed database implementation, detailed User Interface(UI) implementation, Application Programming Interface(API) implementation, Continues Implementation(CI) pipeline implementation, extensive application code or production deployment.

### 3.3 Future/Optional Scope
The following areas may be considered later if stakeholder value and engineering constraints justify them:
* Additional reporting capabilities and advanced management analytics.
* Additional service request categories or workflows.
* Additional notification mechanisms and integrations.

### 3.4 Deliberate Exclusion
A deliberate exclusion is advanced or unspecified functionality that is not necessary to demonstrate the minimum CivicConnect business capabilities. For example, advanced analytics is not included in the initial baseline because the brief establishes the need for useful service activity information but does not define a detailed advanced analytics capability. Deferring such functionality protects the team from unnecessary scope growth while preserving the option to reconsider it when additional stakeholder evidence and engineering capacity are available.

---

## 4. Requirements & Acceptance Criteria
### 4.1 Functional Requirements
#### 4.1.1 Requester Access & Visibility
| ID & Priority | Requirement | Source | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **FR-001**(Must) | **Sign In and Out:** The platform shall authenticate users and apply their assigned role permissions (Requester, Staff, Oversight). Users must be able to securely sign out. | All users; MB §§3, 16 | **AC-F01:** A valid login grants access only to authorised features. Invalid credentials prevent login. Post sign-out, browser navigation backward cannot retrieve or modify protected records. |
| **FR-002**(Must) | **Submit Request:** The system shall accept requests containing a title, description, and active category (location or asset details remain optional). Upon submission, it auto-assigns a unique reference ID, creation time, Normal priority, and Received status. | Requester; MB §3 | **AC-F02:** Submitting a valid form creates a retrievable database record and displays a confirmation screen. Missing required fields blocks submission, highlights the missing inputs, and retains already entered text. |
| **FR-003**(Must) | **Controlled Categories:** The system shall restrict category selection to an approved active list. Existing requests must maintain their category label if that category is later retired. | Requester / Staff; MB §3 | **AC-F03:** Active categories are accepted. Invalid or inactive category submissions are rejected. Deactivating or retiring a category does not remove or alter category labels on existing ticket histories. |
| **FR-004**(Must) | **Submission History:** The system shall allow requesters to view a list of their past submissions and inspect current status, submitted details, and visible history (including closed and rejected tickets). | Requester; MB §3 | **AC-F04:** Requesters can see all their submitted records and associated status details upon refreshing. Requesters cannot view or access another user's submissions. |
| **FR-005**(Must) | **In-App Feedback:** The system shall retain in-platform activity updates for receipt, assignment, rejection, priority updates, due-date changes, status transitions, and public comments. Resolution and closure must be clearly highlighted. | Requester; MB §3 | **AC-F05:** After any update, the requester’s dashboard displays the timestamp, reference ID, and clear explanation note. Rejections display reasons, and resolutions display summaries. Internal staff notes remain hidden. Feedback persists across sign-outs. |

#### 4.1.2 Responsibility, Workflows & Oversight
| ID & Priority | Requirement | Source | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **FR-006**(Must) | **Authorised Work Queue:** The system shall display tickets within a staff member's authorised categories and allow full inspection of submitted details, owner, priority, due time, status, and history. | Staff; MB §3 | **AC-F06:** Queues display only in-scope category tickets for the logged-in staff member. Opening an in-scope record displays all fields. Direct access attempts to out-of-scope categories are denied. |
| **FR-007**(Must) | **Search, Filter, and Sort:** The system shall support reference code or title searches, filters (by status, category, owner, priority, creation date), and ascending/descending sorting by creation date or due date. | Staff; MB §3 | **AC-F07:** Search and combined filters return exact matching records within authorised categories. Sorting correctly orders results, placing unscheduled/undated items last. Empty searches show a clear 'No results found' message. |
| **FR-008**(Must) | **Assign Responsibility:** Authorised staff shall accept/assign a Received request (updating status to Assigned) or reassign an active request to another eligible team member. Assignment requires setting a priority and due time. | Staff; MB §3 | **AC-F08:** Assignment locks the ticket to one category-authorized owner. Ineligible owners or missing due dates abort the assignment. Reassignment preserves the prior owner in the history log and notifies the requester. |
| **FR-009**(Must) | **Priority and Due Date Management:** Authorised staff shall set or update priorities (Low, Normal, High) and set target completion dates (must be later than creation time). | Staff / Oversight; MB §§2, 3 | **AC-F09:** Valid priorities and future due dates are saved successfully. Past due dates or invalid values are rejected. Modifications retain previous values, actor ID, timestamp, and update reason in the audit history. |
| **FR-010**(Must) | **Controlled Lifecycle Transitions:** Staff shall transition request statuses strictly following Rule R2. Rejections require reason notes, resolutions require summaries, and closure requires prior resolution. | Staff; MB §3 | **AC-F10:** Valid state transitions execute properly with mandatory notes. Missing notes or invalid state jump attempts are blocked without changing database state. Resolution and closure trigger requester notifications. |
| **FR-011**(Must) | **Work History & Action Logging:** Authorised staff shall append work logs, progress notes, and resolution text. Every note must be explicitly flagged as Requester-Visible or Internal-Only before saving. | Staff; MB §3 | **AC-F11:** Saved notes preserve author, timestamp, text, and visibility flag. Requesters only see public notes. Corrections are appended as new notes; historical logs cannot be edited or deleted through normal user interfaces. |
| **FR-012**(Must) | **Management Reporting:** The system shall generate aggregate reports showing open, overdue, resolved, closed, and rejected counts by category for defined date ranges. It shall report undated tickets, ownership, and MTTR as defined in R4. | Oversight; MB §3 | **AC-F12:** Generated report metrics, boundary date filters, and breakdown counts match underlying data exactly. Only resolved/closed tickets calculate into MTTR. Oversight roles cannot modify tickets without staff rights. |
| **FR-013**(Must) | **Audit Trail:** The system shall maintain an immutable, chronological log of creation, ownership updates, priority shifts, due-date adjustments, status changes, and work logs. | Staff / Oversight; MB §§2, 3 | **AC-F13:** System updates generate sequential audit log records capturing actor ID, timestamp, prior values, and new values. Standard interfaces prevent editing or deleting audit logs. Requesters cannot view internal audit details. |

### 4.2 Non-Functional Requirements
| ID & Priority | Requirement | Source | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **NFR-001**(Must) | **Access Control & Least Privilege:** The platform shall enforce strict role-based access checks on all protected API endpoints and system actions, blocking unauthorised direct backend requests. | All users; MB §16 | **AC-N01:** Role matrix tests verify that unauthorised read/write attempts (e.g., cross-requester views, out-of-scope staff edits) fail cleanly without exposing sensitive system information or altering state. |
| **NFR-002**(Must) | **Data & Secret Protection:** Transmitted credentials and data must be encrypted in transit (TLS). Operational secrets, API keys, and passwords must be excluded from code repositories, client-side files, and logs. | All users / Team; MB §§9, 16 | **AC-N02:** Network traffic audits confirm HTTPS/TLS encryption. Automated repository and log scans confirm no hardcoded secrets or credentials exist in codebase or build outputs. |
| **NFR-003**(Must) | **Data Integrity & Concurrency:** Acknowledged transactions must persist through system restarts. Failed operations must roll back completely. Concurrent edits must not cause data loss or duplicate records. | Requester / Staff; MB §§2, 4 | **AC-N03:** Database recovery checks confirm zero state loss after forced application restarts. Failed updates leave no partial entries. Concurrent updates are handled cleanly without silent overwrites. |
| **NFR-004**(Should) | **System Responsiveness:** Under load (5,000 active records, 20 concurrent users), 95% of read operations (search, lists, details) complete within 2.0s, and write operations complete within 3.0s. | All users; MB §§4, 11 | **AC-N04:** A 15-minute steady-state load test (80% reads, 20% writes) measures client-to-server transaction times, verifying performance target compliance. |
| **NFR-005**(Should) | **User Accessibility & Usability:** At least 80% of first-time test users can successfully submit a ticket and look up its status within 3 minutes without assistance. | Requester; MB §§2.1, 4 | **AC-N05:** Unassisted usability testing with representative user groups tracks task completion time and error rates to verify target usability metrics. |
| **NFR-006**(Should) | **WCAG Accessibility Compliance:** Submission, lookup, and staff queue workflows shall support full keyboard navigation, display visible focus indicators, and support 200% text zooming without loss of functionality. | All users; MB §§2.1, 4; W3C (2024) | **AC-N06:** Interface testing verifies keyboard navigation (WCAG 2.1.1), visible focus styling (WCAG 2.4.7), and responsive page rendering at 200% font scaling (WCAG 1.4.4). |
| **NFR-007**(Must) | **Operational Monitoring:** System administrators must be alerted to service outages or critical infrastructure failures within 60 seconds. Diagnostic logs must exclude credentials and sensitive request text. | Operations team; MB §17 | **AC-N07:** Simulated service outages confirm monitoring system alerts trigger within 60 seconds. System logs confirm error correlation IDs and timestamps are captured without logging sensitive payload data. |
| **NFR-008**(Must) | **Backup and Disaster Recovery:** In a critical data-loss event, system recovery shall occur within 60 minutes (RTO), with no more than 24 hours of lost data (RPO). | Organisation / Ops; MB §17 | **AC-N08:** Simulated database recovery tests verify full system restoration from backup files within 60 minutes, ensuring recovered data integrity. |

---

## 5. Constraints & Assumptions

| Constraint | Application to CivicConnect | Interaction and trade-off |
|---|---|---|
| Team size | The project must be completed by exactly three students. | Limited capacity requires clear work allocation, peer review and controlled scope. |
| Schedule | CivicConnect must progress through four milestones within the SEN381 delivery period. | Adding functionality reduces the time available for testing, security and documentation. |
| Cost and resources | Free or low-cost services should be preferred, but their limitations and future operational costs must be recorded. | Lower cost may introduce restrictions involving storage, performance, availability or deployment. |
| Scope | Agreed functionality must be baselined and changed through a controlled process. | New features may provide value but increase design, implementation, testing and maintenance work. |
| Quality | Quality expectations must be measurable and later supported by evidence. | Schedule pressure must not result in silently removing testing or lowering acceptance criteria. |
| Security | Security must be considered throughout the lifecycle. Credentials and sensitive information must not be committed to GitHub. | Stronger security controls require additional development and testing but reduce exposure risks. |
| Technology | No programming language, architecture or platform is prescribed during Milestone 1. | Technology selection must be deferred until alternatives can be evaluated against requirements and constraints. |

### 5.1 Initial Assumptions

Team members will continue to have access to GitHub and the required university resources.
- Representative requesters, staff and management will be available for later requirements validation.
- Service categories and detailed permission rules will be confirmed before implementation.
- A free or low-cost platform will be sufficient for the academic prototype.
- Proposed operational and performance targets remain subject to team review.

If an assumption proves false, its effect will be assessed and recorded as a risk, issue or controlled change.

---

## 6. Risk Register

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

### 6.1 Highest-Priority Risk

RISK-001, uncontrolled scope growth, is treated as the highest-priority risk because it can increase schedule pressure, cost, complexity, security exposure, testing effort and integration work simultaneously. Every additional CivicConnect feature creates further obligations to specify, implement, secure, test and maintain it.

The main mitigation is to baseline a controlled set of Must requirements and require an impact assessment before accepting additional functionality. If this risk begins to materialise, optional features will be deferred instead of silently reducing required quality or security work.

RISK-003 is also Critical because the three-person team must complete four controlled milestones. These risks are connected because uncontrolled scope directly increases the probability of schedule failure.

### 6.2 Review and Maintenance

This Risk Register is a live engineering artefact and must be reviewed at every milestone. If a risk materialises, it becomes an issue and must be linked to the relevant requirement, decision, GitHub issue or change record. Probability, impact, priority, ownership and status must be updated when new evidence becomes available.

---

## 7. Requirements Traceability Matrix (RTM)
*Note: Status Legend - P = Pending Artifact/Evidence (Design, code, PRs, and test evidence will be attached during development). All requirements are now Baselined.*

| Req ID | Stakeholder Source | AC Basis | Design | Issue/PR | Impl. | Test Evid. | Release |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FR-001** | All users; MB §§3, 16 | AC-F01 | P | P | P | P | P |
| **FR-002** | Requester; MB §3 | AC-F02 | P | P | P | P | P |
| **FR-003** | Requester / Staff; MB §3 | AC-F03 | P | P | P | P | P |
| **FR-004** | Requester; MB §3 | AC-F04 | P | P | P | P | P |
| **FR-005** | Requester; MB §3 | AC-F05 | P | P | P | P | P |
| **FR-006** | Staff; MB §3 | AC-F06 | P | P | P | P | P |
| **FR-007** | Staff; MB §3 | AC-F07 | P | P | P | P | P |
| **FR-008** | Staff; MB §3 | AC-F08 | P | P | P | P | P |
| **FR-009** | Staff / Oversight; MB §§2, 3 | AC-F09 | P | P | P | P | P |
| **FR-010** | Staff; MB §3 | AC-F10 | P | P | P | P | P |
| **FR-011** | Staff; MB §3 | AC-F11 | P | P | P | P | P |
| **FR-012** | Oversight; MB §3 | AC-F12 | P | P | P | P | P |
| **FR-013** | Staff / Oversight; MB §§2, 3 | AC-F13 | P | P | P | P | P |
| **NFR-001** | All users; MB §16 | AC-N01 | P | P | P | P | P |
| **NFR-002** | All users / Team; MB §§9, 16 | AC-N02 | P | P | P | P | P |
| **NFR-003** | Requester / Staff; MB §§2, 4 | AC-N03 | P | P | P | P | P |
| **NFR-004** | All users; MB §§4, 11 | AC-N04 | P | P | P | P | P |
| **NFR-005** | Requester; MB §§2.1, 4 | AC-N05 | P | P | P | P | P |
| **NFR-006** | All users; MB §§2.1, 4; W3C | AC-N06 | P | P | P | P | P |
| **NFR-007** | Operations team; MB §17 | AC-N07 | P | P | P | P | P |
| **NFR-008** | Organization / Ops; MB §17 | AC-N08 | P | P | P | P | P |

---

## 8. Forward Engineering Considerations
**1. Deployment and Hosting Environment**
*   **Why it matters now:** We must determine if CivicConnect will be hosted on-premise, via cloud services, or on a specific operating system environment.
*   **What later decision it influences:** The final technology stack, database engine, and CI/CD pipeline architecture.
*   **Missing information:** We do not yet know the client's budget constraints for hosting or their existing infrastructure.
*   **Risk of ignoring:** Developing on a stack that is ultimately incompatible with the client's deployment capabilities could result in expensive rework.

**2. Role-Based Access Control (RBAC) & Security**
*   **Why it matters now:** CivicConnect handles multiple user types (Requesters, Staff, Management) with differing permissions.
*   **What later decision it influences:** Database schema design, authentication methods, and API endpoint security.
*   **Missing information:** The exact hierarchy and data-visibility rules between Staff and Management.
*   **Risk of ignoring:** Failing to plan for RBAC early could lead to data leakage or a complete rewrite of the authentication logic.

**3. Data Migration and Persistence**
*   **Why it matters now:** The current system uses paper, WhatsApp, and spreadsheets. We must consider if legacy data needs to be imported.
*   **What later decision it influences:** Database schema design and the creation of data migration scripts.
*   **Missing information:** Whether stakeholders require historical spreadsheet data to be accessible in the new system.
*   **Risk of ignoring:** Data loss or severe launch delays due to unplanned database formatting conflicts.

**4. Automated Testing & Continuous Integration (CI)**
*   **Why it matters now:** To ensure code quality, we must establish how tests will be run before code merges.
*   **What later decision it influences:** The selection of our testing frameworks and GitHub Actions/workflows.
*   **Missing information:** Which specific backend and frontend frameworks we will use, dictating the testing tools.
*   **Risk of ignoring:** Manual testing will become a bottleneck, leading to unverified code entering the `main` branch.

**5. Observability and Audit Logging**
*   **Why it matters now:** Management needs to hold staff accountable for request updates.
*   **What later decision it influences:** How we design our backend logging architecture and database triggers.
*   **Missing information:** The specific metrics Management wants to track (e.g., time-to-resolution, frequency of status changes).
*   **Risk of ignoring:** If tracking isn't built into the core data models, generating management reports will be impossible.

**6. Scalability and Concurrent Users**
*   **Why it matters now:** Community faults could spike during major events (e.g., severe weather), causing a surge in concurrent users.
*   **What later decision it influences:** Server architecture, database indexing, and performance requirements.
*   **Missing information:** The expected baseline versus peak user load.
*   **Risk of ignoring:** The system could crash during critical periods of high community need.

---

## 9. Engineering Decision Log
| Decision ID | Context | Constraints | Alternatives | Decision | Rationale | Trade-offs | Risks | Evidence | Later consequence |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| DEC-001 | Milestone 1 requires strict version control and peer review for all engineering documents. | Must support two-reviewer approvals and allow line-by-line verification. | Local Word files, Google Docs, GitHub repository with Markdown. | Use GitHub with protected `main` branch and Markdown (.md) files. | Markdown allows line-by-line difference tracking in GitHub, enabling verifiable peer review for text documents. | Requires a learning curve for team members unfamiliar with Markdown syntax. | Team might bypass PR rules if formatting becomes too difficult. | Master Project Brief governance rules. | All project documentation will be stored and versioned as code. |
| DEC-002 | Selection of the core programming languages, frameworks, and database architecture. | Must align with team capability, budget, and NFRs. | Evaluate candidate technology stacks during Milestone 2. | Deferred to future milestone. | A final selection cannot be made until Functional and Non-Functional Requirements are finalized and baselined. | Delays initial prototyping. | If delayed too long, the construction phase in M2 will be compressed. | Milestone 1 Brief explicitly limits premature implementation. | A formal tech stack ADR will be completed in future milestone once constraints are clear. |
| DEC-003 | Defining the scope boundary for management reporting and analytics in Milestone 1 to protect the project from uncontrolled scope expansion. | Must deliver core management oversight capabilities required by the Master Project Brief within strict schedule, resource, and delivery constraints. | 1. Fully build advanced reporting and predictive analytics into the initial baseline. 2. Omit all management oversight capabilities entirely. 3. Include basic management oversight views in the core baseline. | Retain basic management oversight capabilities in-scope (viewing open, overdue, resolved, and closed requests) and formally defer advanced reporting and analytics to future/optional scope. | The Master Project Brief requires useful service activity information but does not define or require complex advanced analytics. Deferring advanced reporting protects the project from scope creep during early foundation phases. | Delays custom reporting, data exports, and complex analytical insights for management. | Management stakeholders may express frustration if initial basic oversight views do not meet every operational analytical need. | CivicConnect Scope Baseline v1.0 (Section: Future/optional scope & Deliberate exclusion) and Stakeholder Analysis v1.0 (Section: Conflict 3). | Any future inclusion of advanced reporting will require formal impact analysis (evaluating scope, schedule, cost, and security) through the change control process. |
| DEC-004 | Designing the service request capture mechanism to balance requester usability against staff data needs. | Must preserve ease of use for requesters while capturing sufficiently structured data for staff to process and assign requests. | 1. Open-ended, unstructured free-text fields for all input. 2. Extensive, multi-page mandatory form fields. 3. Standardized submission form with a controlled request categorisation mechanism. | Implement a standardized request submission form featuring a controlled category mechanism. | Derived directly from stakeholder needs (STK-001 / FR-001, FR-002). Controlled categories allow staff to search, filter, and assign requests efficiently without creating an unreasonable data-entry burden for requesters. | Requesters must select from a predefined category list, which slightly limits open-ended input flexibility. | Potential misclassification of requests if the category list is ambiguous or incomplete. | Stakeholder Analysis v1.0 (Derived Requirements: FR-001, FR-002, and Conflict 1) and CivicConnect Scope Baseline v1.0 (Scope Prioritisation: Must Have). | Requires validation during UI/UX prototyping in Milestone 2 and potential dynamic category administration features in later scope updates. |

---

## 10. AI Usage Register
| Date | Student | Tool | Engineering task | AI contribution | Verification | Decision | Issues found |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 07/09/2026 | Amelia | ChatGPT | Work Devision between 3 | Gave fair devision of work for the 3 of us | Checked with the group if they agreed that hte workload was spread evenly | ACCEPTED | Seems to have no Error |
| 07/09/2026 | Amelia | ChatGPT | Clearer explanation of what needs to be done | Gave me a better understanding of what I needed to do | Verified with my team if they also understood it like the output given | ACCEPTED | Seems to have no errors |
| 08/09/2026 | Amelia | ChatGPT | Sectioning the different deliverables | Gave a suggested devision of the deliverables | Checked that the devision made sense | ACCEPTED | There seems to have been no error |
| 09/09/2026 | Amelia | ChatGPT | Document layout | Document layout suggestions | Checked that it looks profesional | MODIFIED | AI output gave to many bullet points so I made it less |
| 09/09/2026 | Albert | Gemini | Task Brainstorming Forward Engineering Considerations | Suggested a list of 10 potential future lifecycle concerns related to web architectures AI generated | Cross-referenced the suggestions against the CivicConnect scenario to ensure relevance. Filtered out suggestions that crossed into premature implementation checked it | MODIFIED | AI suggested finalizing the CI/CD pipeline immediately; rejected this to comply with M1 boundaries against premature implementation |
| 09/09/2026 | Albert | Gemini | Provide format for AI register and decision log table | Generated the initial Markdown syntax for the AI Usage Register and Engineering Decision Log tables. | Checked to see if coloumns aligned with project | ACCEPTED | None |
| 09/09/2026 | Edward Goosen 602882 | ChatGPT | Reviewing and organising the Person 2 requirements section | Suggested clearer wording and a structure for presenting the requirements, acceptance criteria and RTM | Compared the suggestions with the Master Project Brief, checked the requirement links and reviewed the final content myself | MODIFIED | Some suggested rules and targets were not confirmed by the brief, so I marked them for team review |

---

## Appendix: Baseline Sign-Off
| Project | CivicConnect |
| :--- | :--- |
| **Baseline Type** | Milestone 1 (M1) Engineering Foundation |
| **Version** | v1.0 |
| **Date** | 2026-09-09 |
| **Scope reviewed** | YES |
| **Requirements/traceability checked** | YES |
| **Risk review completed** | YES |
| **Repository/governance controls checked** | YES |
| **Outcome** | **ACCEPTED** |