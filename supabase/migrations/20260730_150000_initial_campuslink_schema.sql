-- CampusLink initial Supabase migration
-- This migration creates the main schema, seeds base data,
-- wires profile creation to auth.users, and applies baseline RLS policies.

begin;

create extension if not exists pgcrypto;
create extension if not exists citext;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_type_enum') then
    create type public.user_type_enum as enum ('student', 'expert', 'institution');
  end if;
  if not exists (select 1 from pg_type where typname = 'role_enum') then
    create type public.role_enum as enum ('user', 'admin', 'super_admin');
  end if;
  if not exists (select 1 from pg_type where typname = 'verification_status_enum') then
    create type public.verification_status_enum as enum ('not_started', 'pending', 'verified', 'rejected');
  end if;
  if not exists (select 1 from pg_type where typname = 'verification_type_enum') then
    create type public.verification_type_enum as enum ('student_kyc', 'expert_verification', 'institution_verification');
  end if;
  if not exists (select 1 from pg_type where typname = 'document_type_enum') then
    create type public.document_type_enum as enum ('student_id', 'government_id', 'certificate', 'other');
  end if;
  if not exists (select 1 from pg_type where typname = 'wallet_status_enum') then
    create type public.wallet_status_enum as enum ('active', 'restricted', 'suspended');
  end if;
  if not exists (select 1 from pg_type where typname = 'ledger_entry_type_enum') then
    create type public.ledger_entry_type_enum as enum ('deposit', 'withdrawal', 'payment', 'earning', 'refund', 'fee', 'hold', 'release');
  end if;
  if not exists (select 1 from pg_type where typname = 'ledger_direction_enum') then
    create type public.ledger_direction_enum as enum ('credit', 'debit');
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_purpose_enum') then
    create type public.payment_purpose_enum as enum ('wallet_deposit', 'marketplace_checkout', 'subscription', 'withdrawal_payout', 'refund');
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_method_enum') then
    create type public.payment_method_enum as enum ('wallet', 'card', 'transfer', 'ussd', 'bank', 'bank_transfer');
  end if;
  if not exists (select 1 from pg_type where typname = 'provider_enum') then
    create type public.provider_enum as enum ('paystack');
  end if;
  if not exists (select 1 from pg_type where typname = 'provider_status_enum') then
    create type public.provider_status_enum as enum ('initialized', 'pending', 'paid', 'failed', 'cancelled', 'refunded');
  end if;
  if not exists (select 1 from pg_type where typname = 'subscription_interval_enum') then
    create type public.subscription_interval_enum as enum ('monthly', 'yearly');
  end if;
  if not exists (select 1 from pg_type where typname = 'subscription_status_enum') then
    create type public.subscription_status_enum as enum ('active', 'past_due', 'cancelled', 'expired');
  end if;
  if not exists (select 1 from pg_type where typname = 'category_kind_enum') then
    create type public.category_kind_enum as enum ('services', 'goods', 'mixed');
  end if;
  if not exists (select 1 from pg_type where typname = 'seller_type_enum') then
    create type public.seller_type_enum as enum ('expert', 'student', 'institution');
  end if;
  if not exists (select 1 from pg_type where typname = 'item_type_enum') then
    create type public.item_type_enum as enum ('service', 'goods');
  end if;
  if not exists (select 1 from pg_type where typname = 'listing_status_enum') then
    create type public.listing_status_enum as enum ('draft', 'active', 'paused', 'sold', 'archived', 'moderated');
  end if;
  if not exists (select 1 from pg_type where typname = 'fulfillment_mode_enum') then
    create type public.fulfillment_mode_enum as enum ('digital', 'physical', 'remote', 'in_person', 'pickup');
  end if;
  if not exists (select 1 from pg_type where typname = 'order_status_enum') then
    create type public.order_status_enum as enum ('pending_payment', 'paid', 'processing', 'fulfilled', 'completed', 'cancelled', 'disputed', 'refunded');
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_status_enum') then
    create type public.payment_status_enum as enum ('pending', 'paid', 'failed', 'refunded', 'partially_refunded');
  end if;
  if not exists (select 1 from pg_type where typname = 'order_item_status_enum') then
    create type public.order_item_status_enum as enum ('pending', 'processing', 'fulfilled', 'cancelled', 'refunded', 'disputed');
  end if;
  if not exists (select 1 from pg_type where typname = 'conversation_type_enum') then
    create type public.conversation_type_enum as enum ('direct', 'group', 'order_support');
  end if;
  if not exists (select 1 from pg_type where typname = 'conversation_role_enum') then
    create type public.conversation_role_enum as enum ('member', 'admin');
  end if;
  if not exists (select 1 from pg_type where typname = 'message_type_enum') then
    create type public.message_type_enum as enum ('text', 'file', 'image', 'system');
  end if;
  if not exists (select 1 from pg_type where typname = 'dispute_reason_enum') then
    create type public.dispute_reason_enum as enum ('item_not_as_described', 'not_delivered', 'damaged', 'duplicate_charge', 'unauthorized_payment', 'service_abandoned', 'other');
  end if;
  if not exists (select 1 from pg_type where typname = 'dispute_status_enum') then
    create type public.dispute_status_enum as enum ('open', 'under_review', 'resolved_refund', 'resolved_reject', 'resolved_credit', 'closed');
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_user_role()
returns public.role_enum
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role from public.profiles where id = auth.uid()),
    'user'::public.role_enum
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() in ('admin'::public.role_enum, 'super_admin'::public.role_enum);
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() = 'super_admin'::public.role_enum;
$$;

