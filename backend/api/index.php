<?php
declare(strict_types=1);
require __DIR__ . '/lib.php';

cors();
set_exception_handler(function (Throwable $e) { error_log((string) $e); fail(500, 'The server ran into a problem. Please try again shortly.'); });
start_session();

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = '/' . trim(substr($path, strlen($CFG['base_path'])), '/');
$seg = explode('/', trim($path, '/')); // e.g. ['api','admin','leads','12','status']
if (($seg[0] ?? '') !== 'api') fail(404, 'Not found');
array_shift($seg);
$ip = $_SERVER['REMOTE_ADDR'] ?? '0';

/* ---------- helpers mapping rows to frontend types ---------- */
function inst_row(array $r): array {
  $r['id'] = (int) $r['id'];
  $r['is_government'] = (bool) $r['is_government'];
  $r['is_partner_verified'] = (bool) $r['is_partner_verified'];
  $r['modes'] = $r['modes'] === '' ? [] : explode(',', $r['modes']);
  $r['approvals'] = json_decode($r['approvals'] ?? '[]', true) ?: [];
  unset($r['is_published'], $r['featured']);
  return $r;
}
function course_row(array $r, bool $admin = false): array {
  $showFee = $r['mode'] === 'online' && $r['fee_verified'] && $r['fee_valid_until'] && $r['fee_valid_until'] >= date('Y-m-d');
  $fee = ($showFee || ($admin && $r['fee_amount'] !== null)) ? ['amount' => (float) $r['fee_amount'], 'currency' => $r['fee_currency'], 'period' => $r['fee_period'], 'verified' => (bool) $r['fee_verified'], 'valid_until' => $r['fee_valid_until']] : null;
  // Regular/campus fees are never returned from public endpoints.
  if (!$admin && $r['mode'] === 'regular') $fee = null;
  foreach (['fee_amount', 'fee_currency', 'fee_period', 'fee_verified', 'fee_valid_until', 'is_published'] as $k) unset($r[$k]);
  $r['id'] = (int) $r['id']; $r['institution_id'] = (int) $r['institution_id']; $r['fee'] = $fee;
  return $r;
}
const COURSE_SELECT = 'SELECT c.*, i.name institution_name, i.slug institution_slug, i.type institution_type FROM courses c JOIN institutions i ON i.id = c.institution_id';

/* ---------- PUBLIC ---------- */
if ($seg[0] === 'universities' && $method === 'GET') {
  if (!empty($seg[1])) {
    $r = q('SELECT * FROM institutions WHERE slug = ? AND is_published = 1', [$seg[1]])->fetch();
    $r ? out(inst_row($r)) : fail(404, 'Institution not found.');
  }
  [$page, $per, $off] = page_params();
  $w = ['is_published = 1']; $p = [];
  if ($v = str($_GET['q'] ?? null, 100)) { $w[] = '(name LIKE ? OR city LIKE ?)'; $p[] = "%$v%"; $p[] = "%$v%"; }
  if ($v = str($_GET['category'] ?? null, 100)) { $cats = array_intersect(explode(',', $v), ['university', 'b_school', 'engineering', 'other']); if ($cats) { $w[] = 'category IN (' . implode(',', array_fill(0, count($cats), '?')) . ')'; array_push($p, ...$cats); } }
  if (in_array($_GET['mode'] ?? '', ['online', 'regular'], true)) { $w[] = 'FIND_IN_SET(?, modes)'; $p[] = $_GET['mode']; }
  if ($v = str($_GET['location'] ?? null, 100)) { $w[] = '(city LIKE ? OR state LIKE ?)'; $p[] = "%$v%"; $p[] = "%$v%"; }
  if (isset($_GET['partner']) && $_GET['partner'] !== '') { $w[] = 'is_partner_verified = ?'; $p[] = $_GET['partner'] === '1' ? 1 : 0; }
  if (($_GET['exclude_government'] ?? '') === '1') $w[] = 'is_government = 0';
  if (($_GET['featured'] ?? '') === '1') $w[] = 'featured = 1';
  if ($v = str($_GET['course'] ?? null, 100)) { $w[] = 'id IN (SELECT institution_id FROM courses WHERE is_published = 1 AND (category = ? OR name LIKE ?))'; $p[] = $v; $p[] = "%$v%"; }
  $where = implode(' AND ', $w);
  $total = (int) q("SELECT COUNT(*) FROM institutions WHERE $where", $p)->fetchColumn();
  $rows = q("SELECT * FROM institutions WHERE $where ORDER BY featured DESC, name LIMIT $per OFFSET $off", $p)->fetchAll();
  out(array_map('inst_row', $rows), 200, meta($page, $per, $total));
}

