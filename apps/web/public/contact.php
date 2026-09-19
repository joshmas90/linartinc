<?php
/**
 * Linart Construction Inc. — contact form handler
 *
 * Receives JSON from the /contact page, validates it, emails the lead to
 * services@linartinc.com, and appends a copy to a local log so a lead is
 * never lost even if mail delivery fails.
 *
 * Deploy: this file must sit at the web root next to index.html.
 * Vite copies everything in public/ to the build output, so keeping it at
 * apps/web/public/contact.php is enough.
 */

declare(strict_types=1);

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const RECIPIENT      = 'services@linartinc.com';
// MUST be an address on linartinc.com or SPF/DKIM will fail and the mail
// will land in spam. Create this mailbox (or alias) in hPanel first.
const SENDER         = 'no-reply@linartinc.com';
const SENDER_NAME    = 'Linart Website';
const LOG_FILENAME   = 'linart-leads.log';
const RATE_LIMIT_SEC = 20;   // minimum seconds between submissions per IP
const MIN_FILL_SEC   = 3;    // a human takes longer than this to fill the form

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function respond(int $status, array $payload): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload);
    exit;
}

/** Strip CR/LF so user input can never inject extra mail headers. */
function header_safe(string $value): string {
    return trim(str_replace(["\r", "\n", "%0a", "%0d"], '', $value));
}

/**
 * mbstring is present on most hosts but not guaranteed. Fall back to the
 * byte-safe functions rather than fataling on an undefined function, which
 * would return an empty body and look like a broken form.
 */
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

/**
 * Prefer a directory above the web root so the lead log is not publicly
 * readable. Falls back to the script directory if that is not writable.
 */
function log_path(): string {
    $above = dirname(__DIR__) . DIRECTORY_SEPARATOR . LOG_FILENAME;
    if (@is_writable(dirname($above))) {
        return $above;
    }
    return __DIR__ . DIRECTORY_SEPARATOR . LOG_FILENAME;
}

function client_ip(): string {
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

function rate_limited(): bool {
    $file = sys_get_temp_dir() . '/linart-rl-' . md5(client_ip());
    $now  = time();
    if (is_file($file) && ($now - (int) @filemtime($file)) < RATE_LIMIT_SEC) {
        return true;
    }
    @touch($file);
    return false;
}

// ---------------------------------------------------------------------------
// Request guards
// ---------------------------------------------------------------------------

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'Method not allowed.']);
}

$raw = file_get_contents('php://input') ?: '';
$data = json_decode($raw, true);
if (!is_array($data)) {
    $data = $_POST; // tolerate a normal form post as a fallback
}

// Honeypot: a real visitor never sees or fills this field.
// Respond with success so bots do not learn they were caught.
if (!empty($data['company'])) {
    respond(200, ['ok' => true]);
}

// Timing trap.
$started = isset($data['started']) ? (int) $data['started'] : 0;
if ($started > 0 && (time() - intdiv($started, 1000)) < MIN_FILL_SEC) {
    respond(200, ['ok' => true]);
}

if (rate_limited()) {
    respond(429, ['ok' => false, 'error' => 'Please wait a moment before sending again.']);
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

$name    = clean((string) ($data['name']    ?? ''), 120);
$email   = clean((string) ($data['email']   ?? ''), 180);
$phone   = clean((string) ($data['phone']   ?? ''), 60);
$city    = clean((string) ($data['city']    ?? ''), 120);
$service = clean((string) ($data['service'] ?? ''), 80);
$timing  = clean((string) ($data['timing']  ?? ''), 80);
$contact = clean((string) ($data['contact'] ?? ''), 40);
$message = clean((string) ($data['message'] ?? ''), 6000);

$errors = [];
if ($name === '')                                           $errors['name']    = 'Please enter your name.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL))             $errors['email']   = 'Please enter a valid email address.';
if (preg_match_all('/\d/', $phone) < 10)                    $errors['phone']   = 'Please enter a phone number with at least 10 digits.';
if ($city === '')                                           $errors['city']    = 'Please enter the project city or ZIP.';
if (str_len($message) < 10)                                  $errors['message'] = 'Please describe the work briefly.';

if ($errors) {
    respond(422, ['ok' => false, 'error' => 'Please check the highlighted fields.', 'fields' => $errors]);
}

// ---------------------------------------------------------------------------
// Compose
// ---------------------------------------------------------------------------

$submittedAt = date('Y-m-d H:i:s T');

$lines = [
    "New project inquiry from linartinc.com",
    "",
    "Name:              {$name}",
    "Email:             {$email}",
    "Phone:             {$phone}",
    "City / ZIP:        {$city}",
    "Project type:      {$service}",
    "Timing:            {$timing}",
    "Preferred contact: {$contact}",
    "",
    "Project description",
    "-------------------",
    $message,
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
    'Reply-To: ' . header_safe($name) . ' <' . header_safe($email) . '>',
    'X-Mailer: PHP/' . phpversion(),
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
];

// ---------------------------------------------------------------------------
// Log first, then send. A logged lead survives a mail failure.
// ---------------------------------------------------------------------------

@file_put_contents(
    log_path(),
    "===== {$submittedAt} =====\n{$body}\n\n",
    FILE_APPEND | LOCK_EX
);

$sent = @mail(
    RECIPIENT,
    '=?UTF-8?B?' . base64_encode($subject) . '?=',
    $body,
    implode("\r\n", $headers),
    '-f' . SENDER
);

if (!$sent) {
    // The lead is in the log, so tell the visitor how to reach you directly
    // rather than pretending nothing happened.
    respond(502, [
        'ok'    => false,
        'error' => 'We could not send that automatically. Please call 609-209-7810 or email services@linartinc.com.',
    ]);
}

respond(200, ['ok' => true]);
