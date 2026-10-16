<?php
// Copy to config.php and edit. Never commit config.php.
return [
  'db_dsn'  => 'mysql:host=127.0.0.1;dbname=collegeoncall;charset=utf8mb4',
  'db_user' => 'root',
  'db_pass' => '',
  // Exact origins allowed to call the API with cookies (the built site).
  'allowed_origins' => ['http://localhost', 'http://localhost:8080'],
  'cookie_secure' => false, // set true when served over HTTPS
  'base_path' => '/collegeoncall-api', // URL prefix where this folder is served; '' if at web root
];
