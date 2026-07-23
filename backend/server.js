const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send('ScoutConnect Backend API is running...');
});

// TODO: User Signup Route (CRUD - Create)
app.post('/api/signup', (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  
  const query = 'INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)';
  
  db.query(query, [firstName, lastName, email, password, role], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error or email already exists.' });
    }
    res.status(201).json({ message: 'User registered successfully!', userId: result.insertId });
  });
});
// User Login Route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';

  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error during login.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    res.status(200).json({ 
      message: 'Login successful!', 
      user: {
        id: results[0].id,
        firstName: results[0].first_name,
        lastName: results[0].last_name,
        email: results[0].email,
        role: results[0].role
      } 
    });
  });
});

// 1. READ: Get all events
app.get('/api/events', (req, res) => {
  db.query('SELECT * FROM events', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch events.' });
    }
    res.status(200).json(results);
  });
});

// 2. CREATE: Add a new event
app.post('/api/events', (req, res) => {
  const { title, description, eventDate, location } = req.body;
  const query = 'INSERT INTO events (title, description, event_date, location) VALUES (?, ?, ?, ?)';

  db.query(query, [title, description, eventDate, location], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create event.' });
    }
    res.status(201).json({ message: 'Event created successfully!', eventId: result.insertId });
  });
});

// 3. DELETE: Remove an event
app.delete('/api/events/:id', (req, res) => {
  const eventId = req.params.id;
  db.query('DELETE FROM events WHERE id = ?', [eventId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete event.' });
    }
    res.status(200).json({ message: 'Event deleted successfully!' });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});