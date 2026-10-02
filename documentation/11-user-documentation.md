# 11. User Documentation

## Installation and first run

### Selected Python/Flet web application

Prerequisites: Python 3.9 or later, pip, and a modern browser.

1. From the repository root, create a virtual environment: `python3 -m venv flet_webapp/.venv`.
2. Install dependencies: `flet_webapp/.venv/bin/pip install -r flet_webapp/requirements.txt`.
3. Start the web app: `CAMPUSLINK_PORT=8551 flet_webapp/.venv/bin/python flet_webapp/app.py`.
4. Open `http://localhost:8551/`. Omit `CAMPUSLINK_PORT` to use port 8550 when it is free.
5. Browse the marketplace or choose **Sign in** to enter demo credentials.

Checkout in the selected Flet app is simulated and does not connect to Paystack or charge funds. Never enter real personal, address, payment, or identity information.

### React/Vite reference application

The repository also contains a separate React/Vite implementation. From the repository root run `npm ci` and `npm run dev`; Vite uses port 3000. This is a parallel reference, not the selected coursework target.

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Buyer/student | `john.doe@university.edu` | `password123` |
| Expert/vendor | `sarah.chen@gmail.com` | `expert123` |
| Institution | `admin@techuniversity.com` | `admin123` |
| Platform super-admin | `admin@campuslink.com` | `admin123` |

These credentials are public demo fixtures in source code. Do not reuse them for a real service.

## Buyer manual

1. Open the Marketplace and browse categories or use search/filter controls.
2. Select **Add to cart** on a listing. Sign in when prompted.
3. Open **Cart**; adjust quantity, remove items, or continue shopping.
4. Select **Proceed to Checkout** and complete contact and delivery fields.
5. Review subtotal, service fee (5%), delivery fee (NGN 3,500 when the cart is non-empty), and total.
6. Choose **Demo payment (no charge)** or **CampusLink demo wallet**. Wallet checkout is rejected if the demo balance is too low.
7. Orders appear under **Orders**. Use the available status buttons to walk through the local fulfillment flow. Changes are stored only in this browser session; they do not notify a seller or represent a real shipment.

The React reference app has a separate checkout and fee configuration; do not mix its behavior with the selected Flet target.

## Vendor manual

1. Sign in with a verified demo account, or register a new account and request verification from Profile.
2. Open **My listings** (or **Listings** for expert/institution roles).
3. Enter title, offer type, category, description, price, location, and delivery/turnaround, then select **Publish listing**.
4. Use the listing controls to edit, pause/reactivate, or delete your own listings.

Listings are saved in this browser only and are not reviewed by an admin. Do not advertise real goods/services through the demo.

## Admin manual

1. Sign in with the super-admin demo account.
2. Use **Dashboard** to inspect illustrative platform summary metrics. The Flet port does not include user-management, system-settings, or analytics sub-tabs.
3. Use **Profile**, **Wallet**, or **Billing** from the role navigation to inspect demo screens.
4. Treat all metrics and actions as illustrative. This role does not provide a production moderation, KYC review, payout approval, audit, or dispute-resolution system.

Operational actions on real users or funds must wait for server-side permissions, persistence, audit trails, and approved procedures.

## FAQ

**Why did my cart or session reset?** Browser data may be cleared or changed. The current demo stores key state in browser local storage and does not sync between devices.

**Can I use a real card or transfer?** No. Flet checkout offers a no-charge simulated payment and a simulated wallet method only.

**Why can't I publish a listing?** The account must have verified status. New registrations start unverified; request verification from Profile. This local demo does not include a real KYC review process.

**How do I update an order?** Use the allowed status buttons shown on the Flet Orders view. Status changes are local demo history only and are not shared with a seller.

**Are demo account passwords secure?** No. They are fixtures in source code and must never be used as production credentials.

**Where do I report a bug?** This repository has no configured production support channel. During development, record the browser, steps, expected/actual behavior, and a sanitized screenshot for the project maintainer.
