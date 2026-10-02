# 2. Fact-Finding

## Scope and evidence quality

This is a repository-based fact-finding report. No interview transcripts, questionnaire responses, institutional records, production analytics, or field-observation notes were present in the workspace. No external stakeholder interviews or questionnaires were conducted for this report. Findings below are therefore limited to code/document review and a manual browser walkthrough of the local demo.

## Methods actually used

| Method | Status | Evidence and result |
|---|---|---|
| Document review | Completed | Reviewed root plans, database schema, React package configuration, Flet README/requirements, and Flet source. The selected coursework target is the Python/Flet web app; React/Vite is separate. |
| Code review | Completed | Inspected Flet registration, local storage, seller listing, cart, checkout, order status, and dashboard code, plus the React reference app and PostgreSQL schema. |
| UI observation | Limited, local demo only | Launched the Flet web app at `http://localhost:8551/` and confirmed the public marketplace renders. Integrated-browser pointer and keyboard events did not activate Flet canvas controls. Earlier React/Vite demo interactions are separate evidence. No real users or operational environment were observed. |
| Automated code tests | Completed, local only | Ran 11 Python unit/smoke tests covering totals, Flet view construction, listing verification, wallet balance, demo order creation, and allowed status transitions. These are not browser E2E tests. |
| Interviews | Not conducted | No user, vendor, institution, admin, support, payment, or legal stakeholder testimony is available. |
| Questionnaires | Not conducted | No sample, response count, or survey results are available. |
| Production document review | Not available | No live policy approvals, vendor contracts, payment statements, dispute records, or incident reports were supplied. |

## Findings from current evidence

1. The selected Flet web app renders a public marketplace with seeded products, category/search controls, registration/sign-in dialogs, role workspaces, cart, checkout, orders, wallet, and supporting screens.
2. Student, expert, institution, and super-admin demo accounts are hard-coded. Registration validates required fields, email shape, matching passwords, and an eight-character minimum, but accounts/passwords are persisted in browser client storage; this is not production authentication.
3. Flet cart and orders are stored with the current user in browser client storage. Flet seller listings use a separate browser client-storage key. The cart supports quantity, removal, and clearing.
4. Flet checkout calculates a 5% service fee and a fixed NGN 3,500 delivery fee for non-empty carts. It supports a no-charge demo method and a simulated wallet method with an insufficient-balance check. There is no live payment provider or server verification in the selected Flet app.
5. Flet creates per-user local orders in `processing` state and records a local status history. The UI permits guarded demo transitions (for example, processing to fulfilled to completed); this state is not server-authorized or shared with sellers.
6. Verified demo sellers can create, edit, pause/activate, and delete their own local listings. Listings are not moderated or persisted outside the browser.
7. `database/schema.sql` models profiles, verification, categories/listings, wallets/ledger, payment attempts, orders/items, conversations/messages, disputes, settings, and admin audit logs. It is not wired into the Flet app.
8. The compliance plan names Nigerian regulatory areas and proposes upload scanning, but implementation and legal compliance were not independently verified.

## Stakeholder research still required

Conduct structured sessions before finalizing requirements:

- Buyers: discovery, trust signals, delivery, payment methods, returns, and support expectations.
- Student/expert vendors: verification burden, listing creation, pricing, fulfillment, payouts, and disputes.
- Institution representatives: procurement, approval, bulk offers, and reporting needs.
- Administrators/support: moderation, KYC review, fraud, refunds, escalation, and audit requirements.
- Legal/privacy/payment partners: applicable obligations, payment settlement, data retention, and cross-border service terms.

Record participant role, date, consent, method, anonymized notes, themes, decisions, and follow-up actions. Do not store unnecessary personal or KYC data in research notes.

## Suggested interview prompts

1. Describe the last time you bought or sold an academic service or student good.
2. What information would make you trust a listing and its seller?
3. What should happen when an item is late, not as described, or a service is incomplete?
4. Which payment and delivery options are practical for your location?
5. What information should a seller provide, and what verification is proportionate?
6. Which admin actions must be logged or require a second approval?

## Suggested questionnaire measures

Use a pilot questionnaire to quantify preferred categories, delivery methods, payment methods, purchase frequency, trust concerns, accessibility needs, acceptable verification steps, and willingness to pay. Report the sampling method and response count; do not generalize a convenience sample to all students.

## Requirement implications

Prioritize real identity, server persistence, provider-confirmed payment, server-authorized seller/listing/order workflows, returns/disputes, support operations, accessible low-bandwidth use, and privacy-by-design. Validate priorities with stakeholders before production.
