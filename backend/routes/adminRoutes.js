const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');

router.use(verifyToken, requireRole(['admin']));

// Get All Users
router.get('/users', (req, res) => {
  const query = 'SELECT id, first_name, last_name, email, phonenumber, role FROM users';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database query failed.' });
    res.status(200).json(results);
  });
});

// Create User Account (Leader, Scout, Admin, Parent)
router.post('/create-user', async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password, role } = req.body;

  if (!firstName || !lastName || !email || !phoneNumber || !password || !role) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const checkEmail = 'SELECT id FROM users WHERE email = ?';
  db.query(checkEmail, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error.' });
    if (results.length > 0) return res.status(400).json({ error: 'User with this email already exists.' });

    try {
      // Hash password with 10 salt rounds
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertQuery = 'INSERT INTO users (first_name, last_name, email, phonenumber, password, role) VALUES (?, ?, ?, ?, ?, ?)';
      db.query(insertQuery, [firstName, lastName, email, phoneNumber, hashedPassword, role], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to create user account.' });
        res.status(201).json({ message: 'User account created successfully!' });
      });
    } catch (hashErr) {
      res.status(500).json({ error: 'Password security hashing failed.' });
    }
  });
});

// Delete User Account
router.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  const deleteQuery = 'DELETE FROM users WHERE id = ?';
  db.query(deleteQuery, [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to delete user.' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found.' });

    res.status(200).json({ message: 'User deleted successfully.' });
  });
});

module.exports = router;