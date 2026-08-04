import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import { FaUserShield, FaClipboardList, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
  const navigate = useNavigate();
  // Shared translation function from context (single source of truth).
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // Guard the localStorage parse: corrupted JSON here would otherwise throw
  // during render and blank out every page (Navbar renders on all routes).
  let user = null;
  try {
    const raw = localStorage.getItem('user');
    user = raw ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleLanguageChange = (e) => setLanguage(e.target.value);

  const navLink =
    'text-emerald-100 hover:text-white border-b-2 border-transparent hover:border-amber-400 pb-0.5 transition';

  return (
    <nav className="bg-emerald-900 text-white shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo / Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-extrabold tracking-tight text-white hover:text-amber-300 transition">
              Scout<span className="text-amber-400">Connect</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className={navLink}>{t('home', 'Home')}</Link>
            <Link to="/about" className={navLink}>{t('about', 'About')}</Link>
            <Link to="/services" className={navLink}>{t('services', 'Programs')}</Link>
            <Link to="/events" className={navLink}>{t('events', 'Events')}</Link>
            <Link to="/contact" className={navLink}>{t('contact', 'Contact')}</Link>

            {/* Role-based dashboard links */}
            {user?.role === 'admin' && (
              <Link
                to="/admin-dashboard"
                className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold px-4 py-1.5 rounded-lg shadow-sm transition flex items-center gap-2 ml-2"
              >
                <FaUserShield /> {t('adminPanel', 'Admin Panel')}
              </Link>
            )}

            {user?.role === 'leader' && (
              <Link
                to="/leader-dashboard"
                className="bg-emerald-700 hover:bg-emerald-600 border border-emerald-500 text-white font-semibold px-4 py-1.5 rounded-lg transition flex items-center gap-2 ml-2"
              >
                <FaClipboardList /> {t('leaderPortal', 'Leader Portal')}
              </Link>
            )}
          </div>

          {/* Desktop Right Actions (Lang + Auth) */}
          <div className="hidden md:flex items-center space-x-4">
            <select
              value={language || 'en'}
              onChange={handleLanguageChange}
              className="bg-emerald-800 text-white border border-emerald-600 text-sm rounded px-2 py-1 cursor-pointer focus:outline-none focus:border-amber-400"
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="ar">AR</option>
            </select>

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-emerald-200">
                  {t('welcome', 'Welcome')}, <span className="text-white font-semibold">{user.firstName}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 border border-emerald-600 text-emerald-100 hover:bg-emerald-800 hover:text-white text-sm px-4 py-1.5 rounded-lg transition"
                >
                  <FaSignOutAlt /> {t('logout', 'Logout')}
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-amber-500 hover:bg-amber-600 text-emerald-950 text-sm font-bold px-5 py-1.5 rounded-lg shadow-sm transition"
              >
                {t('login', 'Login')}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="text-emerald-100 hover:text-white focus:outline-none text-xl"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-emerald-800 border-t border-emerald-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            <Link to="/" onClick={() => setIsOpen(false)} className="text-emerald-100 hover:bg-emerald-700 hover:text-white block px-3 py-2 rounded-md font-medium">{t('home', 'Home')}</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="text-emerald-100 hover:bg-emerald-700 hover:text-white block px-3 py-2 rounded-md font-medium">{t('about', 'About')}</Link>
            <Link to="/services" onClick={() => setIsOpen(false)} className="text-emerald-100 hover:bg-emerald-700 hover:text-white block px-3 py-2 rounded-md font-medium">{t('services', 'Programs')}</Link>
            <Link to="/events" onClick={() => setIsOpen(false)} className="text-emerald-100 hover:bg-emerald-700 hover:text-white block px-3 py-2 rounded-md font-medium">{t('events', 'Events')}</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="text-emerald-100 hover:bg-emerald-700 hover:text-white block px-3 py-2 rounded-md font-medium">{t('contact', 'Contact')}</Link>

            {/* Mobile Role-Based Links */}
            {user?.role === 'admin' && (
              <Link to="/admin-dashboard" onClick={() => setIsOpen(false)} className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold flex items-center gap-2 px-3 py-2 rounded-md mt-1">
                <FaUserShield /> {t('adminPanel', 'Admin Panel')}
              </Link>
            )}
            {user?.role === 'leader' && (
              <Link to="/leader-dashboard" onClick={() => setIsOpen(false)} className="bg-emerald-700 hover:bg-emerald-600 border border-emerald-500 text-white font-semibold flex items-center gap-2 px-3 py-2 rounded-md mt-1">
                <FaClipboardList /> {t('leaderPortal', 'Leader Portal')}
              </Link>
            )}

            <div className="border-t border-emerald-700 my-2 pt-2 pb-1">
              <select
                value={language || 'en'}
                onChange={handleLanguageChange}
                className="w-full bg-emerald-900 text-white border border-emerald-600 text-sm rounded px-3 py-2 mb-2 focus:outline-none"
              >
                <option value="en">English (EN)</option>
                <option value="fr">Français (FR)</option>
                <option value="ar">العربية (AR)</option>
              </select>

              {user ? (
                <div className="flex flex-col space-y-2 mt-2 px-1">
                  <span className="text-sm text-emerald-200 px-2">
                    {t('welcome', 'Welcome')}, <span className="text-white font-semibold">{user.firstName}</span>
                  </span>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="w-full flex items-center gap-2 text-emerald-100 hover:bg-emerald-700 hover:text-white px-3 py-2 rounded-md font-medium"
                  >
                    <FaSignOutAlt /> {t('logout', 'Logout')}
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold block px-3 py-2 rounded-md mt-2"
                >
                  {t('login', 'Login')}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;