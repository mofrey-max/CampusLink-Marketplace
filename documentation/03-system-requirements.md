# 3. System Requirements

## Status key

- **Implemented (demo)**: works in the selected Python/Flet web app using local demo state.
- **Partial**: a UI or local simulation exists, but production backing or complete workflow is absent.
- **Proposed**: required for a reliable production marketplace.

## Functional requirements

| ID | Requirement | Status and note |
|---|---|---|
| FR-01 | Register and sign in using role-appropriate account data. | Partial: Flet form validates required fields, email shape, password match, and minimum length; accounts and password records remain in browser client storage. |
| FR-02 | Support student, expert, institution, and super-admin views. | Partial: role-specific views exist; authorization is client-side and can be bypassed. |
| FR-03 | Browse seeded goods and services by category and search/filter controls. | Implemented (demo) with local seed data. |
| FR-04 | View listing details and add an item to the cart. | Implemented (demo); no server listing or conversation persistence. |
| FR-05 | Create, edit, pause, and remove a seller listing. | Implemented (demo) for verified accounts; data is local and there is no moderation workflow. |
| FR-06 | Add items to cart, change quantity, remove items, clear cart, and calculate totals. | Implemented (demo) in browser client storage. |
| FR-07 | Validate checkout and pay by wallet or another method. | Partial: customer details, fee calculation, no-charge demo payment, and simulated wallet with balance check work; no real payment provider or server verification. |
| FR-08 | Persist an order and show buyer order history. | Partial: order and history persist in the browser session record; no shared backend database. |
| FR-09 | Update fulfillment status and notify buyer/seller. | Partial: guarded local demo status transitions and local history work; no server authorization or notifications. |
| FR-10 | Submit, review, and retain verification requests/documents. | Partial: KYC UI/state exists; secure backend storage/review is not demonstrated. |
| FR-11 | Provide wallet deposits, payouts, immutable ledger, and reconciliation. | Partial: local mock wallet only; production ledger/payment settlement is proposed in SQL design. |
| FR-12 | Provide messaging, billing, profile, and support/legal information. | Partial: screens exist; persistence, authorization, and complete support processes are not confirmed. |
| FR-13 | Provide admin moderation, disputes, settings, and auditable actions. | Partial: dashboard screens/schema concepts exist; production control workflows are not demonstrated. |

## Non-functional requirements

Targets below are proposed acceptance criteria and should be validated with stakeholders and infrastructure measurements.

| ID | Requirement / target | Current status |
|---|---|---|
| NFR-01 Security | Enforce authentication, role/record-level authorization, input validation, secrets management, secure headers, and rate limits server-side. | Not met by local demo alone. |
| NFR-02 Payment integrity | Confirm payments from trusted server/provider events; make order creation idempotent and reconcile settlement. | Not verified; browser callback path exists. |
| NFR-03 Privacy | Minimize personal data, define lawful basis/retention, restrict KYC access, encrypt sensitive data, and fulfill data-subject requests. | Policy/controls require review and implementation. |
| NFR-04 Availability | Pilot target: 99.5% monthly service availability, excluding planned maintenance. | No production SLO or monitoring evidence. |
| NFR-05 Performance | Pilot target: p95 key page response under 2.5 seconds on agreed mobile network/device profile. | Not measured. |
| NFR-06 Accessibility | Target WCAG 2.2 AA for primary flows, keyboard use, contrast, labels, and error announcements. | Not audited. |
| NFR-07 Usability | Fees, delivery terms, order status, and support route must be clear before payment. | Fee summary exists; full order/support terms need implementation/review. |
| NFR-08 Reliability | Backups, restore tests, transaction monitoring, and incident runbooks must be available. | Not demonstrated. |
| NFR-09 Compatibility | Support current stable Chrome, Edge, Firefox, and Safari on desktop and mobile. | Browser coverage not tested systematically. |
| NFR-10 Maintainability | Python source compiles and automated tests cover critical commerce rules. | Flet compile passes and 11 Python tests pass; React lint remains failing and no browser E2E suite is configured. |

## Hardware requirements

These are planning recommendations, not measured limits:

- **End user**: recent smartphone or computer, 2 GB available memory recommended, stable internet; usable responsive browser.
- **Developer**: dual-core 64-bit computer, 8 GB RAM recommended, at least 2 GB free disk for dependencies/build artifacts, and Node.js toolchain.
- **Production service**: size app/API, managed PostgreSQL, storage, monitoring, and backups from a load test and retention policy. No production sizing evidence exists yet.

## Software requirements

| Area | Requirement |
|---|---|
| Selected app development | Python 3.9 or later and Flet 0.28.x as constrained by `flet_webapp/requirements.txt`; a virtual environment is recommended. |
| Target platform | Web browser. The Flet app starts with `ft.AppView.WEB_BROWSER`; desktop packaging and Android/iOS deployment are not part of this selected target and have not been verified. |
| Browser | Current desktop browser recommended; responsive layouts use Flet `ResponsiveRow`, but mobile browser coverage is not yet measured. |
| Payment configuration | No payment secret or provider setting is required for the Flet no-charge demo flow. The React reference app has a separate Paystack public-key setting; it does not configure Flet payments. |
| Persistence target | PostgreSQL-compatible database; `database/schema.sql` and a Supabase migration are included as design assets but are not connected to the Flet runtime. |
| Test command | From `flet_webapp/`, run `python -m unittest discover -s . -p 'test_*.py' -v`. |

## Acceptance principle

A requirement is not considered production-complete merely because a screen or mock state exists. Acceptance requires end-to-end behavior, authorization, failure handling, persistence, and tests appropriate to the risk.
