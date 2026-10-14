# ADR-P2-004 — Restore controlled server configuration and static boundary

Date12 October2026. Status: implemented candidate, review pending. Supersedes merged wrapper details, not the Node/SQLite/layered-monolith direction.

Original direction: ADR-P2-003 and original server configuration use controlled origin/session settings with loopback development. Integrated M2 wrapper hard-coded3000 and omitted shutdown/configuration. New actual-entry tests reproduced configuration failure, static traversal exposure and unfinished favicon responses.

Alternatives: remove UI serving; add a separate framework/server now; retain the single-process same-origin interface and correct the wrapper. Choose the third to preserve integration proportionate to current scope.

Decision: honour HOST/PORT/APP_ORIGIN/COOKIE_SECURE; retain loopback restrictions for insecure mode, reject traversal before URL normalisation, constrain root/extensions, handle GET/HEAD only for static assets, complete404 responses and restore close handling. Controlled frontend assets must not contain symlinks outside their root; validate packaging if symlinks are introduced.

Consequence: entry-point regressions now execute real process on an ephemeral port with independent Origin. Static assets use nosniff/no-store. This is a scoped fix, not a complete static/security audit, TLS deployment or CSP migration. Test matrix, defect register, RTM and runtime guide reference this change.

Evidence: before-fix.tap/after-fix.tap, M3-I01..03, DEF-M3-001..003. Team approval and PR/commit reference to be recorded after review.
