<?php
declare(strict_types=1);
// No credentials belong in this file. Host configuration lives outside public_html.
function studio_config(): array {
    $path = getenv('LINART_CONFIG_FILE') ?: dirname(__DIR__, 2) . '/linart-config.php';
    return is_file($path) ? require $path : [];
}
function studio_reply(int $status, array $body): void {
    http_response_code($status);
    header('Content-Type: application/json'); header('Cache-Control: no-store, private');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($body, JSON_UNESCAPED_SLASHES); exit;
}
function studio_uuid(string $id): string {
    if (!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $id)) throw new InvalidArgumentException('Invalid project reference.');
    return strtolower($id);
}
function studio_new_id(): string {
    $b = random_bytes(16); $b[6] = chr((ord($b[6]) & 15) | 64); $b[8] = chr((ord($b[8]) & 63) | 128);
    $h = bin2hex($b); return substr($h,0,8).'-'.substr($h,8,4).'-'.substr($h,12,4).'-'.substr($h,16,4).'-'.substr($h,20);
}
function studio_private_dir(): string {
    $c = studio_config(); $dir = $c['private_dir'] ?? dirname(__DIR__, 2) . '/linart-private';
    $old = umask(0077);
    try { if (!is_dir($dir) && !mkdir($dir, 0700, true)) throw new RuntimeException('Private storage unavailable.'); }
    finally { umask($old); }
    $real = realpath($dir); $public = realpath(!empty($_SERVER['DOCUMENT_ROOT']) ? $_SERVER['DOCUMENT_ROOT'] : __DIR__ . '/..');
    if (!$real || ($public && ($real === $public || str_starts_with($real, $public . '/')))) throw new RuntimeException('Private storage must be outside the web root.');
    return $real;
}
function studio_write(string $path, array $data): void {
    $temp = $path . '.' . bin2hex(random_bytes(6)) . '.tmp';
    $old = umask(0077);
    try {
        $h = fopen($temp, 'xb');
        if (!$h) throw new RuntimeException('Private storage unavailable.');
        $json = json_encode($data, JSON_THROW_ON_ERROR);
        if (fwrite($h, $json) !== strlen($json) || !fflush($h)) throw new RuntimeException('Private write failed.');
        if (function_exists('fsync')) fsync($h);
        fclose($h);
        if (!rename($temp, $path)) throw new RuntimeException('Private write failed.');
    } finally { umask($old); if (is_file($temp)) unlink($temp); }
}
function studio_lock(string $key) {
    $h = fopen(studio_private_dir() . '/' . hash('sha256', $key) . '.lock', 'c+');
    if (!$h || !flock($h, LOCK_EX)) throw new RuntimeException('Please try again later.');
    return $h;
}
function studio_rate(string $key, int $seconds): void {
    $h = studio_lock('rate:' . $key); rewind($h); $last = (int) stream_get_contents($h);
    if (time() - $last < $seconds) { fclose($h); studio_reply(429, ['ok'=>false,'error'=>'Please wait before trying again.']); }
    ftruncate($h,0); rewind($h); fwrite($h,(string)time()); fflush($h); fclose($h);
}
function studio_remote(string $path, string $method='GET', $body=null, ?string $token=null, array $extra=[]): array {
    $c = studio_config();
    if (empty($c['supabase_url']) || empty($c['service_key']) || !function_exists('curl_init')) throw new RuntimeException('Studio is not available yet. Your initial inquiry is unaffected.');
    if (!str_starts_with($c['supabase_url'], 'https://')) throw new RuntimeException('Invalid server configuration.');
    $headers = ['apikey: '.$c['service_key']];
    if ($token !== null || !str_starts_with($c['service_key'],'sb_secret_')) $headers[]='Authorization: Bearer '.($token ?? $c['service_key']);
    if (!array_filter($extra,fn($header)=>str_starts_with(strtolower($header),'content-type:'))) $headers[]='Content-Type: application/json';
    $headers=array_merge($headers,$extra);
    $ch = curl_init(rtrim($c['supabase_url'],'/').$path);
    curl_setopt_array($ch,[CURLOPT_CUSTOMREQUEST=>$method,CURLOPT_RETURNTRANSFER=>true,CURLOPT_CONNECTTIMEOUT=>3,CURLOPT_TIMEOUT=>20,CURLOPT_HTTPHEADER=>$headers,CURLOPT_FOLLOWLOCATION=>false]);
    if ($body !== null) curl_setopt($ch,CURLOPT_POSTFIELDS,is_string($body)?$body:json_encode($body,JSON_THROW_ON_ERROR));
    $raw = curl_exec($ch); $status = (int)curl_getinfo($ch,CURLINFO_RESPONSE_CODE); curl_close($ch);
    if ($raw === false || $status < 200 || $status >= 300) throw new RuntimeException('Studio request could not be confirmed. Refresh before trying again.');
    return json_decode($raw,true) ?? [];
}
function studio_user(string $token): array {
    if (!$token || strlen($token)>8192) throw new UnexpectedValueException('Please verify your email to continue.');
    try { $user = studio_remote('/auth/v1/user','GET',null,$token); }
    catch (Throwable $e) { throw new UnexpectedValueException('Your session has expired. Verify your email again.'); }
    if (empty($user['id']) || empty($user['email_confirmed_at']) || empty($user['email'])) throw new UnexpectedValueException('Email verification is required.');
    return $user;
}
function studio_is_admin(array $user): bool {
    $rows = studio_remote('/rest/v1/linart_staff?user_id=eq.'.rawurlencode($user['id']).'&select=user_id&active=eq.true');
    return count($rows) === 1;
}
function studio_project(string $id, array $user, bool $admin=false): array {
    $rows = studio_remote('/rest/v1/linart_inquiries?id=eq.'.studio_uuid($id).'&select=*');
    if (!$rows || (!$admin && strcasecmp($rows[0]['email'], $user['email']) !== 0)) throw new OutOfBoundsException('Project not available for this verified email.');
    return $rows[0];
}
function studio_draft(array $draft): array {
    $result=[];
    foreach (['projectType','goals','existingConditions','style','priorities','investment','timeline','constraints','other'] as $field) {
        $value=$draft[$field]??'';
        if (!is_string($value) || mb_strlen($value)>4000) throw new InvalidArgumentException('Keep each answer within 4,000 characters.');
        $result[$field]=trim($value);
    }
    $refs=$draft['references']??[];
    if (!is_array($refs) || count($refs)>10) throw new InvalidArgumentException('Use up to ten inspiration links.');
    $result['references']=[];
    foreach($refs as $ref) {
        $url=$ref['url']??''; $note=$ref['note']??''; $parts=is_string($url)?parse_url($url):false;
        if (!$parts || !in_array(strtolower($parts['scheme']??''),['https','http'],true) || empty($parts['host']) || isset($parts['user']) || isset($parts['pass']) || strlen($url)>2048 || !is_string($note) || mb_strlen($note)>500) throw new InvalidArgumentException('Use a complete web link and a note up to 500 characters.');
        $result['references'][]=['id'=>studio_uuid($ref['id']??''),'url'=>$url,'note'=>$note];
    }
    return $result;
}
