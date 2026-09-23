-- READ ONLY. Run against the owner-confirmed LINART project before approval.
select current_database(), version();
select table_schema,table_name from information_schema.tables where table_schema not in ('pg_catalog','information_schema') order by 1,2;
select schemaname,tablename,policyname,roles,cmd,qual,with_check from pg_policies where schemaname in ('public','storage');
select routine_schema,routine_name,security_type from information_schema.routines where routine_schema='public' and routine_name like 'linart_%';
select table_schema,table_name,grantee,privilege_type from information_schema.table_privileges where table_schema='public' and table_name like 'linart_%';
select trigger_schema,event_object_table,trigger_name,action_statement from information_schema.triggers where event_object_schema in ('public','storage');
select id,public,file_size_limit,allowed_mime_types from storage.buckets;
select n.nspname,c.relname,c.relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r';
