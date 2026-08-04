import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../Components/LanguageContext';
import { API_BASE_URL } from '../config';

const Register = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: 'scout'
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Helper for safe translation lookup with fallback text
  const getText = (key, defaultText) => {
    if (typeof t === 'function') {
      const translated = t(key);
      return translated && translated !== key ? translated : defaultText;
    }
    return defaultText;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    let value = e.target.value;

    if (e.target.name === 'phoneNumber') {
      value = value.replace(/\D/g, ''); // Numeric characters only
    }

    setErrorMessage('');
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Strict Frontend Validation
    if (formData.phoneNumber.length !== 8) {
      return setErrorMessage(getText('errPhoneDigits', 'Phone number must be exactly 8 digits.'));
    }

    if (formData.password.length < 8) {
      return setErrorMessage(getText('errPasswordLength', 'Password must be at least 8 characters long.'));
    }

    if (!/\d/.test(formData.password)) {
      return setErrorMessage(getText('errPasswordNumber', 'Password must contain at least one number.'));
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(getText('msgAccountSuccess', 'Account created successfully! Please sign in.'));
        navigate('/login');
      } else {
        setErrorMessage(data.error || getText('errRegistrationFailed', 'Registration failed. Please try again.'));
      }
    } catch (err) {
      console.error('Network error:', err);
      setErrorMessage(getText('errNetwork', 'Network error. Please check your server connection.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 border border-slate-200 rounded-lg shadow-sm mt-6">
      <h2 className="text-3xl font-bold text-emerald-900 mb-6 text-center">
        {getText('joinScouts', 'Join ScoutConnect')}
      </h2>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {getText('firstName', 'First Name')}
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full p-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {getText('lastName', 'Last Name')}
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full p-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

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
            className="w-full p-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {getText('phoneNumber', 'Phone Number')}
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            maxLength="8"
            placeholder="8 digits"
            className="w-full p-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
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
            className="w-full p-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {getText('registeringAs', 'Registering As')}
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="scout">{getText('roleScout', 'Scout')}</option>
            <option value="parent">{getText('roleParent', 'Parent')}</option>
          </select>
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
            ? getText('creatingAccount', 'Creating Account...')
            : getText('createAccount', 'Create Account')}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-slate-600">
        {getText('alreadyHaveAccount', 'Already have an account?')}{' '}
        <Link to="/login" className="text-emerald-600 hover:underline font-medium ml-1">
          {getText('loginHere', 'Login here')}
        </Link>
      </div>
    </div>
  );
};

export default Register;