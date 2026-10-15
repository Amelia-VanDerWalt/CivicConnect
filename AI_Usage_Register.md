# AI Usage Register

|Date|Student|Tool|Engineering task|AI contribution|Verification|Decision|Issues found|
|-|-|-|-|-|-|-|-|
|07/09/2026|Amelia|ChatGPT|Work Devision between 3|Gave fair devision of work for the 3 of us|Checked with the group if they agreed that hte workload was spread evenly|ACCEPTED|Seems to have no Error|
|07/09/2026|Amelia|ChatGPT|Clearer explanation of what needs to be done|Gave me a better understanding of what I needed to do|Verified with my team if they also understood it like the output given|ACCEPTED|Seems to have no errors|
|08/09/2026|Amelia|ChatGPT|Sectioning the different deliverables|Gave a suggested devision of the deliverables|Checked that the devision made sense|ACCEPTED|There seems to have been no error|
|09/09/2026|Amelia|ChatGPT|Document layout|Document layout suggestions|Checked that it looks profesional|MODIFIED|AI output gave to many bullet points so I made it less|
|09/09/2026|Albert|Gemini|Task Brainstorming Forward Engineering Considerations|Suggested a list of 10 potential future lifecycle concerns related to web architectures AI generated|Cross-referenced the suggestions against the CivicConnect scenario to ensure relevance. Filtered out suggestions that crossed into premature implementation checked it|MODIFIED|AI suggested finalizing the CI/CD pipeline immediately; rejected this to comply with M1 boundaries against premature implementation|
|09/09/2026|Albert|Gemini|Provide format for AI register and decision log table|Generated the initial Markdown syntax for the AI Usage Register and Engineering Decision Log tables.|Checked to see if coloumns aligned with project|ACCEPTED|None|
|09/09/2026|Edward Goosen 602882|ChatGPT|Reviewing and organising the Person 2 requirements section|Suggested clearer wording and a structure for presenting the requirements, acceptance criteria and RTM|Compared the suggestions with the Master Project Brief, checked the requirement links and reviewed the final content myself|MODIFIED|Some suggested rules and targets were not confirmed by the brief, so I marked them for team review|
|09/09/2026|Edward Goosen 602882|ChatGPT|Reviewing the constraints and Risk Register|Suggested a structure and possible project-specific risks|Checked the entries against the Master Project Brief requirements and adjusted them for CivicConnect|MODIFIED|Risk owners, probability ratings and impact ratings still require team review|
|24/09/2026|Edward Goosen 602882|ChatGPT|Milestone 2 backend and supporting documents|Assisted with backend code, tests, data model, ADRs, API documentation and RTM|Ran all 24 tests successfully and demonstrated login, submission, assignment and status updates locally|MODIFIED|  Setup and login needed troubleshooting,full interface and acceptance checks remain incomplete|
|28/09/2026|Edward Goosen 602882|ChatGPT|Consolidating PED v2.0|Helped combine M1 and M2 contributions.|Codex checked repository evidence and reran 24 tests successfully |MODIFIED|Server configuration differed from documentation; some interface features and verification remain incomplete |

### M3 Person2 assistance — 12 October 2026

| Date | Student | Tool | Engineering task | AI contribution | Verification | Decision | Issues found |
|---|---|---|---|---|---|---|---|
| 12/10/2026 | Edward Goosen602882 | ChatGPT/Codex | M3 testing and quality | Assisted test design/code, reproduced server defects, implemented scoped fixes and prepared RTM/quality records | Assistant ran11 new checks on baseline:8 pass/3 fail; after correction full35 pass. Student/local rerun and peer review pending | Review candidate; human approval not claimed | Configuration ignored, traversal exposure, hanging favicon; UI acceptance and release evidence remain incomplete |

### M3 verification and evidence follow-up — 15 October 2026

| Date | Student | Tool | Engineering task | AI contribution | Verification | Decision | Issues found |
|---|---|---|---|---|---|---|---|
| 12–15/10/2026 | Edward Goosen 602882 | ChatGPT/Codex | Browser verification, frontend corrections and M3 evidence updates | Assisted with browser test steps, reference-display and mandatory-note corrections, PowerShell commands, defect records and PED/RTM wording | Ran all 35 automated tests successfully on Windows with Node.js 24.20.0; syntax check passed; manually checked submission, isolation, lifecycle, references and resolution/rejection validation | MODIFIED; retained changes supported by observed results | Original browser record contained malformed lines, which were repaired. Full history/reporting UI, representative-user usability and final release checks remain unresolved in the available evidence |


### M3 Person 1 — updated PED consolidation using the new Person 3 handoff (15 October 2026)

| Date | Student | Tool | Engineering task | AI contribution | Verification | Decision | Issues found |
|---|---|---|---|---|---|---|---|
| 15/10/2026 | Amelia van der Walt | ChatGPT / GitHub integration | Update the consolidated M3 PED after Person 3's contribution was merged in PR #25 | Assisted with reviewing the new Person 3 handoff, integrating its reported CI run #11, static/security results, 35/35 regression result, simulated staging/backup checks, measured small-workload performance and provisional release position into PED v3.0; refreshed Person 1's supporting handoff | Claims are labelled as reported evidence from PR #25 and distinguished from full acceptance. The formal NFR-004 workload, production TLS, timed recovery, DEF-M3-006 and CR-P2-001 remain unresolved or unproven; team review and a fresh CI run on the final candidate are still required | Review candidate; human team approval not claimed | Person 3's run #11 is reported against earlier main SHA 53bf185a2938d20df5d0d12a1a3ea120d635d6f5, not the new consolidation candidate. Full UI histories/reporting, formal performance workload, production operations and full accessibility/usability acceptance remain open |
