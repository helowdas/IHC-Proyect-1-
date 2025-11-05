-- Run this in Supabase SQL editor to enable multi-site (multiple websites) support

-- Ensure pgcrypto for gen_random_uuid()
create extension if not exists "pgcrypto";

-- 1) Create Sites table
create table if not exists public."Sites" (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- 2) Add site_id to Secciones and make names unique per site
alter table if exists public."Secciones"
  add column if not exists site_id uuid,
  add column if not exists folderId text null; -- keep if you plan to use folders in DB

-- 3) Backfill: create a default site and attach current rows
insert into public."Sites" (name, slug)
select 'default', 'default'
where not exists (select 1 from public."Sites" where slug = 'default');

update public."Secciones" s
set site_id = (select id from public."Sites" where slug = 'default')
where s.site_id is null;

-- 4) Add FK and unique index per site
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'secciones_site_fk'
  ) then
    alter table public."Secciones"
      add constraint secciones_site_fk
      foreign key (site_id) references public."Sites"(id) on delete cascade;
  end if;
end $$;

create unique index if not exists secciones_unique_per_site
  on public."Secciones" (site_id, "nameSeccion");

-- Optional: enable RLS and basic policies (adjust to your auth model)
-- alter table public."Sites" enable row level security;
-- alter table public."Secciones" enable row level security;
-- create policy "read all" on public."Sites" for select using (true);
-- create policy "read all" on public."Secciones" for select using (true);
-- create policy "anon insert" on public."Sites" for insert with check (true);
-- create policy "anon write secciones" on public."Secciones" for all using (true) with check (true);
