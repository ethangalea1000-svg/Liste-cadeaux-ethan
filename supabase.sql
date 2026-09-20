create table if not exists public.reservations (
  gift_id text primary key,
  name text not null check (char_length(trim(name)) between 1 and 50),
  created_at timestamptz not null default now()
);

alter table public.reservations enable row level security;

drop policy if exists "Public can view reservations" on public.reservations;
create policy "Public can view reservations"
on public.reservations for select
to anon
using (true);

drop policy if exists "Public can create reservations" on public.reservations;
create policy "Public can create reservations"
on public.reservations for insert
to anon
with check (char_length(trim(name)) between 1 and 50);

-- Autorisations PostgREST pour les visiteurs non connectés
grant usage on schema public to anon;
grant select, insert on table public.reservations to anon;
