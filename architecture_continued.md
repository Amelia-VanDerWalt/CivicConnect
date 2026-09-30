**Architecture Alternatives**

Three realistic architecture alternatives were considered.

**Alternative 1 — Simple Monolithic Architecture**

Under a simple monolithic architecture, the user interface, application logic and data-access functionality are implemented within one deployable application.

**Advantages**

- Simple deployment.
- Low infrastructure overhead.
- Easy for a three-person team to understand.
- Suitable for a relatively small academic application.
- Fewer network boundaries and integration points.

**Disadvantages**

- Poor separation of responsibilities if the internal structure is not carefully maintained.
- Changes can become difficult to isolate as functionality grows.
- Security, business logic and data-access responsibilities may become tightly coupled.
- Future scaling of individual parts is less flexible.

**Suitability**

A simple monolith is feasible for CivicConnect, but it requires deliberate internal separation to prevent the codebase becoming tightly coupled.

**Alternative 2 — Modular Layered Architecture**

This approach uses one application but separates responsibilities into logical layers/modules.

A conceptual structure is:

**Presentation → Application → Domain/Business → Persistence → Database**

**Advantages**

- Provides clear responsibility boundaries.
- Supports maintainability and testability.
- Allows business rules to remain independent of the user interface.
- Supports centralised security and authorisation logic.
- Provides a clear persistence boundary.
- Appropriate for the three-person project team.
- Does not require multiple independently deployed services.

**Disadvantages**

- Requires discipline to maintain layer boundaries.
- Slightly more structure than a basic monolith.
- Developers must understand where responsibilities belong.
- Some functionality may require communication between several layers.

**Suitability**

This architecture directly supports CivicConnect's maintainability, security, data-integrity and usability drivers while remaining proportionate to the project scope.

**Alternative 3 — Distributed Service-Oriented Architecture**

Under this approach, major functions such as authentication, request management, reporting and notification could be implemented as separate services.

**Advantages**

- Services can potentially be scaled independently.
- Stronger physical separation of responsibilities.
- Individual services can evolve independently.
- Potentially suitable for a much larger system.

**Disadvantages**

- Multiple deployments are required.
- Introduces network communication between services.
- Increases monitoring and troubleshooting requirements.
- Creates additional configuration and security boundaries.
- Makes local development and testing more complicated.
- Creates additional failure points.
- Greater complexity is difficult to justify for the current CivicConnect scope.

**Suitability**

The architecture could support future service extraction if the system grows substantially, but the additional complexity is not justified by the current M1 requirements and project constraints.

**Selected Architecture**

The selected architecture for CivicConnect is a **modular layered application architecture**.

The logical structure is:

**Presentation Layer**  
↓  
**Application Layer**  
↓  
**Domain / Business Layer**  
↓  
**Persistence Layer**  
↓  
**Database**

This selection provides meaningful responsibility boundaries while avoiding the operational complexity of a distributed architecture.

The decision is based on the following considerations:

1. **Security:** Central application and business layers provide clear locations for authentication, authorisation and protected operations.
2. **Data integrity:** Business rules and transaction-related operations can be controlled before data reaches persistence.
3. **Maintainability:** Changes to the interface, business rules and persistence mechanisms can be isolated.
4. **Usability:** Presentation concerns can evolve without changing the underlying service-request rules.
5. **Performance:** The architecture avoids unnecessary network communication between multiple services.
6. **Team capability:** A modular application is manageable for a three-person development team.
7. **Schedule:** The architecture can be implemented without the additional deployment and integration effort associated with distributed services.
8. **Scope:** The architecture supports the approved service-request lifecycle without introducing functionality or infrastructure that is not currently required.
9. **Future evolution:** Clear internal boundaries allow components to be separated further later if actual system evidence justifies doing so.

This is consistent with the M2 requirement that architecture must be proportionate to the project and that additional distribution should only be introduced when supported by engineering evidence.

**Logical Architecture**

The proposed logical architecture consists of five major areas.

**Presentation Layer**

The Presentation Layer is responsible for user interaction.

Responsibilities include:

- Login and logout interfaces.
- Request submission.
- Requester dashboard.
- Staff work queue.
- Request details.
- Management/oversight views.
- Search, filtering and sorting interfaces.
- Status and feedback presentation.
- Validation messages.
- Accessibility-related interaction behaviour.

The Presentation Layer should not contain core request-lifecycle rules. Instead, it communicates with the Application Layer.

