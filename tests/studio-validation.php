<?php
require __DIR__.'/../apps/web/public/studio/common.php';
function expect(bool $condition,string $message): void { if (!$condition) throw new RuntimeException($message); }
function rejected(callable $f): void {try {$f();}catch(InvalidArgumentException $e){return;}throw new RuntimeException('Expected validation rejection');}
expect(studio_draft([])['goals']==='','Empty brief must be valid.');
rejected(fn()=>studio_draft(['goals'=>str_repeat('a',4001)]));
rejected(fn()=>studio_draft(['references'=>array_fill(0,11,[])]));
foreach(['javascript:alert(1)','file:///etc/passwd','https://user:password@example.com','//example.com'] as $url) rejected(fn()=>studio_draft(['references'=>[['id'=>studio_new_id(),'url'=>$url,'note'=>'']]]));
$id=studio_new_id();expect(studio_uuid($id)===$id,'UUID validation');
rejected(fn()=>studio_uuid('../../private'));
expect(studio_draft(['references'=>[['id'=>$id,'url'=>'https://www.houzz.com/','note'=>'Cabinetry']]])['references'][0]['note']==='Cabinetry','Legitimate link');
expect(!array_key_exists('email',studio_draft(['email'=>'spoofed@example.com','project_id'=>studio_new_id()])),'Client cannot supply ownership');
echo "PASS: optional fields, answer/link limits, unsafe URL rejection, UUID validation, ownership field filtering.\n";
