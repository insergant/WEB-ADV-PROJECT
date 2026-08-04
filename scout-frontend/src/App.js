import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout Components
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import LanguagePrompt from './Components/LanguagePrompt';
import ProtectedRoute from './Components/ProtectedRoute';

// Public Pages
import Home from './Pages/Home';
import About from './Pages/About';
import Services from './Pages/Services';
import Contact from './Pages/Contact';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Events from './Pages/Events';
import ForgotPassword from './Components/ForgotPassword';

// Dashboard Components
import AdminDashboard from './Components/AdminDashboard';
import LeaderDashboard from './Components/LeaderDashboard';

// NOTE: GoogleOAuthProvider and LanguageProvider are provided ONCE in index.js
// (the composition root). They used to be duplicated here, which nested the whole
// app inside two separate provider instances. Removed.
const App = () => {
  return (
    <Router>
      <LanguagePrompt />
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/events" element={<Events />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leader-dashboard"
              element={
                <ProtectedRoute allowedRoles={['leader', 'admin']}>
                  <LeaderDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