**Application Layer**

The Application Layer coordinates use cases and application operations.

Responsibilities include:

- Authenticating users through the appropriate security mechanism.
- Authorising requested operations.
- Coordinating request submission.
- Coordinating assignment.
- Coordinating priority and due-date changes.
- Coordinating status transitions.
- Coordinating work-log creation.
- Coordinating reporting requests.
- Coordinating audit-record creation.
- Managing application-level validation.

This layer acts as the boundary between the user interface and the underlying business rules.

**Domain / Business Layer**

The Domain/Business Layer contains CivicConnect-specific rules.

Responsibilities include:

- Valid request lifecycle transitions.
- Assignment rules.
- Priority rules.
- Due-date validation.
- Category rules.
- Request visibility rules.
- Resolution and closure rules.
- Work-log visibility rules.
- Business-level validation.

For example, FR-010 requires controlled lifecycle transitions, rejection reasons and resolution summaries. These rules belong in the business/domain responsibility rather than being implemented only in the user interface.

**Persistence Layer**

The Persistence Layer provides controlled access to stored data.

Responsibilities include:

- Creating requests.
- Retrieving requests.
- Updating request information.
- Storing categories.
- Storing users and role information.
- Storing assignments.
- Storing work logs.
- Storing audit records.
- Retrieving management reporting information.
- Supporting transactional operations.
- Supporting concurrency and integrity requirements.

The persistence layer prevents business logic from becoming directly dependent on database-specific operations.

**Database**

The database provides persistent storage for CivicConnect information.

Important information includes:

- Users.
- Roles.
- Service requests.
- Categories.
- Assignments.
- Priorities.
- Due dates.
- Status information.
- Work logs/comments.
- Audit records.

The exact database technology remains a separate technology decision and must be selected using the team's M2 technology-selection evidence.

**Main System Interaction Flow**

A typical service-request submission follows this logical flow:

**Requester**

→ Presentation Layer  
→ Application Layer  
→ Authentication/Authorisation Check  
→ Domain/Business Validation  
→ Persistence Layer  
→ Database  
→ Audit Record  
→ Response to Presentation Layer  
→ Requester Confirmation

For example, when a requester submits a request:

1. The requester enters the required title, description and category.
2. The Presentation Layer performs appropriate input validation.
3. The Application Layer receives the submission.
4. The user's identity and permissions are checked.
5. The Domain/Business Layer verifies that the submission satisfies CivicConnect rules.
6. The Persistence Layer creates the request.
7. The request receives its reference ID, creation time, Normal priority and Received status as required by FR-002.
8. An appropriate activity/audit record is created.
9. The result is returned to the Presentation Layer.
10. The requester receives confirmation.

FR-002 requires the submission to create a retrievable database record and display a confirmation screen, making this a suitable end-to-end architectural path for later implementation evidence.

**Component Responsibility Summary**

| **Component / Module** | **Primary Responsibility**                       | **Related Requirements**                |
| ---------------------- | ------------------------------------------------ | --------------------------------------- |
| Authentication Module  | Login, logout and identity handling              | FR-001, NFR-001, NFR-002                |
| Authorisation Module   | Role and permission checks                       | FR-001, FR-006, FR-008, FR-012, NFR-001 |
| Request Module         | Creation and retrieval of requests               | FR-002, FR-004, FR-006                  |
| Category Module        | Controlled category handling                     | FR-003                                  |
| Workflow Module        | Assignment and lifecycle transitions             | FR-008, FR-009, FR-010                  |
| Feedback Module        | Requester-visible updates and feedback           | FR-005, FR-010                          |
| Work Log Module        | Public/internal notes and resolution information | FR-011                                  |
| Audit Module           | Immutable activity/audit records                 | FR-013                                  |
| Reporting Module       | Management service activity information          | FR-012                                  |
| Persistence Module     | Controlled database interaction                  | FR-002–FR-013, NFR-003                  |
| Presentation/UI        | User interaction and information display         | FR-001–FR-012, NFR-005, NFR-006         |

These are logical responsibilities rather than final implementation classes. The M2 brief specifically states that a complete detailed design for every future class/component is not required.

**Security Architecture Considerations**

Security is treated as a cross-cutting architectural concern.

The architecture must ensure that:

- Authentication occurs before protected functionality is accessed.
- Authorisation is checked at the application/backend boundary.
- Requesters can only access their own requests.
- Staff can only access requests within their authorised categories.
- Oversight users receive the permissions defined for their role.
- Internal staff notes are not exposed to requesters.
- Audit information is not exposed through ordinary requester interfaces.
- Secrets are not stored in source code, client-side files or logs.
- Protected operations cannot be performed merely by manipulating the user interface.

**This is directly supported by FR-004, FR-006, FR-011 and NFR-001/NFR-002.**

**Data Integrity Architecture Considerations**

CivicConnect contains several operations where partial or conflicting updates could damage the correctness of the system.

Examples include:

- Assigning a request.
- Changing priority.
- Changing a due date.
- Transitioning a request status.
- Recording resolution information.
- Closing a request.
- Creating audit records.

The architecture therefore separates business rules from persistence operations and requires related database updates to be treated consistently.

For example, when a request changes from Received to Assigned, the system should not successfully change the status while failing to record the corresponding owner or audit information.

NFR-003 specifically requires failed operations to roll back completely and concurrent edits to be handled without silent overwrites or duplicate records.

**Architecture Decision Record**

**ADR-ARCH-001 — Selection of Modular Layered Architecture**

| **Field**    | **Decision**                                                                                                          |
| ------------ | --------------------------------------------------------------------------------------------------------------------- |
| **Status**   | Accepted for M2 baseline                                                                                              |
| **Date**     | 2026-09-23                                                                                                            |
| **Decision** | Use a modular layered application architecture                                                                        |
| **Scope**    | CivicConnect logical application architecture                                                                         |
| **Drivers**  | Security, data integrity, auditability, maintainability, usability, performance, proportionality and team constraints |

**Context**

CivicConnect requires a controlled service-request platform supporting request submission, categorisation, status tracking, staff assignment, work management, reporting and auditability. The system must enforce role-based access control and maintain reliable request information.

M1 established these requirements but deliberately deferred final architecture and technology selection. The M2 architecture must therefore provide meaningful boundaries while remaining appropriate for the three-person team and the current project scope.

**Alternatives Considered**

1. Simple monolithic architecture.
2. Modular layered architecture.
3. Distributed service-oriented architecture.

**Decision**

CivicConnect will use a **modular layered application architecture** consisting of:

- Presentation Layer
- Application Layer
- Domain/Business Layer
- Persistence Layer
- Database

**Rationale**

The modular layered architecture provides stronger separation of responsibilities than an unstructured monolith while avoiding the additional deployment, networking, monitoring and operational complexity of distributed services.

It directly supports the project's major architectural drivers:

- Security boundaries.
- Data integrity.
- Auditability.
- Maintainability.
- Usability.
- Performance.
- Proportionality.

It is also appropriate for a three-person student team working within fixed milestone and resource constraints.

**Trade-offs**

The selected architecture introduces more structure than a basic monolith. Developers must maintain the boundaries between layers and avoid placing business logic directly inside presentation or persistence code.

However, this additional structure is considered justified because CivicConnect contains multiple roles, controlled workflows, audit requirements and significant business rules.

**Consequences**

Positive consequences include:

- Clear responsibility boundaries.
- Easier maintenance.
- Improved separation of security and business rules.
- More controlled persistence operations.
- Easier future testing.
- Ability to change the interface without rewriting core business rules.

Negative consequences include:

- Additional initial design effort.
- Developers must follow agreed architectural boundaries.
- Small features may sometimes pass through multiple layers.

**Risks**

- Developers may bypass layers for convenience.
- Business logic may become duplicated.
- Excessive abstraction could increase complexity.
- The final technology stack may impose constraints on the implementation.

**Evidence Required**

The decision should be supported during M2 by:

- Architecture diagram.
- Repository structure.
- Initial implementation.
- RTM mappings.
- GitHub commits and Pull Requests.
- Peer-review evidence.
- Initial verification evidence.

The M2 brief requires documented decisions to translate into visible application evidence once implementation has begun.

**Architecture Risk Register Updates**

