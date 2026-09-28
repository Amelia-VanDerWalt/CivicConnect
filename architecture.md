# Architecture, Architecturally Significant Requirements & System Structure

## M1 Baseline Review and Architectural Evolution
Milestone 1 established the **CivicConnect** requirements, stakeholder needs, scope, constraints, risks, and forward-engineering considerations. The M1 baseline identifies a need for a controlled digital platform that manages the complete service-request lifecycle from submission through assignment, status management, resolution, and closure. The system must also provide appropriate visibility to requesters, staff, and management while maintaining accountability and protecting sensitive information.

The M1 baseline deliberately deferred final technology-stack, architecture, database, and deployment decisions. These decisions are therefore developed during Milestone 2 using the approved requirements and quality drivers rather than being selected prematurely.

The architectural concerns identified in M1 include:
* Role-based access control
* Persistence and data migration
* Automated testing and continuous integration
* Observability and audit logging
* Scalability/concurrent users

These concerns directly influence the M2 architecture. The architecture must also respect the three-person team, fixed milestone schedule, limited resources, controlled scope, and security requirements. These constraints mean that unnecessary architectural complexity should be avoided.

***

## Architecturally Significant Requirements and Quality Drivers
Not every requirement has the same architectural importance. The following requirements and quality drivers have been identified as architecturally significant because they materially influence system boundaries, responsibilities, data handling, security controls, and deployment structure.

| ASR ID | Quality Driver | Supporting Requirements | Architectural Significance |
| :--- | :--- | :--- | :--- |
| **ASR-001** | Security and Access Control | FR-001, FR-006, FR-008, FR-012, FR-013, NFR-001, NFR-002 | Requires authentication, role-based authorisation and protected access to requests and management information. |
| **ASR-002** | Data Integrity and Consistency | FR-008, FR-009, FR-010, FR-011, FR-013, NFR-003 | Requires controlled transactions, valid state transitions, consistent updates and protection against concurrent data loss. |
| **ASR-003** | Auditability and Accountability | FR-009, FR-010, FR-011, FR-013 | Requires historical records of important actions, actors, timestamps and previous/new values. |
| **ASR-004** | Maintainability | All core FRs, NFR-003, project constraints | Requires clear separation of responsibilities so that changes to one area do not unnecessarily affect unrelated functionality. |
| **ASR-005** | Usability and Accessibility | FR-002, FR-004, FR-005, NFR-005, NFR-006 | Requires a clear interaction structure for request submission, status visibility and staff workflows. |
| **ASR-006** | Performance | FR-007, FR-012, NFR-004 | Requires efficient retrieval, filtering, sorting and reporting without unnecessarily complex infrastructure. |
| **ASR-007** | Availability and Recoverability | NFR-007, NFR-008 | Requires architectural consideration of monitoring, backup, recovery and failure handling. |
| **ASR-008** | Proportionality and Simplicity | M1 scope, constraints and risks | Requires the architecture to provide the required quality attributes without introducing unnecessary distributed-system complexity. |

### ASR-001 — Security and Access Control
Security is architecturally significant because CivicConnect has three major user roles: Requester, Service Staff and Management/Oversight. M1 requires authentication and role permissions through FR-001 and explicitly requires least-privilege access through NFR-001.

The architecture therefore requires a clear security boundary between the user interface, application logic and protected data. Authorisation must be enforced by the application rather than relying only on interface restrictions. This is particularly important because M1 requires backend requests outside a user's authorised scope to be rejected.

### ASR-002 — Data Integrity and Consistency
CivicConnect manages service-request state, ownership, priority, due dates, work logs and audit information. NFR-003 requires acknowledged transactions to survive system restarts, failed operations to roll back completely and concurrent edits not to result in silent data loss or duplicate records.

The architecture therefore requires a controlled application-to-persistence boundary. Business rules such as valid status transitions and assignment rules should be enforced in the application/business layer rather than being implemented only in the user interface.

### ASR-003 — Auditability and Accountability
FR-013 requires an immutable chronological audit trail containing important changes such as creation, ownership updates, priority changes, due-date changes, status changes and work logs.

This means audit logging must be treated as a core architectural responsibility rather than an optional reporting feature. Changes to important request information should result in persistent audit information that identifies the actor, timestamp and relevant previous/new values.

### ASR-004 — Maintainability
CivicConnect must be developed by a three-person team within the SEN381 milestone schedule. The M1 constraints identify team size and schedule as important limitations.

The architecture should therefore separate major responsibilities without creating excessive abstraction. Authentication, request workflow, reporting and persistence should have identifiable responsibilities so that individual team members can work on related areas without creating unnecessary coupling.

### ASR-005 — Usability and Accessibility
Requester functionality includes submitting requests, viewing previous submissions, checking status and receiving feedback. NFR-005 requires at least 80% of first-time test users to complete ticket submission and status lookup within three minutes without assistance. NFR-006 also requires keyboard navigation, visible focus indicators and functionality at 200% text zoom.

The architecture should therefore keep presentation responsibilities separate from business rules, allowing the user interface to be changed or improved without rewriting the core request-management logic.

### ASR-006 — Performance
NFR-004 defines a target of 95% of read operations completing within two seconds and write operations within three seconds under the specified test conditions.

The architecture should therefore support efficient querying, filtering and sorting. The solution should avoid introducing distributed communication or additional infrastructure unless there is evidence that the expected workload requires it.

### ASR-007 — Availability and Recoverability
NFR-007 requires operational alerts for outages or critical infrastructure failures within 60 seconds, while NFR-008 establishes a 60-minute recovery target and a maximum 24-hour data-loss window.

At M2, these requirements influence architectural decisions around persistence, failure handling, backups and deployment. Full production monitoring and disaster-recovery implementation are not required at this stage, but the architecture must not prevent them from being introduced later.

### ASR-008 — Proportionality and Simplicity
M1 identifies uncontrolled scope growth as the highest-priority risk and requires the team to avoid functionality that creates unnecessary schedule, security, testing and maintenance obligations.

The architecture should therefore use the simplest structure capable of satisfying the approved requirements. A more distributed architecture is not automatically better; additional services would introduce communication, deployment, monitoring and debugging overhead.
