-- CampusLink PostgreSQL schema
-- Generic relational schema derived from the current product plan.

begin;

create extension if not exists pgcrypto;
create extension if not exists citext;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_type_enum') then
    create type user_type_enum as enum ('student', 'expert', 'institution');
  end if;
  if not exists (select 1 from pg_type where typname = 'role_enum') then
    create type role_enum as enum ('user', 'admin', 'super_admin');
  end if;
  if not exists (select 1 from pg_type where typname = 'verification_status_enum') then
    create type verification_status_enum as enum ('not_started', 'pending', 'verified', 'rejected');
  end if;
  if not exists (select 1 from pg_type where typname = 'verification_type_enum') then
    create type verification_type_enum as enum ('student_kyc', 'expert_verification', 'institution_verification');
  end if;
  if not exists (select 1 from pg_type where typname = 'document_type_enum') then
    create type document_type_enum as enum ('student_id', 'government_id', 'certificate', 'other');
  end if;
  if not exists (select 1 from pg_type where typname = 'wallet_status_enum') then
    create type wallet_status_enum as enum ('active', 'restricted', 'suspended');
  end if;
  if not exists (select 1 from pg_type where typname = 'ledger_entry_type_enum') then
    create type ledger_entry_type_enum as enum ('deposit', 'withdrawal', 'payment', 'earning', 'refund', 'fee', 'hold', 'release');
  end if;
  if not exists (select 1 from pg_type where typname = 'ledger_direction_enum') then
    create type ledger_direction_enum as enum ('credit', 'debit');
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_purpose_enum') then
    create type payment_purpose_enum as enum ('wallet_deposit', 'marketplace_checkout', 'subscription', 'withdrawal_payout', 'refund');
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_method_enum') then
    create type payment_method_enum as enum ('wallet', 'card', 'transfer', 'ussd', 'bank', 'bank_transfer');
  end if;
  if not exists (select 1 from pg_type where typname = 'provider_enum') then
    create type provider_enum as enum ('paystack');
  end if;
  if not exists (select 1 from pg_type where typname = 'provider_status_enum') then
    create type provider_status_enum as enum ('initialized', 'pending', 'paid', 'failed', 'cancelled', 'refunded');
  end if;
  if not exists (select 1 from pg_type where typname = 'subscription_interval_enum') then
    create type subscription_interval_enum as enum ('monthly', 'yearly');
  end if;
  if not exists (select 1 from pg_type where typname = 'subscription_status_enum') then
    create type subscription_status_enum as enum ('active', 'past_due', 'cancelled', 'expired');
  end if;
  if not exists (select 1 from pg_type where typname = 'category_kind_enum') then
    create type category_kind_enum as enum ('services', 'goods', 'mixed');
  end if;
  if not exists (select 1 from pg_type where typname = 'seller_type_enum') then
    create type seller_type_enum as enum ('expert', 'student', 'institution');
  end if;
  if not exists (select 1 from pg_type where typname = 'item_type_enum') then
    create type item_type_enum as enum ('service', 'goods');
  end if;
  if not exists (select 1 from pg_type where typname = 'listing_status_enum') then
    create type listing_status_enum as enum ('draft', 'active', 'paused', 'sold', 'archived', 'moderated');
  end if;
  if not exists (select 1 from pg_type where typname = 'fulfillment_mode_enum') then
    create type fulfillment_mode_enum as enum ('digital', 'physical', 'remote', 'in_person', 'pickup');
  end if;
  if not exists (select 1 from pg_type where typname = 'order_status_enum') then
    create type order_status_enum as enum ('pending_payment', 'paid', 'processing', 'fulfilled', 'completed', 'cancelled', 'disputed', 'refunded');
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_status_enum') then
    create type payment_status_enum as enum ('pending', 'paid', 'failed', 'refunded', 'partially_refunded');
  end if;
  if not exists (select 1 from pg_type where typname = 'order_item_status_enum') then
    create type order_item_status_enum as enum ('pending', 'processing', 'fulfilled', 'cancelled', 'refunded', 'disputed');
  end if;
  if not exists (select 1 from pg_type where typname = 'conversation_type_enum') then
    create type conversation_type_enum as enum ('direct', 'group', 'order_support');
  end if;
  if not exists (select 1 from pg_type where typname = 'conversation_role_enum') then
    create type conversation_role_enum as enum ('member', 'admin');
  end if;
  if not exists (select 1 from pg_type where typname = 'message_type_enum') then
    create type message_type_enum as enum ('text', 'file', 'image', 'system');
  end if;
  if not exists (select 1 from pg_type where typname = 'dispute_reason_enum') then
    create type dispute_reason_enum as enum ('item_not_as_described', 'not_delivered', 'damaged', 'duplicate_charge', 'unauthorized_payment', 'service_abandoned', 'other');
  end if;
  if not exists (select 1 from pg_type where typname = 'dispute_status_enum') then
    create type dispute_status_enum as enum ('open', 'under_review', 'resolved_refund', 'resolved_reject', 'resolved_credit', 'closed');
  end if;
