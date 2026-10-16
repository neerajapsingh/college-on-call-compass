<?php
// Included from index.php after require_admin(). $seg, $method, $me available.
declare(strict_types=1);

$res = $seg[1] ?? ''; $id = isset($seg[2]) && ctype_digit($seg[2]) ? (int) $seg[2] : null; $sub = $seg[3] ?? null;
$STATUSES = ['new', 'contacted', 'counselling_done', 'converted', 'not_interested'];
$LABEL = ['new' => 'New Lead', 'contacted' => 'Contacted', 'counselling_done' => 'Counselling Done', 'converted' => 'Converted', 'not_interested' => 'Not Interested'];

function lead_out(array $r): array { $r['id'] = (int) $r['id']; unset($r['ip'], $r['user_agent'], $r['assigned_to']); return $r; }
const LEAD_SELECT = 'SELECT l.*, u.name assigned_to_name, (SELECT MIN(due_at) FROM followups f WHERE f.lead_id = l.id AND f.status = "pending") next_followup_at FROM leads l LEFT JOIN admin_users u ON u.id = l.assigned_to';

/* Leads */
if ($res === 'leads') {
  if ($method === 'GET' && !$id) {
    [$page, $per, $off] = page_params(100);
    $w = ['1=1']; $p = [];
    if ($v = str($_GET['q'] ?? null, 100)) { $w[] = '(l.full_name LIKE ? OR l.mobile LIKE ? OR l.email LIKE ?)'; array_push($p, "%$v%", "%$v%", "%$v%"); }
    if (in_array($_GET['status'] ?? '', $STATUSES, true)) { $w[] = 'l.status = ?'; $p[] = $_GET['status']; }
    if (in_array($_GET['source'] ?? '', ['home_enquiry', 'contact'], true)) { $w[] = 'l.source = ?'; $p[] = $_GET['source']; }
    if ($v = str($_GET['from'] ?? null, 10)) { $w[] = 'l.created_at >= ?'; $p[] = $v; }
    if ($v = str($_GET['to'] ?? null, 10)) { $w[] = 'l.created_at < ? + INTERVAL 1 DAY'; $p[] = $v; }
    $where = implode(' AND ', $w);
    $total = (int) q("SELECT COUNT(*) FROM leads l WHERE $where", $p)->fetchColumn();
    $rows = q(LEAD_SELECT . " WHERE $where ORDER BY l.created_at DESC LIMIT $per OFFSET $off", $p)->fetchAll();
    out(array_map('lead_out', $rows), 200, meta($page, $per, $total));
  }
  if ($method === 'GET' && $id) {
    $l = q(LEAD_SELECT . ' WHERE l.id = ?', [$id])->fetch(); if (!$l) fail(404, 'Lead not found.');
    out([
      'lead' => lead_out($l),
      'notes' => q('SELECT n.id, n.body, u.name author_name, n.created_at FROM lead_notes n LEFT JOIN admin_users u ON u.id = n.author_id WHERE lead_id = ? ORDER BY n.created_at DESC', [$id])->fetchAll(),
      'interactions' => q('SELECT i.id, i.type, i.summary, u.name actor_name, i.created_at FROM lead_interactions i LEFT JOIN admin_users u ON u.id = i.actor_id WHERE lead_id = ? ORDER BY i.created_at DESC', [$id])->fetchAll(),
      'followups' => q('SELECT f.*, ? lead_name, ? lead_mobile FROM followups f WHERE lead_id = ? ORDER BY due_at DESC', [$l['full_name'], $l['mobile'], $id])->fetchAll(),
    ]);
  }
  if ($method === 'PATCH' && $id && $sub === 'status') {
    $s = body()['status'] ?? ''; if (!in_array($s, $STATUSES, true)) fail(422, 'Invalid status.');
    $old = q('SELECT status FROM leads WHERE id = ?', [$id])->fetchColumn(); if ($old === false) fail(404, 'Lead not found.');
    q('UPDATE leads SET status = ? WHERE id = ?', [$s, $id]);
    q('INSERT INTO lead_interactions (lead_id, actor_id, type, summary) VALUES (?,?,"status_change",?)', [$id, $me['id'], "Status: {$LABEL[$old]} → {$LABEL[$s]}"]);
    out(['id' => $id, 'status' => $s]);
  }
  if ($method === 'POST' && $id && $sub === 'notes') {
    $txt = str(body()['body'] ?? null, 2000); if (!$txt) fail(422, 'Note cannot be empty.');
    q('INSERT INTO lead_notes (lead_id, author_id, body) VALUES (?,?,?)', [$id, $me['id'], $txt]);
    $nid = (int) db()->lastInsertId();
    q('INSERT INTO lead_interactions (lead_id, actor_id, type, summary) VALUES (?,?,"note","Note added")', [$id, $me['id']]);
    out(['id' => $nid], 201);
  }
}

