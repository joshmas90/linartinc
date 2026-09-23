-- LINART-only project. Run only after the deployment preflight and owner approval.
begin;
create table public.linart_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table public.linart_inquiries (
  id uuid primary key,
  owner_id uuid references auth.users(id) on delete set null,
  contact jsonb not null check (jsonb_typeof(contact) = 'object' and octet_length(contact::text) <= 16000),
  receipt_hash text not null check (receipt_hash ~ '^[a-f0-9]{64}$'),
  receipt_expires_at timestamptz not null,
  created_at timestamptz not null,
  status text not null default 'New Inquiry' check (status in ('New Inquiry','Awaiting Details','Ready for Review','Contacted','Archived')),
  delivery text not null check (delivery in ('accepted','notification_failed','uncertain')),
  deletion_requested_at timestamptz
);
create index linart_inquiry_owner on public.linart_inquiries(owner_id);
create index linart_inquiry_created on public.linart_inquiries(created_at desc);
create table public.linart_studios (
  inquiry_id uuid primary key references public.linart_inquiries(id) on delete cascade,
  answers jsonb not null default '{}' check (jsonb_typeof(answers) = 'object' and octet_length(answers::text) <= 160000),
  links jsonb not null default '[]' check (jsonb_typeof(links) = 'array' and jsonb_array_length(links) <= 10),
  revision integer not null default 0,
  updated_at timestamptz not null default now(),
  submitted_at timestamptz,
  submitted_revision integer,
  submitted_brief jsonb
);
create table public.linart_assets (
  id uuid primary key,
  inquiry_id uuid not null references public.linart_inquiries(id) on delete cascade,
  filename text not null check (length(filename) between 1 and 120),
  mime text not null check (mime in ('image/jpeg','image/png','application/pdf')),
  bytes integer not null check (bytes between 1 and 10485760),
  purpose text not null check (purpose in ('Existing space','Inspiration','Plans or drawings')),
  note text not null default '' check (length(note) <= 500),
  state text not null default 'pending' check (state in ('pending','ready')),
  created_at timestamptz not null default now()
);
create index linart_assets_inquiry on public.linart_assets(inquiry_id);
create table public.linart_audit (
  id bigint generated always as identity primary key,
  actor uuid,
  inquiry_id uuid,
  action text not null,
  created_at timestamptz not null default now()
);
-- All access goes through the PHP gateway. No direct Data API or Storage rights for clients.
alter table public.linart_admins enable row level security;
alter table public.linart_inquiries enable row level security;
alter table public.linart_studios enable row level security;
alter table public.linart_assets enable row level security;
alter table public.linart_audit enable row level security;
revoke all on public.linart_admins, public.linart_inquiries, public.linart_studios, public.linart_assets, public.linart_audit from public, anon, authenticated;
grant all on public.linart_admins, public.linart_inquiries, public.linart_studios, public.linart_assets, public.linart_audit to service_role;
grant usage, select on sequence public.linart_audit_id_seq to service_role;

create function public.linart_import_inquiry(p_id uuid, p_contact jsonb, p_receipt_hash text, p_created timestamptz, p_delivery text)
returns jsonb language plpgsql security invoker set search_path = '' as $$
begin
  insert into public.linart_inquiries(id,contact,receipt_hash,created_at,receipt_expires_at,delivery)
    values(p_id,p_contact,p_receipt_hash,p_created,p_created + interval '30 days',p_delivery) on conflict (id) do nothing;
  insert into public.linart_studios(inquiry_id) values(p_id) on conflict do nothing;
  return jsonb_build_object('ok',true);
end $$;

-- p_actor comes only from Supabase /auth/v1/user verification at the server, never request JSON.
create function public.linart_access(p_actor uuid, p_id uuid, p_admin boolean default false)
returns boolean language sql stable security invoker set search_path = '' as $$
  select exists(select 1 from public.linart_admins where user_id=p_actor)
    or (not p_admin and exists(select 1 from public.linart_inquiries where id=p_id and owner_id=p_actor and deletion_requested_at is null));
$$;
create function public.linart_claim(p_actor uuid, p_email text, p_id uuid, p_hash text)
returns jsonb language plpgsql security invoker set search_path = '' as $$
begin
  update public.linart_inquiries set owner_id=p_actor where id=p_id
    and lower(contact->>'email')=lower(p_email) and receipt_hash=p_hash
    and receipt_expires_at > now() and deletion_requested_at is null and (owner_id is null or owner_id=p_actor);
  if not found then raise exception 'Not available' using errcode='42501'; end if;
  insert into public.linart_audit(actor,inquiry_id,action) values(p_actor,p_id,'claim');
  return jsonb_build_object('ok',true);
