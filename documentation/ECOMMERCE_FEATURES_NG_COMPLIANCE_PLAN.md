# CampusLink E-Commerce Features, Nigeria Compliance, and ClamAV Plan

## Purpose

This document translates the uploaded `CSC720 Electronic Commerce Technologies` lecture notes into an implementation plan for CampusLink. It also layers in the main Nigerian legal and regulatory requirements that affect an e-commerce marketplace and payment-enabled platform, plus a practical ClamAV scanning design for uploads.

This is not just a theory note. It is written as a build plan for the current CampusLink app.

## Sources used

Official Nigeria policy and regulation sources:

- Nigeria Data Protection Act 2023 recognized by the Nigeria Data Protection Commission [$TRAE_REF](https://ndpc.gov.ng/about-us/)[$TRAE_REF](https://ndpc.gov.ng/download/nigeria-data-protection-act-2023)
- CBN Consumer Protection Regulations 2019 [$TRAE_REF](https://www.cbn.gov.ng/out/2019/ccd/cbn%20consumer%20protection%20regulations.pdf)
- FCCPA 2018 and FCCPC mandate [$TRAE_REF](https://fccpc.gov.ng/resources-library/fccpa/)[$TRAE_REF](https://fccpc.gov.ng/wp-content/uploads/2022/07/FCCPA-2018.pdf)
- Cybercrimes (Amendment) Act 2024 [$TRAE_REF](https://placng.org/i/wp-content/uploads/2024/05/Cybercrimes-Prohibition-Prevention-etc-Amendment-Act-2024.pdf)

## Current app status

The current CampusLink codebase already has the beginnings of an e-commerce platform:

- marketplace listings
- category pages
- cart
- checkout
- wallet
- billing
- premium plans
- orders
- chat/messages
- KYC upload form
- legal policy pages

The main limitation is that the app is still mostly frontend-driven with local state and local storage. To support full e-commerce features and regulatory compliance, the system needs backend persistence, upload security, payment verification, moderation, and auditability.

## What the lecture notes imply CampusLink should support

From the lecture notes, the platform should cover these e-commerce capability areas:

### 1. Core commerce models

The notes explicitly classify e-commerce into B2C, B2B, C2C, C2B, G2C, mobile commerce, and social commerce. CampusLink should therefore be designed to support:

- B2C: platform or institutional sellers selling to students
- C2C: students selling goods or services to other students
- C2B: students and experts offering services to organizations
- B2B: institutional procurement, bulk supply, or organization-to-organization services
- G2C and G2B adjacencies: fee payments, public-sector service links, government-approved identity validation
- m-commerce: mobile-first shopping, payment, messaging, notifications
- social commerce: reviews, referrals, reputation, community-driven discovery

### 2. Trust and conversion features

The lecture repeatedly emphasizes trust, perceived risk, social proof, and reputation. CampusLink therefore needs:

- verified identity for sellers and service providers
- verified institution and expert profiles
- verified product or service badges where appropriate
- ratings and review system
- buyer-visible seller history
- order-level dispute flow
- complaint handling workflow
- safe messaging and evidence retention
- transparent delivery and refund status

### 3. Platform and architecture features

The lecture describes modern e-commerce as layered and API-driven. CampusLink should include:

- storefront
- catalog service
- pricing service
- cart service
- checkout service
- payments service
- wallet ledger
- order management
- notification service
- moderation pipeline
- search and recommendation layer
- audit logging
- file and media storage

### 4. Data interchange and integration features

The notes stress process interchange and partner systems. CampusLink should be prepared for:

- payment gateway webhooks
- logistics or delivery provider webhooks
- school or institution verification APIs
- document verification providers
- exportable product feeds
- admin and financial reporting exports
- future procurement or B2B catalog integrations

### 5. Personalization and customer relationship features

The lecture’s virtual customer and personalization sections imply:

- recently viewed items
- recommended products and services
- suggested experts
- saved searches
- wishlists
- targeted but permission-aware promotions
- e-CRM messaging and lifecycle communication
- opt-in marketing controls

### 6. Usability and inclusion features

The lecture explicitly covers accessibility and low-bandwidth inclusion. CampusLink should support:

- accessible forms and keyboard navigation
- plain checkout copy
- clear pricing and fee visibility
- lightweight pages for low-bandwidth users
- mobile-first interactions
- support for local payment methods
- support for users with lower digital literacy

## Features CampusLink should add or strengthen

### Marketplace and catalog

- inventory and availability status
- stock counts for physical goods
- listing moderation status
- promotional banners and featured slots
- advanced filters and sorting
- seller storefront pages
- bundle offers
- bulk purchase workflow
- procurement request flow for institutions

### Cart and checkout

- saved carts
- coupon and discount engine
- tax or regulatory fee abstraction if needed
- checkout validation and address verification
- guest checkout decision support
- delivery options by location
- partial payment handling if business rules allow

### Payments and financial controls

- server-side Paystack verification
- payment status reconciliation
- wallet ledger immutability
- transaction risk checks
- duplicate payment detection
- failed payment retry logic
- refund initiation and refund status tracking

### Orders and fulfillment

- order splitting by seller
- shipment or fulfillment states
- service delivery acceptance state
- cancellation windows
- return and refund workflow
- proof-of-delivery or proof-of-completion
- support escalation

### Messaging and community

- listing-linked conversation threads
- order-linked support chat
- attachment uploads
- moderation and abuse reporting
- community discussions or reviews around listings
- trust and safety rules

### Personalization

- recommendations
- search relevance ranking
- behavioural analytics
- saved preferences
- notification targeting

### Admin and operations

- moderation queue
- fraud monitoring dashboard
- consumer complaint dashboard
- premium plan management
- payout review and approval
- suspicious activity review
- reporting and audit exports

## Nigeria compliance requirements CampusLink must satisfy

### 1. Data protection and privacy

Nigeria’s Data Protection Act 2023 is the core privacy law and the NDPC presents it as the legal framework protecting personal data in Nigeria [$TRAE_REF](https://ndpc.gov.ng/about-us/)[$TRAE_REF](https://ndpc.gov.ng/download/nigeria-data-protection-act-2023)

For CampusLink this means:

- define lawful basis for processing user data
- collect only necessary KYC and account data
- publish privacy notice and processing purposes clearly
- store identity documents securely
- implement role-based access to personal data
- keep consent or processing records where required
- support subject rights workflows
- secure personal data in transit and at rest

Minimum product requirements:

- privacy notice linked at registration and checkout
- data retention policy
- delete or archive policy for dormant or expired records
- audit logs for access to sensitive records
- consent preferences for marketing and personalization

### 2. Consumer protection

The CBN Consumer Protection Regulations require fair treatment, disclosure and transparency, responsible business conduct, data protection and privacy, and complaints handling and redress for regulated financial products and services [$TRAE_REF](https://www.cbn.gov.ng/out/2019/ccd/cbn%20consumer%20protection%20regulations.pdf)

This directly affects:

- wallet
- premium billing
- card and transfer payments
- checkout disclosures
- refund handling
- complaint and dispute resolution

CampusLink must therefore implement:

- clear display of all fees before payment
- fair and non-deceptive advertising
- accurate transaction notifications
- dispute and complaint channels
- visible complaint escalation path
- plain-language terms for financial actions
- documented refund and reversal handling

The FCCPA 2018 is Nigeria’s main consumer protection statute and FCCPC states it is the primary law governing consumer protection and competition regulation in Nigeria [$TRAE_REF](https://fccpc.gov.ng/resources-library/fccpa/)[$TRAE_REF](https://fccpc.gov.ng/wp-content/uploads/2022/07/FCCPA-2018.pdf)

This means CampusLink should also support:

- truthful product and service descriptions
- right to return or dispute where applicable
- product safety and quality responsibility
- safe goods and services standards
- prevention of unfair contract terms
- transparent price display

### 3. Cybersecurity and incident handling

The 2024 Cybercrimes amendment tightened incident reporting timelines to 72 hours after detection for relevant events and ties service-provider traffic and subscriber data protection to the Nigeria Data Protection Act; it also expands coverage to broader public and private organizations and other payment technology means [$TRAE_REF](https://placng.org/i/wp-content/uploads/2024/05/Cybercrimes-Prohibition-Prevention-etc-Amendment-Act-2024.pdf)

For CampusLink this means:

- incident logging
- suspicious payment and fraud monitoring
- breach notification workflow
- SOC or security monitoring integration readiness
- protection of traffic and subscriber information
- protection against phishing, fraudulent uploads, and malicious files

## ClamAV requirement and how it should be used

### Important note

`clamscan` is not installed in the current runtime, so I could not run a real scan locally on the uploaded PDF during this session. The command returned `command not found`.

That means the correct next step is not to fake ClamAV usage in the frontend. The correct step is to design ClamAV into the backend upload flow and infrastructure.

### Where ClamAV must be used

CampusLink should use ClamAV on all file uploads that may enter the platform:

- student KYC documents
- government IDs
- listing images and attachments
- dispute evidence uploads
- chat attachments
- future seller documents

### Required scan workflow

1. User uploads file
2. File lands in temporary quarantine storage
3. Backend creates file scan job
4. ClamAV scans file
5. File is marked:
   - `clean`
   - `infected`
   - `scan_failed`
   - `quarantined`
6. Only clean files become visible or usable in the app
7. Infected files are blocked and logged
8. Admin can review infected or failed uploads

### Minimum backend components for ClamAV

- ClamAV daemon or sidecar container
- upload quarantine bucket
- scan job worker
- file metadata table
- scan audit log
- admin review screen

### Suggested file tables

#### `uploaded_files`

- `id`
- `owner_user_id`
- `context_type`
- `context_id`
- `original_name`
- `storage_path`
- `mime_type`
- `size_bytes`
- `sha256`
- `upload_status`
- `created_at`

#### `file_scan_jobs`

- `id`
- `file_id`
- `scanner_name`
- `scan_status`
- `scan_result`
- `signature_version`
- `started_at`
- `completed_at`
- `error_message`

#### `security_events`

- `id`
- `event_type`
- `severity`
- `user_id`
- `file_id`
- `order_id`
- `payment_attempt_id`
- `metadata`
- `created_at`

## Gaps between current app and required e-commerce baseline

### Current strengths

- marketplace exists
- categories exist
- cart exists
- wallet exists
- billing exists
- KYC UI exists
- legal pages exist
- messages exist
- admin dashboard exists

### Current gaps

- no real backend persistence
- no real upload storage workflow
- no real file scanning
- no real payment verification webhook
- no order audit ledger
- no review and rating persistence
- no formal complaint workflow
- no security event pipeline
- no breach or incident handling workflow
- no RLS-backed data protection enforcement

## Recommended implementation phases

### Phase 1: secure core commerce

- move auth, wallet, orders, and listings to backend
- add payment verification backend
- implement order audit trail
- implement admin-managed refunds and dispute intake
- implement upload storage and file metadata
- integrate ClamAV scanning service

### Phase 2: trust and safety

- reviews and ratings
- listing moderation
- complaint escalation
- fraud and suspicious activity logging
- document validation workflow
- security events dashboard

### Phase 3: richer e-commerce features

- promotions and coupons
- saved carts and wishlists
- advanced search and recommendation
- bulk offers and institution procurement
- seller storefront pages
- inventory control

### Phase 4: compliance maturity

- consent management
- retention and deletion workflows
- user data request workflow
- incident response logs
- admin export and audit reporting

## Recommended immediate implementation priority for CampusLink

If the goal is to make the app genuinely e-commerce-ready and policy-aware, the next concrete build order should be:

1. backend persistence
2. Paystack server verification
3. secure upload pipeline
4. ClamAV integration
5. complaint and dispute flow
6. ratings and reviews
7. recommendation and personalization

## Suggested engineering tasks

### Backend

- create upload service with quarantine and scan pipeline
- add webhook verification for Paystack
- add complaint and dispute APIs
- add review and rating APIs
- add recommendation-ready event capture

### Database

- extend schema with `uploaded_files`
- extend schema with `file_scan_jobs`
- extend schema with `security_events`
- extend schema with `reviews`
- extend schema with `complaints`
- extend schema with `recommendation_events`
- extend schema with `user_consents`

### Frontend

- show upload scan pending and blocked states
- add review submission and listing review display
- add complaint submission UI
- add order dispute timeline
- add security and privacy notices at upload and checkout

### Admin

- infected file review queue
- complaint dashboard
- fraud and risk event list
- refund approval workflow
- policy settings and retention controls

## ClamAV deployment recommendation

Recommended production pattern:

- app uploads to temporary storage
- queue triggers a worker
- worker calls ClamAV daemon
- result written back to DB
- only clean files move to permanent bucket

Suggested runtime options:

- Docker sidecar with `clamd`
- separate scan worker service
- daily signature updates
- hard file size and mime checks before scan

## What this means for the current project

The lecture notes support a much larger e-commerce scope than the current frontend-only implementation. The app already has a strong UI foundation, but to actually satisfy the lecture’s model and the Nigerian compliance layer, CampusLink now needs:

- backend state
- secure payments
- secure uploads
- moderation
- privacy controls
- auditability
- complaint and redress flow

## Next best outputs

After this file, the strongest next deliverables are:

1. updated database schema that includes file scanning, reviews, complaints, and security events
2. Supabase migration for those new tables
3. backend API design for upload scanning and payment verification
4. implementation roadmap for frontend and backend phases
