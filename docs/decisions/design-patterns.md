### Design Problem 1: Request Creation & Categorisation

| Decision ID | Context | Constraints | Alternatives | Decision | Rationale | Trade-offs | Risks | Evidence | Later consequence |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| DES-001 | CivicConnect must handle the creation of various service request types based on requester input. | Must remain maintainable as new categories are added, strictly following requirement FR-003. | 1. Conditional Logic / Data-Driven Association. 2. Factory Method Pattern. | **Implement Conditional Logic / Data-Driven Model (Reject Factory Method).** | Assignment 2 recommended Factory Method if request types had complex, distinct behaviors. However, an evaluation of our domain logic (`policy.js`) and database schema confirms categories are purely data-driven labels, not distinct behavioral subclasses. Implementing a Factory Pattern would introduce unnecessary complexity, violating M2 guidelines against over-engineering. | Relying on a unified Request model means any future category requiring highly specialized backend processing will necessitate refactoring. | Potential null-field bloating in the database if future categories require vastly different data fields. | Assignment 2, §1.4 (Comparison of Conditional Logic and Factory Method), and current `RequestService` implementation. | New service categories can be added directly via database administration without requiring Node.js source-code modifications. |

**Affected Components & Expected Collaboration (DES-001):**
*   `RequestService` (Application Service)
*   `RequestRepository` (Persistence)
*   `policy.js` (Domain Business Rules)

    [Requester UI] --> [RequestService.create()] --> [RequestRepository] --> SQLite Database
                              

---

### Design Problem 2: Request Status Reactions

| Decision ID | Context | Constraints | Alternatives | Decision | Rationale | Trade-offs | Risks | Evidence | Later consequence |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| DES-002 | When a request status changes, the system must fulfill FR-011 (Action Logging) and FR-013 (Audit Trail) by recording the activity. | The solution must be proportional to the current architecture and avoid premature abstraction. | 1. Direct Method Calls. 2. Observer Pattern / In-Process Events. | **Implement Direct Method Calls (Reject Observer Pattern).** | Assignment 2 explicitly noted that Direct Method Calls are appropriate for initial implementations with a small, fixed number of reactions. Currently, `RequestService.mutate()` simply calls `RequestRepository.activity()` directly. Introducing an event dispatcher (Observer) for a single guaranteed reaction is premature complexity. | Tighter coupling between the `RequestService` and the `RequestRepository` for logging activities. | If multiple new reactions (e.g., external email notifications) are added later, `RequestService` will become bloated with direct call dependencies. | Assignment 2, §1.5 ("Request Status Reactions"), which validated direct calls for simple, fixed reactions. | If external integrations are added in future milestones, this component must be refactored to an event-driven Observer model. |

**Affected Components & Expected Collaboration (DES-002):**
*   `RequestService` (Application Service)
*   `RequestRepository` (Persistence)

    [RequestService.mutate()] --> [RequestRepository.activity()]
              