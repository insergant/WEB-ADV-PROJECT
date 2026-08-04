const mysql = require('mysql2');

// Credentials now come from environment variables (see backend/.env).
// The previous hardcoded values are kept as fallbacks so local XAMPP setups
// keep working with zero changes.
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // Replace via .env if your MySQL has a password
  database: process.env.DB_NAME || 'scout_db',
  port: Number(process.env.DB_PORT) || 3307, // XAMPP default here is 3307
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database Connection Error:', err.message);
  } else {
    console.log('✅ Connected to MySQL Database Pool.');
    connection.release();
  }
});

module.exports = db;
