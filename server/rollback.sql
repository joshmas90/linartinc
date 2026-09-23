-- DESTRUCTIVE: run only after owner approval and a verified backup/export.
-- Prefer disabling studio_enabled, stopping the sync cron, and reverting source first.
-- Export inquiries, staff and asset metadata; download bucket contents before removal.
begin;
drop function if exists public.linart_reserve_asset(uuid,uuid,text,text,text,integer,text,text);
drop function if exists public.linart_save_draft(uuid,integer,jsonb,boolean);
drop table if exists public.linart_assets;
drop table if exists public.linart_staff;
drop table if exists public.linart_inquiries;
-- Remove files through Storage API before deleting its bucket; never delete storage.objects in SQL.
delete from storage.buckets where id='linart-studio';
commit;