/* Follow-ups */
if ($res === 'followups') {
  if ($method === 'GET') {
    [$page, $per, $off] = page_params(100);
    $view = $_GET['view'] ?? 'upcoming';
    $w = match ($view) {
      'overdue' => 'f.status = "pending" AND f.due_at < NOW()',
      'today' => 'f.status = "pending" AND DATE(f.due_at) = CURDATE()',
      'completed' => 'f.status = "done"',
      default => 'f.status = "pending" AND f.due_at >= NOW()',
    };
    $total = (int) q("SELECT COUNT(*) FROM followups f WHERE $w")->fetchColumn();
    $order = $view === 'completed' ? 'DESC' : 'ASC';
    $rows = q("SELECT f.*, l.full_name lead_name, l.mobile lead_mobile FROM followups f JOIN leads l ON l.id = f.lead_id WHERE $w ORDER BY f.due_at $order LIMIT $per OFFSET $off")->fetchAll();
    out($rows, 200, meta($page, $per, $total));
  }
  if ($method === 'POST' && !$id) {
    $b = body(); $lead = (int) ($b['lead_id'] ?? 0); $due = strtotime((string) ($b['due_at'] ?? ''));
    if (!$lead || !$due) fail(422, 'Lead and a valid due date are required.');
    q('INSERT INTO followups (lead_id, created_by, due_at, note) VALUES (?,?,?,?)', [$lead, $me['id'], date('Y-m-d H:i:s', $due), str($b['note'] ?? null, 500)]);
    $fid = (int) db()->lastInsertId();
    q('INSERT INTO lead_interactions (lead_id, actor_id, type, summary) VALUES (?,?,"followup",?)', [$lead, $me['id'], 'Follow-up scheduled for ' . date('d M Y H:i', $due)]);
    out(['id' => $fid], 201);
  }
  if ($method === 'PATCH' && $id) {
    $s = body()['status'] ?? ''; if (!in_array($s, ['pending', 'done', 'cancelled'], true)) fail(422, 'Invalid status.');
    $f = q('SELECT lead_id FROM followups WHERE id = ?', [$id])->fetch(); if (!$f) fail(404, 'Follow-up not found.');
    q('UPDATE followups SET status = ? WHERE id = ?', [$s, $id]);
    q('INSERT INTO lead_interactions (lead_id, actor_id, type, summary) VALUES (?,?,"followup",?)', [$f['lead_id'], $me['id'], "Follow-up marked $s"]);
    out(['id' => $id]);
  }
}

/* Reports */
if ($res === 'reports' && $method === 'GET') {
  if (($seg[2] ?? '') === 'dashboard') {
    $by = array_fill_keys($STATUSES, 0);
    foreach (q('SELECT status, COUNT(*) c FROM leads GROUP BY status')->fetchAll() as $r) $by[$r['status']] = (int) $r['c'];
    out([
      'total_leads' => array_sum($by), 'by_status' => $by,
      'leads_today' => (int) q('SELECT COUNT(*) FROM leads WHERE DATE(created_at) = CURDATE()')->fetchColumn(),
      'followups_due_today' => (int) q('SELECT COUNT(*) FROM followups WHERE status = "pending" AND DATE(due_at) = CURDATE()')->fetchColumn(),
      'followups_overdue' => (int) q('SELECT COUNT(*) FROM followups WHERE status = "pending" AND due_at < NOW()')->fetchColumn(),
      'recent_leads' => array_map('lead_out', q(LEAD_SELECT . ' ORDER BY l.created_at DESC LIMIT 8')->fetchAll()),
    ]);
  }
  $from = str($_GET['from'] ?? null, 10) ?? date('Y-m-d', strtotime('-30 days'));
  $to = str($_GET['to'] ?? null, 10) ?? date('Y-m-d');
  $rng = 'created_at >= ? AND created_at < ? + INTERVAL 1 DAY';
  $grp = fn(string $col) => array_map(fn($r) => ['label' => $r['label'] ?? 'Not specified', 'count' => (int) $r['count']], q("SELECT $col label, COUNT(*) count FROM leads WHERE $rng GROUP BY $col ORDER BY count DESC LIMIT 20", [$from, $to])->fetchAll());
  out([
    'by_source' => $grp('source'), 'by_course' => $grp('course_interest'), 'by_mode' => $grp('study_mode'),
    'funnel' => array_map(fn($s) => ['status' => $s, 'count' => (int) q("SELECT COUNT(*) FROM leads WHERE status = ? AND $rng", [$s, $from, $to])->fetchColumn()], $STATUSES),
    'daily' => q("SELECT DATE(created_at) date, COUNT(*) count FROM leads WHERE $rng GROUP BY DATE(created_at) ORDER BY date", [$from, $to])->fetchAll(),
  ]);
}

