import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  // State to hold form inputs
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'scout'
  });

  const navigate = useNavigate();

  // Route Guard: Redirect to home if already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        navigate('/login'); // Redirect to login page
      } else {
        alert(data.error || 'Registration failed.');
      }
    } catch (err) {
      console.error('Network error:', err);
      alert('Could not connect to the backend server.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 border border-slate-200 rounded-lg shadow-sm mt-10">
      <h2 className="text-3xl font-bold text-emerald-900 mb-6 text-center">Join the Scouts</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-slate-700">First Name</label>
            <input 
              type="text" 
              name="firstName" 
              value={formData.firstName} 
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
              required 
            />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-slate-700">Last Name</label>
            <input 
              type="text" 
              name="lastName" 
              value={formData.lastName} 
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
              required 
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
            className="mt-1 block w-full p-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
            required 
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
          className="w-full bg-emerald-700 text-white font-bold py-2 px-4 rounded hover:bg-emerald-800 transition mt-4"
        >
          Create Account
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-slate-600">
        Already have an account? <Link to="/login" className="text-emerald-600 hover:underline">Log in here</Link>
      </div>
    </div>
  );
};

export default Register;