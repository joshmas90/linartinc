<?php
declare(strict_types=1);

date_default_timezone_set('America/New_York');
require_once __DIR__ . '/studio/common.php';

const RECIPIENT      = 'services@linartinc.com, linartinc@yahoo.com';
const SENDER         = 'services@linartinc.com';
const SENDER_NAME    = 'Linart Website';
const LOG_FILENAME   = 'linart-leads.log';
const RATE_LIMIT_SEC = 20;
const MAX_BODY_BYTES = 32768;

function respond(int $status, array $payload): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload);
    exit;
}

function header_safe(string $value): string {
    return trim(str_ireplace(["\r", "\n", "%0a", "%0d"], '', $value));
}

function header_name(string $value): string {
    return trim((string) preg_replace('/["<>\\\\]/u', '', header_safe($value)));
}

function str_len(string $v): int {
    return function_exists('mb_strlen') ? mb_strlen($v, 'UTF-8') : strlen($v);
}

function str_cut(string $v, int $max): string {
    return function_exists('mb_substr') ? mb_substr($v, 0, $max, 'UTF-8') : substr($v, 0, $max);
}

function clean(string $value, int $max = 2000): string {
    $value = str_replace("\0", '', $value);
    $value = trim($value);
    return str_cut($value, $max);
}

function field_value(array $data, string $key, int $max): string {
    $value = $data[$key] ?? '';
    return is_scalar($value) ? clean((string) $value, $max) : '';
}

function log_path(): string {
    try { return studio_private_dir() . DIRECTORY_SEPARATOR . LOG_FILENAME; } catch (Throwable $e) { /* Preserve legacy logging fallback. */ }
    $above = dirname(__DIR__) . DIRECTORY_SEPARATOR . LOG_FILENAME;
    if (@is_writable(dirname($above))) {
        return $above;
    }
    return sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'linart-private-leads.log';
}

function client_ip(): string {
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

function rate_limited(): bool {
    $file = sys_get_temp_dir() . '/linart-rl-' . hash('sha256', client_ip());
    $handle = @fopen($file, 'c+');
    if ($handle === false) return false;

    if (!@flock($handle, LOCK_EX)) {
        fclose($handle);
        return false;
    }

    rewind($handle);
    $last = (int) trim((string) stream_get_contents($handle));
    $now = time();
    $limited = $last > 0 && ($now - $last) < RATE_LIMIT_SEC;

    if (!$limited) {
        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, (string) $now);
        fflush($handle);
    }

    flock($handle, LOCK_UN);
    fclose($handle);
    return $limited;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'Method not allowed.']);
}

if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > MAX_BODY_BYTES) {
    respond(413, ['ok' => false, 'error' => 'That message is too large to send.']);
}

$raw = file_get_contents('php://input', false, null, 0, MAX_BODY_BYTES + 1) ?: '';
if (strlen($raw) > MAX_BODY_BYTES) respond(413, ['ok'=>false,'error'=>'That message is too large to send.']);
$data = json_decode($raw, true);
if (!is_array($data)) {
    $data = $_POST;
}

if (!empty($data['company'])) {
    respond(200, ['ok' => true]);
}

$name    = field_value($data, 'name', 120);
$email   = field_value($data, 'email', 180);
$phone   = field_value($data, 'phone', 60);
$city    = field_value($data, 'city', 120);
$service = field_value($data, 'service', 80);
$timing  = field_value($data, 'timing', 80);
$contact = field_value($data, 'contact', 40);
$message = field_value($data, 'message', 1000);

$allowedServices = [
    'New Custom Home Construction',
    'Home Addition',
    'Whole-Home Renovation',
    'Kitchen Remodeling',
    'Bathroom Remodeling',
    'Basement Finishing',
    'Deck / Patio Construction',
    'Other Residential Work',
];

$allowedTimings = ['Planning / researching', 'Within 3 months', '3–6 months', '6–12 months', '12+ months'];
$allowedContacts = ['', 'Phone', 'Email', 'Text'];

$errors = [];
if ($name === '')                                           $errors['name']    = 'Please enter your name.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL))             $errors['email']   = 'Please enter a valid email address.';
if (preg_match_all('/\d/', $phone) < 10)                    $errors['phone']   = 'Please enter a phone number with at least 10 digits.';
if ($city === '')                                           $errors['city']    = 'Please enter the project city or ZIP.';
if (!in_array($service, $allowedServices, true))             $errors['service'] = 'Please choose a valid project type.';
if ($timing !== '' && !in_array($timing, $allowedTimings, true)) $errors['timing'] = 'Please choose a valid project timing.';
if (!in_array($contact, $allowedContacts, true))             $errors['contact'] = 'Please choose a valid contact method.';

if ($errors) {
    respond(422, ['ok' => false, 'error' => 'Please check the highlighted fields.', 'fields' => $errors]);
}

