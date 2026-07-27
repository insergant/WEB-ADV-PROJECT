import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="bg-emerald-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-bold text-xl tracking-wider">
           Muslim Scoutma
          </Link>

          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-emerald-300 transition">Home</Link>
            <Link to="/about" className="hover:text-emerald-300 transition">About</Link>
            <Link to="/services" className="hover:text-emerald-300 transition">Programs</Link>
            <Link to="/contact" className="hover:text-emerald-300 transition">Contact</Link>
          </div>

          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-emerald-200 text-sm font-semibold">
                  Hi, {user.firstName || user.first_name}
                </span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 px-3 rounded text-sm transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="bg-emerald-700 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded transition border border-emerald-500"
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold py-2 px-4 rounded transition"
                >
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;