| **Risk ID** | **Architecture Risk**                                                                               | **Probability** | **Impact** | **Mitigation**                                                                                                   | **Related M1 Risk** |
| ----------- | --------------------------------------------------------------------------------------------------- | --------------- | ---------- | ---------------------------------------------------------------------------------------------------------------- | ------------------- |
| ARCH-R01    | Developers bypass defined layer boundaries, creating unnecessary coupling.                          | Medium          | High       | Define module responsibilities and review architectural changes through Pull Requests.                           | RISK-005            |
| ARCH-R02    | Architecture becomes unnecessarily complex for the project's scope.                                 | Medium          | High       | Apply proportionality and reject abstractions/services without a demonstrated requirement.                       | RISK-001            |
| ARCH-R03    | Security checks are implemented only in the interface and bypassed through direct backend requests. | Medium          | High       | Enforce authorisation at protected application operations and verify negative access cases.                      | RISK-006            |
| ARCH-R04    | Data operations become inconsistent across workflow and persistence components.                     | Medium          | High       | Centralise business rules and use controlled persistence operations.                                             | RISK-007            |
| ARCH-R05    | Technology selection conflicts with the selected logical architecture.                              | Medium          | Medium     | Evaluate technology alternatives against the architecture before finalising the stack.                           | RISK-004            |
| ARCH-R06    | Future growth exposes limitations in the initial architecture.                                      | Low             | Medium     | Maintain clear module boundaries so individual responsibilities can later be separated if evidence justifies it. | RISK-009            |

The architecture risks extend the M1 Risk Register rather than replacing it. M1 already identifies unauthorised access, data corruption/loss, technology capability and free-service limitations as relevant risks.

**Architecture Traceability**

The architecture must extend the M1 RTM so that requirements are connected to architectural responsibilities, later implementation and verification.

The following initial architecture mappings are proposed.

| **Requirement** | **ASR / Quality Driver**                     | **Architecture Responsibility** | **Initial Verification**                 |
| --------------- | -------------------------------------------- | ------------------------------- | ---------------------------------------- |
| FR-001          | ASR-001 Security                             | Authentication + Authorisation  | Login and role-access checks             |
| FR-002          | ASR-002 Data Integrity, ASR-005 Usability    | Request Module + Persistence    | Request creation and retrieval test      |
| FR-003          | ASR-002 Data Integrity                       | Category Module                 | Active/inactive category validation      |
| FR-004          | ASR-001 Security, ASR-005 Usability          | Request Module + Authorisation  | Cross-requester access test              |
| FR-005          | ASR-005 Usability, ASR-003 Auditability      | Feedback Module + Audit Module  | Feedback persistence and visibility test |
| FR-006          | ASR-001 Security                             | Authorisation + Request Module  | Staff category access test               |
| FR-007          | ASR-006 Performance                          | Request/Query Module            | Search/filter/sort verification          |
| FR-008          | ASR-002 Data Integrity                       | Workflow Module                 | Assignment/reassignment test             |
| FR-009          | ASR-002 Data Integrity, ASR-003 Auditability | Workflow + Audit Modules        | Priority/due-date history verification   |
| FR-010          | ASR-002 Data Integrity                       | Workflow/Domain Module          | Valid/invalid transition tests           |
| FR-011          | ASR-003 Auditability, ASR-001 Security       | Work Log + Audit Modules        | Visibility and immutability checks       |
| FR-012          | ASR-006 Performance, ASR-001 Security        | Reporting Module                | Report accuracy and permission checks    |
| FR-013          | ASR-003 Auditability                         | Audit Module + Persistence      | Audit-record verification                |
| NFR-001         | ASR-001 Security                             | Authorisation boundary          | Negative authorisation tests             |
| NFR-002         | ASR-001 Security                             | Security/configuration boundary | Secret and TLS checks                    |
| NFR-003         | ASR-002 Data Integrity                       | Persistence Layer               | Transaction/concurrency tests            |
| NFR-004         | ASR-006 Performance                          | Query/Persistence architecture  | Load/performance verification            |
| NFR-005         | ASR-005 Usability                            | Presentation Layer              | Usability testing                        |
| NFR-006         | ASR-005 Accessibility                        | Presentation Layer              | Keyboard/zoom accessibility checks       |
| NFR-007         | ASR-007 Availability                         | Operational/Monitoring boundary | Planned monitoring verification          |
| NFR-008         | ASR-007 Availability                         | Persistence/Deployment boundary | Backup/recovery verification             |

The M2 RTM should eventually include the additional fields required by the brief, including ASR/quality-driver link, architecture/component responsibility, technology decision, implementation evidence, verification evidence and ADR/risk references.

**End-to-End Architecture Trace**

A meaningful CivicConnect end-to-end trace can be based on **FR-002 — Submit Request**.

**Requirement**

**FR-002:** The system shall accept a request containing a title, description and active category, automatically assigning a unique reference ID, creation time, Normal priority and Received status.

