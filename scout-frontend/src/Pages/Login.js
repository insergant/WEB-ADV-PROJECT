import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../Components/LanguageContext';
import { useGoogleLogin } from '@react-oauth/google'; // 👈 IMPORT THE HOOK
import { API_BASE_URL } from '../config';

const Login = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getText = (key, defaultText) => {
    if (typeof t === 'function') {
      const translated = t(key);
      return translated && translated !== key ? translated : defaultText;
    }
    return defaultText;
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      if (storedUser.role === 'admin') navigate('/admin-dashboard');
      else if (storedUser.role === 'leader') navigate('/leader-dashboard');
      else navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setErrorMessage('');
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Standard Email/Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        if (data.user.role === 'admin') navigate('/admin-dashboard');
        else if (data.user.role === 'leader') navigate('/leader-dashboard');
        else navigate('/');
      } else {
        setErrorMessage(data.error || getText('errInvalidCredentials', 'Invalid email or password.'));
      }
    } catch (err) {
      console.error('Login network error:', err);
      setErrorMessage(getText('errNetwork', 'Network error. Please check your server connection.'));
    } finally {
      setIsLoading(false);
    }
  };

  // 🛡️ ACTUAL GOOGLE LOGIN LOGIC 🛡️
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        // Send the Google token to your backend to verify and log the user in
        const response = await fetch(`${API_BASE_URL}/api/google-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));

          if (data.user.role === 'admin') navigate('/admin-dashboard');
          else if (data.user.role === 'leader') navigate('/leader-dashboard');
          else navigate('/');
        } else {
          setErrorMessage(data.error || "Google login failed on server.");
        }
      } catch (err) {
        console.error('Google verification failed:', err);
        setErrorMessage(getText('errNetwork', 'Network error. Please check your server connection.'));
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google Login Failed:', error);
      setErrorMessage("Google Authentication was canceled or failed.");
    }
  });

  return (
    <div className="max-w-md mx-auto bg-white p-8 border border-slate-200 rounded-lg shadow-sm mt-12">
      <h2 className="text-3xl font-bold text-emerald-900 mb-6 text-center">
        {getText('signInTitle', 'Sign In to ScoutConnect')}
      </h2>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... (Your email and password inputs stay exactly the same here) ... */}
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {getText('emailAddress', 'Email Address')}
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {getText('password', 'Password')}
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full font-bold py-2 px-4 rounded transition mt-4 text-white ${
            isLoading
              ? 'bg-emerald-400 cursor-not-allowed'
              : 'bg-emerald-700 hover:bg-emerald-800 cursor-pointer'
          }`}
        >
          {isLoading
            ? getText('signingIn', 'Signing In...')
            : getText('signInBtn', 'Sign In')}
        </button>
      </form>

      {/* Google Login Divider & Button */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-500">{getText('orContinueWith', 'Or continue with')}</span>
          </div>
        </div>

        <button
          onClick={() => handleGoogleLogin()} // 👈 TRIGGER THE HOOK HERE
          type="button"
          disabled={isLoading}
          className="mt-4 w-full flex items-center justify-center gap-3 bg-white border border-slate-300 text-slate-700 font-medium py-2 px-4 rounded hover:bg-slate-50 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img 
            src="https://www.svgrepo.com/show/475656/google-color.svg" 
            className="w-5 h-5" 
            alt="Google logo" 
          />
          {getText('googleLogin', 'Sign in with Google')}
        </button>
      </div>

      <div className="mt-6 text-center text-sm text-slate-600">
        {getText('noAccount', "Don't have an account?")}{' '}
        <Link to="/register" className="text-emerald-600 hover:underline font-medium ml-1">
          {getText('registerHere', 'Register here')}
        </Link>
      </div>
    </div>
  );
};

export default Login;