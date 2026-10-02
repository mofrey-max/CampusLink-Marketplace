# 5. Flowcharts

The first two diagrams describe the intended user path alongside current demo behavior. The fulfillment diagram is a production target because the current UI does not provide a status-update workflow.

## Registration and login

```mermaid
flowchart TD
    A([Start]) --> B{Choose action}
    B -->|Register| C[Enter account and profile details]
    C --> D{Form valid?}
    D -->|No| E[Show field or validation error]
    E --> C
    D -->|Yes| F{Email already registered?}
    F -->|Yes| G[Show duplicate account error]
    G --> C
    F -->|No| H[Create account and session]
    B -->|Login| I[Enter email and password]
    I --> J{Credentials valid?}
    J -->|No| K[Show sign-in error]
    K --> I
    J -->|Yes| H
    H --> L[Select role-appropriate default view]
    L --> M([Continue to marketplace/workspace])
```

**Current note:** the validation and account lookup use the frontend demo provider and local storage, not a server identity service.

## Checkout (Flet demo)

```mermaid
flowchart TD
    A([Open checkout]) --> B{Signed in and cart non-empty?}
    B -->|No cart| C[Show empty checkout]
    B -->|No session| D[Require sign-in]
    B -->|Yes| E[Collect contact and delivery details]
    E --> F{Required fields valid?}
    F -->|No| G[Show validation message]
    G --> E
    F -->|Yes| H[Recalculate subtotal, 5 percent service fee, NGN 3,500 delivery]
    H --> I{Select demo payment method}
    I -->|Wallet| J{Balance covers total?}
    J -->|No| K[Show insufficient-balance error]
    J -->|Yes| L[Debit simulated wallet]
    I -->|Demo payment| M[Generate simulated payment reference]
    L --> N[Snapshot order and status history]
    M --> N
    N --> O[Clear cart and show order]
    P[Production addition: server verifies provider event] -.-> N
```

The Flet flow does not collect card/bank details and does not charge real funds. Server/provider confirmation is a production requirement, not a current guarantee.

## Order fulfillment (production target)

```mermaid
flowchart TD
    A([Paid order]) --> B[Create order and item status history]
    B --> C[Notify assigned seller]
    C --> D{Seller accepts?}
    D -->|No| E[Admin review or cancellation/refund decision]
    D -->|Yes| F[Seller prepares goods or service]
    F --> G[Record fulfillment evidence and status]
    G --> H[Notify buyer]
    H --> I{Buyer accepts delivery/completion?}
    I -->|Yes| J[Mark item/order completed]
    I -->|No| K[Open dispute with reason/evidence]
    K --> L[Admin reviews evidence and policy]
    L --> M{Resolution}
    M -->|Refund| N[Issue verified refund and ledger entry]
    M -->|Reject| O[Record decision and close dispute]
    M -->|Other remedy| P[Record approved resolution]
    E --> Q[Record status, actor, and reason]
```

The Flet demo now supports local, guarded status transitions and stores status history with each browser-local order. This diagram extends that flow with seller/buyer authorization, notifications, evidence, and dispute resolution; those production capabilities are not implemented.
