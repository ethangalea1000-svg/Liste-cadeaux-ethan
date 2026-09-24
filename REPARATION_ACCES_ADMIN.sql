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


-- CORRECTIF V2 : nouvelles fonctions sans ambiguïté

-- Nouvelle fonction d'administration sans dépendance aux anciennes fonctions d'accès.
create or replace function public.admin_list_people_v2()
returns table(
  access_id bigint,
  label text,
  code text,
  access_active boolean,
  is_admin boolean,
  access_created_at timestamptz,
  last_used_at timestamptz,
  profile_id bigint,
  profile_name text,
  relation text,
  avatar text,
  bio text,
  profile_created_at timestamptz,
  profile_updated_at timestamptz,
  messages_count bigint,
  ideas_count bigint,
  suggestions_count bigint,
  contributions_count bigint,
  community_count bigint
)
language plpgsql
security definer
set search_path = public
as $peoplev2$
begin
  perform public.assert_admin_header();

  return query
  select
    lac.id as access_id,
    lac.label as label,
    lac.code as code,
    lac.active as access_active,
    lac.is_admin as is_admin,
    lac.created_at as access_created_at,
    lac.last_used_at as last_used_at,
    gp.id as profile_id,
    gp.name as profile_name,
    gp.relation as relation,
    gp.avatar as avatar,
    gp.bio as bio,
    gp.created_at as profile_created_at,
    gp.updated_at as profile_updated_at,
    coalesce((select count(*) from public.messages m where lower(trim(m.name)) = lower(trim(lac.label))),0)::bigint as messages_count,
    coalesce((select count(*) from public.ideas i where lower(trim(i.name)) = lower(trim(lac.label))),0)::bigint as ideas_count,
    coalesce((select count(*) from public.gift_suggestions gs where lower(trim(gs.name)) = lower(trim(lac.label))),0)::bigint as suggestions_count,
    coalesce((select count(*) from public.contributions c where lower(trim(c.name)) = lower(trim(lac.label))),0)::bigint as contributions_count,
    coalesce((select count(*) from public.community_posts cp where lower(trim(cp.name)) = lower(trim(lac.label))),0)::bigint as community_count
  from public.list_access_codes as lac
  left join public.guest_profiles as gp
    on lower(trim(gp.name)) = lower(trim(lac.label))
  order by lac.created_at desc;
end;
$peoplev2$;

grant execute on function public.admin_list_people_v2() to anon;

create or replace function public.admin_list_access_codes_v2()
returns table(
  access_id bigint,
  label text,
  code text,
  access_active boolean,
  is_admin boolean,
  access_created_at timestamptz,
  last_used_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $accessv2$
begin
  perform public.assert_admin_header();

  return query
  select
    lac.id as access_id,
    lac.label as label,
    lac.code as code,
    lac.active as access_active,
    lac.is_admin as is_admin,
    lac.created_at as access_created_at,
    lac.last_used_at as last_used_at
  from public.list_access_codes as lac
  order by lac.created_at desc;
end;
$accessv2$;

grant execute on function public.admin_list_access_codes_v2() to anon;

