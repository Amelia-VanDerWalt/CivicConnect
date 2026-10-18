# Technical Debt Register

| ID | Compromise | Consequence / affected basis | Next action | Proposed owner | Status |
|---|---|---|---|---|---|
| TD-M3-001 | Lists/reports filter scoped rows in memory; no pagination | Memory/response costs grow; NFR-004 not proven | Move suitable filtering/aggregation to SQL, add pagination, and run the formal NFR-004 workload if the system continues. | Edward + implementation owner | Retained / Open at closure |
| TD-M3-002 | Custom HTTP/authentication and process-local login throttle | Additional maintenance; throttle resets and cannot coordinate multiple hosts | Perform a security/framework review before production use or multi-host deployment. | Edward | Retained / Open at closure |
| TD-M3-003 | HTTP system automation excludes browser rendering | Manual browser checks now provide partial UI evidence, but DOM, accessibility and critical browser journeys are not fully automated. | Automate critical browser journeys and accessibility checks if the project continues. | Edward + frontend owner | Partially mitigated / Retained |
| TD-M3-004 | Single-host SQLite with deployment/backup controls pending | Simulated staging backup/integrity checks exist, but host/disk failure and formal recovery targets remain unproven. | Implement production/off-site backup and perform a timed recovery drill against the RTO/RPO targets before production release. | Person1 + Person3 | Partially mitigated / Retained |

Missing required functionality is a defect/scope gap, not technical debt used to excuse acceptance. Ownership and acceptance of deferrals require genuine team decisions.
