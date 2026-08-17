-- Add "unknown" as a valid lead_temp value.
--
-- Context: lead-temperature classification was unified across the quiz and
-- consultation-form submission paths (see lib/lead-temperature.ts). Both
-- paths can now legitimately produce "unknown" for missing/malformed input
-- instead of silently guessing "education" or "nurture" — this migration
-- widens the check constraint to allow that value to be stored.
--
-- Run this in the Supabase SQL editor, or via the Supabase CLI:
--   supabase db push
--
-- NOTE: this was NOT run against your live database from this session —
-- there are no database credentials available here. Apply it yourself.

-- Drop the existing constraint. Postgres auto-names an inline, unnamed
-- `check()` as "<table>_<column>_check" — leads_lead_temp_check — which is
-- what 001_initial.sql produced. If this DROP fails because the name
-- differs in your actual database (e.g. it was renamed at some point), run:
--   select conname from pg_constraint
--   where conrelid = 'leads'::regclass and contype = 'c';
-- to find the real name, then substitute it below.
alter table leads drop constraint if exists leads_lead_temp_check;

alter table leads add constraint leads_lead_temp_check
  check (lead_temp in ('hot', 'warm', 'nurture', 'education', 'unknown'));
