const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const { verifyToken, requireRole, JWT_SECRET } = require('../middleware/auth');

// ==========================================
// 1. GET ALL EVENTS (Available to guests & logged-in users)
// ==========================================
router.get('/', (req, res) => {
  let userId = null;
  const authHeader = req.headers['authorization'];
  
  // If a token is provided, verify it to see if the user is registered
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.id;
    } catch (err) {
      // Ignore invalid/expired tokens here; treat them as guest users
    }
  }

  const query = `
    SELECT 
      e.id, 
      e.title, 
      e.description, 
      e.location, 
      e.event_date, 
      e.max_capacity,
      COUNT(er.id) AS registered_count,
      MAX(CASE WHEN er.scout_id = ? THEN 1 ELSE 0 END) AS is_user_registered
    FROM events e
    LEFT JOIN event_registrations er ON e.id = er.event_id
    GROUP BY e.id
    ORDER BY e.event_date ASC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch events.' });
    res.status(200).json(results);
  });
});

// ==========================================
// 2. CREATE EVENT (Leaders and Admins only)
// ==========================================
router.post('/', verifyToken, requireRole(['leader', 'admin']), (req, res) => {
  const { title, description, location, eventDate, maxCapacity } = req.body;
  const createdBy = req.user.id;

  if (!title || !location || !eventDate || !maxCapacity) {
    return res.status(400).json({ error: 'Title, location, date, and capacity are required.' });
  }

  const query = `
    INSERT INTO events (title, description, location, event_date, max_capacity, created_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [title, description, location, eventDate, maxCapacity, createdBy], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to create event.' });
    res.status(201).json({ message: 'Event created successfully!', eventId: result.insertId });
  });
});

// ==========================================
// 3. REGISTER FOR AN EVENT (Scouts)
// ==========================================
router.post('/:id/register', verifyToken, (req, res) => {
  const eventId = req.params.id;
  const scoutId = req.user.id;

  // Check event capacity
  const capacityQuery = `
    SELECT 
      e.max_capacity, 
      COUNT(er.id) AS registered_count 
    FROM events e
    LEFT JOIN event_registrations er ON e.id = er.event_id
    WHERE e.id = ?
    GROUP BY e.id
  `;

  db.query(capacityQuery, [eventId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database check failed.' });
    if (results.length === 0) return res.status(404).json({ error: 'Event not found.' });

    const { max_capacity, registered_count } = results[0];

    if (registered_count >= max_capacity) {
      return res.status(400).json({ error: 'This event is full!' });
    }

    const registerQuery = 'INSERT INTO event_registrations (event_id, scout_id) VALUES (?, ?)';
    db.query(registerQuery, [eventId, scoutId], (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'You are already registered for this event.' });
        }
        return res.status(500).json({ error: 'Failed to register for event.' });
      }
      res.status(200).json({ message: 'Successfully registered for event!' });
    });
  });
});

// ==========================================
// 4. CANCEL REGISTRATION
// ==========================================
router.delete('/:id/register', verifyToken, (req, res) => {
  const eventId = req.params.id;
  const scoutId = req.user.id;

  const query = 'DELETE FROM event_registrations WHERE event_id = ? AND scout_id = ?';
  db.query(query, [eventId, scoutId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to cancel registration.' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Registration record not found.' });
    }
    res.status(200).json({ message: 'Registration cancelled.' });
  });
});

// ==========================================
// 5. VIEW EVENT ATTENDEES (Leaders & Admins)
// ==========================================
router.get('/:id/attendees', verifyToken, requireRole(['leader', 'admin']), (req, res) => {
  const eventId = req.params.id;

  const query = `
    SELECT u.id, u.first_name, u.last_name, u.email, u.phonenumber, er.registered_at
    FROM event_registrations er
    JOIN users u ON er.scout_id = u.id
    WHERE er.event_id = ?
    ORDER BY er.registered_at ASC
  `;

  db.query(query, [eventId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch attendee list.' });
    res.status(200).json(results);
  });
});

module.exports = router;