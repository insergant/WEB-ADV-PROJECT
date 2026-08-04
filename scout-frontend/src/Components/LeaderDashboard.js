import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const LeaderDashboard = () => {
  const [scouts, setScouts] = useState([]);
  const [activeTab, setActiveTab] = useState('roster');

  const [scoutData, setScoutData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  // Helper function to attach JWT token to requests
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  useEffect(() => {
    fetchScouts();
  }, []);

  const fetchScouts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/leader/scouts`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (res.ok) setScouts(data);
    } catch (err) {
      console.error('Failed to load scouts roster:', err);
    }
  };

  const handleInputChange = (e) => {
    setScoutData({ ...scoutData, [e.target.name]: e.target.value });
  };

  const handleRegisterScout = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch(`${API_BASE_URL}/api/leader/create-scout`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(scoutData)
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        setScoutData({ firstName: '', lastName: '', email: '', phoneNumber: '', password: '' });
        fetchScouts();
        setActiveTab('roster');
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to register scout.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server communication error.' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-emerald-950">Troop Leader Dashboard</h1>
        <p className="text-slate-600">Register new scouts and manage active troop members.</p>
      </div>

      <div className="flex border-b border-slate-200 mb-6">
        <button 
          onClick={() => setActiveTab('roster')}
          className={`py-2 px-4 font-semibold text-sm border-b-2 transition ${
            activeTab === 'roster' 
              ? 'border-emerald-700 text-emerald-800' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Scout Roster ({scouts.length})
        </button>
        <button 
          onClick={() => setActiveTab('register')}
          className={`py-2 px-4 font-semibold text-sm border-b-2 transition ${
            activeTab === 'register' 
              ? 'border-emerald-700 text-emerald-800' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          + Register New Scout
        </button>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded border text-sm ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-red-50 border-red-300 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {activeTab === 'roster' && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100 text-slate-600">
                <th className="p-3">Scout Name</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Contact Phone</th>
              </tr>
            </thead>
            <tbody>
              {scouts.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-6 text-center text-slate-500">No registered scouts found in this unit.</td>
                </tr>
              ) : (
                scouts.map((scout) => (
                  <tr key={scout.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-800">{scout.first_name} {scout.last_name}</td>
                    <td className="p-3 text-slate-600">{scout.email}</td>
                    <td className="p-3 text-slate-600">{scout.phonenumber}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'register' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Register Scout Account</h2>
          <form onSubmit={handleRegisterScout} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">First Name</label>
                <input type="text" name="firstName" value={scoutData.firstName} onChange={handleInputChange} required className="w-full p-2 border border-slate-300 rounded text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Last Name</label>
                <input type="text" name="lastName" value={scoutData.lastName} onChange={handleInputChange} required className="w-full p-2 border border-slate-300 rounded text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
              <input type="email" name="email" value={scoutData.email} onChange={handleInputChange} required className="w-full p-2 border border-slate-300 rounded text-sm" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number (8 Digits)</label>
              <input type="text" name="phoneNumber" maxLength="8" value={scoutData.phoneNumber} onChange={handleInputChange} required className="w-full p-2 border border-slate-300 rounded text-sm" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Temporary Password</label>
              <input type="password" name="password" value={scoutData.password} onChange={handleInputChange} required className="w-full p-2 border border-slate-300 rounded text-sm" />
            </div>

            <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded text-sm transition">
              Register Scout
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LeaderDashboard;