<?php
// Simple bookings viewer. CHANGE THIS PASSWORD before going live!
session_start();
const ADMIN_PASSWORD = 'nova@123';

if (isset($_GET['logout'])) { session_destroy(); header('Location: admin.php'); exit; }
if (isset($_POST['password'])) {
    if (hash_equals(ADMIN_PASSWORD, $_POST['password'])) { $_SESSION['nova_admin'] = true; }
    else { $error = 'Wrong password'; }
}
$logged = !empty($_SESSION['nova_admin']);

$rows = [];
if ($logged && file_exists(__DIR__ . '/data/bookings.csv')) {
    $fp = fopen(__DIR__ . '/data/bookings.csv', 'r');
    while (($r = fgetcsv($fp)) !== false) { $rows[] = $r; }
    fclose($fp);
}
$head = $rows ? array_shift($rows) : [];
$rows = array_reverse($rows);
function e($s) { return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); }
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bookings | Nova Beauty Admin</title>
<style>
  body { font-family: system-ui, sans-serif; background: #fffafc; color: #2b1d24; margin: 0; padding: 30px 16px; }
  .wrap { max-width: 1100px; margin: 0 auto; }
  h1 { color: #d63f7a; }
  form.login { max-width: 320px; margin: 80px auto; background: #fff; padding: 30px; border-radius: 14px; box-shadow: 0 10px 30px rgba(214,63,122,.12); }
  input, button { width: 100%; padding: 12px; margin-top: 10px; border-radius: 8px; border: 1px solid #ecd3de; font-size: 1rem; box-sizing: border-box; }
  button { background: #d63f7a; color: #fff; border: 0; cursor: pointer; }
  .table-wrap { overflow-x: auto; background: #fff; border-radius: 14px; box-shadow: 0 10px 30px rgba(214,63,122,.12); }
  table { width: 100%; border-collapse: collapse; font-size: .9rem; }
  th, td { padding: 12px; text-align: left; border-bottom: 1px solid #f3dde6; white-space: nowrap; }
  th { background: #fde8f0; }
  .top { display: flex; justify-content: space-between; align-items: center; }
  a { color: #d63f7a; }
  .err { color: #e74c3c; }
</style>
</head>
<body>
<div class="wrap">
<?php if (!$logged): ?>
  <form class="login" method="POST">
    <h2>Admin Login</h2>
    <?php if (!empty($error)): ?><p class="err"><?= e($error) ?></p><?php endif; ?>
    <input type="password" name="password" placeholder="Password" required autofocus>
    <button type="submit">Login</button>
  </form>
<?php else: ?>
  <div class="top"><h1>Appointment Bookings (<?= count($rows) ?>)</h1><a href="?logout=1">Logout</a></div>
  <?php if (!$rows): ?>
    <p>No bookings yet.</p>
  <?php else: ?>
  <div class="table-wrap"><table>
    <tr><?php foreach ($head as $h): ?><th><?= e($h) ?></th><?php endforeach; ?></tr>
    <?php foreach ($rows as $r): ?>
      <tr><?php foreach ($r as $c): ?><td><?= e($c) ?></td><?php endforeach; ?></tr>
    <?php endforeach; ?>
  </table></div>
  <?php endif; ?>
<?php endif; ?>
</div>
</body>
</html>