if ($seg[0] === 'courses' && $method === 'GET') {
  if (!empty($seg[1])) {
    $r = q(COURSE_SELECT . ' WHERE c.slug = ? AND c.is_published = 1 AND i.is_published = 1', [$seg[1]])->fetch();
    $r ? out(course_row($r)) : fail(404, 'Course not found.');
  }
  [$page, $per, $off] = page_params();
  $w = ['c.is_published = 1', 'i.is_published = 1']; $p = [];
  if ($v = str($_GET['q'] ?? null, 100)) { $w[] = 'c.name LIKE ?'; $p[] = "%$v%"; }
  if ($v = str($_GET['category'] ?? null, 80)) { $w[] = 'c.category = ?'; $p[] = $v; }
  if (in_array($_GET['mode'] ?? '', ['online', 'regular'], true)) { $w[] = 'c.mode = ?'; $p[] = $_GET['mode']; if ($_GET['mode'] === 'regular') $w[] = 'i.is_government = 0'; }
  if ($v = str($_GET['level'] ?? null, 20)) { $w[] = 'c.level = ?'; $p[] = $v; }
  if ($v = str($_GET['institution'] ?? null, 160)) { $w[] = 'i.slug = ?'; $p[] = $v; }
  $where = implode(' AND ', $w);
  $total = (int) q("SELECT COUNT(*) FROM courses c JOIN institutions i ON i.id = c.institution_id WHERE $where", $p)->fetchColumn();
  $rows = q(COURSE_SELECT . " WHERE $where ORDER BY c.name LIMIT $per OFFSET $off", $p)->fetchAll();
  out(array_map(fn($r) => course_row($r), $rows), 200, meta($page, $per, $total));
}

if ($seg[0] === 'blog' && $method === 'GET') {
  if (!empty($seg[1])) {
    $r = q('SELECT * FROM articles WHERE slug = ? AND is_published = 1', [$seg[1]])->fetch();
    if (!$r) fail(404, 'Article not found.');
    $r['id'] = (int) $r['id']; unset($r['is_published']); out($r);
  }
  [$page, $per, $off] = page_params();
  $w = ['is_published = 1']; $p = [];
  if ($v = str($_GET['category'] ?? null, 200)) { $c = explode(',', $v); $w[] = 'category IN (' . implode(',', array_fill(0, count($c), '?')) . ')'; array_push($p, ...$c); }
  if ($v = str($_GET['exam'] ?? null, 40)) { $w[] = 'exam = ?'; $p[] = $v; }
  $where = implode(' AND ', $w);
  $total = (int) q("SELECT COUNT(*) FROM articles WHERE $where", $p)->fetchColumn();
  $rows = q("SELECT id, slug, title, excerpt, '' content, category, exam, source_url, last_verified_at, author, published_at, updated_at FROM articles WHERE $where ORDER BY published_at DESC LIMIT $per OFFSET $off", $p)->fetchAll();
  out($rows, 200, meta($page, $per, $total));
}

