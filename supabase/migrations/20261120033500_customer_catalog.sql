-- Customer projections receive only approved department evidence through a trusted source.
create schema customer_catalog;
revoke all on schema customer_catalog from public, anon, authenticated;
grant usage on schema customer_catalog to service_role;

create table customer_catalog.listings (
  id uuid primary key default gen_random_uuid(),
  source_key text not null unique check (length(btrim(source_key)) between 1 and 160),
  title text not null check (length(btrim(title)) between 1 and 180),
  title_key text not null check (length(btrim(title_key)) between 1 and 160),
  season_number integer not null check (season_number > 0),
  episode_number integer not null check (episode_number > 0),
  grant_ref text not null check (btrim(grant_ref) <> ''),
  media_validation_ref text not null check (btrim(media_validation_ref) <> ''),
  publication_ref text not null check (btrim(publication_ref) <> ''),
  visible_from timestamptz not null,
  visible_until timestamptz,
  withdrawn_at timestamptz,
  check (visible_until is null or visible_until > visible_from)
);
alter table customer_catalog.listings enable row level security;
create table customer_catalog.paid_periods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.portal_accounts(user_id) on delete cascade,
  payment_evidence_ref text not null unique check (btrim(payment_evidence_ref) <> ''),
  activation_ref text not null unique check (btrim(activation_ref) <> ''),
  activated_at timestamptz not null,
  ends_at timestamptz not null,
  terminated_at timestamptz,
  check (ends_at = activated_at + interval '720 hours'),
  check (terminated_at is null or (terminated_at >= activated_at and terminated_at <= ends_at))
);
create index paid_periods_user on customer_catalog.paid_periods(user_id, activated_at);
alter table customer_catalog.paid_periods enable row level security;

revoke all on all tables in schema customer_catalog from public, anon, authenticated, service_role;
grant select on all tables in schema customer_catalog to service_role;

create function public.department_customer_catalog(p_actor uuid, p_query text, p_page integer) returns jsonb
language sql stable security invoker set search_path = ''
as $$
  select jsonb_build_object('items', coalesce((
    select jsonb_agg(jsonb_build_object('id', id, 'title', title, 'label', 'Season ' || season_number || ' · Episode ' || episode_number) order by title, id)
    from (
      select * from customer_catalog.listings
      where visible_from <= statement_timestamp()
        and (visible_until is null or visible_until > statement_timestamp())
        and (withdrawn_at is null or withdrawn_at > statement_timestamp())

        and (coalesce(btrim(p_query),'') = '' or strpos(lower(title),lower(btrim(p_query))) > 0)
      order by title,id limit 25 offset ((p_page - 1) * 24)
    ) page
  ), '[]'::jsonb), 'access', (select case when count(*) > 1 then jsonb_build_object('state','unavailable')
      when count(*) = 1 then jsonb_build_object('state','active','endsAt',min(ends_at))
      else jsonb_build_object('state','inactive') end
    from customer_catalog.paid_periods e
    where e.user_id = p_actor and e.activated_at <= statement_timestamp()
      and e.ends_at > statement_timestamp() and (e.terminated_at is null or e.terminated_at > statement_timestamp())))
  where p_page between 1 and 100000 and length(coalesce(p_query,'')) <= 100
    and exists (select 1 from public.portal_accounts a where a.user_id = p_actor
      and a.account_type = 'subscriber' and a.status = 'active')
    and not exists (select 1 from public.staff_roles s where s.user_id = p_actor)
$$;
revoke all on function public.department_customer_catalog(uuid,text,integer) from public, anon, authenticated;
grant execute on function public.department_customer_catalog(uuid,text,integer) to service_role;