/* Institutions & courses (admin view includes unpublished rows) */
if ($res === 'universities') {
  if ($method === 'GET') {
    [$page, $per, $off] = page_params(100);
    $w = ['1=1']; $p = [];
    if (in_array($_GET['type'] ?? '', ['university', 'college'], true)) { $w[] = 'type = ?'; $p[] = $_GET['type']; }
    if ($v = str($_GET['q'] ?? null, 100)) { $w[] = '(name LIKE ? OR city LIKE ?)'; array_push($p, "%$v%", "%$v%"); }
    $where = implode(' AND ', $w);
    $total = (int) q("SELECT COUNT(*) FROM institutions WHERE $where", $p)->fetchColumn();
    out(array_map('inst_row', q("SELECT * FROM institutions WHERE $where ORDER BY name LIMIT $per OFFSET $off", $p)->fetchAll()), 200, meta($page, $per, $total));
  }
  if ($method === 'PATCH' && $id) {
    if ($me['role'] !== 'admin') fail(403, "You don't have permission to do this.");
    $allowed = ['is_partner_verified', 'is_published', 'featured']; $b = body(); $set = []; $p = [];
    foreach ($allowed as $k) if (array_key_exists($k, $b)) { $set[] = "$k = ?"; $p[] = $b[$k] ? 1 : 0; }
    if (!$set) fail(422, 'Nothing to update.');
    $p[] = $id; q('UPDATE institutions SET ' . implode(', ', $set) . ' WHERE id = ?', $p);
    out(['id' => $id]);
  }
}
if ($res === 'courses' && $method === 'GET') {
  [$page, $per, $off] = page_params(100);
  $w = '1=1'; $p = [];
  if ($v = str($_GET['q'] ?? null, 100)) { $w = 'c.name LIKE ?'; $p[] = "%$v%"; }
  $total = (int) q("SELECT COUNT(*) FROM courses c WHERE $w", $p)->fetchColumn();
  out(array_map(fn($r) => course_row($r, true), q(COURSE_SELECT . " WHERE $w ORDER BY c.name LIMIT $per OFFSET $off", $p)->fetchAll()), 200, meta($page, $per, $total));
}

/* Settings */
if ($res === 'settings') {
  $keys = ['whatsapp_number', 'contact_phone', 'contact_email', 'enquiry_duplicate_window_hours'];
  if ($method === 'GET') {
    $s = []; foreach (q('SELECT k, v FROM settings')->fetchAll() as $r) $s[$r['k']] = $r['v'];
    $s['enquiry_duplicate_window_hours'] = (int) ($s['enquiry_duplicate_window_hours'] ?? 24);
    out($s);
  }
  if ($method === 'PUT') {
    if ($me['role'] !== 'admin') fail(403, "You don't have permission to do this.");
    $b = body();
    if (isset($b['contact_email']) && !filter_var($b['contact_email'], FILTER_VALIDATE_EMAIL)) fail(422, 'Invalid email.', ['contact_email' => 'Invalid email']);
    foreach ($keys as $k) if (isset($b[$k])) q('REPLACE INTO settings (k, v) VALUES (?, ?)', [$k, mb_substr((string) $b[$k], 0, 500)]);
    out(null);
  }
}

fail(404, 'Not found');
