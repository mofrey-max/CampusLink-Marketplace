# 6. Pseudocode

The pseudocode is language-independent. The `CURRENT` and `PRODUCTION` labels distinguish the demo's actual scope from recommended trusted behavior.

## Register account

```text
FUNCTION register(input):
    REQUIRE input.name, input.email, input.password, input.confirmPassword
    REQUIRE input.accountType, input.university
    IF NOT validEmail(input.email):
        RETURN error("Invalid email")
    IF length(input.password) < 8:
        RETURN error("Password requirements not met")
    IF input.password != input.confirmPassword:
        RETURN error("Passwords do not match")

    // CURRENT FLET DEMO: search demo users and browser-stored registrations.
    // PRODUCTION: enforce uniqueness inside the identity service/database.
    IF accountExists(caseInsensitive(input.email)):
        RETURN error("Account already exists")

    account = createProfile(input, role="user", verification="not_started")
    persistAccount(account)  // Includes demo password record in client storage.
    session = createSessionWithoutPassword(account)
    persistSession(session)
    RETURN success(session)
```

For production, passwords must only be handled by a trusted identity provider, never stored as plaintext in browser local storage.

## Add/update cart

```text
FUNCTION addToCart(cart, product):
    item = find cart item where productId == product.id
    IF item exists:
        item.quantity = item.quantity + 1
    ELSE:
        cart.append(snapshot(product, quantity=1))
    saveCart(cart)
    RETURN cart

FUNCTION setQuantity(cart, productId, quantity):
    IF quantity <= 0:
        remove item with productId from cart
    ELSE:
        set matching item's quantity = quantity
    saveCart(cart)
    RETURN cart
```

## Checkout

```text
FUNCTION checkout(user, cart, delivery, method):
    IF user is absent:
        RETURN error("Sign in required")
    IF cart is empty:
        RETURN error("Cart is empty")
    IF required delivery fields are missing:
        RETURN error("Complete delivery details")

    subtotal = SUM(item.price * item.quantity for item in cart)
    serviceFee = ROUND(subtotal * 0.05)
    deliveryFee = 2500
    total = subtotal + serviceFee + deliveryFee

    IF method == WALLET:
        IF user.walletBalance < total:
            RETURN error("Insufficient demo wallet balance")
        debit user.walletBalance by total
        paymentReference = createDemoWalletReference()
    ELSE IF method == DEMO:
        paymentReference = createNoChargeDemoReference()
    ELSE:
        RETURN error("Unsupported demo payment method")

    order = snapshot cart, checkout, totals, paymentReference
    order.status = PROCESSING
    order.paymentStatus = PAID_DEMO
    append initial status-history entry
    add order to user's browser-stored order history
    clear cart
    persist session
    RETURN order
```

The current Flet method recalculates totals from the cart instead of trusting a caller-supplied total. Demo wallet/order state is still local browser data. Database transactions, provider confirmation, and idempotency are production requirements.

## Update fulfillment status

```text
FUNCTION updateOrderStatus(orderId, requestedStatus):
    order = find order in current user's browser-local order list
    IF order does not exist:
        RETURN notFound
    IF NOT validTransition(order.status, requestedStatus):
        RETURN conflict(order.status)

    order.status = requestedStatus
    append local status-history(requestedStatus, timestamp)
    persist current user's session
    RETURN updated demo order
```

Production extension: authenticate and authorize the actor server-side, update in a transaction, append immutable history, and notify parties through an idempotent outbox.
