# 4. Algorithms

These descriptions target the selected Python/Flet web application. Demo/local behavior is separated from production requirements.

## 4.1 Registration

**Current Flet demo behavior**

1. Collect name, email, password, confirmation, account type, university/organization, and optional profile fields.
2. Require all required fields, a basic email pattern, matching passwords, and a password of at least eight characters.
3. Check the email against seeded accounts and registered users in Flet browser client storage.
4. If the address is unique, create a user object with role `user`, default verification state, and a local ID.
5. Store the registered user record in client storage, save a session without the password field, and render the role's Flet workspace.

**Production requirement:** do not store passwords in browser storage. Use a managed identity provider/server, server-side uniqueness checks, secure session handling, verification controls, abuse/rate protection, and privacy notices.

## 4.2 Login

1. Accept email and password in the Flet sign-in dialog.
2. Compare the credentials against in-code demo users and browser-stored registrations.
3. On match, create a password-free current-user object, restore that account's cart and orders, and select the role's default tab.
4. On mismatch, display an error and keep the sign-in dialog available.

This is a demonstration flow only; browser storage is not a secure session store.

## 4.3 Cart

1. Receive a seeded or active seller listing selected from marketplace data.
2. Search cart items by product ID.
3. If present, increase quantity by one; otherwise append a cart item containing product/seller/price/delivery snapshots with quantity one.
4. Persist the cart in the current user's browser client-storage record.
5. For quantity changes, replace the quantity; remove the item if quantity is zero or below. Explicit removal and clear-cart actions delete items.
6. Compute subtotal as `sum(unit price * quantity)` and display the 5% service fee plus NGN 3,500 delivery fee when the cart is non-empty.

There is no server inventory reservation in the current implementation.

## 4.4 Checkout

1. Load the signed-in user and current cart.
2. Reject an empty cart; require a valid email and non-empty name, phone, and address.
3. Recalculate subtotal from cart contents, service fee (5%), delivery fee (NGN 3,500 for a non-empty cart), and total. The order function ignores any caller-supplied total.
4. For wallet payment, reject a balance below the recalculated total; otherwise debit only the required amount and generate a demo reference.
5. For the no-charge demo method, generate a clearly marked simulated payment reference. No card or bank credentials are collected.
6. Snapshot cart items, fees, checkout details, payment method/reference, and initial `processing` status into the current user's local orders.
7. Clear the cart, persist the updated session, and open order history.

**Production requirement:** connect a payment provider through a trusted server; verify provider status server-side before marking an order paid; use idempotency and a database transaction.

## 4.5 Order update / fulfillment

**Current Flet demo behavior:** checkout creates a per-user local order with status `processing` and `paid_demo`. Order history displays the snapshot and exposes only transitions permitted by `commerce.py`. Each accepted change appends a local status-history entry. These controls are not server-authorized, and no notifications are sent.

**Proposed production algorithm:**

1. Authenticate the actor and load the order/items from the database.
2. Verify actor authorization for the requested transition (seller assigned to item, buyer confirmation, or authorized admin).
3. Validate the transition against an explicit state machine; reject terminal or out-of-order transitions.
4. Write the order/item status and immutable status-history event in one transaction, including actor, timestamp, and note.
5. For payment/refund transitions, require server-confirmed provider/ledger state; never accept a browser-supplied status as proof.
6. Commit, then enqueue buyer/seller notification; retry notification independently without duplicating the state change.
7. Return the authoritative order state. On conflict, return the current state and a safe error.

Proposed states are defined in the schema enums, including pending payment, paid, processing, fulfilled, completed, cancelled, disputed, and refunded. Allowed transitions need product/legal approval.