// Stable request IDs are persisted before attempting email. A retry never sends twice.
$inquiryId = null; $journalPath = null; $journal = null; $inquiryLock = null;
$lead = compact('name','email','phone','city','service','timing','contact','message');
try {
    if (isset($data['request_id']) && !is_string($data['request_id'])) throw new InvalidArgumentException('Invalid request reference.');
    $inquiryId = !empty($data['request_id']) ? studio_uuid($data['request_id']) : studio_new_id();
} catch (InvalidArgumentException $e) { respond(422, ['ok'=>false,'error'=>'Invalid request reference.']); }
try {
    $inquiryLock = studio_lock('inquiry:'.$inquiryId);
    $journalPath = studio_private_dir().'/inquiry-'.$inquiryId.'.json';
    if (is_file(studio_private_dir().'/deleted-'.$inquiryId.'.json')) respond(409,['ok'=>false,'error'=>'This inquiry reference was removed. Start a new inquiry if you wish to contact LINART again.']);
    $fingerprint = hash('sha256', json_encode($lead));
    if (is_file($journalPath)) {
        $existing = json_decode(file_get_contents($journalPath),true);
        if (!$existing || !hash_equals($existing['fingerprint'], $fingerprint)) respond(409,['ok'=>false,'error'=>'This request reference was already used. Contact LINART before sending again.']);
        if ($existing['delivery'] === 'accepted') respond(200,['ok'=>true,'inquiry_id'=>$inquiryId,'studio_available'=>(bool)(studio_config()['studio_enabled']??false)]);
        respond(409,['ok'=>false,'error'=>'Your inquiry may already have been received. Please contact LINART before sending again.','delivery'=>'unconfirmed']);
    }
    $journal = ['id'=>$inquiryId,'fingerprint'=>$fingerprint,'lead'=>$lead,'created_at'=>gmdate('c'),'delivery'=>'pending'];
} catch (Throwable $e) {
    // Preserve existing mail delivery even if optional private storage is unavailable.
    $inquiryId = null; $journalPath = null; $journal = null;
}

if (rate_limited()) {
    header('Retry-After: ' . RATE_LIMIT_SEC);
    respond(429, ['ok' => false, 'error' => 'Please wait a moment before sending again.']);
}

if ($journalPath && $journal) {
    try { studio_write($journalPath,$journal); }
    catch (Throwable $e) { $inquiryId=null; $journalPath=null; }
}
$submittedAt = date('Y-m-d H:i:s T');
$timingDisplay = $timing !== '' ? $timing : 'Not specified';
$messageDisplay = $message !== '' ? $message : 'Not provided';

$lines = [
    "New project inquiry from linartinc.com",
    "Reference: " . ($inquiryId ?? "Contact LINART for details"),
    "",
    "Name:                 {$name}",
    "Email:                {$email}",
    "Phone:                {$phone}",
    "City / ZIP:           {$city}",
    "Project type:         {$service}",
    "Timing:               {$timingDisplay}",
    "Preferred contact:    {$contact}",
    "",
    "Project description",
    "-------------------",
    $messageDisplay,
    "",
    "-------------------",
    "Submitted: {$submittedAt}",
    "IP:        " . client_ip(),
];

$body = implode("\n", $lines);
$subjectCity = $city !== '' ? $city : 'NJ';
$subject = "Website inquiry — {$service} — {$subjectCity} — {$name}";

$headers = [
    'From: ' . SENDER_NAME . ' <' . SENDER . '>',
    'Reply-To: ' . header_name($name) . ' <' . header_safe($email) . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
];

$leadLog = log_path();
$previousUmask = umask(0077);
$logged = @file_put_contents(
    $leadLog,
    "===== {$submittedAt} =====\n{$body}\n\n",
    FILE_APPEND | LOCK_EX
) !== false;
umask($previousUmask);

if ($logged) {
    @chmod($leadLog, 0600);
}

$sent = function_exists('mail') && @mail(
    RECIPIENT,
    '=?UTF-8?B?' . base64_encode($subject) . '?=',
    $body,
    implode("\r\n", $headers),
    '-f' . SENDER
);

if ($journalPath && $journal) {
    $journal['delivery'] = $sent ? 'accepted' : 'failed';
    try { studio_write($journalPath,$journal); }
    catch (Throwable $e) { $inquiryId=null; } // Email acceptance remains authoritative.
}
if (!$sent) {
    respond(502, [
        'ok'    => false,
        'error' => $logged
            ? 'Your details were saved, but email delivery failed. Please call 609-209-7810 or email services@linartinc.com.'
            : 'We could not save or send that automatically. Please call 609-209-7810 or email services@linartinc.com.',
    ]);
}

respond(200, ['ok' => true, 'inquiry_id' => $inquiryId, 'studio_available' => $inquiryId !== null && (bool)(studio_config()['studio_enabled'] ?? false)]);
