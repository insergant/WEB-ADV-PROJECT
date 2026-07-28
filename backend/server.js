const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- ROUTES ---

// Health Check
app.get('/', (req, res) => {
  res.send('ScoutConnect Backend API is running...');
});

// 1. REGISTER: Create a new user
app.post('/api/signup', (req, res) => {
  const { firstName, lastName, email, phoneNumber, password, role } = req.body;
  
  // Validation checks
  if (!phoneNumber || phoneNumber.length !== 8) {
    return res.status(400).json({ error: 'Phone number must be exactly 8 digits.' });
  }
  if (password.length < 8 || !/\d/.test(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long and include at least one number.' });
  }

  // Assuming DB column is exactly 'phonenumber' (no underscore) based on your query
  const query = 'INSERT INTO users (first_name, last_name, email, phonenumber, password, role) VALUES (?, ?, ?, ?, ?, ?)';
  
  db.query(query, [firstName, lastName, email, phoneNumber, password, role], (err, result) => {
    if (err) {
      console.error(err);
      // Smart Error Checking: Detect if the email is already in the database
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }
      return res.status(500).json({ error: 'Internal database error.' });
    }
    res.status(201).json({ message: 'User registered successfully!', userId: result.insertId });
  });
});

// 2. LOGIN: Authenticate standard user
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

    const user = results[0];
    res.status(200).json({ 
      message: 'Login successful!', 
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phoneNumber: user.phonenumber, // Fixed inconsistency here
        role: user.role
      } 
    });
  });
});

// 3. GOOGLE LOGIN: Authenticate or Upsert Google user
app.post('/api/google-login', (req, res) => {
  const { firstName, lastName, email } = req.body;
  const dummyPassword = 'GOOGLE_OAUTH_LOGIN';

  const checkQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkQuery, [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error during Google login.' });
    }

    if (results.length > 0) {
      // User exists, return user session data
      const user = results[0];
      return res.status(200).json({
        message: 'Google login successful!',
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          phoneNumber: user.phonenumber, // Fixed inconsistency here
          role: user.role
        }
      });
    } 
    
    // User does not exist, create them
    const insertQuery = 'INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)';
    db.query(insertQuery, [firstName, lastName, email, dummyPassword, 'scout'], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to register Google user.' });
      }
      res.status(201).json({
        message: 'Google user registered successfully!',
        user: {
          id: result.insertId,
          firstName,
          lastName,
          email,
          phoneNumber: null, // Google doesn't provide this, so we default to null
          role: 'scout'
        }
      });
    });
  });
});

// --- EVENT ROUTES ---

// 4. READ: Get all events
app.get('/api/events', (req, res) => {
  db.query('SELECT * FROM events', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch events.' });
    }
    res.status(200).json(results);
  });
});

// 5. CREATE: Add a new event
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

// 6. DELETE: Remove an event
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

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});