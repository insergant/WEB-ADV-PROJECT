-- ============================================================
-- Migration 001 — tables required by the new backend routes.
-- Run once in phpMyAdmin (or `mysql`) against the `scout_db` database.
-- Safe to re-run: uses CREATE TABLE IF NOT EXISTS.
-- ============================================================

-- Contact form submissions  (used by routes/contactRoutes.js)
CREATE TABLE IF NOT EXISTS contact_messages (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(150)  NOT NULL,
  email       VARCHAR(190)  NOT NULL,
  message     TEXT          NOT NULL,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Password reset codes  (used by routes/passwordResetRoutes.js)
-- code_hash stores a bcrypt hash of the 6-digit code (never the plaintext).
CREATE TABLE IF NOT EXISTS password_resets (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  email       VARCHAR(190)  NOT NULL,
  code_hash   VARCHAR(255)  NOT NULL,
  expires_at  DATETIME      NOT NULL,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_password_resets_email (email)
);

-- ============================================================
-- Reference only — the tables below are assumed to already exist
-- (they are referenced by the existing auth/admin/leader/event routes).
-- Uncomment to (re)create on a fresh database.
-- ============================================================
-- CREATE TABLE IF NOT EXISTS users (
--   id           INT AUTO_INCREMENT PRIMARY KEY,
--   first_name   VARCHAR(100) NOT NULL,
--   last_name    VARCHAR(100) NOT NULL,
--   email        VARCHAR(190) NOT NULL UNIQUE,
--   phonenumber  VARCHAR(20)  DEFAULT '',
--   password     VARCHAR(255) NOT NULL,
--   role         ENUM('scout','parent','leader','admin') NOT NULL DEFAULT 'scout',
--   created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );
--
-- CREATE TABLE IF NOT EXISTS events (
--   id           INT AUTO_INCREMENT PRIMARY KEY,
--   title        VARCHAR(200) NOT NULL,
--   description  TEXT,
--   location     VARCHAR(200) NOT NULL,
--   event_date   DATETIME     NOT NULL,
--   max_capacity INT          NOT NULL,
--   created_by   INT,
--   created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );
--
-- -- The event registration route relies on this UNIQUE constraint
-- -- (it catches ER_DUP_ENTRY to block double-registration).
-- CREATE TABLE IF NOT EXISTS event_registrations (
--   id            INT AUTO_INCREMENT PRIMARY KEY,
--   event_id      INT NOT NULL,
--   scout_id      INT NOT NULL,
--   registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   UNIQUE KEY uq_event_scout (event_id, scout_id)
-- );
