# 7. System Design

## Design boundary

The design has two distinct views: **current Flet web demo architecture** and **proposed production architecture**. The PostgreSQL schema and Supabase migration are design assets; the selected Flet runtime uses browser client storage for account, listing, cart, wallet, and order state. Do not infer production persistence or authorization from the schema alone.

## Current architecture

```mermaid
flowchart LR
    B[Browser] --> UI[Python and Flet web client]
    UI --> AUTH[Demo sign-in and registration]
    UI --> CAT[Seed catalog and local seller listings]
    UI --> CART[Cart and fee calculation]
    UI --> CHECK[Demo checkout and order status flow]
    AUTH --> LS[(Flet client storage: demo users and session)]
    CAT --> LS2[(Flet client storage: listings)]
    CART --> LS3[(Session cart and wallet balance)]
    CHECK --> LS4[(Session order history and status events)]
    REACT[Separate React/Vite reference app] -. Not the selected coursework target .-> B
    SQL[(PostgreSQL schema and Supabase migration assets)] -. Not wired to Flet runtime .-> UI
```

## Proposed production architecture

```mermaid
flowchart LR
    U[Buyer, seller, admin] --> WEB[Responsive React client]
    WEB --> API[Authenticated application API]
    API --> ID[Identity and role policy]
    API --> DB[(PostgreSQL)]
    API --> OBJ[(Private object storage)]
    OBJ --> Q[Quarantine and malware scan worker]
    API --> PAY[Payment adapter]
    PAY --> PS[Paystack]
    PS --> WH[Signed webhook endpoint]
    WH --> API
    API --> JOB[Outbox/notification worker]
    JOB --> MSG[Email, SMS, push providers]
    API --> AUD[Audit and monitoring]
```

The API, server verification, malware scanner, notification worker, and audit integration in this diagram are **proposed**, not current Flet services.

## Database design

The repository's `database/schema.sql` defines the following relational groups. Monetary columns in the schema use integer kobo; Flet demo values are integer NGN, so conversion and rounding rules must be centralized before database persistence.

| Domain | Main tables | Purpose |
|---|---|---|
| Identity and verification | `profiles`, `verification_requests`, `verification_documents` | User role/profile and verification request/document metadata. |
| Marketplace | `marketplace_categories`, `marketplace_listings`, `listing_media` | Catalog, category, listing state, and media references. |
| Payment and wallet | `wallets`, `wallet_ledger_entries`, `payout_accounts`, `payment_attempts` | Balances, ledger history, withdrawal destinations, and provider attempts. |
| Orders | `orders`, `order_items`, `order_status_history` | Buyer order, immutable listing snapshots, and status history. |
| Premium | `subscription_plans`, `subscriptions` | Plan catalog and user subscription lifecycle. |
| Messaging and disputes | `conversations`, `conversation_participants`, `messages`, `message_attachments`, `disputes` | Communication, attachments, and order dispute resolution. |
| Governance | `system_settings`, `admin_audit_logs` | Platform settings and administrative action history. |

### Core entity relationships

```mermaid
erDiagram
    PROFILES ||--o{ VERIFICATION_REQUESTS : submits
    PROFILES ||--o{ MARKETPLACE_LISTINGS : sells
    MARKETPLACE_CATEGORIES ||--o{ MARKETPLACE_LISTINGS : categorizes
    MARKETPLACE_LISTINGS ||--o{ LISTING_MEDIA : has
    PROFILES ||--|| WALLETS : owns
    WALLETS ||--o{ WALLET_LEDGER_ENTRIES : records
    PROFILES ||--o{ PAYMENT_ATTEMPTS : initiates
    PROFILES ||--o{ ORDERS : buys
    ORDERS ||--o{ ORDER_ITEMS : contains
    MARKETPLACE_LISTINGS o|--o{ ORDER_ITEMS : snapshots
    PROFILES ||--o{ ORDER_ITEMS : fulfills
    ORDERS ||--o{ ORDER_STATUS_HISTORY : tracks
    PROFILES ||--o{ SUBSCRIPTIONS : holds
    SUBSCRIPTION_PLANS ||--o{ SUBSCRIPTIONS : defines
    CONVERSATIONS ||--o{ MESSAGES : contains
    PROFILES ||--o{ CONVERSATION_PARTICIPANTS : joins
    CONVERSATIONS ||--o{ CONVERSATION_PARTICIPANTS : includes
    ORDERS ||--o{ DISPUTES : may_have
    PROFILES ||--o{ ADMIN_AUDIT_LOGS : performs
```

The diagram is a high-level view. Column types, constraints, indexes, enum values, and triggers are in `../database/schema.sql`.

## Input, output, and interface design

| Interface | Inputs | Outputs / feedback | Current surface |
|---|---|---|---|
| Registration | Name, email, password/confirmation, account type, profile fields | Validation feedback or local account/session | Flet auth dialog |
| Sign-in | Email and password | Error or role-specific workspace | Flet auth dialog |
| Marketplace | Search text, category, listing selection | Filtered cards, details dialog, cart action | `build_marketplace_panel` |
| Seller listings | Kind, category, title, description, price, location, delivery | Local listing create/edit/pause/delete | `build_listings`, `save_listing` |
| Cart | Product, quantity delta, remove/clear action | Items, subtotal, service fee, delivery fee, total | `build_cart` |
| Checkout | Name, email, phone, address, note, demo/wallet method | Validation or locally stored simulated order | `build_checkout`, `place_order` |
| Orders | Current user's local orders, selected allowed status | Snapshots, payment reference, status history | `build_orders`, `update_order_status` |
| Admin | Dashboard tabs and controls | Demo metrics and management views | `build_dashboard` |

For production, every form needs server validation, accessible labels/error messaging, server permission checks, and a durable audit trail for sensitive actions.

## Design constraints and decisions

- Keep order item title/price/seller snapshots so later listing edits do not rewrite a buyer's receipt.
- Use integer minor currency units in persistent records and document one rounding policy for fee calculation.
- Enforce role and record ownership on the server; hiding a client button is not authorization.
- Keep KYC documents private, use temporary quarantine storage and scan before release, and restrict staff access.
- Verify payment events on the server and make order creation idempotent.
