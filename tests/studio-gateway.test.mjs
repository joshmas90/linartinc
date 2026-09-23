// Real gateway, mocked curl functions. All outbound transport is disabled.
import {execFileSync} from 'node:child_process';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
const root=path.resolve(new URL('..',import.meta.url).pathname),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'linart-gateway-'));
const actor='10000000-0000-4000-8000-000000000001',own='20000000-0000-4000-8000-000000000001',other='20000000-0000-4000-8000-000000000002';
const php=path.join(process.env.QA_NODE_MODULES,'@php-wasm/cli/php-wasm.js');let passed=0;
function request(data,{token='fixture-token',origin='',confirmed=true}={}){
 const payload=Buffer.from(JSON.stringify(data)).toString('base64');
 const code=`function curl_init($u){$GLOBALS['url']=$u;return 1;}function curl_setopt_array($c,$o){return true;}function curl_setopt($c,$k,$v){$GLOBALS['body']=$v;return true;}function curl_getinfo(...$a){return 200;}function curl_close($c){}function curl_exec($c){$u=$GLOBALS['url'];if(str_contains($u,'/auth/v1/user'))return json_encode(['id'=>'${actor}','email'=>'verified@example.invalid','email_confirmed_at'=>${confirmed?"'2026-09-23'":"null"}]);if(str_contains($u,'/linart_admins'))return '[]';if(str_contains($u,'/linart_inquiries')){if(str_contains($u,'id=eq.${own}&owner_id=eq.${actor}'))return json_encode([['id'=>'${own}','contact'=>[]]]);return '[]';}if(str_contains($u,'/linart_studios'))return '[{"revision":0,"answers":{},"links":[]}]';if(str_contains($u,'/linart_assets'))return '[]';if(str_contains($u,'/rpc/linart_save')){ $b=json_decode($GLOBALS['body'],true);if($b['p_actor']!=='${actor}')throw new Exception('Actor spoof');return '{"revision":1}';}throw new Exception('Unexpected network call');} $_POST=json_decode(base64_decode('${payload}'),true);$_SERVER['REQUEST_METHOD']='POST';$_SERVER['CONTENT_TYPE']='multipart/form-data';$_SERVER['HTTP_AUTHORIZATION']='${token?'Bearer '+token:''}';$_SERVER['HTTP_ORIGIN']='${origin}';$_SERVER['DOCUMENT_ROOT']='${root}/apps/web/public';require '${root}/apps/web/public/studio.php';`;
 return JSON.parse(execFileSync(process.execPath,[php,'-d','disable_functions=curl_init,curl_setopt_array,curl_setopt,curl_getinfo,curl_close,curl_exec','-r',code],{env:{...process.env,LINART_PRIVATE_DIR:tmp,LINART_SUPABASE_URL:'https://fixture.invalid',LINART_SUPABASE_SERVICE_KEY:'fixture-secret',LINART_SUPABASE_PUBLIC_KEY:'fixture-public'},encoding:'utf8'}));
}
function test(name,fn){fn();passed++;console.log('PASS '+name);}
test('Unauthenticated project request denied',()=>assert.ok(request({action:'get',inquiry_id:own},{token:''}).error));
test('Unverified Auth email denied',()=>assert.ok(request({action:'get',inquiry_id:own},{confirmed:false}).error));
test('Wrong browser origin denied',()=>assert.ok(request({action:'get',inquiry_id:own},{origin:'https://attacker.invalid'}).error));
test('Owner can load own project',()=>assert.equal(request({action:'get',inquiry_id:own}).project.id,own));
test('Owner cannot load another client project',()=>assert.ok(request({action:'get',inquiry_id:other}).error));
test('Client supplied actor cannot replace verified identity',()=>assert.equal(request({action:'save',inquiry_id:own,revision:0,answers:{},links:[],p_actor:'30000000-0000-4000-8000-000000000001'}).studio.revision,1));
test('Client cannot assign administrator status',()=>assert.ok(request({action:'status',inquiry_id:own,status:'Archived',admin:true}).error));
test('Unavailable attachment does not create a download',()=>assert.ok(request({action:'download',inquiry_id:own,asset_id:other}).error));
fs.rmSync(tmp,{recursive:true,force:true});console.log(`${passed} gateway checks passed; outbound curl disabled.`);