if ($seg[0] === 'enquiries' && $method === 'POST') {
  $b = body();
  if (!empty($b['website'])) out(['id' => 0]); // honeypot: silently drop bots
  rate_limit("enq:$ip", 5, 600);
  $err = [];
  $name = str($b['full_name'] ?? null, 120); if (!$name || mb_strlen($name) < 2) $err['full_name'] = 'Please enter your full name.';
  $mobile = preg_replace('/\D/', '', (string) ($b['mobile'] ?? '')); $mobile = substr($mobile, -10);
  if (!preg_match('/^[6-9]\d{9}$/', $mobile)) $err['mobile'] = 'Enter a valid 10-digit Indian mobile number.';
  $email = str($b['email'] ?? null, 190); if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) $err['email'] = 'Enter a valid email address.';
  $source = in_array($b['source'] ?? '', ['home_enquiry', 'contact'], true) ? $b['source'] : null; if (!$source) $err['source'] = 'Invalid source.';
  $topics = ['Online Degrees', 'Regular Admissions', 'Entrance Exams', 'Admission Counselling', 'Other Query'];
  $topic = str($b['topic'] ?? null, 60);
  if ($source === 'contact') {
    if (!in_array($topic, $topics, true)) $err['topic'] = 'Please choose a topic.';
    if (!str($b['message'] ?? null, 2000)) $err['message'] = 'Please enter a message.';
  }
  if (($b['consent'] ?? false) !== true) $err['consent'] = 'Consent is required.';
  if ($err) fail(422, 'Please correct the highlighted fields.', $err);
  rate_limit("enq:m:$mobile", 3, 3600);

  $hours = (int) (q("SELECT v FROM settings WHERE k = 'enquiry_duplicate_window_hours'")->fetchColumn() ?: 24);
  $dup = q('SELECT id FROM leads WHERE mobile = ? AND created_at > NOW() - INTERVAL ? HOUR ORDER BY id DESC LIMIT 1', [$mobile, $hours])->fetchColumn();
  if ($dup) {
    q('INSERT INTO lead_interactions (lead_id, type, summary) VALUES (?, "system", ?)', [$dup, 'Repeat enquiry received from ' . $source]);
    out(['id' => (int) $dup, 'duplicate' => true]);
  }
  q('INSERT INTO leads (full_name, mobile, email, source, topic, qualification, study_mode, course_interest, message, consent, consent_text, consent_at, page_url, ip, user_agent) VALUES (?,?,?,?,?,?,?,?,?,1,?,NOW(),?,?,?)', [
    $name, $mobile, $email, $source, $topic, str($b['qualification'] ?? null, 80), str($b['study_mode'] ?? null, 40), str($b['course_interest'] ?? null, 120),
    str($b['message'] ?? null, 2000), str($b['consent_text'] ?? null, 500) ?? 'consent', str($b['page_url'] ?? null, 500), inet_pton($ip) ?: null, str($_SERVER['HTTP_USER_AGENT'] ?? null, 300),
  ]);
  $id = (int) db()->lastInsertId();
  q('INSERT INTO lead_interactions (lead_id, type, summary) VALUES (?, "system", "Enquiry received")', [$id]);
  out(['id' => $id, 'duplicate' => false], 201);
}

/* ---------- AUTH ---------- */
if ($seg[0] === 'auth') {
  $act = $seg[1] ?? '';
  if ($act === 'login' && $method === 'POST') {
    rate_limit("login:$ip", 8, 900);
    $b = body();
    $u = q('SELECT * FROM admin_users WHERE email = ? AND is_active = 1', [str($b['email'] ?? null, 190)])->fetch();
    if (!$u || !password_verify((string) ($b['password'] ?? ''), $u['password_hash'])) fail(401, 'Incorrect email or password.');
    session_regenerate_id(true);
    $_SESSION['uid'] = (int) $u['id'];
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
    out(['user' => ['id' => (int) $u['id'], 'name' => $u['name'], 'email' => $u['email'], 'role' => $u['role']], 'csrf_token' => $_SESSION['csrf']]);
  }
  if ($act === 'me' && $method === 'GET') { $u = require_admin(); $u['id'] = (int) $u['id']; out(['user' => $u, 'csrf_token' => $_SESSION['csrf']]); }
  if ($act === 'logout' && $method === 'POST') { require_admin(); $_SESSION = []; session_destroy(); out(null); }
  fail(404, 'Not found');
}

/* ---------- ADMIN ---------- */
if ($seg[0] === 'admin') {
  $me = require_admin();
  require __DIR__ . '/admin.php';
}

fail(404, 'Not found');
