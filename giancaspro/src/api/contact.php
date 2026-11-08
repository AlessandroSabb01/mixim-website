<?php
/**
 * Invio richieste appuntamento — Studio Dentistico Giancaspro
 * Funziona su Hostinger (PHP mail()). Nessun dato viene salvato su database.
 *
 * CONFIGURAZIONE (Hostinger → Email): crea la casella indicata in MAIL_FROM
 * (es. noreply@studiogiancaspro.it) così i messaggi non finiscono in spam.
 */
declare(strict_types=1);

const MAIL_TO   = 'info@studiogiancaspro.it';
const MAIL_FROM = 'noreply@studiogiancaspro.it';
const SITE_HOST = 'studiogiancaspro.it';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function out(bool $ok, string $error = '', int $code = 200): void {
    http_response_code($code);
    echo json_encode(['ok' => $ok, 'error' => $error]);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') out(false, 'method', 405);

// Stesso dominio (protezione CSRF di base)
$origin = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
if ($origin !== '' && stripos(parse_url($origin, PHP_URL_HOST) ?: '', SITE_HOST) === false && stripos($origin, 'localhost') === false) {
    out(false, 'origin', 403);
}

// Honeypot anti-spam
if (!empty($_POST['website'])) out(true);

// Limite semplice: 1 invio ogni 30 secondi per IP
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$rl = sys_get_temp_dir() . '/gc_rl_' . md5($ip);
if (is_file($rl) && (time() - (int) @filemtime($rl)) < 30) out(false, 'rate', 429);
@touch($rl);

$clean = static function (string $k, int $max = 200): string {
    $v = trim((string) ($_POST[$k] ?? ''));
    $v = str_replace(["\r", "\n", "%0a", "%0d"], ' ', $v);
    return mb_substr(strip_tags($v), 0, $max);
};
$nome        = $clean('nome', 80);
$cognome     = $clean('cognome', 80);
$email       = filter_var(trim((string) ($_POST['email'] ?? '')), FILTER_VALIDATE_EMAIL) ?: '';
$telefono    = preg_replace('/[^0-9+ ().-]/', '', $clean('telefono', 30));
$trattamento = $clean('trattamento', 80);
$pagina      = $clean('pagina', 120);
$messaggio   = mb_substr(strip_tags(trim((string) ($_POST['messaggio'] ?? ''))), 0, 3000);
$privacy     = ($_POST['privacy'] ?? '') === '1';

if ($nome === '' || $cognome === '' || $email === '' || $telefono === '' || $trattamento === '' || !$privacy) {
    out(false, 'validation', 422);
}

$subject = '=?UTF-8?B?' . base64_encode("Richiesta appuntamento – {$nome} {$cognome}") . '?=';
$body = "Nuova richiesta dal sito studiogiancaspro.it\n\n"
      . "Nome: {$nome} {$cognome}\n"
      . "Email: {$email}\n"
      . "Telefono: {$telefono}\n"
      . "Trattamento di interesse: {$trattamento}\n"
      . "Pagina: {$pagina}\n\n"
      . "Messaggio:\n{$messaggio}\n\n"
      . "Consenso privacy: sì — " . date('d/m/Y H:i') . "\n";

$headers = [
    'From: Sito Studio Giancaspro <' . MAIL_FROM . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
];

$sent = @mail(MAIL_TO, $subject, $body, implode("\r\n", $headers), '-f' . MAIL_FROM);
$sent ? out(true) : out(false, 'mail', 500);
