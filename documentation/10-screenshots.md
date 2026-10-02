# 10. Screenshots

## Evidence inventory

Screenshots are stored in `documentation/screenshots/`. The folder contains 37 captures of React/Vite interface states and a Flet public-marketplace capture. The two implementations are labeled separately so the evidence is not misattributed.

| Implementation | Evidence | Coverage |
|---|---|---|
| Python/Flet web app | [flet-public-marketplace.png](screenshots/flet-public-marketplace.png) | Public storefront rendered from the selected Flet app at `http://localhost:8551/`. |
| React/Vite reference app | `marketplace-public.png`, `auth-*.png`, `student-*.png`, `expert-*.png`, `institution-*.png`, `super-admin-*.png` | Public marketplace, auth, role sections, cart, and checkout. These are not screenshots of the Flet port. |

## Capture limitations

The integrated browser rendered the Flet canvas but its automated pointer and keyboard actions did not activate the Flet controls. Therefore only the Flet public view is recorded as browser screenshot evidence. The Flet workflow methods and widget constructors are instead covered by the Python tests in `../flet_webapp/test_commerce.py`.

For a complete visual submission, manually capture Flet sign-in/registration, buyer marketplace/cart/checkout/orders, verified vendor listings, fulfillment status changes, and admin screens from the running Flet web app. Preserve one screenshot per meaningful feature and keep the original resolution. Screenshots prove visible UI only, not persistence, security, payment settlement, or legal compliance.