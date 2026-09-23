import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync } from 'node:fs';
import assert from 'node:assert/strict';
const db = new PGlite();
// Minimal Supabase-owned schemas for an isolated PostgreSQL test, never production.
await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
create schema auth; create table auth.users(id uuid primary key);
create schema storage; create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);`);
const file = readdirSync(new URL('../supabase/migrations/', import.meta.url)).find(x => x.endsWith('_linart_project_studio.sql'));
await db.exec(readFileSync(new URL(`../supabase/migrations/${file}`, import.meta.url), 'utf8'));
const id='11111111-1111-4111-8111-111111111111';
await db.query(`insert into linart_inquiries(id,email,contact) values ($1,'client@example.invalid','{}')`,[id]);
for(const role of ['anon','authenticated']) {
  await db.exec(`set role ${role}`);
  for(const sql of [`select * from linart_inquiries`,`select * from linart_staff`,`select * from linart_assets`,`select * from linart_save_draft('${id}',0,'{}',true)`]) {
    await assert.rejects(db.query(sql), /permission denied/);
  }
  await db.exec('reset role');
}
// RLS still denies rows even if a future accidental SELECT grant is introduced.
await db.exec('grant select on linart_inquiries to authenticated; set role authenticated');
assert.equal((await db.query('select * from linart_inquiries')).rows.length,0);
await db.exec('reset role; revoke select on linart_inquiries from authenticated');
await db.exec('set role service_role');
let result=await db.query(`select * from linart_save_draft($1,0,'{"goals":"Daylight"}',false)`,[id]);
assert.equal(result.rows[0].version,1); assert.equal(result.rows[0].status,'Awaiting Details'); assert.equal(result.rows[0].submitted_at,null);
result=await db.query(`select * from linart_save_draft($1,0,'{"goals":"STALE"}',true)`,[id]); assert.equal(result.rows.length,0);
result=await db.query(`select * from linart_save_draft($1,1,'{}',true)`,[id]);
assert.equal(result.rows[0].status,'Ready for Review'); assert.ok(result.rows[0].submitted_at);
await db.query(`update linart_inquiries set status='Contacted' where id=$1`,[id]);
result=await db.query(`select * from linart_save_draft($1,2,'{"goals":"Updated"}',false)`,[id]);
assert.equal(result.rows[0].status,'Contacted'); assert.deepEqual(result.rows[0].submitted_draft,{});
for(let i=1;i<=13;i++) {
 const asset=`22222222-2222-4222-8222-${String(i).padStart(12,'0')}`;
 result=await db.query(`select * from linart_reserve_asset($1,$2,'room.jpg',$3,'image/jpeg',100,'Existing space','North wall')`,[asset,id,`${id}/${asset}.jpg`]);
 assert.equal(result.rows.length,i<=12?1:0);
}
const asset='22222222-2222-4222-8222-000000000001';
result=await db.query(`select * from linart_reserve_asset($1,$2,'room.jpg',$3,'image/jpeg',100,'Existing space','North wall')`,[asset,id,`${id}/${asset}.jpg`]);assert.equal(result.rows.length,1);
await assert.rejects(db.query(`update linart_assets set object_path='another-project/private.jpg' where id=$1`,[asset]), /check constraint/);
await assert.rejects(db.query(`update linart_assets set bytes=10485761 where id=$1`,[asset]), /check constraint/);
await db.exec('reset role');
const rls=await db.query(`select relrowsecurity from pg_class where relname in ('linart_inquiries','linart_assets','linart_staff')`);
assert.equal(rls.rows.length,3); assert.ok(rls.rows.every(r=>r.relrowsecurity));
const bucket=await db.query(`select * from storage.buckets where id='linart-studio'`); assert.equal(bucket.rows[0].public,false);
await db.exec(readFileSync(new URL('../server/rollback.sql', import.meta.url),'utf8'));
assert.equal((await db.query(`select to_regclass('public.linart_inquiries') as name`)).rows[0].name,null);
await db.close();
console.log('PASS: migration, deny-by-default grants/RLS, version conflicts, partial submission, workflow preservation, file quotas, retry reservation, path/size constraints and rollback.');
