# Technical Debt Register

| ID | Compromise | Consequence / affected basis | Next action | Proposed owner | Status |
|---|---|---|---|---|---|
| TD-M3-001 | Lists/reports filter scoped rows in memory; no pagination | The formal local NFR-004 workload passed, but in-memory filtering and the lack of pagination remain scalability and maintenance concerns as data volume grows. | Move suitable filtering/aggregation to SQL and add pagination if the system continues. | Edward + implementation owner | Partially mitigated / Retained |
| TD-M3-002 | Custom HTTP/authentication and process-local login throttle | Additional maintenance; throttle resets and cannot coordinate multiple hosts | Perform a security/framework review before production use or multi-host deployment. | Edward | Retained / Open at closure |
| TD-M3-003 | HTTP system automation excludes browser rendering | Manual browser checks now provide partial UI evidence, but DOM, accessibility and critical browser journeys are not fully automated. | Automate critical browser journeys and accessibility checks if the project continues. | Edward + frontend owner | Partially mitigated / Retained |
| TD-M3-004 | Single-host SQLite with local backup/recovery controls | Timed local restoration passed, but single-host failure, off-site recovery, ongoing backup scheduling and disaster-site recovery remain unproven. | Implement scheduled/off-site backups and verify recovery from a separate failure location before production release. | Person1 + Person3 | Partially mitigated / Retained |


