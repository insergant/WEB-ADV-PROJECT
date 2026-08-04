const express = require('express');
const router = express.Router();
const db = require('../config/db');

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ==========================================
// POST /api/contact  — store a contact message
// (Frontend: src/Pages/Contact.js)
// ==========================================
router.post('/', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are all required.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }
  if (message.trim().length < 5) {
    return res.status(400).json({ error: 'Your message is too short.' });
  }

  const query = 'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)';
  db.query(query, [name.trim(), email.trim(), message.trim()], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to send your message. Please try again later.' });
    res.status(201).json({ message: 'Your message has been sent. We will get back to you soon!' });
  });
});

module.exports = router;
