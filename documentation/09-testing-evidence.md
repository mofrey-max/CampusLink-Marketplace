# 9. Testing Evidence

## Test environment

- Date recorded: 2026-10-01.
- Selected app: Python 3.9, Flet 0.28.3 in `flet_webapp/.venv`.
- Browser: local Flet web app at `http://localhost:8551/`; the React reference app also runs at `http://localhost:3000/`.
- Automated Flet suite: Python `unittest`; no browser E2E suite is configured.

## Results

| ID | Test / input | Expected result | Actual result | Status |
|---|---|---|---|---|
| T-01 | `npm run build` | Production bundle compiles. | Vite transformed 1,510 modules and completed build in 1.94 seconds. Existing browser-data freshness warnings were emitted. | PASS |
| T-02 | `npm run lint` | ESLint reports no errors. | Exit failed: 59 errors and 8 warnings across existing source modules, including unused variables and explicit `any` violations. | FAIL |
| T-03 | Open React reference at local Vite URL. | Marketplace screen renders. | Page title `CampusLink`; public marketplace and listing content rendered. | PASS |
| T-04 | Use student demo credentials in React reference. | Student session and student navigation render. | Student workspace rendered; dashboard and student sections were navigated for screenshots. | PASS (manual smoke) |
| T-05 | Use expert, institution, and super-admin demo shortcuts in React reference. | Correct role workspace/navigation renders. | Each role name, role-specific sidebar, and dashboard were visible. | PASS (manual smoke) |
| T-06 | Add first marketplace service to cart in React reference. | Cart contains item and recalculates count/price. | `Statistics Assignment Support` appeared as one cart item; cart view rendered. | PASS (manual smoke) |
| T-07 | Open React reference checkout for that cart. | Checkout form and fee summary render. | Checkout rendered with subtotal NGN 8,500, service fee NGN 425, delivery NGN 2,500, total NGN 11,425. | PASS (manual smoke) |
| T-08 | Attempt live card/transfer payment in selected Flet app. | Provider-confirmed payment creates one paid order. | Flet exposes only simulated demo/wallet methods; no real payment integration is implemented or submitted. | NOT IMPLEMENTED |
| T-09 | Advance Flet order from processing through fulfillment. | Valid transition is recorded; invalid transition is rejected. | Python tests confirm allowed transitions and reject terminal/invalid transitions; state is local, not server-authorized. | PASS (unit) |
| T-10 | Apply database migration/integration checks. | Tables and constraints deploy to test PostgreSQL/Supabase. | Not run; no configured test database was supplied. | NOT RUN |
| T-11 | Run `python -m unittest discover -s flet_webapp -p 'test_*.py' -v`. | Commerce rules and Flet views construct correctly. | 11 tests pass: totals, listing verification/ownership behavior, insufficient wallet balance, demo order persistence/cart clearing, status transitions, and listing/cart/checkout/orders widget constructors. | PASS |
| T-12 | Run `python -m py_compile flet_webapp/app.py flet_webapp/commerce.py`. | Changed Python modules compile. | Compilation completed without errors. | PASS |
| T-13 | Launch Flet using `CAMPUSLINK_PORT=8551 .../python flet_webapp/app.py`. | Public Flet marketplace renders in the browser. | Server listens on port 8551 and the public marketplace rendered. | PASS (manual smoke) |
| T-14 | Browser click through Flet sign-in and commerce screens. | Flet UI responds to mouse/keyboard and completes user flow. | Integrated browser displayed the Flet canvas, but its pointer/keyboard automation did not activate controls; workflow behavior was verified in Python unit tests instead. | NOT VERIFIED IN BROWSER |

## Evidence references

Screenshots are stored in `screenshots/`. The folder contains 37 React/Vite UI captures and `flet-public-marketplace.png` from the selected Flet app. Screenshots prove rendered UI states only; they do not prove payment settlement, backend persistence, security, accessibility, or legal compliance. See [Screenshots](10-screenshots.md).

## Build warnings and lint findings

The production build passed with notices that `baseline-browser-mapping` and `caniuse-lite` data are stale. The lint command failed with 59 errors and 8 warnings. Representative files in the reported output include `Accommodation.tsx`, `RegisterForm.tsx`, `SuperAdminDashboard.tsx`, `Marketplace.tsx`, `useAuth.ts`, `useWallet.ts`, and `types/index.ts`. These findings were recorded, not fixed as part of this documentation task.

## Next verification gates

1. Add test coverage for Flet registration validation, cart mutations, and all seller/order state transitions.
2. Add API/database integration tests for role access, idempotency, ledger integrity, and server-side payment verification when a backend exists.
3. Add browser E2E tests for registration, sign-in, listing management, buyer checkout, and fulfillment; resolve the current Flet canvas automation limitation.
4. Run accessibility, responsive-device, security, backup/restore, and legal-policy review before pilot release.
