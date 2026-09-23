<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require __DIR__ . '/../apps/web/public/studio-runtime.php';
// No email here. Runs from cron; an outage retains the durable queue for retry.
$lock = fopen(private_dir() . '/sync.lock', 'c');
if (!$lock || !flock($lock, LOCK_EX | LOCK_NB)) exit;
$failed = 0; $done = 0;
foreach (glob(private_dir() . '/inquiry-*.json') ?: [] as $file) {
    $itemLock=fopen(substr($file,0,-5).'.lock','c');
    if (!$itemLock || !flock($itemLock,LOCK_EX|LOCK_NB)) { if ($itemLock) fclose($itemLock); continue; }
    $record = json_decode((string) file_get_contents($file), true);
    if (!$record || ($record['synced'] ?? false) || !in_array($record['state'] ?? '', ['accepted','notification_failed','pending'], true)) { fclose($itemLock); continue; }
    if ($record['state']==='pending' && strtotime($record['created_at']) > time()-300) { fclose($itemLock); continue; }
    try {
        rpc('import_inquiry', ['p_id' => $record['id'], 'p_contact' => $record['contact'], 'p_receipt_hash' => hash('sha256', $record['receipt']), 'p_created' => $record['created_at'], 'p_delivery' => $record['state']==='pending'?'uncertain':$record['state']]);
        $record['synced'] = true; private_write($file, $record); $done++;
    } catch (Throwable $e) { $failed++; }
    fclose($itemLock);
}
fwrite(STDOUT, "Synced: {$done}; pending failures: {$failed}\n");
exit($failed ? 1 : 0);
