-- College On Call — MySQL schema (MySQL 8 / MariaDB 10.4+, XAMPP). Import via phpMyAdmin.
-- Contains NO sample institutions, courses or leads. Add only verified data.
CREATE DATABASE IF NOT EXISTS collegeoncall CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE collegeoncall;

CREATE TABLE admin_users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','counsellor') NOT NULL DEFAULT 'counsellor',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE institutions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(160) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  type ENUM('university','college') NOT NULL,
  category ENUM('university','b_school','engineering','other') NOT NULL,
  ownership ENUM('private','government','deemed','autonomous','other') NOT NULL,
  is_government TINYINT(1) NOT NULL DEFAULT 0,
  city VARCHAR(100), state VARCHAR(100),
  modes SET('online','regular') NOT NULL,
  approvals JSON NULL,                      -- verified approvals only
  is_partner_verified TINYINT(1) NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 0,
  featured TINYINT(1) NOT NULL DEFAULT 0,
  logo_url VARCHAR(500), website VARCHAR(500),
  description TEXT, eligibility_summary TEXT, admission_process TEXT,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_inst_cat (category), INDEX idx_inst_gov (is_government), INDEX idx_inst_pub (is_published)
) ENGINE=InnoDB;

CREATE TABLE courses (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(160) NOT NULL UNIQUE,
  institution_id INT UNSIGNED NOT NULL,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(80) NOT NULL,
  level ENUM('ug','pg','diploma','certificate','doctorate') NOT NULL,
  mode ENUM('online','regular') NOT NULL,
  duration VARCHAR(60), eligibility TEXT, description TEXT,
  -- Fee columns: API must return fee ONLY when mode='online' AND fee_verified=1 AND fee_valid_until >= CURDATE()
  fee_amount DECIMAL(12,2) NULL, fee_currency CHAR(3) DEFAULT 'INR',
  fee_period ENUM('total','year','semester') NULL,
  fee_verified TINYINT(1) NOT NULL DEFAULT 0, fee_valid_until DATE NULL,
  is_published TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE,
  INDEX idx_course_mode (mode), INDEX idx_course_inst (institution_id)
) ENGINE=InnoDB;

CREATE TABLE articles (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(160) NOT NULL UNIQUE,
  title VARCHAR(250) NOT NULL, excerpt TEXT, content MEDIUMTEXT NOT NULL,
  category ENUM('online-degree-guides','university-comparisons','admission-updates','career-guides','entrance-exams') NOT NULL,
  exam VARCHAR(40) NULL, source_url VARCHAR(500) NULL, last_verified_at DATE NULL,
  author VARCHAR(120) NULL, is_published TINYINT(1) NOT NULL DEFAULT 0,
  published_at DATETIME NULL, updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_art_cat (category, published_at), INDEX idx_art_exam (exam)
) ENGINE=InnoDB;

CREATE TABLE leads (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  mobile CHAR(10) NOT NULL,
  email VARCHAR(190) NULL,
  source ENUM('home_enquiry','contact') NOT NULL,
  topic VARCHAR(60), qualification VARCHAR(80), study_mode VARCHAR(40), course_interest VARCHAR(120),
  message TEXT,
  status ENUM('new','contacted','counselling_done','converted','not_interested') NOT NULL DEFAULT 'new',
  assigned_to INT UNSIGNED NULL,
  consent TINYINT(1) NOT NULL, consent_text VARCHAR(500) NOT NULL, consent_at DATETIME NOT NULL,
  page_url VARCHAR(500), ip VARBINARY(16), user_agent VARCHAR(300),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_to) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_leads_mobile (mobile, created_at), INDEX idx_leads_status (status, created_at), INDEX idx_leads_created (created_at)
) ENGINE=InnoDB;

CREATE TABLE lead_notes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  lead_id INT UNSIGNED NOT NULL, author_id INT UNSIGNED NULL, body TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX (lead_id, created_at)
) ENGINE=InnoDB;

CREATE TABLE lead_interactions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  lead_id INT UNSIGNED NOT NULL, actor_id INT UNSIGNED NULL,
  type ENUM('status_change','note','followup','call','system') NOT NULL, summary VARCHAR(500) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
  INDEX (lead_id, created_at)
) ENGINE=InnoDB;

CREATE TABLE followups (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  lead_id INT UNSIGNED NOT NULL, created_by INT UNSIGNED NULL,
  due_at DATETIME NOT NULL, note VARCHAR(500),
  status ENUM('pending','done','cancelled') NOT NULL DEFAULT 'pending',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
  INDEX idx_fu_due (status, due_at)
) ENGINE=InnoDB;

CREATE TABLE rate_limits (
  bucket VARCHAR(120) NOT NULL, hit_at DATETIME NOT NULL, INDEX (bucket, hit_at)
) ENGINE=InnoDB;

CREATE TABLE settings (
  k VARCHAR(80) PRIMARY KEY, v VARCHAR(500) NOT NULL
) ENGINE=InnoDB;
INSERT INTO settings (k, v) VALUES
 ('whatsapp_number','917471166366'), ('contact_phone','+91 7471166366'),
 ('contact_email','info@collegeoncall.com'), ('enquiry_duplicate_window_hours','24');

-- Create your first admin (run in PHP: echo password_hash('YourStrongPassword', PASSWORD_DEFAULT);)
-- INSERT INTO admin_users (name,email,password_hash,role) VALUES ('Admin','you@collegeoncall.com','<hash>','admin');