end $$;
create function public.linart_save(p_actor uuid, p_id uuid, p_revision integer, p_answers jsonb, p_links jsonb, p_submit boolean)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare result public.linart_studios; media jsonb;
begin
  if not public.linart_access(p_actor,p_id,false) then raise exception 'Forbidden' using errcode='42501'; end if;
  perform 1 from public.linart_inquiries where id=p_id for update;
  select coalesce(jsonb_agg(to_jsonb(a)),'[]') into media from public.linart_assets a where inquiry_id=p_id and state='ready';
  if p_submit and exists(select 1 from public.linart_assets where inquiry_id=p_id and state='pending') then raise exception 'Pending upload' using errcode='23514'; end if;
  update public.linart_studios set answers=p_answers, links=p_links, revision=revision+1, updated_at=now(),
    submitted_at=case when p_submit then now() else submitted_at end,
    submitted_revision=case when p_submit then revision+1 else submitted_revision end,
    submitted_brief=case when p_submit then jsonb_build_object('answers',p_answers,'links',p_links,'assets',media) else submitted_brief end
    where inquiry_id=p_id and revision=p_revision returning * into result;
  if not found then raise exception 'Revision conflict' using errcode='40001'; end if;
  if p_submit then update public.linart_inquiries set status='Ready for Review' where id=p_id and status in ('New Inquiry','Awaiting Details','Ready for Review'); end if;
  insert into public.linart_audit(actor,inquiry_id,action) values(p_actor,p_id,case when p_submit then 'submit' else 'save' end);
  return to_jsonb(result);
end $$;
create function public.linart_reserve_asset(p_actor uuid,p_id uuid,p_asset uuid,p_filename text,p_mime text,p_bytes integer,p_purpose text,p_note text)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare existing public.linart_assets;
begin
  if not public.linart_access(p_actor,p_id,false) then raise exception 'Forbidden' using errcode='42501'; end if;
  perform 1 from public.linart_inquiries where id=p_id for update;
  select * into existing from public.linart_assets where id=p_asset;
  if found then
    if existing.inquiry_id<>p_id then raise exception 'Forbidden' using errcode='42501'; end if;
    return to_jsonb(existing);
  end if;
  if (select count(*) from public.linart_assets where inquiry_id=p_id) >= 12
    or (p_mime <> 'application/pdf' and (select count(*) from public.linart_assets where inquiry_id=p_id and mime <> 'application/pdf') >= 8)
    or (p_mime = 'application/pdf' and (select count(*) from public.linart_assets where inquiry_id=p_id and mime = 'application/pdf') >= 4)
  then raise exception 'Attachment limit' using errcode='23514'; end if;
  insert into public.linart_assets(id,inquiry_id,filename,mime,bytes,purpose,note) values(p_asset,p_id,p_filename,p_mime,p_bytes,p_purpose,p_note) returning * into existing;
  return to_jsonb(existing);
end $$;
create function public.linart_finish_asset(p_actor uuid,p_id uuid,p_asset uuid)
returns jsonb language plpgsql security invoker set search_path = '' as $$
begin
  if not public.linart_access(p_actor,p_id,false) then raise exception 'Forbidden' using errcode='42501'; end if;
  perform 1 from public.linart_inquiries where id=p_id for update;
  update public.linart_assets set state='ready' where id=p_asset and inquiry_id=p_id;
  return jsonb_build_object('ok',true);
end $$;
create function public.linart_asset_change(p_actor uuid,p_id uuid,p_asset uuid,p_action text,p_note text default '')
returns jsonb language plpgsql security invoker set search_path = '' as $$
begin
  if not public.linart_access(p_actor,p_id,false) then raise exception 'Forbidden' using errcode='42501'; end if;
  perform 1 from public.linart_inquiries where id=p_id for update;
  if p_action='caption' then
    update public.linart_assets set note=p_note where id=p_asset and inquiry_id=p_id;
  elsif p_action='remove' then
    delete from public.linart_assets where id=p_asset and inquiry_id=p_id;
  else raise exception 'Invalid action' using errcode='22023'; end if;
  insert into public.linart_audit(actor,inquiry_id,action) values(p_actor,p_id,'asset:'||p_action);
  return jsonb_build_object('ok',true);
end $$;
-- Revoke EXECUTE defaults on every LINART function, including future overloads.
do $$ declare r record; begin
  for r in select oid::regprocedure as signature from pg_proc where pronamespace='public'::regnamespace and proname like 'linart_%' loop
    execute format('revoke all on function %s from public, anon, authenticated',r.signature);
    execute format('grant execute on function %s to service_role',r.signature);
  end loop;
end $$;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('linart-studio','linart-studio',false,10485760,array['image/jpeg','image/png','application/pdf']);
-- No client storage policy. The gateway authorizes each transfer; no public URLs.
commit;
