import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  // 1. Check if user is logged in
  if (!token || !storedUser) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(storedUser);

    // 2. Check if user has required role permissions
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-red-50 border border-red-300 rounded-lg text-center">
          <h2 className="text-xl font-bold text-red-800 mb-2">Access Denied</h2>
          <p className="text-sm text-red-600 mb-4">
            You do not have permission to view this page. Restricted to: <strong>{allowedRoles.join(', ')}</strong>.
          </p>
          <a href="/" className="inline-block bg-emerald-700 text-white px-4 py-2 rounded text-sm font-semibold">
            Return to Home Page
          </a>
        </div>
      );
    }

    // 3. Render protected content if authorized
    return children;
  } catch (error) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;