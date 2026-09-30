## User Interface & Information Architecture

The CivicConnect user interface is structured around role-specific journeys, built to consume our Node.js JSON API via a same-origin client.

### 1. Information Architecture & API Integration
The frontend navigates users through specific flows while natively handling secure API communications:
*   **Authentication Flow:** The `Login` UI captures credentials and establishes session cookies with CSRF tokens for secure subsequent requests.
*   **Requester Journey:** The `Submit Request` UI dynamically loads approved categories from the backend and handles `400 Bad Request` validation errors gracefully if fields are missing.
*   **Staff Journey:** The `Status Update` UI incorporates conflict resolution. Based on our persistence strategy, if the UI receives a `409 Conflict` (indicating a stale-record overwrite attempt), the interface prompts the staff member to reload the latest request state.

### 2. Wireframe Layouts & Usability Rationale
Our interface design decisions were driven by baselined NFRs:
*   **Minimizing Cognitive Load (NFR-005):** The UI uses a single-column layout. By relying on the backend's `/categories` endpoint to populate dropdowns, we eliminate open-text data entry errors.
*   **Accessibility Compliance (NFR-006):** The layout is designed to support WCAG accessibility requirements. All form interactions accommodate keyboard navigation (Tab/Shift-Tab) and gracefully degrade when subjected to 200% browser text scaling.