end $$;

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email citext unique not null,
  full_name text not null,
  user_type user_type_enum not null,
  role role_enum not null default 'user',
  phone text,
  location text,
  bio text,
  university text,
  course text,
  level text,
  department text,
  faculty text,
  avatar_url text,
  expertise text[] default '{}',
  hourly_rate_kobo bigint,
  years_of_experience integer,
  certifications text[] default '{}',
  institution_name text,
  position text,
  is_verified boolean not null default false,
  verification_status verification_status_enum not null default 'not_started',
  is_authorized boolean not null default false,
  is_premium boolean not null default false,
  rating numeric(3,2) not null default 0,
  reviews_count integer not null default 0,
  completed_projects_count integer not null default 0,
  earnings_total_kobo bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists verification_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  verification_type verification_type_enum not null,
  status verification_status_enum not null default 'pending',
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid references profiles(id) on delete set null,
  rejection_reason text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists verification_documents (
  id uuid primary key default gen_random_uuid(),
  verification_request_id uuid not null references verification_requests(id) on delete cascade,
  document_type document_type_enum not null,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  file_size_bytes bigint,
  checksum text,
  created_at timestamptz not null default now()
);

create table if not exists wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles(id) on delete cascade,
  currency_code text not null default 'NGN',
  available_balance_kobo bigint not null default 0,
  ledger_balance_kobo bigint not null default 0,
  status wallet_status_enum not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists payout_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  bank_name text not null,
  account_number text not null,
  account_name text not null,
  provider_recipient_code text,
  is_default boolean not null default false,
  is_verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists subscription_plans (
  id text primary key,
  name text not null,
  price_kobo bigint not null check (price_kobo >= 0),
  currency_code text not null default 'NGN',
  interval subscription_interval_enum not null,
  is_active boolean not null default true,
  is_popular boolean not null default false,
  features jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  plan_id text not null references subscription_plans(id),
  status subscription_status_enum not null,
  started_at timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancelled_at timestamptz,
  latest_payment_attempt_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists marketplace_categories (
  id text primary key,
  label text not null,
  kind category_kind_enum not null,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

create table if not exists marketplace_listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references profiles(id) on delete cascade,
  category_id text not null references marketplace_categories(id),
  seller_type seller_type_enum not null,
  item_type item_type_enum not null,
  title text not null,
  description text not null,
  price_kobo bigint not null check (price_kobo >= 0),
  currency_code text not null default 'NGN',
  location text,
  delivery_text text,
  status listing_status_enum not null default 'draft',
  quantity_available integer,
  fulfillment_mode fulfillment_mode_enum,
  rating_avg numeric(3,2) not null default 0,
  reviews_count integer not null default 0,
  search_vector tsvector,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists listing_media (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references marketplace_listings(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references profiles(id) on delete cascade,
  status order_status_enum not null default 'pending_payment',
  payment_status payment_status_enum not null default 'pending',
  payment_method payment_method_enum not null,
  payment_attempt_id uuid,
  payment_reference text,
  subtotal_kobo bigint not null default 0,
  service_fee_kobo bigint not null default 0,
  delivery_fee_kobo bigint not null default 0,
  total_kobo bigint not null default 0,
  currency_code text not null default 'NGN',
  delivery_name text not null,
  delivery_email text not null,
  delivery_phone text not null,
  delivery_address text not null,
  delivery_city text not null,
  delivery_state text not null,
  delivery_note text,
  estimated_delivery_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists payment_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  purpose payment_purpose_enum not null,
  provider provider_enum not null default 'paystack',
  provider_reference text not null unique,
  provider_transaction_id text,
  payment_method payment_method_enum,
  amount_kobo bigint not null check (amount_kobo >= 0),
  currency_code text not null default 'NGN',
  status provider_status_enum not null default 'initialized',
  order_id uuid references orders(id) on delete set null,
  subscription_id uuid references subscriptions(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  initialized_at timestamptz,
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table subscriptions
  add constraint subscriptions_latest_payment_attempt_id_fkey
  foreign key (latest_payment_attempt_id) references payment_attempts(id) on delete set null;

alter table orders
  add constraint orders_payment_attempt_id_fkey
  foreign key (payment_attempt_id) references payment_attempts(id) on delete set null;

create table if not exists wallet_ledger_entries (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid not null references wallets(id) on delete cascade,
  entry_type ledger_entry_type_enum not null,
  direction ledger_direction_enum not null,
  amount_kobo bigint not null check (amount_kobo >= 0),
  currency_code text not null default 'NGN',
  status provider_status_enum not null,
  reference text not null,
  description text,
  source_type text,
  source_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  listing_id uuid references marketplace_listings(id) on delete set null,
  seller_id uuid not null references profiles(id) on delete restrict,
  item_type item_type_enum not null,
  title_snapshot text not null,
  description_snapshot text,
  seller_name_snapshot text,
  category_snapshot text,
  location_snapshot text,
  delivery_snapshot text,
  unit_price_kobo bigint not null check (unit_price_kobo >= 0),
  quantity integer not null check (quantity > 0),
  line_total_kobo bigint not null check (line_total_kobo >= 0),
  status order_item_status_enum not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  status order_status_enum not null,
  changed_by uuid references profiles(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  conversation_type conversation_type_enum not null,
  created_by uuid not null references profiles(id) on delete cascade,
  listing_id uuid references marketplace_listings(id) on delete set null,
  order_id uuid references orders(id) on delete set null,
  title text,
  last_message_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists conversation_participants (
  conversation_id uuid not null references conversations(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role conversation_role_enum not null default 'member',
  last_read_message_id uuid,
  joined_at timestamptz not null default now(),
  muted_at timestamptz,
  primary key (conversation_id, user_id)
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  message_type message_type_enum not null default 'text',
  body text,
  reply_to_message_id uuid references messages(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  deleted_at timestamptz
);

alter table conversation_participants
  add constraint conversation_participants_last_read_message_id_fkey
  foreign key (last_read_message_id) references messages(id) on delete set null;

create table if not exists message_attachments (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references messages(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  file_size_bytes bigint
);

create table if not exists disputes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  order_item_id uuid references order_items(id) on delete set null,
  opened_by uuid not null references profiles(id) on delete cascade,
  reason dispute_reason_enum not null,
  status dispute_status_enum not null default 'open',
  summary text,
  resolution_note text,
  resolved_by uuid references profiles(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists system_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid not null references profiles(id) on delete cascade,
  action text not null,
  target_type text not null,
  target_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_user_type_verification on profiles(user_type, verification_status);
create index if not exists idx_profiles_university_user_type on profiles(university, user_type);
create index if not exists idx_verification_requests_user_status on verification_requests(user_id, status);
create index if not exists idx_verification_requests_status_submitted_at on verification_requests(status, submitted_at desc);
create unique index if not exists idx_wallets_user_id on wallets(user_id);
create index if not exists idx_wallet_ledger_wallet_created_at on wallet_ledger_entries(wallet_id, created_at desc);
create index if not exists idx_wallet_ledger_source on wallet_ledger_entries(source_type, source_id);
create index if not exists idx_payment_attempts_user_purpose_created_at on payment_attempts(user_id, purpose, created_at desc);
create index if not exists idx_payment_attempts_order_id on payment_attempts(order_id);
create index if not exists idx_payment_attempts_status_created_at on payment_attempts(status, created_at desc);
create index if not exists idx_marketplace_listings_seller_status_created_at on marketplace_listings(seller_id, status, created_at desc);
create index if not exists idx_marketplace_listings_category_status_created_at on marketplace_listings(category_id, status, created_at desc);
create index if not exists idx_marketplace_listings_item_type_status on marketplace_listings(item_type, status);
create index if not exists idx_marketplace_listings_search_vector on marketplace_listings using gin (search_vector);
create index if not exists idx_orders_buyer_created_at on orders(buyer_id, created_at desc);
create index if not exists idx_orders_status_created_at on orders(status, created_at desc);
create index if not exists idx_orders_payment_status_created_at on orders(payment_status, created_at desc);
create index if not exists idx_order_items_order_id on order_items(order_id);
create index if not exists idx_order_items_seller_status_created_at on order_items(seller_id, status, created_at desc);
create index if not exists idx_conversations_last_message_at on conversations(last_message_at desc nulls last);
create index if not exists idx_conversation_participants_user_joined_at on conversation_participants(user_id, joined_at desc);
create index if not exists idx_messages_conversation_created_at on messages(conversation_id, created_at desc);
create index if not exists idx_messages_sender_created_at on messages(sender_id, created_at desc);
create index if not exists idx_disputes_order_id on disputes(order_id);
create index if not exists idx_disputes_status_created_at on disputes(status, created_at desc);

create trigger trg_profiles_updated_at
before update on profiles
for each row execute function set_updated_at();

create trigger trg_wallets_updated_at
before update on wallets
for each row execute function set_updated_at();

create trigger trg_subscription_plans_updated_at
before update on subscription_plans
for each row execute function set_updated_at();

create trigger trg_marketplace_listings_updated_at
before update on marketplace_listings
for each row execute function set_updated_at();

create trigger trg_orders_updated_at
before update on orders
for each row execute function set_updated_at();

insert into marketplace_categories (id, label, kind, sort_order, is_active)
values
  ('all', 'All listings', 'mixed', 1, true),
  ('services', 'Services', 'services', 2, true),
  ('goods', 'Goods', 'goods', 3, true),
  ('assignment-help', 'Assignment Help', 'services', 4, true),
  ('research', 'Research Support', 'services', 5, true),
  ('design', 'Design & Presentation', 'services', 6, true),
  ('coding', 'Coding & Data', 'services', 7, true),
  ('books', 'Books & Materials', 'goods', 8, true),
  ('gadgets', 'Gadgets', 'goods', 9, true)
on conflict (id) do update
set label = excluded.label,
    kind = excluded.kind,
    sort_order = excluded.sort_order,
    is_active = excluded.is_active;

insert into subscription_plans (id, name, price_kobo, currency_code, interval, is_active, is_popular, features)
values
  (
    'monthly',
    'Premium Monthly',
    250000,
    'NGN',
    'monthly',
    true,
    false,
    '[
      "Priority project visibility",
      "Advanced profile analytics",
      "Unlimited project applications",
      "Premium badge on profile",
      "Priority customer support",
      "Access to exclusive events",
      "Advanced search filters",
      "Data export capabilities"
    ]'::jsonb
  ),
  (
    'yearly',
    'Premium Yearly',
    2500000,
    'NGN',
    'yearly',
    true,
    true,
    '[
      "All monthly features included",
      "2 months free (save 17%)",
      "Priority project visibility",
      "Advanced profile analytics",
      "Unlimited project applications",
      "Premium badge on profile",
      "Priority customer support",
      "Access to exclusive events",
      "Advanced search filters",
      "Data export capabilities",
      "Quarterly business reports",
      "Early access to new features"
    ]'::jsonb
  )
on conflict (id) do update
set name = excluded.name,
    price_kobo = excluded.price_kobo,
    currency_code = excluded.currency_code,
    interval = excluded.interval,
    is_active = excluded.is_active,
    is_popular = excluded.is_popular,
    features = excluded.features,
    updated_at = now();

commit;
