-- CORRECTIF CIBLÉ : affichage des comptes existants dans l'administration
-- À exécuter une fois dans Supabase SQL Editor si l'erreur
-- « column reference "id" is ambiguous » apparaît encore.

drop function if exists public.admin_list_access_codes_for_code(text);
drop function if exists public.admin_list_access_codes();

create or replace function public.admin_list_access_codes_for_code(p_code text)
returns table(
  id bigint,
  label text,
  code text,
  active boolean,
  is_admin boolean,
  created_at timestamptz,
  last_used_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $accesslist$
begin
  if not exists (
    select 1
    from public.list_access_codes as check_lac
    where check_lac.active = true
      and check_lac.is_admin = true
      and check_lac.code = trim(coalesce(p_code, ''))
  ) then
    raise exception 'Accès administrateur refusé.' using errcode = '42501';
  end if;

  return query
  select
    lac.id,
    lac.label,
    lac.code,
    lac.active,
    lac.is_admin,
    lac.created_at,
    lac.last_used_at
  from public.list_access_codes as lac
  order by lac.created_at desc;
end;
$accesslist$;

grant execute on function public.admin_list_access_codes_for_code(text) to anon;

create or replace function public.admin_list_access_codes()
returns table(
  id bigint,
  label text,
  code text,
  active boolean,
  is_admin boolean,
  created_at timestamptz,
  last_used_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.assert_admin_header();

  return query
  select
    lac.id,
    lac.label,
    lac.code,
    lac.active,
    lac.is_admin,
    lac.created_at,
    lac.last_used_at
  from public.list_access_codes as lac
  order by lac.created_at desc;
end;
$$;

grant execute on function public.admin_list_access_codes() to anon;
