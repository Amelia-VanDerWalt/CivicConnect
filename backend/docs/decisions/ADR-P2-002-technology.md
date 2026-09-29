# ADR P2 002 Technology selection

Date: 16 September 2026. Status: working candidate choice; no approved team stack was supplied. Requirement drivers: small controlled workflow, browser access, testability, durable data and low setup burden.

## Options considered

| Option | Fit and benefits | Main cost or uncertainty |
|---|---|---|
| Node.js core, browser JavaScript, SQLite | One language; no third-party runtime packages; runs without a database service; SQL constraints and local tests | Custom HTTP/auth code needs careful review; SQLite API is release candidate; synchronous reads and single writer |
| Express, browser UI, PostgreSQL | Framework routing and middleware ecosystem; relational database can be managed separately | More dependencies, database service and credentials; deployment and package setup must be validated |
| ASP.NET Core MVC with relational persistence | Structured web framework and integrated framework facilities | .NET tooling and all teammates' readiness unconfirmed; runtime and hosting proof required |

## Decision

Use Node.js 24.x LTS with vanilla HTML/CSS/JavaScript and SQLite for this candidate. The environment actually ran Node 24.19.0 and SQLite 3.53.3. The package has zero third-party runtime dependencies; npm lockfile and Node's built-in test runner provide repeatable setup/checks. Avoid treating a library count as a security score. Maintaining custom HTTP/session code transfers responsibility to the team. Reconsider Express or a framework identity solution before expanding authentication features.

The local runtime was available and exercised by automated tests. Team capability is an assumption, not evidence from all three students. Each member must demonstrate setup, tracing and a small modification before sign-off. Node's release policy supports LTS selection [S01]. The 24.x SQLite documentation labels the API release candidate [S02]. The live release page listed a newer 24.x patch than the tested runtime: evaluate and retest a current supported patch before staging. Do not call 24.19.0 the latest version.

## Compatibility licensing and cost

Development needs a Node 24.x installation and a writable local disk on the selected OS. Staging assumes one persistent host, a reverse proxy and HTTPS. Ephemeral or multi-host filesystems are not the selected database environment. Node is distributed with MIT and third-party notices [S13]; SQLite core is dedicated to the public domain [S14]. That does not make infrastructure, backups, support or networking free. No cloud price or free-tier promise is made. Obtain an actual provider quote before a hosting commitment.

Known risks: P2-R01 to P2-R05 and P2-R07. Sources S01-S02, S13-S15. Review this ADR against any existing approved team technology choice before importing code.
