# CivicConnect

CivicConnect is a Community Service Request Management Platform developed for the SEN381 project.

The system provides a centralised way for requesters to submit and track community service requests, while authorised staff can view, assign and update requests through a controlled lifecycle.

The current CivicConnect implementation includes:

- A browser-based HTML, CSS and JavaScript frontend.
- A Node.js backend and JSON API.
- A relational SQLite database.
- Role-based access for Requester, Staff and Oversight users.
- Controlled request lifecycle and activity/audit handling.
- Automated backend verification.
- Architecture, design, traceability and engineering documentation.

> > **Project status:** CivicConnect is in final Milestone 4 project closure. The current product supports the principal Requester, Staff and Oversight workflows. The final deployment decision is **Staging — NO-GO for production** because production TLS, operational outage alerting, representative-user usability, complete accessibility verification and production/off-site recovery controls have not been fully demonstrated.

---

## Requirements

To run CivicConnect locally, you need:

- **Node.js 24.19.0 or a compatible later 24.x version**
- npm, included with Node.js
- A modern web browser

No separate SQLite installation is required.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Amelia-VanDerWalt/CivicConnect.git
cd CivicConnect
```

### 2. Open the backend directory

```bash
cd backend
```

All npm commands should currently be run from the `backend` directory.

### 3. Install the project

```bash
npm ci --ignore-scripts
```

The current implementation does not require third-party runtime packages, but this command prepares the project using the committed package lock.

### 4. Create the local database and demo accounts

Run:

```bash
npm run setup
```

This creates the local SQLite database, initial categories and demonstration accounts.

The setup process creates the following users:

| Username | Role | Intended use |
|---|---|---|
| `requester` | Requester | Submit and view own requests |
| `requester2` | Requester | Second requester test account |
| `staff` | Staff | Facilities requests |
| `itstaff` | Staff | IT support requests |
| `oversight` | Oversight | Read-only reporting/API access |

The setup command generates a random password for each account and displays each password **once** in the terminal.

Example:

```text
requester: <generated password>
staff: <generated password>
```

Save these passwords privately for local testing.

**Do not commit generated passwords to GitHub.**

If setup reports that accounts already exist, the database has already been initialised and the original passwords will not be displayed again.

---

## Running CivicConnect

From the `backend` directory, run:

```bash
npm start
```

The application will be available at:

```text
http://127.0.0.1:3000
```

The same Node.js process serves:

- The CivicConnect frontend.
- The `/api` backend API.
- The `/health` health endpoint.

You can check application/database health at:

```text
http://127.0.0.1:3000/health
```

Stop the application using:

```text
Ctrl + C
```

---

## Using the Application

### Requester

Log in using either the `requester` or `requester2` account created during setup.

The current requester interface supports:

- Logging in and out.
- Viewing the requester's own requests.
- Submitting a new service request.
- Selecting an active category.
- Entering a title and description.
- Optionally entering a location.
- Receiving a submission confirmation/reference.
- Viewing the current status of submitted requests.

New requests begin with:

- **Priority:** Normal
- **Status:** Received

---

### Staff

Log in using:

- `staff` for the **Facilities** category.
- `itstaff` for the **IT Support** category.

The current staff interface supports:

- Viewing the request queue.
- Viewing all authorised requests.
- Viewing unassigned requests.
- Viewing requests assigned to the current staff member.
- Opening request details.
- Viewing the current assigned owner.
- Assigning a Received request to the logged-in staff member.
- Updating request status.
- Adding an optional note when performing an update.

The request lifecycle is:

```text
Received
   |
   v
Assigned
   |
   v
In progress
   |
   v
Resolved
   |
   v
Closed
```

A request may also follow:

```text
Received -> Rejected
```

Invalid lifecycle transitions are rejected by the backend.

---

### Oversight

The current baseline includes read-only Oversight/reporting functionality through the API.

The final M4 browser-interface status will be confirmed against the integrated release baseline.

---

## Running the Tests

From the `backend` directory, run:

```bash
npm test
```

The project currently contains automated backend tests covering areas such as:

- Request creation.
- Authentication and authorisation.
- Database persistence.
- Staff assignment.
- Request lifecycle validation.
- Audit/activity behaviour.
- Stale-record conflict handling.
- Transaction rollback.
- Reporting calculations.
- API authentication/session behaviour.

The current automated regression suite contains 35 tests.

These tests provide initial implementation evidence and do not represent complete production acceptance testing.

---

## Backup

A local SQLite backup can be created using:

```bash
npm run backup
```

This creates a consistent local database snapshot.

The current backup mechanism does **not** by itself demonstrate complete off-site backup, RTO or RPO compliance.

---

## Database

CivicConnect currently uses **SQLite**.

The database is created locally when:

```bash
npm run setup
```

is executed.

The main data model contains:

- Users
- Sessions
- Categories
- Staff-category eligibility
- Service requests
- Activities

The persistence implementation includes controls such as:

- Foreign keys.
- Unique constraints.
- Status and priority validation.
- Transactions.
- Optimistic version checking.
- Append-only activity history controls.

Generated database files should not be committed to the repository.

---

## API

The CivicConnect frontend communicates with the backend using a same-origin JSON API.

The API base path is:

```text
/api
```

Important endpoints include:

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/login` | Authenticate a user |
| GET | `/api/me` | Retrieve current session/user |
| POST | `/api/logout` | End the current session |
| GET | `/api/categories` | Retrieve active categories |
| GET | `/api/staff` | Retrieve eligible staff |
| POST | `/api/requests` | Create a request |
| GET | `/api/requests` | Retrieve scoped request lists |
| GET | `/api/requests/{id}` | Retrieve request details |
| POST | `/api/requests/{id}/assign` | Assign/reassign a request |
| POST | `/api/requests/{id}/schedule` | Update priority and due date |
| POST | `/api/requests/{id}/status` | Update request status |
| POST | `/api/requests/{id}/note` | Add a work note |
| GET | `/api/reports` | Retrieve Oversight reporting information |
| GET | `/health` | Check application/database health |

