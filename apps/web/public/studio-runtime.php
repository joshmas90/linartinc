<?php
declare(strict_types=1);
// PHP-only shared functions. Configuration is environment-only; data stays outside public_html.
function studio_configured(): bool {
    return (bool) (getenv('LINART_SUPABASE_URL') && getenv('LINART_SUPABASE_SERVICE_KEY') && getenv('LINART_SUPABASE_PUBLIC_KEY'));
}
function private_dir(): string {
    $path = getenv('LINART_PRIVATE_DIR') ?: dirname(__DIR__) . '/linart-private';
    if (!is_dir($path) && !@mkdir($path, 0700, true)) throw new RuntimeException('Private storage unavailable');
    $real = realpath($path);
    $root = realpath($_SERVER['DOCUMENT_ROOT'] ?? '') ?: '';
    if (!$real || ($root !== '' && ($real === $root || str_starts_with($real, $root . '/')))) throw new RuntimeException('Private storage must be outside document root');
    @chmod($real, 0700);
    return $real;
}
function private_write(string $path, array $record): void {
    $temp = $path . '.' . bin2hex(random_bytes(8)) . '.tmp';
    $old = umask(0077);
    try {
        if (file_put_contents($temp, json_encode($record, JSON_THROW_ON_ERROR), LOCK_EX) === false || !rename($temp, $path)) throw new RuntimeException('Unable to save');
    } finally { umask($old); if (is_file($temp)) @unlink($temp); }
}
function sb(string $path, string $method = 'GET', ?array $body = null, ?string $token = null, bool $public = false): array {
    if (!studio_configured()) throw new RuntimeException('Studio unavailable', 503);
    $key = getenv($public ? 'LINART_SUPABASE_PUBLIC_KEY' : 'LINART_SUPABASE_SERVICE_KEY');
    $curl = curl_init(rtrim(getenv('LINART_SUPABASE_URL'), '/') . $path);
    $headers = ['apikey: ' . $key, 'Content-Type: application/json', 'Prefer: return=representation'];
    if ($token || str_starts_with($key,'eyJ')) $headers[]='Authorization: Bearer '.($token ?: $key);
    curl_setopt_array($curl, [CURLOPT_RETURNTRANSFER => true, CURLOPT_CUSTOMREQUEST => $method, CURLOPT_HTTPHEADER => $headers, CURLOPT_CONNECTTIMEOUT => 3, CURLOPT_TIMEOUT => 12]);
    if ($body !== null) curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($body, JSON_THROW_ON_ERROR));
    $raw = curl_exec($curl); $status = curl_getinfo($curl, CURLINFO_RESPONSE_CODE); curl_close($curl);
    $data = is_string($raw) ? json_decode($raw, true) : null;
    if ($status < 200 || $status >= 300) {
        if ($public && str_starts_with($path,'/auth/v1/verify') && in_array($status,[400,401,403,422],true)) throw new RuntimeException('The code is invalid or expired. Request a new code.',401);
        if ($status===429) throw new RuntimeException('Please wait before requesting another code.',429);
        $code = $data['code'] ?? '';
        if ($code === '40001') throw new RuntimeException('This project changed on another device. Reload before saving.', 409);
        if ($code === '42501') throw new RuntimeException('Project access is not available.', 403);
        if ($code === '23514' || $code === '22023') throw new RuntimeException('Check the project details or attachment limit.', 422);
        throw new RuntimeException($status === 401 ? 'Please verify your email again.' : 'Studio is temporarily unavailable. Your inquiry is unaffected.', $status === 401 ? 401 : 503);
    }
    return is_array($data) ? $data : [];
}
function rpc(string $name, array $args): array { return sb('/rest/v1/rpc/linart_' . $name, 'POST', $args); }
function uuid_value(mixed $value): string {
    if (!is_string($value) || !preg_match('/^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i', $value)) throw new RuntimeException('Invalid project reference', 422);
    return strtolower($value);
}
function limit_action(string $scope, int $seconds): void {
    $path = private_dir() . '/limit-' . hash('sha256', $scope . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
    $handle = fopen($path, 'c+');
    if (!$handle || !flock($handle, LOCK_EX)) throw new RuntimeException('Please try later.', 503);
    $last = (int) stream_get_contents($handle);
    if (time() - $last < $seconds) { fclose($handle); throw new RuntimeException('Please wait before trying again.', 429); }
    ftruncate($handle, 0); rewind($handle); fwrite($handle, (string) time()); fflush($handle); fclose($handle);
}
function limit_upload(string $actor): void {
    $path=private_dir().'/uploads-'.hash('sha256',$actor);
    $handle=fopen($path,'c+');
    if (!$handle || !flock($handle,LOCK_EX)) throw new RuntimeException('Please try later.',503);
    $events=json_decode((string)stream_get_contents($handle),true) ?: [];
    $events=array_values(array_filter($events,fn($time)=>is_int($time) && $time>time()-60));
    if (count($events)>=20) { fclose($handle); throw new RuntimeException('Please wait a minute before uploading more files.',429); }
    $events[]=time(); ftruncate($handle,0); rewind($handle); fwrite($handle,json_encode($events)); fflush($handle); fclose($handle);
}
function validated_answers(array $answers): array {
    $keys = ['projectType','goals','existingConditions','style','priorities','investment','timeline','constraints','other'];
    $result = [];
    foreach ($keys as $key) {
        $v = $answers[$key] ?? '';
        if (!is_string($v) || mb_strlen($v) > 4000) throw new RuntimeException('Each answer must be under 4,000 characters.', 422);
        $result[$key] = trim($v);
    }
    return $result;
}
function validated_links(array $links): array {
    if (count($links) > 10) throw new RuntimeException('Maximum 10 inspiration links.', 422);
    $result = [];
    foreach ($links as $link) {
        $url = $link['url'] ?? ''; $note = $link['note'] ?? '';
        if (!is_string($url) || strlen($url) > 1000 || !filter_var($url, FILTER_VALIDATE_URL) || !in_array(strtolower(parse_url($url, PHP_URL_SCHEME) ?: ''), ['http','https'], true) || parse_url($url, PHP_URL_USER) || !is_string($note) || mb_strlen($note) > 500) throw new RuntimeException('Use a complete http or https inspiration link and a short note.', 422);
        $result[] = ['url' => $url, 'note' => $note];
    }
    return $result;
}
function storage_request(string $path, string $method, ?string $bytes = null, string $mime = 'application/octet-stream'): string {
    $key = getenv('LINART_SUPABASE_SERVICE_KEY');
    $c = curl_init(rtrim(getenv('LINART_SUPABASE_URL'), '/') . '/storage/v1/object/linart-studio/' . $path);
    $headers=['apikey: '.$key,'Content-Type: '.$mime,'x-upsert: false'];
    if (str_starts_with($key,'eyJ')) $headers[]='Authorization: Bearer '.$key;
    curl_setopt_array($c, [CURLOPT_RETURNTRANSFER => true, CURLOPT_CUSTOMREQUEST => $method, CURLOPT_HTTPHEADER => $headers, CURLOPT_CONNECTTIMEOUT => 3, CURLOPT_TIMEOUT => 30]);
    if ($bytes !== null) curl_setopt($c, CURLOPT_POSTFIELDS, $bytes);
    $out = curl_exec($c); $status = curl_getinfo($c, CURLINFO_RESPONSE_CODE); curl_close($c);
    if ($status < 200 || $status >= 300) throw new RuntimeException('Attachment transfer could not be confirmed. Refresh before trying again.', $status === 404 ? 404 : 503);
    return (string) $out;
}
