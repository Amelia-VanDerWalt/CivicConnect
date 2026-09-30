## Design Quality: Coupling, Cohesion, and SOLID Principles

As part of the Milestone 2 architecture baseline, the team evaluated how our internal component interactions affect maintainability. Our decisions in DES-001 and DES-002 reflect a conscious balance between keeping the architecture simple and preserving modularity.

### Coupling & Cohesion in CivicConnect
*   **Coupling:** In DES-002, we consciously accepted tighter behavioral coupling by using Direct Method Calls between `RequestService` and `RequestRepository` for activity logging. We prioritized structural simplicity over the loose coupling of an Observer pattern to avoid premature abstraction in our Node.js backend.
*   **Cohesion:** We maintained high cohesion by isolating our business rules inside `policy.js` and pure data access inside `RequestRepository`. The `RequestService` acts merely as the orchestrator. Furthermore, rejecting the Factory Method (DES-001) keeps our request data model highly cohesive, preventing fragmentation across unnecessary subclasses.

### Applied Design Principles
1.  **Single Responsibility Principle (SRP):** By decoupling business validation from data persistence, we adhered to SRP. For instance, `policy.js` is solely responsible for determining if a status transition is valid, while `RequestRepository` only handles SQLite database transactions. 
2.  **KISS (Keep It Simple, Stupid):** A driving principle of our M2 baseline was avoiding over-engineering. By rejecting complex design patterns (Factory and Observer) when standard procedural JavaScript and data-driven models sufficed, we delivered a maintainable, easily testable backend.