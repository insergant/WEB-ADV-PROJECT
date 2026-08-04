const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');

router.use(verifyToken, requireRole(['leader', 'admin']));

// Get Scout Roster
router.get('/scouts', (req, res) => {
  const query = "SELECT id, first_name, last_name, email, phonenumber FROM users WHERE role = 'scout'";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch scout roster.' });
    res.status(200).json(results);
  });
});

// Register New Scout
router.post('/create-scout', async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;

  if (!firstName || !lastName || !email || !phoneNumber || !password) {
    return res.status(400).json({ error: 'All fields are required to register a scout.' });
  }

  const checkEmail = 'SELECT id FROM users WHERE email = ?';
  db.query(checkEmail, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database check failed.' });
    if (results.length > 0) return res.status(400).json({ error: 'A scout with this email already exists.' });

    try {
      // Hash password with 10 salt rounds
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertQuery = "INSERT INTO users (first_name, last_name, email, phonenumber, password, role) VALUES (?, ?, ?, ?, ?, 'scout')";
      db.query(insertQuery, [firstName, lastName, email, phoneNumber, hashedPassword], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to create scout account.' });
        res.status(201).json({ message: 'Scout registered successfully!' });
      });
    } catch (hashErr) {
      res.status(500).json({ error: 'Password security hashing failed.' });
    }
  });
});

module.exports = router;