<?php
// Lilium House booking enquiry handler — honeypot + simple rate limit, mail() delivery only.
header('Content-Type: application/json');

$to = '[[EMAIL_ADDRESS]]';

function reply($ok, $msg = '') {
    echo json_encode(['ok' => $ok, 'message' => $msg]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    reply(false, 'Invalid request method');
}

// Honeypot field, must stay empty
if (!empty($_POST['website'] ?? '')) {
    reply(true); // silently accept to not tip off bots
}

// Simple per-IP rate limit (1 submission / 60s) using a tmp file
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$lockFile = sys_get_temp_dir() . '/lh_contact_' . md5($ip) . '.lock';
if (file_exists($lockFile) && (time() - filemtime($lockFile)) < 60) {
    reply(false, 'Please wait a moment before trying again.');
}
touch($lockFile);

$name    = trim($_POST['name'] ?? '');
$phone   = trim($_POST['phone'] ?? '');
$email   = trim($_POST['email'] ?? '');
$reason  = trim($_POST['reason'] ?? '');
$dates   = trim($_POST['dates'] ?? '');
$privacy = $_POST['privacy'] ?? '';

if (!$name || !$phone || !$email || !$privacy) {
    reply(false, 'Missing required fields');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    reply(false, 'Invalid email');
}

$subject = 'New booking enquiry — Lilium House';
$body = "Name: $name\nPhone: $phone\nEmail: $email\nLocation: $reason\nPreferred dates: $dates\n";
$headers = "From: no-reply@liliumhouse.miximcreativestudio.com\r\nReply-To: $email\r\n";

$sent = @mail($to, $subject, $body, $headers);

reply($sent, $sent ? 'Sent' : 'Mail delivery failed');
