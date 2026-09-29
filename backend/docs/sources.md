# Research sources

Accessed 16 September 2026. Official documentation and original pattern descriptions support the choices below. They do not establish stakeholder approval or prove the application's quality.

| ID | Source | Use in this project |
|---|---|---|
| S01 | [Node.js release policy](https://nodejs.org/en/about/previous-releases) | Use an LTS line and review current patches before deployment. |
| S02 | [Node.js 24 SQLite API](https://nodejs.org/docs/latest-v24.x/api/sqlite.html) | Built-in database API, synchronous calls, backup API and release-candidate stability. |
| S03 | [SQLite isolation](https://www.sqlite.org/isolation.html) | Transactions and the single-writer concurrency constraint. |
| S04 | [Appropriate uses for SQLite](https://www.sqlite.org/whentouse.html) | Local application database fit and limits for many concurrent writers/network filesystems. |
| S05 | [SQLite backup API](https://www.sqlite.org/backup.html) | Consistent online backups rather than copying a live database file alone. |
| S08 | [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) | Server-side, per-request object authorization and least privilege. |
| S09 | [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) | CSRF token and origin validation for cookie-authenticated mutations. |
| S10 | [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) | Salted scrypt configuration N=131072, r=8, p=1 when using this runtime path. |
| S13 | [Node.js licence](https://github.com/nodejs/node/blob/main/LICENSE) | Node distribution licensing includes MIT and third-party notices. |
| S14 | [SQLite copyright](https://www.sqlite.org/copyright.html) | SQLite core public-domain dedication; hosting and operations still have costs. |
| S15 | [Express security guidance](https://expressjs.com/en/advanced/best-practice-security/) | Framework alternative considered; dependency and security middleware obligations. |

Internal inputs: SEN381 Master Project Brief version 1.1; SEN381 CivicConnect Milestone 2; CivicConnect Milestone 1 Person 2 Deliverables dated 9 September 2026, marked Draft. The team's A2 submission and approved combined PED were not supplied.
