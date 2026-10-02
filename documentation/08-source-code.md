# 8. Source Code

## Selected target: Python/Flet web

The selected coursework application lives under `flet_webapp/`. It is a single Python codebase served in a browser using Flet. The React/Vite implementation below is a separate reference app, not the chosen deliverable.

| Path | Responsibility |
|---|---|
| [`../flet_webapp/app.py`](../flet_webapp/app.py) | Flet UI, demo identity/session state, role navigation, marketplace, local seller listings, cart, checkout, orders, and other views. |
| [`../flet_webapp/commerce.py`](../flet_webapp/commerce.py) | Shared fee calculation and allowed order-status transition rules. |
| [`../flet_webapp/test_commerce.py`](../flet_webapp/test_commerce.py) | Unit/workflow and widget-construction tests for the selected Flet app. |
| [`../flet_webapp/requirements.txt`](../flet_webapp/requirements.txt) | Python dependency constraint for Flet. |
| [`../flet_webapp/README.md`](../flet_webapp/README.md) | Flet installation, launch, limitations, tests, and demo credentials. |
| [`../database/schema.sql`](../database/schema.sql) | PostgreSQL design/schema with enums, constraints, indexes, seeds, and timestamps; not wired into Flet runtime. |
| [`../supabase/migrations/`](../supabase/migrations/) | Initial Supabase migration asset; not applied by the Flet demo. |

## Parallel React reference

| Path | Responsibility |
|---|---|
| `../src/main.tsx` | React entry point and Auth/Commerce providers. |
| `../src/App.tsx` | Authentication, role selection, navigation, and screen composition. |
| `../src/components/Auth/` | Login, registration, student KYC, and verification banner. |
| `../src/components/Marketplace/` | Marketplace storefront, category page, and seeded product/category data. |
| `../src/components/Cart/`, `../src/components/Checkout/`, `../src/components/Orders/` | Buyer commerce flow. |
| `../src/components/Dashboard/` | Student, expert, institution, and super-admin dashboards. |
| `../src/components/Wallet/`, `../src/components/Billing/` | Demo wallet, deposits/withdrawals, and premium billing screens. |
| `../src/components/Messages/`, `../src/components/Projects/`, `../src/components/Profile/` | Supporting user workspace modules. |
| `../src/components/Accommodation/`, `../src/components/DataAnalysis/`, `../src/components/News/`, `../src/components/Legal/` | Additional platform views. |
| `../src/components/Mobile/`, `../src/components/Navigation/`, `../src/components/UI/` | Responsive navigation and shared UI. |
| `../src/hooks/useAuth.ts` | Demo authentication and verification state. |
| `../src/hooks/useCommerce.tsx` | Local cart and order state. |
| `../src/hooks/useWallet.ts`, `../src/hooks/usePaystack.ts` | Mock wallet and optional Paystack Inline client flow. |
| `../src/types/index.ts` | TypeScript domain interfaces. |
| `../database/schema.sql` | PostgreSQL design/schema with enums, constraints, indexes, seeds, and timestamps. |
| `../supabase/migrations/` | Initial Supabase migration asset. |
| `screenshots/` | React/Vite UI captures and Flet public marketplace capture; see [Screenshots](10-screenshots.md) for provenance. |

The React app is organized by feature/module and remains available for comparison. Neither frontend is a production marketplace backend.

## Run the selected Flet web application

From the repository root, create a virtual environment, install the Flet requirements, and start the web app:

```bash
python3 -m venv flet_webapp/.venv
flet_webapp/.venv/bin/pip install -r flet_webapp/requirements.txt
CAMPUSLINK_PORT=8551 flet_webapp/.venv/bin/python flet_webapp/app.py
```

Open `http://localhost:8551/`. Omit `CAMPUSLINK_PORT` to use the default port 8550. On Windows, set the environment variable using PowerShell syntax before running Python.

Run the Flet test suite:

```bash
flet_webapp/.venv/bin/python -m unittest discover -s flet_webapp -p 'test_*.py' -v
```

## Parallel React commands

The separate React app uses `npm ci`, `npm run dev`, `npm run build`, and `npm run lint` from the repository root. React results are reported separately in [Testing Evidence](09-testing-evidence.md).

## Demo accounts

These accounts are hard-coded for demonstration and must not be used as production credentials:

| Type | Email | Password |
|---|---|---|
| Student | `john.doe@university.edu` | `password123` |
| Expert | `sarah.chen@gmail.com` | `expert123` |
| Institution | `admin@techuniversity.com` | `admin123` |
| Super admin | `admin@campuslink.com` | `admin123` |

## Reproducibility and security note

Browser-local accounts, carts, orders, and wallet values are not a secure or shared persistence layer. Do not place real KYC files, live payment data, or confidential user data in the demo. Before deployment, replace mock services with an authenticated backend and complete the controls in [System Requirements](03-system-requirements.md) and [System Design](07-system-design.md).
