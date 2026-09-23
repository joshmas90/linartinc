-- Additive, LINART-only migration. Review and approve the target project before deployment.
begin;
create table public.linart_inquiries (
 id uuid primary key,
 email text not null check (email = lower(email) and length(email) <= 180),
 contact jsonb not null check (jsonb_typeof(contact)='object'),
 status text not null default 'New Inquiry' check (status in ('New Inquiry','Awaiting Details','Ready for Review','Contacted','Archived')),
 draft jsonb not null default '{}' check (jsonb_typeof(draft)='object' and octet_length(draft::text)<=60000),
 version integer not null default 0 check (version>=0),
 submitted_draft jsonb,
 submitted_assets jsonb,
 submitted_at timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index linart_inquiries_email_created on public.linart_inquiries (email,created_at desc);
create index linart_inquiries_created on public.linart_inquiries (created_at desc);
create table public.linart_staff (
 user_id uuid primary key references auth.users(id) on delete cascade,
 active boolean not null default true,
 created_at timestamptz not null default now()
);
create table public.linart_assets (
 id uuid primary key,
 inquiry_id uuid not null references public.linart_inquiries(id) on delete cascade,
 object_path text not null unique,
 filename text not null check (length(filename)<=100),
 mime text not null check (mime in ('image/jpeg','application/pdf')),
 bytes integer not null check (bytes between 1 and 10485760),
 purpose text not null check (purpose in ('Existing space','Inspiration','Plans or drawings')),
 note text not null default '' check (length(note)<=500),
 slot integer not null check (slot between 1 and 12),
 ready boolean not null default false,
 created_at timestamptz not null default now(),
 unique(inquiry_id,slot),
 check (object_path = inquiry_id::text || '/' || id::text || case when mime='image/jpeg' then '.jpg' else '.pdf' end)
);
-- All client access goes through the authenticated PHP gateway. RLS deliberately has no
-- anon/authenticated policies: a leaked project UUID or client JWT grants no table access.
alter table public.linart_inquiries enable row level security;
alter table public.linart_staff enable row level security;
alter table public.linart_assets enable row level security;
revoke all on public.linart_inquiries, public.linart_staff, public.linart_assets from anon, authenticated;
grant select,insert,update,delete on public.linart_inquiries, public.linart_staff, public.linart_assets to service_role;

create function public.linart_save_draft(p_id uuid,p_version integer,p_draft jsonb,p_submit boolean)
returns setof public.linart_inquiries language sql security invoker set search_path='' as $$
 update public.linart_inquiries set
 draft=p_draft,version=version+1,updated_at=now(),
 submitted_draft=case when p_submit then p_draft else submitted_draft end,
 submitted_assets=case when p_submit then (select coalesce(jsonb_agg(jsonb_build_object('id',a.id,'filename',a.filename,'purpose',a.purpose,'note',a.note)),'[]'::jsonb) from public.linart_assets a where a.inquiry_id=p_id and a.ready) else submitted_assets end,
 submitted_at=case when p_submit then now() else submitted_at end,
 status=case when p_submit and status in ('New Inquiry','Awaiting Details','Ready for Review') then 'Ready for Review'
             when not p_submit and status='New Inquiry' then 'Awaiting Details' else status end
 where id=p_id and version=p_version returning *;
$$;
create function public.linart_reserve_asset(p_id uuid,p_inquiry uuid,p_filename text,p_path text,p_mime text,p_bytes integer,p_purpose text,p_note text)
returns setof public.linart_assets language plpgsql security invoker set search_path='' as $$
declare next_slot integer;
begin
 perform 1 from public.linart_inquiries where id=p_inquiry for update;
 if not found then return; end if;
 if exists(select 1 from public.linart_assets where id=p_id and inquiry_id=p_inquiry) then
  return query select * from public.linart_assets where id=p_id and inquiry_id=p_inquiry; return;
 end if;
 select s into next_slot from generate_series(1,12) s where not exists(select 1 from public.linart_assets where inquiry_id=p_inquiry and slot=s) order by s limit 1;
 if next_slot is null then return; end if;
 return query insert into public.linart_assets(id,inquiry_id,filename,object_path,mime,bytes,purpose,note,slot)
 values(p_id,p_inquiry,p_filename,p_path,p_mime,p_bytes,p_purpose,p_note,next_slot) returning *;
end;
$$;
revoke all on function public.linart_save_draft(uuid,integer,jsonb,boolean) from public,anon,authenticated;
revoke all on function public.linart_reserve_asset(uuid,uuid,text,text,text,integer,text,text) from public,anon,authenticated;
grant execute on function public.linart_save_draft(uuid,integer,jsonb,boolean) to service_role;
grant execute on function public.linart_reserve_asset(uuid,uuid,text,text,text,integer,text,text) to service_role;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('linart-studio','linart-studio',false,10485760,array['image/jpeg','application/pdf']);
-- Do not add a public storage policy. The server alone uploads/signs files.
commit;
