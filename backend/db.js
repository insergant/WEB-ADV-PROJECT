const mysql = require('mysql2');

// Create the connection pool to XAMPP MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // Default XAMPP user
  password: '',      // Default XAMPP password is empty
  database: 'scout_db',
  port: 3307,         // Default MySQL port
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err.message);
    return;
  }
  console.log('Successfully connected to XAMPP MySQL database: scout_db');
});

module.exports = db;