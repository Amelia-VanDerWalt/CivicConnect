# Technical Debt Register

| ID | Compromise | Consequence / affected basis | Next action | Proposed owner | Status |
|---|---|---|---|---|---|
| TD-M3-001 | Lists/reports filter scoped rows in memory; no pagination | Memory/response costs grow; NFR-004 not proven | Measure workload, move suitable filters/aggregation to SQL and paginate | Edward + implementation owner | Open |
| TD-M3-002 | Custom HTTP/authentication and process-local login throttle | Additional maintenance; throttle resets and cannot coordinate multiple hosts | Security review and framework comparison before scope expansion | Edward | Open |
| TD-M3-003 | HTTP system automation excludes browser rendering | DOM validation, interaction/accessibility gaps invisible | Execute browser records and automate critical UI journeys when stable | Person2 + frontend owner | Open |
| TD-M3-004 | Single-host SQLite with deployment/backup controls pending | Host/disk failure affects all users; recovery target unproven | Staging recovery/backup drill; reassess architecture on measured need | Person1 + Person3 | Open |

Missing required functionality is a defect/scope gap, not technical debt used to excuse acceptance. Ownership and acceptance of deferrals require genuine team decisions.