**ASR / Constraint**

- ASR-002 — Data Integrity and Consistency.
- ASR-005 — Usability.
- Three-person team and controlled project scope.

**Architecture Responsibility**

- Presentation Layer captures the request.
- Application Layer coordinates submission.
- Domain/Business Layer validates request rules.
- Persistence Layer stores the request.
- Database provides persistent storage.

**Data Decision**

The request must be stored as a persistent record with the information required to retrieve and manage its lifecycle.

**Design / Interface Decision**

The submission operation should expose only the information necessary for the use case and should not allow the presentation layer to directly manipulate persistence.

**Technology / ADR**

The final technology decision will be recorded in the separate M2 technology ADR once the team has evaluated the candidate stack.

**Application Artefact**

The implemented request-submission module, corresponding UI/form and persistence operation.

**Initial Verification**

Verify that:

1. Required fields are enforced.
2. An active category is accepted.
3. A request record is created.
4. A unique reference is generated.
5. Creation time is stored.
6. Normal priority is assigned.
7. Received status is assigned.
8. The requester receives confirmation.
9. The resulting record can be retrieved.

This follows the M2 requirement for an end-to-end trace from requirement through ASR, architecture responsibility, data decision, design/interface decision, technology/ADR, application artefact and initial verification.

**PED v2.0 Updates**

The following M1 sections should be updated in PED v2.0:

| **PED Section**                    | **M2 Update**                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------------ |
| Scope / Constraints                | Record any approved changes resulting from architecture or technology decisions.           |
| Requirements                       | Preserve M1 requirement IDs and wording unless formal change control is used.              |
| Forward Engineering Considerations | Update deployment, RBAC, persistence, CI/testing, observability and scalability decisions. |
| Risk Register                      | Add architecture-specific risks and update existing risks where necessary.                 |
| RTM                                | Add ASR, architecture responsibility, implementation and verification fields/evidence.     |
| Engineering Decision Log           | Link M2 architecture decisions to ADRs.                                                    |
| Architecture                       | Add ASRs, alternatives, selected architecture and diagrams.                                |
| Technology                         | Record the final technology decision once completed by the responsible team member.        |
| Data/Persistence                   | Record the team's final persistence design and architecture interaction.                   |
| AI Usage Register                  | Record material AI-assisted architecture research/design and human verification.           |
| Baseline Sign-Off                  | Record M2 Architecture, Technology & Initial Design Baseline approval.                     |

The M2 submission requires the evolved **PED v2.0**, updated RTM, Risk Register, assumptions/dependencies and Forward Engineering Considerations, together with architecture diagrams and ADR evidence.

**Architecture Diagram**

The following logical architecture should be represented visually in the M2 architecture diagram:

```
                         CIVICCONNECT
                              │
                              ▼
                  ┌──────────────────────┐
                  │   Presentation/UI    │
                  │                      │
                  │ Requester Interface  │
                  │ Staff Interface      │
                  │ Oversight Interface  │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │   Application Layer  │
                  │                      │
                  │ Authentication       │
                  │ Authorisation        │
                  │ Use-case Coordination│
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ Domain / Business    │
                  │                      │
                  │ Request Workflow     │
                  │ Assignment Rules     │
                  │ Status Rules         │
                  │ Priority Rules       │
                  │ Validation           │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ Persistence Layer    │
                  │                      │
                  │ Request Repository   │
                  │ User Data            │
                  │ Work Logs            │
                  │ Audit Records        │
                  │ Reporting Queries    │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │      Database        │
                  │                      │
                  │ Users / Roles        │
                  │ Requests             │
                  │ Categories           │
                  │ Assignments          │
                  │ Work Logs             │
                  │ Audit Records        │
                  └──────────────────────┘
```

The diagram represents **logical architecture**, not the final physical deployment architecture. The final technology stack and deployment environment should be documented separately.

**Architecture Conclusion**

The M2 architecture establishes CivicConnect as a modular layered application with clear boundaries between presentation, application coordination, business rules, persistence and stored data.

The architecture is driven by the M1 requirements rather than by technology preference. In particular, authentication and role-based access control require a clear security boundary; request lifecycle and audit requirements require controlled business and persistence responsibilities; usability requirements require separation between presentation and business rules; and the team's size and schedule support a proportionate architecture rather than a distributed solution.

The architecture therefore provides a controlled foundation for the subsequent technology, data, interface, implementation and verification decisions in Milestone 2.
