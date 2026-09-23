// Isolated Postgres tests. PGlite supplies PostgreSQL; hosted Auth/Storage are stubbed schemas.
// Run: node tests/studio-database.test.mjs (requires @electric-sql/pglite in QA_NODE_MODULES).
import { createRequire } from 'node:module';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const require=createRequire(`${process.env.QA_NODE_MODULES || process.cwd()+'/node_modules'}/package.json`);
const {PGlite}=require('@electric-sql/pglite');
const db=new PGlite();
await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
create schema auth; create table auth.users(id uuid primary key);
create schema storage; create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]); create table storage.objects(bucket_id text);
grant usage on schema public,auth to service_role; grant select on auth.users to service_role;`);
await db.exec(fs.readFileSync(new URL('../supabase/migrations/20260923185850_linart_studio_v1.sql',import.meta.url),'utf8'));
let passed=0;
const test=async(name,fn)=>{await fn();passed++;console.log(`PASS ${name}`)};
const a='10000000-0000-4000-8000-000000000001',b='10000000-0000-4000-8000-000000000002',admin='10000000-0000-4000-8000-000000000003';
const project='20000000-0000-4000-8000-000000000001',other='20000000-0000-4000-8000-000000000002';
const hash='a'.repeat(64), contact={name:'Test only',email:'client@example.invalid',city:'Test',service:'Kitchen Remodeling'};
await db.query('insert into auth.users values ($1),($2),($3)',[a,b,admin]);
await db.query('insert into public.linart_admins(user_id) values($1)',[admin]);
await db.exec('set role service_role');
await db.query('select public.linart_import_inquiry($1,$2,$3,now(),$4)',[project,contact,hash,'accepted']);
await db.query('select public.linart_import_inquiry($1,$2,$3,now()-interval \'31 days\',$4)',[other,contact,hash,'accepted']);
await test('Duplicate sync does not create a second inquiry or overwrite contact',async()=>{await db.query('select public.linart_import_inquiry($1,$2,$3,now(),$4)',[project,{...contact,name:'Overwrite'},hash,'accepted']);assert.equal((await db.query('select contact from public.linart_inquiries where id=$1',[project])).rows[0].contact.name,'Test only');});
await test('Email without private receipt cannot claim project',async()=>{await assert.rejects(db.query('select public.linart_claim($1,$2,$3,$4)',[a,contact.email,project,'b'.repeat(64)]));});
await test('Receipt without matching verified email cannot claim project',async()=>{await assert.rejects(db.query('select public.linart_claim($1,$2,$3,$4)',[b,'other@example.invalid',project,hash]));});
await test('Expired receipt is rejected',async()=>{await assert.rejects(db.query('select public.linart_claim($1,$2,$3,$4)',[a,contact.email,other,hash]));});
await db.query('select public.linart_claim($1,$2,$3,$4)',[a,contact.email,project,hash]);
await test('Another authenticated actor cannot read or save this project',async()=>{assert.equal((await db.query('select public.linart_access($1,$2,false) allowed',[b,project])).rows[0].allowed,false);await assert.rejects(db.query('select public.linart_save($1,$2,0,$3,$4,false)',[b,project,{},[]]));});
await test('Partial brief is accepted without budget, photos or questions',async()=>{await db.query('select public.linart_save($1,$2,0,$3,$4,true)',[a,project,{},[]]);const row=(await db.query('select * from public.linart_studios where inquiry_id=$1',[project])).rows[0];assert.equal(row.revision,1);assert.equal(row.submitted_revision,1);assert.ok(row.submitted_at);});
await test('Stale draft cannot overwrite newer submission',async()=>{await assert.rejects(db.query('select public.linart_save($1,$2,0,$3,$4,false)',[a,project,{goals:'stale'},[]]),e=>e.code==='40001');});
await test('Saving a later draft retains the previous submitted snapshot',async()=>{await db.query('select public.linart_save($1,$2,1,$3,$4,false)',[a,project,{goals:'New draft'},[]]);const r=(await db.query('select * from public.linart_studios where inquiry_id=$1',[project])).rows[0];assert.deepEqual(r.submitted_brief.answers,{});assert.equal(r.revision,2);assert.equal(r.submitted_revision,1);});
await test('Photo limit enforced in locked database transaction',async()=>{for(let i=1;i<=8;i++){await db.query('select public.linart_reserve_asset($1,$2,$3,$4,$5,$6,$7,$8)',[a,project,`30000000-0000-4000-8000-${String(i).padStart(12,'0')}`,`${i}.jpg`,'image/jpeg',100,'Existing space','']);}await assert.rejects(db.query('select public.linart_reserve_asset($1,$2,$3,$4,$5,$6,$7,$8)',[a,project,'30000000-0000-4000-8000-000000000009','9.jpg','image/jpeg',100,'Existing space','']));});
await test('Pending attachments prevent misleading complete submission',async()=>{await assert.rejects(db.query('select public.linart_save($1,$2,2,$3,$4,true)',[a,project,{},[]]));});
await test('Cross-project attachment changes are denied',async()=>{await assert.rejects(db.query('select public.linart_asset_change($1,$2,$3,$4,$5)',[b,project,'30000000-0000-4000-8000-000000000001','caption','changed']));});
await test('Fresh administrator membership controls access immediately',async()=>{assert.equal((await db.query('select public.linart_access($1,$2,true) allowed',[admin,project])).rows[0].allowed,true);await db.query('delete from public.linart_admins where user_id=$1',[admin]);assert.equal((await db.query('select public.linart_access($1,$2,true) allowed',[admin,project])).rows[0].allowed,false);});
await test('Deletion request closes client project access',async()=>{await db.query('update public.linart_inquiries set deletion_requested_at=now() where id=$1',[project]);assert.equal((await db.query('select public.linart_access($1,$2,false) allowed',[a,project])).rows[0].allowed,false);});
for(const role of ['anon','authenticated']){
await db.exec(`reset role;set role ${role}`);
await test(`${role}: raw inquiry reads denied`,async()=>{await assert.rejects(db.query('select * from public.linart_inquiries'));});
await test(`${role}: direct privileged RPC denied`,async()=>{await assert.rejects(db.query('select public.linart_claim($1,$2,$3,$4)',[a,contact.email,project,hash]));});
}
await db.exec('reset role');
await test('Every LINART table enables RLS',async()=>{const rows=(await db.query("select relname,relrowsecurity from pg_class where relname in ('linart_admins','linart_inquiries','linart_studios','linart_assets','linart_audit')")).rows;assert.equal(rows.length,5);assert.ok(rows.every(x=>x.relrowsecurity));});
await test('Storage bucket is private',async()=>{assert.equal((await db.query("select public from storage.buckets where id='linart-studio'")).rows[0].public,false);});
await test('Staging rollback succeeds',async()=>{await db.exec(fs.readFileSync(new URL('../supabase/rollback/linart_studio_v1.sql',import.meta.url),'utf8'));});
console.log(`${passed} database checks passed; no production connections used.`);
await db.close();
