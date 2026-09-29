# ADR P2 001 Relational SQLite persistence

Date: 16 September 2026. Status: implemented in review candidate; team acceptance pending. Requirements: FR-002, FR-003, FR-008, FR-012, FR-013, NFR-003 and NFR-008.

## Problem and alternatives

Requests relate to users, categories, owners and chronological activities. Assignment and its audit event must succeed together. Alternatives are JSON files, a document database, embedded relational SQLite and a separately managed relational server such as PostgreSQL. JSON files would require custom locking, integrity and recovery. A document model would still need explicit handling of cross-record relationships. A relational server is a credible later option but adds installation, credentials, networking and operations to this milestone.

## Decision

Use SQLite on local persistent disk with foreign keys, enum checks, unique references, category-label snapshots and append-only activity triggers. Run mutations under BEGIN IMMEDIATE. Update a request only when its version equals the client's expected version. A conflicting version returns HTTP 409 without applying a partial change. Preserve request and audit in one transaction. Use UTC ISO timestamps with inclusive start date and exclusive next-day end boundary.

## Evidence and trade-offs

SQLite documents serialized writes and transaction isolation [S03]. Its usage guidance favours local embedded storage where the deployment and write workload fit [S04]. Node exposes the database and backup APIs [S02]. Tests T03, T10-T12, T17 and T18 demonstrate specific integrity and recovery behaviours here.

The database and disk remain a single point of failure. Backups do not provide high availability. Synchronous access and one writer limit throughput. Lists currently use permission-scoped reads followed by in-memory filtering: the supplied 5,000-record target remains unverified. Prefer SQL predicates, pagination and measured query tuning before replacing the database. Move to a server database if tests establish unacceptable contention or deployment requires multiple application hosts. Such a move requires schema, SQL, migrations, backup and regression work; the repository reduces coupling but does not make migration automatic.

Node's SQLite binding is release-candidate API stability in the researched 24.x documentation. Pin and retest runtime changes. Risks P2-R01, P2-R02, P2-R03 and P2-R04. Sources S02-S05. Actual A2 persistence cross-reference pending.
