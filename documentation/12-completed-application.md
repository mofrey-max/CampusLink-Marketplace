# 12. Completed Application

## Delivered application

The selected coursework target is the runnable Python/Flet web app in `flet_webapp/`. The React/Vite application is a separate reference implementation. Flet provides a public marketplace, mock roles, verified-seller local listing management, cart, simulated checkout, per-user local orders, and local fulfillment status transitions. This is a working web demo, not a production e-commerce service.

## Completion matrix

| Area | Completion status | Evidence / limitation |
|---|---|---|
| Public marketplace and category discovery | Implemented for demo | Flet seeded products, categories, search/filter UI, and public marketplace render in browser. |
| Demo authentication and role workspaces | Partial | Seeded roles and local sign-in; registration validation exists, but users/password records remain in client storage. |
| Registration and verification | Partial | Registration fields and validation work; verification is a local flag/request, not an identity review process. |
| Cart and fee summary | Implemented for demo | Per-user local cart, quantity/remove/clear controls, 5% service fee, NGN 3,500 delivery fee. |
| Checkout | Partial | Validates customer details, recalculates totals, checks demo wallet balance, and offers no-charge demo payment; no real payment provider. |
| Order history and fulfillment | Partial | Per-user local order snapshots and guarded status transitions/history; not shared or server-authorized. |
| Vendor listing management | Implemented for demo | Verified accounts can create/edit/pause/reactivate/delete local service/goods listings; no moderation or shared catalog. |
| Wallet, payout, billing | Partial | Demonstration data and local simulated operations; no trusted settlement ledger. |
| Database design | Designed, not verified as runtime persistence | PostgreSQL schema and Supabase migration asset are included. |
| Admin operations | Partial | Dashboard screens exist; no complete server-backed moderation/audit workflow was verified. |
| Documentation and screenshots | Partial | All report sections are present; `screenshots/` has 37 React captures and one Flet public screen. More Flet feature screenshots should be captured for submission. |
| Build/test quality | Partial | Flet compiles and 11 Python tests pass; Flet browser E2E is not verified. React build passes; React lint fails with 59 errors and 8 warnings. |

## Release recommendation

**Ready:** supervised coursework demonstration of the Flet web target using synthetic/demo data. The public marketplace runs at `http://localhost:8551/` in the current workspace.

**Not ready:** public production launch, real KYC document collection, real payment settlement, trusted wallet balances/payouts, or binding compliance claims. Desktop and mobile deployment are also unverified; this submission has deliberately selected web only.

## Production exit criteria

Before describing the product as a completed production marketplace, require all of the following:

- Stakeholder research and signed-off functional/business rules.
- Server-backed identity, role/ownership policy, secure persistence, and verified migrations.
- Seller listing lifecycle, inventory/availability, and moderation.
- Server-confirmed payments, idempotent orders, refunds, reconciliation, and an auditable wallet ledger.
- Buyer/seller order fulfillment, delivery evidence, disputes, and support escalation.
- Privacy notices/retention and Nigerian legal review; secure KYC storage and malware scanning.
- Passing automated tests, lint/type checks, security/accessibility review, backup/restore test, monitoring, and operational runbooks.
- Pilot acceptance from buyer, vendor, institution, and admin stakeholders.

See [Feasibility Study](01-feasibility-study.md) for the conditional recommendation and [Testing Evidence](09-testing-evidence.md) for the current verification record.
