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

-- Autoriser la déréservation depuis le site
grant delete on table public.reservations to anon;

drop policy if exists "Public can cancel reservations" on public.reservations;
create policy "Public can cancel reservations"
on public.reservations
for delete
to anon
using (true);

-- Fonction serveur pour déréserver un cadeau en vérifiant le prénom
create or replace function public.cancel_reservation(p_gift_id text, p_name text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted boolean;
begin
  delete from public.reservations
  where gift_id = p_gift_id
    and lower(trim(name)) = lower(trim(p_name))
  returning true into deleted;

  return coalesce(deleted, false);
end;
$$;

grant execute on function public.cancel_reservation(text, text) to anon;
