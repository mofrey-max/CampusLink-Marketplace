# 1. Feasibility Study

## Executive finding

**Conditionally feasible as a web-based academic/demo prototype.** Python/Flet is selected for the coursework web target. The Flet app now demonstrates registration/login, marketplace browsing, verified-seller local listings, cart, simulated checkout, buyer order history, and local fulfillment status changes. It is not production-ready: identity, listings, commerce data, and wallet state are stored in browser client storage; no real payment provider is connected; and operational, security, legal, and cost assumptions still need validation.

## Technical feasibility

**Finding: feasible for web deployment with Python/Flet; production requires a trusted backend and security workstream.** The selected app uses Python and Flet 0.28.x and runs in a browser. The repository also includes a separate React/TypeScript/Vite app and PostgreSQL/Supabase schema assets. The Flet UI contains student, expert, institution, and super-admin paths. Its current listing, cart, order, and wallet persistence is browser client storage; its checkout is simulated.

Key technical gaps before production:

- Replace demo-user lookup and browser-stored sessions with a managed identity service and server-enforced authorization.
- Persist listings, carts/orders, payments, verification, messages, and wallet ledger records in a server-side database.
- Integrate a payment provider through a server-side payment API; verify provider events, use idempotency, reconciliation, and refund handling. The Flet target currently does not connect to Paystack.
- Add server-side listing and order workflows, file storage with malware scanning, audit records, backups, monitoring, and recovery tests.
- Resolve current lint errors and establish automated unit, integration, accessibility, and end-to-end checks.

The existing schema provides a useful relational starting point, but schema assets alone do not provide API behavior or data protection policies. The coursework target is web-only; desktop and mobile packaging have not been configured or tested.

## Economic feasibility

**Finding: not yet quantifiable; likely manageable for a staged pilot.** No budget, staffing rates, transaction forecast, provider quotes, or revenue assumptions were supplied. A defensible Naira cost-benefit estimate cannot be produced from repository evidence alone.

Cost categories to price before approval:

- Product and engineering: backend, frontend, testing, security, and operations.
- Hosting: application, PostgreSQL, object storage, backups, monitoring, and bandwidth.
- Payment processing, SMS/email, identity checks, and malware scanning.
- Customer support, seller verification, dispute operations, and legal/accounting review.
- Ongoing security updates, incident response, and regulatory compliance.

A pilot business case should estimate monthly fixed costs and variable cost per order, then compare them with commission, subscription, or other approved revenue. Do not treat placeholder dashboard metrics or demo account balances as forecasts.

## Operational feasibility

**Finding: feasible if accountable operators and policies are assigned.** The application distinguishes buyer, student, expert, institution, and super-admin views, but a production service also needs named owners for seller onboarding, KYC review, catalog moderation, payment reconciliation, support, disputes/refunds, and incident response. Current admin dashboards are demo screens and do not establish a working operational control plane.

Before pilot launch, define escalation hours, response targets, verification decision criteria, prohibited-listing policy, refund/dispute authority, payout approval, and evidence retention. Train support staff and test operational runbooks with realistic scenarios.

## Schedule feasibility

**Finding: a staged pilot is plausible; the following is an estimate, not a commitment.** Assumes a small experienced team, timely legal decisions, and external services available.

| Phase | Indicative duration | Exit evidence |
|---|---:|---|
| Discovery and policy decisions | 1 week | Approved workflows, scope, data map, and acceptance criteria |
| Backend, identity, and database | 2-3 weeks | Auth, schema, role policies, persistence, migration and backup checks |
| Commerce and payments | 2 weeks | Server-verified payments, order lifecycle, refunds, reconciliation |
| Operations, security, and UX hardening | 1-2 weeks | Moderation/support tools, upload scanning, accessibility/security checks |
| Pilot and remediation | 1 week | UAT sign-off, runbooks, monitoring, and go/no-go review |

The phases can overlap only after dependencies and team capacity are confirmed. A production date should not be committed until discovery is complete.

## Legal and regulatory feasibility

**Finding: feasible subject to jurisdiction-specific review and implementation.** The existing Nigeria compliance plan cites the Nigeria Data Protection Act 2023, the Federal Competition and Consumer Protection Act 2018, CBN Consumer Protection Regulations 2019 (where applicable), and the Cybercrimes (Prohibition, Prevention, etc.) Amendment Act 2024. These are planning references, not a legal opinion or confirmation of compliance.

Obtain Nigerian counsel and privacy/security review for controller/processor roles, lawful basis, notices and consent, data subject requests, retention/deletion, cross-border processing, KYC handling, consumer pricing/returns/complaints, payment-provider responsibilities, breach response, and any licensing obligations. Do not collect real identity documents or process real payments using the demo implementation.

## Recommendation

Continue with a limited demonstration or supervised pilot only using synthetic data and test payment credentials. Approve production work conditionally after budget approval, stakeholder fact-finding, legal/privacy review, backend security controls, and successful end-to-end testing.
