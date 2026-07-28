import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '', 
    password: '',
    role: 'scout'
  });

  // New UI states for a better user experience
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Route Guard: Redirect to home if already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    let value = e.target.value;
    
    // Automatically strip non-numbers for the phone field
    if (e.target.name === 'phoneNumber') {
      value = value.replace(/\D/g, '');
    }

    // Clear any previous error messages when the user starts typing again
    setErrorMessage('');

    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset errors on submit

    // 1. Strict Frontend Validation (using inline errors instead of alerts)
    if (formData.phoneNumber.length !== 8) {
      return setErrorMessage("Phone number must be exactly 8 digits.");
    }

    if (formData.password.length < 8) {
      return setErrorMessage("Password must be at least 8 characters long.");
    }

    if (!/\d/.test(formData.password)) {
      return setErrorMessage("Password must contain at least one number.");
    }
    
    // 2. API Call
    setIsLoading(true); // Disable the button to prevent double-clicks
    
    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Account created successfully! You can now log in.');
        navigate('/login');
      } else {
        // Show backend errors (like duplicate emails) in the UI
        setErrorMessage(data.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Network error:', err);
      setErrorMessage('Could not connect to the server. Please check your internet connection.');
    } finally {
      setIsLoading(false); // Re-enable the button when finished
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 border border-slate-200 rounded-lg shadow-sm mt-10">
      <h2 className="text-3xl font-bold text-emerald-900 mb-6 text-center">Join the Scouts</h2>
      
      {/* Conditionally render the error message box if an error exists */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-slate-700">First Name</label>
            <input 
              type="text" 
              name="firstName" 
              value={formData.firstName} 
              onChange={handleChange} 
              required 
              className="mt-1 block w-full p-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-slate-700">Last Name</label>
            <input 
              type="text" 
              name="lastName" 
              value={formData.lastName} 
              onChange={handleChange} 
              required 
              className="mt-1 block w-full p-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Email Address</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            className="mt-1 block w-full p-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Phone Number</label>
          <input
            type="tel" 
            name="phoneNumber" 
            value={formData.phoneNumber} 
            onChange={handleChange} 
            required
            maxLength="8"
            className="mt-1 block w-full p-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            className="mt-1 block w-full p-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">I am registering as a...</label>
          <select 
            name="role" 
            value={formData.role} 
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="scout">Scout</option>
            <option value="parent">Parent/Guardian</option>
            <option value="leader">Scout Leader</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full font-bold py-2 px-4 rounded transition mt-4 text-white 
            ${isLoading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-700 hover:bg-emerald-800'}`}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-slate-600">
        Already have an account? <Link to="/login" className="text-emerald-600 hover:underline font-medium">Log in here</Link>
      </div>
    </div>
  );
};
export default Register;