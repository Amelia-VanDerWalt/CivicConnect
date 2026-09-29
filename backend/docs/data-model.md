# Data model and ownership

| Entity | Key and important data | Relationships and ownership |
|---|---|---|
| users | id PK; username UNIQUE; name; salted password_hash; role; active | Identity boundary owns provisioning; Requester, Staff or Oversight |
| categories | id PK; name UNIQUE; active | Controlled service catalogue; retire instead of deleting referenced entries |
| staff_categories | composite PK user_id + category_id | Many-to-many eligibility; FK to users and categories |
| requests | id PK; reference UNIQUE; title/description/location; status; priority; due_at; created_at; resolved_at; version | One requester and category; zero/one owner; request application owns lifecycle |
| activities | id PK; request_id; actor_id; kind; note; visibility; old_values/new_values JSON text; created_at | Many events per request; append-only through ordinary application/database operations |
| sessions | token_hash PK; user_id; csrf; expires_at | Authentication boundary; expiring session; token itself not stored |

Each request stores category_label as a historical snapshot. A category retirement or rename therefore does not rewrite the label recorded for that request. Retain referenced categories/users rather than deleting records needed for accountability. Account deactivation prevents new sessions and rejects existing sessions on subsequent access.

Migration 001 uses foreign keys, unique constraints, enum checks and status owner/due checks. Staff eligibility and legal transitions are application invariants. SQL constraints complement the service; they do not express every business rule. Audit triggers block UPDATE/DELETE but do not defeat a privileged administrator who can modify the schema or database file.

Requests are the aggregate root for workflow changes and their activities. Updating a request and inserting an activity happen in one database transaction. Sessions are separate from that workflow. Reports read committed request state and compute current category metrics; they do not mutate requests.

Data sensitivity: usernames, request details, location and notes may identify people or reveal operational issues. Synthetic data is used here. Only requesters' own records and public feedback are returned to requesters. Staff and oversight can read relevant internal histories. Audit snapshots retain request data repeatedly, so storage and privacy costs grow with updates. Retention/archival and deletion rules require stakeholder agreement before production.

Indexes support requester/creation queries, category/status scope, due dates, activity order and session expiration. Search currently scans permitted records and filters in memory; no throughput claim is made. SQLite files and WAL must remain on a durable local filesystem for the selected deployment direction.
