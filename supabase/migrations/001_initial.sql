-- Desi Dollhouse Glow Quiz — Initial Schema
-- Run this in the Supabase SQL editor or via the Supabase CLI:
--   supabase db push

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─── AMBASSADORS ─────────────────────────────────────────────────────────────
create table if not exists ambassadors (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  name             text not null,
  ref_code         text not null unique,
  email            text,
  phone            text,
  reward_per_lead  numeric(10,2) not null default 5.00,
  reward_per_booking numeric(10,2) not null default 25.00,
  active           boolean not null default true,
  notes            text
);

-- ─── LEADS ───────────────────────────────────────────────────────────────────
create table if not exists leads (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  first_name       text not null,
  email            text not null,
  phone            text,
  zip              text,
  dollhouse_result text not null,
  service_interest text not null,
  lead_temp        text not null check (lead_temp in ('hot','warm','nurture','education')),
  lead_source      text,
  utm_source       text,
  utm_medium       text,
  utm_campaign     text,
  utm_content      text,
  ref_code         text,
  ambassador_id    uuid references ambassadors(id) on delete set null,
  quiz_answers     jsonb not null default '{}'::jsonb,
  booking_clicked  boolean not null default false,
  booking_clicked_at timestamptz,
  marketing_consent boolean not null default false,
  status           text not null default 'new'
    check (status in ('new','contacted','consultation_scheduled','booked','not_ready','follow_up_later')),
  notes            text
);

-- Index for common admin queries
create index if not exists leads_created_at_idx on leads(created_at desc);
create index if not exists leads_lead_temp_idx on leads(lead_temp);
create index if not exists leads_status_idx on leads(status);
create index if not exists leads_ambassador_id_idx on leads(ambassador_id);

-- ─── QUIZ EVENTS (funnel analytics) ─────────────────────────────────────────
create table if not exists quiz_events (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  event       text not null,
  session_id  text,
  lead_id     uuid references leads(id) on delete set null,
  payload     jsonb not null default '{}'::jsonb,
  utm_source  text,
  utm_medium  text,
  utm_campaign text,
  ref_code    text
);

create index if not exists quiz_events_event_idx on quiz_events(event);
create index if not exists quiz_events_created_at_idx on quiz_events(created_at desc);
create index if not exists quiz_events_session_id_idx on quiz_events(session_id);

-- ─── AMBASSADOR REWARDS ──────────────────────────────────────────────────────
create table if not exists ambassador_rewards (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  ambassador_id  uuid not null references ambassadors(id) on delete cascade,
  lead_id        uuid references leads(id) on delete set null,
  reward_type    text not null check (reward_type in ('lead','booking')),
  amount         numeric(10,2) not null,
  paid           boolean not null default false,
  paid_at        timestamptz,
  notes          text
);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────────
-- Public can insert leads and quiz_events (via service-role API route only)
-- Public cannot read any data — all reads go through the service-role key in
-- server-side API routes.

alter table leads enable row level security;
alter table quiz_events enable row level security;
alter table ambassadors enable row level security;
alter table ambassador_rewards enable row level security;

-- No policies = deny all by default for the anon role.
-- The server-side route handlers use the service-role key which bypasses RLS.