Authenticated mutation requests use the CSRF token returned by the session/login response.

More detailed API information is available in:

```text
backend/docs/api.md
```

---

## Project Structure

```text
CivicConnect/
|
|-- README.md
|-- AI_Usage_Register.md
|-- Forward_Engineering_Considerations.md
|-- architecture.md
|-- architecture_continued.md
|
|-- src/
|   `-- frontend/
|       |-- index.html
|       |-- app.js
|       `-- style.css
|
|-- backend/
|   |-- db/
|   |   `-- migrations/
|   |
|   |-- src/
|   |   |-- application/
|   |   |-- domain/
|   |   |-- http/
|   |   |-- infrastructure/
|   |   `-- server.js
|   |
|   |-- scripts/
|   |   |-- setup.js
|   |   `-- backup.js
|   |
|   |-- tests/
|   |-- docs/
|   |-- package.json
|   `-- README.md
|
`-- docs/
    |-- PED/
    |-- decisions/
    |-- diagrams/
    |-- requirements/
    |-- risk/
    `-- project-management/
```

---

## Architecture

CivicConnect follows a modular layered architecture:

```text
Presentation / UI
       |
       v
Application Layer
       |
       v
Domain / Business Rules
       |
       v
Persistence Layer
       |
       v
SQLite Database
```

The frontend communicates with the backend through the application API and does not access the database directly.

Architecture documentation is available in:

```text
architecture.md
architecture_continued.md
```

---

## Current Limitations

The current application is the CivicConnect project candidate being finalised for Milestone 4. It is not currently considered a production-ready system.

Known limitations and outstanding finalisation items include:

- Production HTTPS/TLS deployment has not been established.
- Production monitoring and outage alerting have not been established.
- Complete accessibility verification has not been demonstrated.
- Representative-user usability testing has not been completed.
- CR-P2-001 still requires a final team decision.
- The final release remains in staging and is not approved for public production deployment.

These limitations are documented intentionally rather than presenting the final academic project as a production-ready system.

---

## Engineering Documentation

Project engineering evidence can be found throughout the repository.

Important documentation includes:

- `docs/PED/PED_v3.0.md` — Milestone 3 engineering and release-readiness baseline
- `architecture.md` and `architecture_continued.md` — architecture and ASR evidence
- `docs/decisions/` — engineering and design decisions
- `backend/docs/decisions/` — persistence, technology and interface ADRs
- `backend/docs/data-model.md` — data model documentation
- `backend/docs/api.md` — API contract
- `docs/diagrams/` — UI wireframes and diagrams
- `docs/risk/` — project risk documentation
- `docs/requirements/` — requirements and traceability evidence
- `AI_Usage_Register.md` — recorded AI-assisted engineering work

---

## Design Decisions

The current implementation includes two initial CivicConnect design decisions:

### DES-001 — Category-dependent request creation

CivicConnect uses a shared request creation approach with data-driven category validation rather than separate Factory classes for each request category.

### DES-002 — Request state change and audit coordination

Request changes and their required audit entries are coordinated directly within the application transaction rather than using an Observer mechanism for the current mandatory audit reaction.

Further details are available in:

```text
docs/decisions/design-patterns.md
docs/design-quality.md
```

---

## Security and Configuration Notes

The current application is intended for local academic development and demonstration.

Important points:

- Session authentication is handled by the backend.
- Mutation requests use CSRF protection.
- Passwords are stored as hashes.
- Operational secrets and generated credentials must not be committed.
- The current server binds locally to `127.0.0.1:3000`.
- Production TLS/HTTPS configuration is not yet implemented.
- `.env`, generated database files and backups should remain outside committed source control where configured.

---

## Team

CivicConnect is developed by:

| Team Member | Student Number | Project responsibility |
|---|---:|---|
| Amelia van der Walt | 601649 | Person 1 - Architecture and System Engineering |
| Edward Goosen | 602882 | Person 2 - Data, Technology and Integration |
| Albert Du Plooy | 601969 | Person 3 - Design, UI and Initial Frontend Implementation |

---

## Academic Project Notice

CivicConnect is an academic software engineering project developed for SEN381.

The repository demonstrates requirements traceability, architecture, data and technology decisions, design decisions, risk management, controlled development and initial implementation evidence.

It should not currently be treated as a production-ready public service platform.
