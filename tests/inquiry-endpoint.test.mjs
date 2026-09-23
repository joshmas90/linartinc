// Executes the real PHP endpoint with mail disabled and replaced by a local counter.
// Nothing in this test can email a real recipient.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const root=path.resolve(new URL('..',import.meta.url).pathname);
const qa=process.env.QA_NODE_MODULES;
if(!qa)throw new Error('Set QA_NODE_MODULES to the isolated test dependency directory');
const php=path.join(qa,'@php-wasm/cli/php-wasm.js');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'linart-inquiry-test-'));
const form={request_id:'10000000-0000-4000-8000-000000000001',name:'Isolated test',email:'client@example.invalid',phone:'6095550100',city:'Test location',service:'Kitchen Remodeling',timing:'',contact:'',message:'',company:''};
let n=0;
function request(data,{failMail=false,method='POST',length=0}={}){
 const payload=Buffer.from(JSON.stringify(data)).toString('base64');
 const code=`function mail(...$args){$p=getenv('LINART_PRIVATE_DIR').'/mail-count';file_put_contents($p,(string)((int)@file_get_contents($p)+1));return ${failMail?'false':'true'};} $_POST=json_decode(base64_decode('${payload}'),true); $_SERVER['DOCUMENT_ROOT']='${root}/apps/web/public'; $_SERVER['REQUEST_METHOD']='${method}'; $_SERVER['CONTENT_LENGTH']='${length}'; $_SERVER['REMOTE_ADDR']='192.0.2.${++n}'; require '${root}/apps/web/public/contact.php';`;
 return JSON.parse(execFileSync(process.execPath,[php,'-d','disable_functions=mail','-r',code],{cwd:root,env:{...process.env,LINART_PRIVATE_DIR:temp,LINART_SUPABASE_URL:'',LINART_SUPABASE_SERVICE_KEY:'',LINART_SUPABASE_PUBLIC_KEY:''},encoding:'utf8'}));
}
let passed=0;function check(name,fn){fn();passed++;console.log('PASS '+name);}
check('Initial inquiry succeeds with Supabase entirely unconfigured',()=>{const r=request(form);assert.equal(r.ok,true);assert.equal(r.studio_available,false);assert.equal(r.inquiry_id,form.request_id);assert.match(r.receipt,/^[a-f0-9]{64}$/);});
check('Exact retry returns the same receipt and never duplicates mail',()=>{const a=request(form),b=request(form);assert.equal(a.receipt,b.receipt);assert.equal(fs.readFileSync(temp+'/mail-count','utf8'),'1');});
check('A reused request ID with changed details is rejected',()=>{assert.equal(request({...form,message:'Changed'}).ok,false);assert.equal(fs.readFileSync(temp+'/mail-count','utf8'),'1');});
check('Validation errors send no email',()=>{const r=request({...form,request_id:'10000000-0000-4000-8000-000000000002',email:'invalid'});assert.ok(r.fields.email);assert.equal(fs.readFileSync(temp+'/mail-count','utf8'),'1');});
check('Mail failure preserves inquiry and never reports success',()=>{const id='10000000-0000-4000-8000-000000000003';const r=request({...form,request_id:id},{failMail:true});assert.equal(r.ok,false);assert.equal(JSON.parse(fs.readFileSync(`${temp}/inquiry-${id}.json`)).state,'notification_failed');assert.equal(request({...form,request_id:id}).ok,false);assert.equal(fs.readFileSync(temp+'/mail-count','utf8'),'2');});
check('Uncertain pending delivery cannot be automatically resent',()=>{const id='10000000-0000-4000-8000-000000000001';const f=`${temp}/inquiry-${id}.json`;const record=JSON.parse(fs.readFileSync(f));record.state='pending';fs.writeFileSync(f,JSON.stringify(record));assert.equal(request(form).ok,false);assert.equal(fs.readFileSync(temp+'/mail-count','utf8'),'2');});
check('Oversized body and wrong method are rejected',()=>{assert.equal(request(form,{length:32769}).ok,false);assert.equal(request(form,{method:'GET'}).ok,false);});
check('Honeypot does not issue a false success or receipt',()=>{const r=request({...form,company:'spam'});assert.equal(r.ok,false);assert.equal(r.receipt,undefined);});
check('Private inquiry records are not inside the document root',()=>{assert.ok(fs.existsSync(temp+'/linart-leads.log'));assert.ok(!temp.startsWith(root+'/apps/web/public'));});
fs.rmSync(temp,{recursive:true,force:true});
console.log(`${passed} isolated inquiry endpoint checks passed; mail disabled.`);
