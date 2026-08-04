const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');
// NOTE: Google token verification uses Node's built-in global fetch (Node 18+).
// The old `require('axios')` was removed — axios was never installed, which
// crashed the whole server on startup (Cannot find module 'axios').

// Public self-registration is only allowed for these roles.
// 'leader' / 'admin' are privileged and must be provisioned by an admin
// (see adminRoutes /create-user) — never via public signup.
const PUBLIC_ROLES = ['scout', 'parent'];

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ==========================================
// 1. STANDARD REGISTRATION ROUTE
// ==========================================
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;

  // --- Server-side validation (mirrors the client, but the API can be called directly) ---
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }
  if (phoneNumber && !/^\d{8}$/.test(phoneNumber)) {
    return res.status(400).json({ error: 'Phone number must be exactly 8 digits.' });
  }
  if (password.length < 8 || !/\d/.test(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long and contain at least one number.' });
  }

  // Whitelist the requested role; anything outside PUBLIC_ROLES silently becomes 'scout'.
  const requestedRole = (req.body.role || '').toLowerCase();
  const role = PUBLIC_ROLES.includes(requestedRole) ? requestedRole : 'scout';

  // Check if email already exists
  db.query('SELECT id FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database check failed.' });
    if (results.length > 0) return res.status(400).json({ error: 'Email already exists.' });

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertQuery = "INSERT INTO users (first_name, last_name, email, phonenumber, password, role) VALUES (?, ?, ?, ?, ?, ?)";
      db.query(insertQuery, [firstName, lastName, email, phoneNumber || '', hashedPassword, role], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to register user.' });
        res.status(201).json({ message: 'User registered successfully!' });
      });
    } catch (hashErr) {
      res.status(500).json({ error: 'Password hashing failed.' });
    }
  });
});

// ==========================================
// 2. STANDARD LOGIN ROUTE
// ==========================================
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password.' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database query failed.' });

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = results[0];

    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role
        }
      });
    } catch (compareErr) {
      res.status(500).json({ error: 'Error verifying password.' });
    }
  });
});

// ==========================================
// 3. GOOGLE SSO LOGIN ROUTE
// ==========================================
router.post('/google-login', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'No Google token provided.' });
  }

  try {
    // 1. Verify the access token with Google's userinfo endpoint (built-in fetch).
    const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!googleResponse.ok) {
      return res.status(401).json({ error: 'Invalid or expired Google token.' });
    }

    const googleUser = await googleResponse.json();

    // 2. Look the user up by email.
    db.query('SELECT * FROM users WHERE email = ?', [googleUser.email], async (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error during Google login.' });

      if (results.length > 0) {
        const user = results[0];
        const appToken = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        return res.status(200).json({
          message: 'Google login successful',
          token: appToken,
          user: {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            role: user.role
          }
        });
      }

      // 3. New Google user -> auto-register as a scout with a random password.
      const fakePassword = await bcrypt.hash(Math.random().toString(36).slice(-10), 10);
      const defaultRole = 'scout';
      const firstName = googleUser.given_name || 'Scout';
      const lastName = googleUser.family_name || '';

      const insertQuery = "INSERT INTO users (first_name, last_name, email, phonenumber, password, role) VALUES (?, ?, ?, ?, ?, ?)";
      db.query(insertQuery, [firstName, lastName, googleUser.email, '', fakePassword, defaultRole], (err, insertResult) => {
        if (err) return res.status(500).json({ error: 'Failed to create new user from Google account.' });

        const appToken = jwt.sign(
          { id: insertResult.insertId, email: googleUser.email, role: defaultRole },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        return res.status(200).json({
          message: 'Google registration and login successful',
          token: appToken,
          user: {
            id: insertResult.insertId,
            firstName,
            lastName,
            email: googleUser.email,
            role: defaultRole
          }
        });
      });
    });
  } catch (error) {
    console.error('Backend Google Auth Error:', error.message);
    return res.status(500).json({ error: 'Failed to verify Google user token.' });
  }
});

module.exports = router;
