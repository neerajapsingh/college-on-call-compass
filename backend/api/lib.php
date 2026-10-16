<?php
declare(strict_types=1);

$CFG = require __DIR__ . '/config.php';

function db(): PDO {
  static $pdo; global $CFG;
  if (!$pdo) {
    $pdo = new PDO($CFG['db_dsn'], $CFG['db_user'], $CFG['db_pass'], [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES => false,
    ]);
  }
  return $pdo;
}

function q(string $sql, array $p = []): PDOStatement { $s = db()->prepare($sql); $s->execute($p); return $s; }

function out($data, int $code = 200, ?array $meta = null, ?string $msg = null): never {
  http_response_code($code);
  $env = ['success' => $code < 400, 'data' => $data];
  if ($meta) $env['meta'] = $meta;
  if ($msg) $env['message'] = $msg;
  echo json_encode($env, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}
function fail(int $code, string $msg, ?array $errors = null): never {
  http_response_code($code);
  echo json_encode(['success' => false, 'data' => null, 'message' => $msg, 'errors' => $errors]);
  exit;
}

function body(): array {
  $b = json_decode(file_get_contents('php://input') ?: '[]', true);
  return is_array($b) ? $b : [];
}
function str($v, int $max): ?string { $v = is_string($v) ? trim($v) : ''; return $v === '' ? null : mb_substr($v, 0, $max); }

function cors(): void {
  global $CFG;
  $o = $_SERVER['HTTP_ORIGIN'] ?? '';
  if (in_array($o, $CFG['allowed_origins'], true)) {
    header("Access-Control-Allow-Origin: $o");
    header('Access-Control-Allow-Credentials: true');
    header('Vary: Origin');
    header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
  }
  header('Content-Type: application/json; charset=utf-8');
  header('X-Content-Type-Options: nosniff');
  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
}

function start_session(): void {
  global $CFG;
  session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'httponly' => true, 'secure' => $CFG['cookie_secure'], 'samesite' => 'Lax']);
  session_name('coc_admin');
  session_start();
  if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
}

/** Requires a logged-in admin; for writes also checks the CSRF header. */
function require_admin(): array {
  if (empty($_SESSION['uid'])) fail(401, 'Please sign in.');
  if ($_SERVER['REQUEST_METHOD'] !== 'GET' && !hash_equals($_SESSION['csrf'], $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '')) fail(403, 'Invalid security token. Reload and try again.');
  $u = q('SELECT id, name, email, role FROM admin_users WHERE id = ? AND is_active = 1', [$_SESSION['uid']])->fetch();
  if (!$u) { session_destroy(); fail(401, 'Please sign in.'); }
  return $u;
}

/** Simple sliding-window limiter stored in MySQL. */
function rate_limit(string $bucket, int $max, int $seconds): void {
  q('DELETE FROM rate_limits WHERE hit_at < NOW() - INTERVAL ? SECOND', [$seconds]);
  $n = (int) q('SELECT COUNT(*) FROM rate_limits WHERE bucket = ?', [$bucket])->fetchColumn();
  if ($n >= $max) fail(429, 'Too many attempts. Please wait a minute and try again.');
  q('INSERT INTO rate_limits (bucket, hit_at) VALUES (?, NOW())', [$bucket]);
}

function page_params(int $maxPer = 50): array {
  $page = max(1, (int) ($_GET['page'] ?? 1));
  $per = min($maxPer, max(1, (int) ($_GET['per_page'] ?? 12)));
  return [$page, $per, ($page - 1) * $per];
}
function meta(int $page, int $per, int $total): array { return ['page' => $page, 'per_page' => $per, 'total' => $total, 'total_pages' => max(1, (int) ceil($total / $per))]; }