create or replace function public.is_conversation_participant(target_conversation_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.conversation_participants cp
    where cp.conversation_id = target_conversation_id
      and cp.user_id = auth.uid()
  );
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email citext unique not null,
  full_name text not null,
  user_type public.user_type_enum not null default 'student',
  role public.role_enum not null default 'user',
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
  verification_status public.verification_status_enum not null default 'not_started',
  is_authorized boolean not null default false,
  is_premium boolean not null default false,
  rating numeric(3,2) not null default 0,
  reviews_count integer not null default 0,
  completed_projects_count integer not null default 0,
  earnings_total_kobo bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.verification_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  verification_type public.verification_type_enum not null,
  status public.verification_status_enum not null default 'pending',
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id) on delete set null,
  rejection_reason text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.verification_documents (
  id uuid primary key default gen_random_uuid(),
  verification_request_id uuid not null references public.verification_requests(id) on delete cascade,
  document_type public.document_type_enum not null,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  file_size_bytes bigint,
  checksum text,
  created_at timestamptz not null default now()
);

create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  currency_code text not null default 'NGN',
  available_balance_kobo bigint not null default 0,
  ledger_balance_kobo bigint not null default 0,
  status public.wallet_status_enum not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payout_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  bank_name text not null,
  account_number text not null,
  account_name text not null,
  provider_recipient_code text,
  is_default boolean not null default false,
  is_verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.subscription_plans (
  id text primary key,
  name text not null,
  price_kobo bigint not null check (price_kobo >= 0),
  currency_code text not null default 'NGN',
  interval public.subscription_interval_enum not null,
  is_active boolean not null default true,
  is_popular boolean not null default false,
  features jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id text not null references public.subscription_plans(id),
  status public.subscription_status_enum not null,
  started_at timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancelled_at timestamptz,
  latest_payment_attempt_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.marketplace_categories (
  id text primary key,
  label text not null,
  kind public.category_kind_enum not null,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

create table if not exists public.marketplace_listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  category_id text not null references public.marketplace_categories(id),
  seller_type public.seller_type_enum not null,
  item_type public.item_type_enum not null,
  title text not null,
  description text not null,
  price_kobo bigint not null check (price_kobo >= 0),
  currency_code text not null default 'NGN',
  location text,
  delivery_text text,
  status public.listing_status_enum not null default 'draft',
  quantity_available integer,
  fulfillment_mode public.fulfillment_mode_enum,
  rating_avg numeric(3,2) not null default 0,
  reviews_count integer not null default 0,
  search_vector tsvector,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.listing_media (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.marketplace_listings(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  status public.order_status_enum not null default 'pending_payment',
  payment_status public.payment_status_enum not null default 'pending',
  payment_method public.payment_method_enum not null,
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

create table if not exists public.payment_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  purpose public.payment_purpose_enum not null,
  provider public.provider_enum not null default 'paystack',
  provider_reference text not null unique,
  provider_transaction_id text,
  payment_method public.payment_method_enum,
  amount_kobo bigint not null check (amount_kobo >= 0),
  currency_code text not null default 'NGN',
  status public.provider_status_enum not null default 'initialized',
  order_id uuid references public.orders(id) on delete set null,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  initialized_at timestamptz,
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.subscriptions
  add constraint subscriptions_latest_payment_attempt_id_fkey
  foreign key (latest_payment_attempt_id) references public.payment_attempts(id) on delete set null;

alter table public.orders
  add constraint orders_payment_attempt_id_fkey
  foreign key (payment_attempt_id) references public.payment_attempts(id) on delete set null;

create table if not exists public.wallet_ledger_entries (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid not null references public.wallets(id) on delete cascade,
  entry_type public.ledger_entry_type_enum not null,
  direction public.ledger_direction_enum not null,
  amount_kobo bigint not null check (amount_kobo >= 0),
  currency_code text not null default 'NGN',
  status public.provider_status_enum not null,
  reference text not null,
  description text,
  source_type text,
  source_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  listing_id uuid references public.marketplace_listings(id) on delete set null,
  seller_id uuid not null references public.profiles(id) on delete restrict,
  item_type public.item_type_enum not null,
  title_snapshot text not null,
  description_snapshot text,
  seller_name_snapshot text,
  category_snapshot text,
  location_snapshot text,
  delivery_snapshot text,
  unit_price_kobo bigint not null check (unit_price_kobo >= 0),
  quantity integer not null check (quantity > 0),
  line_total_kobo bigint not null check (line_total_kobo >= 0),
  status public.order_item_status_enum not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status public.order_status_enum not null,
  changed_by uuid references public.profiles(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  conversation_type public.conversation_type_enum not null,
  created_by uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid references public.marketplace_listings(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  title text,
  last_message_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.conversation_participants (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.conversation_role_enum not null default 'member',
  last_read_message_id uuid,
  joined_at timestamptz not null default now(),
  muted_at timestamptz,
  primary key (conversation_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  message_type public.message_type_enum not null default 'text',
  body text,
  reply_to_message_id uuid references public.messages(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  deleted_at timestamptz
);

alter table public.conversation_participants
  add constraint conversation_participants_last_read_message_id_fkey
  foreign key (last_read_message_id) references public.messages(id) on delete set null;

create table if not exists public.message_attachments (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  file_size_bytes bigint
);

create table if not exists public.disputes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  order_item_id uuid references public.order_items(id) on delete set null,
  opened_by uuid not null references public.profiles(id) on delete cascade,
  reason public.dispute_reason_enum not null,
  status public.dispute_status_enum not null default 'open',
  summary text,
  resolution_note text,
  resolved_by uuid references public.profiles(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.system_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid not null references public.profiles(id) on delete cascade,
  action text not null,
  target_type text not null,
  target_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_user_type_verification on public.profiles(user_type, verification_status);
create index if not exists idx_profiles_university_user_type on public.profiles(university, user_type);
create index if not exists idx_verification_requests_user_status on public.verification_requests(user_id, status);
create index if not exists idx_verification_requests_status_submitted_at on public.verification_requests(status, submitted_at desc);
create unique index if not exists idx_wallets_user_id on public.wallets(user_id);
create index if not exists idx_wallet_ledger_wallet_created_at on public.wallet_ledger_entries(wallet_id, created_at desc);
create index if not exists idx_wallet_ledger_source on public.wallet_ledger_entries(source_type, source_id);
create index if not exists idx_payment_attempts_user_purpose_created_at on public.payment_attempts(user_id, purpose, created_at desc);
create index if not exists idx_payment_attempts_order_id on public.payment_attempts(order_id);
create index if not exists idx_payment_attempts_status_created_at on public.payment_attempts(status, created_at desc);
create index if not exists idx_marketplace_listings_seller_status_created_at on public.marketplace_listings(seller_id, status, created_at desc);
create index if not exists idx_marketplace_listings_category_status_created_at on public.marketplace_listings(category_id, status, created_at desc);
create index if not exists idx_marketplace_listings_item_type_status on public.marketplace_listings(item_type, status);
create index if not exists idx_marketplace_listings_search_vector on public.marketplace_listings using gin (search_vector);
create index if not exists idx_orders_buyer_created_at on public.orders(buyer_id, created_at desc);
create index if not exists idx_orders_status_created_at on public.orders(status, created_at desc);
create index if not exists idx_orders_payment_status_created_at on public.orders(payment_status, created_at desc);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_order_items_seller_status_created_at on public.order_items(seller_id, status, created_at desc);
create index if not exists idx_conversations_last_message_at on public.conversations(last_message_at desc nulls last);
create index if not exists idx_conversation_participants_user_joined_at on public.conversation_participants(user_id, joined_at desc);
create index if not exists idx_messages_conversation_created_at on public.messages(conversation_id, created_at desc);
create index if not exists idx_messages_sender_created_at on public.messages(sender_id, created_at desc);
create index if not exists idx_disputes_order_id on public.disputes(order_id);
create index if not exists idx_disputes_status_created_at on public.disputes(status, created_at desc);

create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger trg_wallets_updated_at
before update on public.wallets
for each row execute function public.set_updated_at();

create trigger trg_subscription_plans_updated_at
before update on public.subscription_plans
for each row execute function public.set_updated_at();

create trigger trg_marketplace_listings_updated_at
before update on public.marketplace_listings
for each row execute function public.set_updated_at();

create trigger trg_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  derived_name text;
  derived_user_type public.user_type_enum;
begin
  derived_name := coalesce(
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'name',
    split_part(new.email, '@', 1)
  );

  derived_user_type := case
    when coalesce(new.raw_user_meta_data ->> 'user_type', 'student') = 'expert' then 'expert'::public.user_type_enum
    when coalesce(new.raw_user_meta_data ->> 'user_type', 'student') = 'institution' then 'institution'::public.user_type_enum
    else 'student'::public.user_type_enum
  end;

  insert into public.profiles (
    id,
    email,
    full_name,
    user_type,
    phone,
    location
  )
  values (
    new.id,
    new.email,
    derived_name,
    derived_user_type,
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'location'
  )
  on conflict (id) do nothing;

  insert into public.wallets (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

insert into public.marketplace_categories (id, label, kind, sort_order, is_active)
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

insert into public.subscription_plans (id, name, price_kobo, currency_code, interval, is_active, is_popular, features)
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

alter table public.profiles enable row level security;
alter table public.verification_requests enable row level security;
alter table public.verification_documents enable row level security;
alter table public.wallets enable row level security;
alter table public.wallet_ledger_entries enable row level security;
alter table public.payout_accounts enable row level security;
alter table public.subscription_plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.marketplace_categories enable row level security;
alter table public.marketplace_listings enable row level security;
alter table public.listing_media enable row level security;
alter table public.orders enable row level security;
alter table public.payment_attempts enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;
alter table public.message_attachments enable row level security;
alter table public.disputes enable row level security;
alter table public.system_settings enable row level security;
alter table public.admin_audit_logs enable row level security;

create policy "profiles are viewable by authenticated users"
on public.profiles for select
to authenticated
using (true);

create policy "users can update own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "admins can update any profile"
on public.profiles for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "users can view own wallet"
on public.wallets for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

create policy "users can view own wallet ledger"
on public.wallet_ledger_entries for select
to authenticated
using (
  exists (
    select 1 from public.wallets w
    where w.id = wallet_ledger_entries.wallet_id
      and (w.user_id = auth.uid() or public.is_admin())
  )
);

create policy "users manage own payout accounts"
on public.payout_accounts for all
to authenticated
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

create policy "users manage own verification requests"
on public.verification_requests for all
to authenticated
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

create policy "users manage own verification documents"
on public.verification_documents for all
to authenticated
using (
  exists (
    select 1 from public.verification_requests vr
    where vr.id = verification_documents.verification_request_id
      and (vr.user_id = auth.uid() or public.is_admin())
  )
)
with check (
  exists (
    select 1 from public.verification_requests vr
    where vr.id = verification_documents.verification_request_id
      and (vr.user_id = auth.uid() or public.is_admin())
  )
);

create policy "subscription plans are readable by authenticated users"
on public.subscription_plans for select
to authenticated
using (is_active = true or public.is_admin());

create policy "super admins manage subscription plans"
on public.subscription_plans for all
to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

create policy "users view own subscriptions"
on public.subscriptions for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

create policy "users view own payment attempts"
on public.payment_attempts for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

create policy "authenticated users can insert payment attempts for themselves"
on public.payment_attempts for insert
to authenticated
with check (user_id = auth.uid() or public.is_admin());

create policy "marketplace categories are readable by authenticated users"
on public.marketplace_categories for select
to authenticated
using (is_active = true or public.is_admin());

create policy "public can read active marketplace listings"
on public.marketplace_listings for select
to anon, authenticated
using (status = 'active' or public.is_admin());

create policy "verified sellers manage own listings"
on public.marketplace_listings for all
to authenticated
using (seller_id = auth.uid() or public.is_admin())
with check (
  seller_id = auth.uid()
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and (p.is_verified = true or public.is_admin())
  )
  or public.is_admin()
);

create policy "public can read listing media for active listings"
on public.listing_media for select
to anon, authenticated
using (
  exists (
    select 1 from public.marketplace_listings ml
    where ml.id = listing_media.listing_id
      and (ml.status = 'active' or public.is_admin())
  )
);

create policy "listing owners manage own media"
on public.listing_media for all
to authenticated
using (
  exists (
    select 1 from public.marketplace_listings ml
    where ml.id = listing_media.listing_id
      and (ml.seller_id = auth.uid() or public.is_admin())
  )
)
with check (
  exists (
    select 1 from public.marketplace_listings ml
    where ml.id = listing_media.listing_id
      and (ml.seller_id = auth.uid() or public.is_admin())
  )
);

create policy "buyers and admins view orders"
on public.orders for select
to authenticated
using (buyer_id = auth.uid() or public.is_admin());

create policy "buyers create orders"
on public.orders for insert
to authenticated
with check (buyer_id = auth.uid() or public.is_admin());

create policy "buyers and admins update orders"
on public.orders for update
to authenticated
using (buyer_id = auth.uid() or public.is_admin())
with check (buyer_id = auth.uid() or public.is_admin());

create policy "buyers sellers and admins view order items"
on public.order_items for select
to authenticated
using (
  exists (
    select 1 from public.orders o
    where o.id = order_items.order_id
      and (o.buyer_id = auth.uid() or order_items.seller_id = auth.uid() or public.is_admin())
  )
);

create policy "buyers and admins create order items"
on public.order_items for insert
to authenticated
with check (
  exists (
    select 1 from public.orders o
    where o.id = order_items.order_id
      and (o.buyer_id = auth.uid() or public.is_admin())
  )
);

create policy "buyers sellers and admins view order history"
on public.order_status_history for select
to authenticated
using (
  exists (
    select 1 from public.orders o
    where o.id = order_status_history.order_id
      and (o.buyer_id = auth.uid() or public.is_admin())
  )
);

create policy "admins manage order history"
on public.order_status_history for insert
to authenticated
with check (public.is_admin());

create policy "participants view conversations"
on public.conversations for select
to authenticated
using (public.is_conversation_participant(id) or public.is_admin());

create policy "authenticated users create conversations"
on public.conversations for insert
to authenticated
with check (created_by = auth.uid() or public.is_admin());

create policy "participants view conversation participants"
on public.conversation_participants for select
to authenticated
using (public.is_conversation_participant(conversation_id) or public.is_admin());

create policy "conversation creators and admins manage participants"
on public.conversation_participants for insert
to authenticated
with check (
  exists (
    select 1 from public.conversations c
    where c.id = conversation_participants.conversation_id
      and (c.created_by = auth.uid() or public.is_admin())
  )
);

create policy "participants view messages"
on public.messages for select
to authenticated
using (public.is_conversation_participant(conversation_id) or public.is_admin());

create policy "participants create messages"
on public.messages for insert
to authenticated
with check (
  sender_id = auth.uid()
  and public.is_conversation_participant(conversation_id)
);

create policy "senders and admins update messages"
on public.messages for update
to authenticated
using (sender_id = auth.uid() or public.is_admin())
with check (sender_id = auth.uid() or public.is_admin());

create policy "participants view message attachments"
on public.message_attachments for select
to authenticated
using (
  exists (
    select 1
    from public.messages m
    where m.id = message_attachments.message_id
      and (public.is_conversation_participant(m.conversation_id) or public.is_admin())
  )
);

create policy "message senders manage attachments"
on public.message_attachments for all
to authenticated
using (
  exists (
    select 1
    from public.messages m
    where m.id = message_attachments.message_id
      and (m.sender_id = auth.uid() or public.is_admin())
  )
)
with check (
  exists (
    select 1
    from public.messages m
    where m.id = message_attachments.message_id
      and (m.sender_id = auth.uid() or public.is_admin())
  )
);

create policy "buyers and admins view disputes"
on public.disputes for select
to authenticated
using (
  opened_by = auth.uid()
  or public.is_admin()
  or exists (
    select 1 from public.orders o
    where o.id = disputes.order_id
      and o.buyer_id = auth.uid()
  )
);

create policy "users create own disputes"
on public.disputes for insert
to authenticated
with check (opened_by = auth.uid() or public.is_admin());

create policy "admins update disputes"
on public.disputes for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "super admins manage system settings"
on public.system_settings for all
to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

create policy "super admins view admin audit logs"
on public.admin_audit_logs for select
to authenticated
using (public.is_super_admin());

create policy "super admins create admin audit logs"
on public.admin_audit_logs for insert
to authenticated
with check (public.is_super_admin());

commit;
