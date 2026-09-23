-- Read only. Run against the chosen LINART target before approving deployment.
select current_database(), version();
select schemaname,tablename,rowsecurity from pg_tables where schemaname in ('public','storage','auth');
select table_schema,table_name,column_name,data_type from information_schema.columns where table_name like 'linart_%';
select schemaname,tablename,policyname,roles,cmd,qual,with_check from pg_policies where schemaname in ('public','storage');
select id,name,public,file_size_limit,allowed_mime_types from storage.buckets;
select routine_schema,routine_name from information_schema.routines where routine_name like 'linart_%';
select name,default_version,installed_version from pg_available_extensions where installed_version is not null;
-- Broad existing storage policies must be inspected; a shared project is not automatically safe.
