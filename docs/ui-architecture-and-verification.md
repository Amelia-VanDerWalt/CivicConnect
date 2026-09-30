## User Interface, Information Architecture & Verification

To ensure the CivicConnect platform meets the operational needs of citizens and staff, the frontend user interface is structured around role-specific journeys that consume our Node.js backend API.

### 1. User Journeys & Flows
The navigation hierarchy isolates capabilities to enforce security and usability, matching the implemented wireframes.

**Requester Flow:**
1. **Login:** User authenticates via Username and Password; the system securely stores the session and CSRF token.
2. **Requester Dashboard (Home):** Displays a Welcome Message, quick-action buttons ("Submit A New Request", "View My Requests"), and a summary table of Recent Requests.
3. **Submit Request:** A guided form capturing the mandatory Title, Category (Dropdown), Location, and Description.
4. **My Requests:** A dedicated view of submitted tickets and their current statuses.

**Staff Flow:**
1. **Login:** Authenticates as a staff role.
2. **Staff Dashboard (Requests Queue):** Displays the work queue with quick-filter tabs for "All Requests", "Unassigned", and "My Requests" to streamline task allocation.
3. **Staff Request View (Update Status):** A detail screen showing the ticket's history and an action panel to submit a "New Status" alongside an "Optional Note".

### 2. Wireframes & Usability Rationale
*(Note: Visual wireframes are located in the `/docs/diagrams/` directory).*

**Login Page:**
Provides a simple sign-in interface for all user roles. The layout keeps authentication straightforward and supports keyboard navigation and clear focus states in line with NFR-006. It supports FR-001.

**Requester Dashboard:**
Provides clear access to the requester’s main tasks: submitting a request and viewing existing requests. The simple navigation and limited number of choices reduce cognitive load and support NFR-005.

**Submit Request Page:**
Supports FR-002 by capturing the required title, description and active category, with optional location information. The category is selected from the approved backend list to support FR-003 and reduce invalid input. The single-column form supports usability and accessibility requirements NFR-005 and NFR-006.

**Staff Dashboard:**
Provides staff with a clear overview of service requests and separates all, unassigned and personally assigned requests. This supports the staff queue and filtering workflow required by FR-006 and FR-007.

**Staff Request View:**
Displays the request information staff need to manage a case and provides controls for updating its status and recording notes. This supports FR-009, FR-010 and FR-011. The layout keeps actions grouped with the request details to reduce navigation and improve usability.

The interface layouts were explicitly driven by our baselined Non-Functional Requirements (NFRs):
* **Minimizing Cognitive Load (NFR-005):** To ensure 80% of first-time users can successfully submit a ticket within 3 minutes, the `Submit Request` form relies on the backend's `/categories` endpoint to populate dropdowns. This prevents open-text data entry errors and ensures clean data for the `RequestService`. The dashboards utilize clear sidebar navigation (Home, Submit Request, My Requests) to prevent users from getting lost.
* **Handling API Conflicts:** The Staff `Update Status` UI is designed to catch backend responses. If a staff member attempts an update and receives a `409 Conflict` (indicating a stale-record overwrite attempt), the UI prompts the user to reload the latest state, protecting data integrity.

### 3. Initial UI Verification Evidence
To prove the initial frontend implementation meets our baselined accessibility and usability standards, the following manual verification checks were completed against the working UI slice:
* **Required Fields Check:** Attempting to submit a request without a title or category successfully blocks submission and displays a clear error message.
* **Keyboard Navigation (NFR-006):** The submission form and dashboard tabs can be fully navigated using `Tab` and `Shift+Tab` without trapping the user.
* **Focus Visibility (NFR-006):** All interactive buttons and inputs display a high-contrast CSS outline when focused.
* **200% Zoom (NFR-006):** The responsive layout ensures that scaling the browser text to 200% does not obscure critical form inputs or submission buttons.