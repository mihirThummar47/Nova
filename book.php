<?php
// Nova Beauty Parlour - appointment booking handler
// Saves bookings to data/bookings.csv (view them in admin.php)

header('Content-Type: application/json; charset=utf-8');
date_default_timezone_set('Asia/Kolkata');

function respond($success, $message) {
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Invalid request.');
}

function clean($key, $max = 200) {
    $val = isset($_POST[$key]) ? trim((string) $_POST[$key]) : '';
    $val = str_replace(["\r", "\n"], ' ', $val);
    return mb_substr($val, 0, $max);
}

$name    = clean('name', 80);
$phone   = clean('phone', 20);
$email   = clean('email', 100);
$service = clean('service', 60);
$date    = clean('date', 10);
$time    = clean('time', 10);
$message = clean('message', 500);

if ($name === '' || $phone === '' || $service === '' || $date === '' || $time === '') {
    respond(false, 'Please fill all required fields.');
}
if (!preg_match('/^[0-9+\s-]{10,15}$/', $phone)) {
    respond(false, 'Please enter a valid phone number.');
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Please enter a valid email address.');
}
$d = DateTime::createFromFormat('Y-m-d', $date);
if (!$d || $d->format('Y-m-d') !== $date || $date < date('Y-m-d')) {
    respond(false, 'Please choose a valid future date.');
}

// Prevent CSV formula injection when opened in Excel
function csv_safe($v) {
    return (strlen($v) && in_array($v[0], ['=', '+', '-', '@'], true)) ? "'" . $v : $v;
}

$dir = __DIR__ . '/data';
if (!is_dir($dir)) {
    mkdir($dir, 0755, true);
    file_put_contents($dir . '/.htaccess', "Require all denied\n");
}
$file = $dir . '/bookings.csv';
$isNew = !file_exists($file);

$fp = fopen($file, 'a');
if (!$fp) {
    respond(false, 'Could not save booking. Please call us.');
}
flock($fp, LOCK_EX);
if ($isNew) {
    fputcsv($fp, ['Booked On', 'Name', 'Phone', 'Email', 'Service', 'Date', 'Time', 'Message']);
}
fputcsv($fp, array_map('csv_safe', [date('Y-m-d H:i'), $name, $phone, $email, $service, $date, $time, $message]));
flock($fp, LOCK_UN);
fclose($fp);

respond(true, "Thank you, $name! Your appointment request for $service on " . $d->format('d M Y') . " at $time has been received. We will call you to confirm.");
