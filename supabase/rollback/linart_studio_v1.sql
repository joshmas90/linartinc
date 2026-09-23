-- DESTRUCTIVE: only for empty staging installs. Production rollback disables the gateway
-- and cron first; preserve records and private objects, take a backup, obtain approval.
begin;
drop function if exists public.linart_asset_change(uuid,uuid,uuid,text,text);
drop function if exists public.linart_finish_asset(uuid,uuid,uuid);
drop function if exists public.linart_reserve_asset(uuid,uuid,uuid,text,text,integer,text,text);
drop function if exists public.linart_save(uuid,uuid,integer,jsonb,jsonb,boolean);
drop function if exists public.linart_claim(uuid,text,uuid,text);
drop function if exists public.linart_access(uuid,uuid,boolean);
drop function if exists public.linart_import_inquiry(uuid,jsonb,text,timestamptz,text);
drop table if exists public.linart_audit, public.linart_assets, public.linart_studios, public.linart_inquiries, public.linart_admins;
-- Storage objects must be removed through the Storage API first, never SQL.
delete from storage.buckets where id='linart-studio' and not exists(select 1 from storage.objects where bucket_id='linart-studio');
commit;
