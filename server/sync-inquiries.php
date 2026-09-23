<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') exit(1);
require $argv[1] . '/studio/common.php';
$run = studio_lock('outbox-worker');
$count=0; $failed=0;
foreach (glob(studio_private_dir().'/inquiry-*.json') as $path) {
    $id=substr(basename($path),8,-5); $lock=studio_lock('inquiry:'.$id);
    try {
        $record=json_decode(file_get_contents($path),true,512,JSON_THROW_ON_ERROR);
        if (is_file(studio_private_dir().'/deleted-'.$id.'.json')) continue;
        if (!empty($record['synced_at']) || ($record['delivery']??'')!=='accepted') continue;
        studio_remote('/rest/v1/linart_inquiries?on_conflict=id','POST',[
            'id'=>$id,'email'=>strtolower($record['lead']['email']),'contact'=>$record['lead'],
            'created_at'=>$record['created_at'],
        ],null,['Prefer: resolution=ignore-duplicates']);
        $record['synced_at']=gmdate('c'); studio_write($path,$record); $count++;
    } catch(Throwable $e) { $failed++; } finally { fclose($lock); }
}
echo json_encode(['synced'=>$count,'failed'=>$failed]).PHP_EOL;
exit($failed?1:0);
