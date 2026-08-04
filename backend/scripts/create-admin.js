/**
 * One-shot account seeder for privileged roles (admin / leader).
 *
 * WHY THIS EXISTS:
 * Public registration is whitelisted to scout/parent, and creating an admin
 * through the API itself requires an existing admin token — so there is no way
 * to create the FIRST admin from inside the app. Run this once to seed one.
 *
 * The password is bcrypt-hashed with the same cost (10) and inserted into the
 * same columns as /api/register, so it verifies against /api/login unchanged.
 *
 * USAGE (from the backend/ folder):
 *   node scripts/create-admin.js --email admin@scout.org --password "ChangeMe#2026" --first Aya --last Admin --role admin
 *
 * Flags:
 *   --email     (required)
 *   --password  (required, min 8 chars)
 *   --first     (required)  first name
 *   --last      (required)  last name
 *   --role      admin | leader | scout | parent   (default: admin)
 *   --phone     optional phone number (default: empty)
 */

// Load backend/.env if dotenv is available; otherwise db.js falls back to
// its built-in local XAMPP defaults, which is fine for local runs.
try {
  require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
} catch (_) { /* dotenv optional */ }

const bcrypt = require('bcryptjs');
const db = require('../config/db');

// ---- tiny --flag value parser -------------------------------------------
function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
      out[key] = val;
    }
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));

const email = (args.email || '').trim().toLowerCase();
const password = args.password || '';
const firstName = (args.first || '').trim();
const lastName = (args.last || '').trim();
const phone = (args.phone || '').trim();
const role = (args.role || 'admin').trim().toLowerCase();

const VALID_ROLES = ['admin', 'leader', 'scout', 'parent'];

// ---- validation ----------------------------------------------------------
const problems = [];
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) problems.push('valid --email is required');
if (password.length < 8) problems.push('--password must be at least 8 characters');
if (!firstName) problems.push('--first (first name) is required');
if (!lastName) problems.push('--last (last name) is required');
if (!VALID_ROLES.includes(role)) problems.push(`--role must be one of: ${VALID_ROLES.join(', ')}`);

function finish(code) {
  db.end(() => process.exit(code));
}

if (problems.length) {
  console.error('✖ Cannot create account:\n  - ' + problems.join('\n  - '));
  console.error('\nExample:\n  node scripts/create-admin.js --email admin@scout.org --password "ChangeMe#2026" --first Aya --last Admin --role admin');
  finish(1);
} else {
  db.query('SELECT id, role FROM users WHERE email = ?', [email], async (err, rows) => {
    if (err) {
      console.error('✖ Database error (is MySQL running and .env correct?):', err.message);
      return finish(1);
    }
    if (rows.length > 0) {
      console.error(`✖ A user with email "${email}" already exists (id ${rows[0].id}, role "${rows[0].role}").`);
      console.error('  To promote that existing account instead, run this SQL in phpMyAdmin:');
      console.error(`    UPDATE users SET role = '${role}' WHERE email = '${email}';`);
      return finish(1);
    }
    try {
      const hashed = await bcrypt.hash(password, 10);
      const sql = 'INSERT INTO users (first_name, last_name, email, phonenumber, password, role) VALUES (?, ?, ?, ?, ?, ?)';
      db.query(sql, [firstName, lastName, email, phone, hashed, role], (insErr, result) => {
        if (insErr) {
          console.error('✖ Insert failed:', insErr.message);
          return finish(1);
        }
        console.log('✅ Account created:');
        console.log(`   id:    ${result.insertId}`);
        console.log(`   name:  ${firstName} ${lastName}`);
        console.log(`   email: ${email}`);
        console.log(`   role:  ${role}`);
        console.log(`\nLog in at /login with that email + password. If role is admin/leader,`);
        console.log(`the matching dashboard link will now appear in the navbar.`);
        finish(0);
      });
    } catch (hashErr) {
      console.error('✖ Failed to hash password:', hashErr.message);
      finish(1);
    }
  });
}