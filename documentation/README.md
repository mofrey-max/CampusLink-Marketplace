# CampusLink Documentation

This documentation is aligned to the selected **Python/Flet web application** in `flet_webapp/`. The React/Vite app remains a parallel reference implementation and supplies additional screenshots. Statements marked **Current** are supported by code or checks recorded here; **Proposed** statements are target-state recommendations, not implemented guarantees.

## Contents

| No. | Document | Coverage |
|---:|---|---|
| 1 | [Feasibility Study](01-feasibility-study.md) | Technical, economic, operational, schedule, and legal feasibility |
| 2 | [Fact-Finding](02-fact-finding.md) | Evidence reviewed, findings, and outstanding stakeholder research |
| 3 | [System Requirements](03-system-requirements.md) | Functional, non-functional, hardware, and software requirements |
| 4 | [Algorithms](04-algorithms.md) | Registration, cart, checkout, and order update algorithms |
| 5 | [Flowcharts](05-flowcharts.md) | Registration/login, checkout, and fulfillment diagrams |
| 6 | [Pseudocode](06-pseudocode.md) | Language-independent core process descriptions |
| 7 | [System Design](07-system-design.md) | Architecture, ERD, tables, and interface I/O |
| 8 | [Source Code](08-source-code.md) | Repository module map and run instructions |
| 9 | [Testing Evidence](09-testing-evidence.md) | Build, lint, and browser smoke-test results |
| 10 | [Screenshots](10-screenshots.md) | Captured interface evidence and provenance |
| 11 | [User Documentation](11-user-documentation.md) | Installation, buyer/vendor/admin guidance, and FAQ |
| 12 | [Completed Application](12-completed-application.md) | Delivered scope, acceptance status, and production gaps |

## Project snapshot

The selected submission target is the Python/Flet web app in `flet_webapp/`. It provides a public storefront, mock role-based sign-in, local seller listings, cart/checkout, simulated wallet/demo payment, per-user local order history, and a demo fulfillment state flow. Browser client storage is not production persistence, and demo payment is not a real payment integration. The React/Vite SPA is retained as a parallel implementation, not the selected target platform. The PostgreSQL schema is a design asset, not evidence either frontend is connected to a live database.

## Evidence and limitations

- Source inspected: `flet_webapp/`, `src/`, `database/schema.sql`, `supabase/migrations/`, and the existing planning documents.
- Verification recorded: Flet compiles and its 11 workflow/unit tests pass; the public Flet web screen renders. React `npm run build` passes while `npm run lint` currently fails. See [Testing Evidence](09-testing-evidence.md).
- Stakeholder interviews, questionnaires, and external legal review were not supplied or conducted for this documentation. See [Fact-Finding](02-fact-finding.md).
- Images under `documentation/screenshots/` include 37 React captures and a Flet public-marketplace capture; they do not establish payment, database, or production-security behavior. See [Screenshots](10-screenshots.md).

## Status convention

Use **Implemented** only for behavior present in the current application; **Partial** for a UI or mock implementation without production backing; **Proposed** for target-state recommendations; and **Not verified** where no test or external evidence is available.
