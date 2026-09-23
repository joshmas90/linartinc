<?php
// No network access, auth email or database calls. Tests request validators only.
require __DIR__.'/../apps/web/public/studio-runtime.php';
function check(bool $value,string $name): void { if (!$value) throw new RuntimeException($name); echo "PASS {$name}\n"; }
function rejects(callable $fn,string $name): void { try {$fn();} catch(Throwable $e) { check(true,$name); return; } throw new RuntimeException($name); }
check(count(validated_answers([]))===9,'All Studio questions optional');
rejects(fn()=>validated_answers(['goals'=>str_repeat('x',4001)]),'Oversized answer rejected');
rejects(fn()=>validated_answers(['goals'=>['nested']]),'Structured answer injection rejected');
check(validated_links([['url'=>'https://www.pinterest.com/pin/example','note'=>'Layout']])[0]['note']==='Layout','External inspiration links accepted without fetching them');
rejects(fn()=>validated_links([['url'=>'javascript:alert(1)','note'=>'']]),'Executable links rejected');
rejects(fn()=>validated_links([['url'=>'https://user:password@example.com','note'=>'']]),'Credential-bearing links rejected');
rejects(fn()=>validated_links(array_fill(0,11,['url'=>'https://example.com','note'=>''])),'Link quantity enforced');
rejects(fn()=>uuid_value('../another-client'),'Path traversal rejected');
check(uuid_value('10000000-0000-4000-8000-000000000001')==='10000000-0000-4000-8000-000000000001','Canonical project reference accepted');
$temp=sys_get_temp_dir().'/linart-upload-test-'.bin2hex(random_bytes(8));
putenv('LINART_PRIVATE_DIR='.$temp);
for ($i=0;$i<20;$i++) limit_upload('isolated-client');
rejects(fn()=>limit_upload('isolated-client'),'Batch photo uploads allowed; excessive burst rejected');
foreach (glob($temp.'/*')?:[] as $file) unlink($file); rmdir($temp);
echo "10 validator checks passed.\n";
