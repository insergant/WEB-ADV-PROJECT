const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'scoutconnect_jwt_secret_key_2026';

// Verify JWT Token Header
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer "

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No authentication token provided.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // Attach payload ({ id, email, role }) to request
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired authentication token.' });
  }
};

// Role Access Control Middleware
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to access this resource.' });
    }
    next();
  };
};

module.exports = { verifyToken, requireRole, JWT_SECRET };