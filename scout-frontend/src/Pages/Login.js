import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  // Route Guard: Redirect if already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/';
      } else {
        alert(data.error || 'Invalid credentials.');
      }
    } catch (err) {
      console.error('Network error:', err);
      alert('Could not connect to the backend server.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 border border-slate-200 rounded-lg shadow-sm mt-10">
      <h2 className="text-3xl font-bold text-emerald-900 mb-6 text-center">Log In</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Email Address</label>
          <input 
            type="email" 
            name="email" 
            value={loginData.email} 
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
            value={loginData.password} 
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
            required 
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-emerald-700 text-white font-bold py-2 px-4 rounded hover:bg-emerald-800 transition mt-4"
        >
          Log In
        </button>

        <div className="pt-2 flex justify-center">
          <GoogleLogin
            shape="rectangular"
            theme="filled_black"
            size="large"
            text="continue_with"
            logo_alignment="left"
            onSuccess={async (credentialResponse) => {
              try {
                const decoded = jwtDecode(credentialResponse.credential);
                
                // Send Google credentials to backend to store in MySQL database
                const response = await fetch('http://localhost:5000/api/google-login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    firstName: decoded.given_name || 'Google',
                    lastName: decoded.family_name || 'User',
                    email: decoded.email
                  }),
                });

                const data = await response.json();

                if (response.ok) {
                  localStorage.setItem('user', JSON.stringify(data.user));
                  alert(`Welcome, ${data.user.firstName}! Login successful.`);
                  window.location.href = '/';
                } else {
                  alert(data.error || 'Google login failed.');
                }
              } catch (err) {
                console.error('Google token processing error:', err);
                alert('An error occurred during Google authentication.');
              }
            }}
            onError={() => {
              alert('Google Login Failed');
            }}
          />
        </div>
      </form>

      <div className="mt-4 text-center text-sm text-slate-600">
        Don't have an account? <Link to="/register" className="text-emerald-600 hover:underline">Register here</Link>
      </div>
    </div>
  );
};

export default Login;