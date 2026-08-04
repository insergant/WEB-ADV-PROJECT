const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('../config/db');

const CODE_TTL_MINUTES = 15;

// Build a mailer only if SMTP is configured. Otherwise we run in "dev mode"
// and print the reset code to the server console instead of emailing it.
function getTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

// ==========================================
// POST /api/forgot-password/request
// Body: { email }
// Always responds 200 (don't reveal whether the email exists — anti-enumeration).
// ==========================================
router.post('/request', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

  const genericOk = () =>
    res.status(200).json({ message: 'If that email is registered, a reset code has been sent.' });

  db.query('SELECT id FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error.' });
    if (results.length === 0) return genericOk(); // silently succeed

    // 6-digit code, stored hashed with an expiry.
    const code = ('' + crypto.randomInt(0, 1000000)).padStart(6, '0');
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000);

    // Invalidate any previous codes for this email, then insert the new one.
    db.query('DELETE FROM password_resets WHERE email = ?', [email], (delErr) => {
      if (delErr) return res.status(500).json({ error: 'Database error.' });

      db.query(
        'INSERT INTO password_resets (email, code_hash, expires_at) VALUES (?, ?, ?)',
        [email, codeHash, expiresAt],
        async (insErr) => {
          if (insErr) return res.status(500).json({ error: 'Database error.' });

          const transport = getTransport();
          if (!transport) {
            // DEV MODE: no SMTP configured — log the code so you can test locally.
            console.log(`\n🔐 [DEV] Password reset code for ${email}: ${code} (valid ${CODE_TTL_MINUTES} min)\n`);
            return genericOk();
          }

          try {
            await transport.sendMail({
              from: process.env.SMTP_FROM || process.env.SMTP_USER,
              to: email,
              subject: 'Your ScoutConnect password reset code',
              text: `Your ScoutConnect password reset code is ${code}. It expires in ${CODE_TTL_MINUTES} minutes.`,
            });
          } catch (mailErr) {
            console.error('Failed to send reset email:', mailErr.message);
            // Still respond generically; the row exists and can be retried.
          }
          return genericOk();
        }
      );
    });
  });
});

// ==========================================
// POST /api/forgot-password/verify
// Body: { email, code, newPassword }
// ==========================================
router.post('/verify', (req, res) => {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    return res.status(400).json({ error: 'Email, code, and new password are required.' });
  }
  if (newPassword.length < 8 || !/\d/.test(newPassword)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long and contain at least one number.' });
  }

  db.query(
    'SELECT id, code_hash, expires_at FROM password_resets WHERE email = ? ORDER BY id DESC LIMIT 1',
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error.' });
      if (results.length === 0) {
        return res.status(400).json({ error: 'Invalid or expired reset code.' });
      }

      const row = results[0];
      if (new Date(row.expires_at).getTime() < Date.now()) {
        db.query('DELETE FROM password_resets WHERE id = ?', [row.id]);
        return res.status(400).json({ error: 'Reset code has expired. Please request a new one.' });
      }

      const codeMatches = await bcrypt.compare(String(code), row.code_hash);
      if (!codeMatches) {
        return res.status(400).json({ error: 'Invalid or expired reset code.' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email], (updErr, result) => {
        if (updErr) return res.status(500).json({ error: 'Failed to update password.' });
        if (result.affectedRows === 0) return res.status(400).json({ error: 'Account not found.' });

        // Burn the code so it can't be reused.
        db.query('DELETE FROM password_resets WHERE email = ?', [email]);
        res.status(200).json({ message: 'Password updated successfully.' });
      });
    }
  );
});

module.exports = router;
