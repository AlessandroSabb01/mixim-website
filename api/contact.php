<?php
/**
 * Lilium House — stay request form.
 * Works on Hostinger with PHP mail(). Nothing is stored in a database.
 * Setup (Hostinger -> Email): create the MAIL_FROM mailbox so messages don't land in spam.
 */
declare(strict_types=1);

const MAIL_TO   = '[EMAIL TO FILL IN]';
const SITE_HOST = 'liliumhouse.miximcreativestudio.com';
const MAIL_FROM = 'noreply@' . SITE_HOST;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function out(bool $ok, string $error = '', int $code = 200): void {
    http_response_code($code);
    echo json_encode(['ok' => $ok, 'error' => $error]);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') out(false, 'method', 405);
if (!filter_var(MAIL_TO, FILTER_VALIDATE_EMAIL)) out(false, 'not-configured', 503);

// Same site only (basic CSRF protection)
$origin = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
$host = (string) (parse_url($origin, PHP_URL_HOST) ?: '');
if ($origin !== '' && stripos($host, 'liliumhouse') === false && stripos($host, 'localhost') === false) {
    out(false, 'origin', 403);
}

// Honeypot
if (!empty($_POST['website'])) out(true);

// Rate limit: 1 request every 30 seconds per IP
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$rl = sys_get_temp_dir() . '/lh_rl_' . md5($ip);
if (is_file($rl) && (time() - (int) @filemtime($rl)) < 30) out(false, 'rate', 429);
@touch($rl);

$clean = static function (string $k, int $max = 200): string {
    $v = trim((string) ($_POST[$k] ?? ''));
    $v = str_replace(["\r", "\n", "%0a", "%0d"], ' ', $v);
    return mb_substr(strip_tags($v), 0, $max);
};
$nome      = $clean('nome', 80);
$cognome   = $clean('cognome', 80);
$email     = filter_var(trim((string) ($_POST['email'] ?? '')), FILTER_VALIDATE_EMAIL) ?: '';
$telefono  = preg_replace('/[^0-9+ ().-]/', '', $clean('telefono', 30));
$casa      = ['rome' => 'Rome — Aventino', 'crete' => 'Crete — Palekastro', 'any' => 'Not decided'][$_POST['casa'] ?? ''] ?? '';
$ospiti    = $clean('ospiti', 4);
$arrivo    = preg_match('/^\d{4}-\d{2}-\d{2}$/', (string) ($_POST['arrivo'] ?? '')) ? $_POST['arrivo'] : '';
$partenza  = preg_match('/^\d{4}-\d{2}-\d{2}$/', (string) ($_POST['partenza'] ?? '')) ? $_POST['partenza'] : '';
$lang      = ($_POST['lang'] ?? '') === 'it' ? 'IT' : 'EN';
$pagina    = $clean('pagina', 120);
$messaggio = mb_substr(strip_tags(trim((string) ($_POST['messaggio'] ?? ''))), 0, 3000);
$privacy   = ($_POST['privacy'] ?? '') === '1';

if ($nome === '' || $cognome === '' || $email === '' || $telefono === '' || $casa === '' || !$privacy) {
    out(false, 'validation', 422);
}

$subject = '=?UTF-8?B?' . base64_encode("Stay request – {$casa} – {$nome} {$cognome}") . '?=';
$body = "New stay request from " . SITE_HOST . "\n\n"
      . "Name: {$nome} {$cognome}\n"
      . "Email: {$email}\n"
      . "Phone / WhatsApp: {$telefono}\n"
      . "Home: {$casa}\n"
      . "Check-in: " . ($arrivo ?: '-') . "\n"
      . "Check-out: " . ($partenza ?: '-') . "\n"
      . "Guests: {$ospiti}\n"
      . "Language: {$lang}\n"
      . "Page: {$pagina}\n\n"
      . "Message:\n{$messaggio}\n\n"
      . "Privacy consent: yes — " . date('d/m/Y H:i') . "\n";

$headers = [
    'From: Lilium House website <' . MAIL_FROM . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
];

$sent = @mail(MAIL_TO, $subject, $body, implode("\r\n", $headers), '-f' . MAIL_FROM);
$sent ? out(true) : out(false, 'mail', 500);
