import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: 'leader'
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
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      
      if (res.ok) {
        // FAIL-SAFE: Ensure we are setting an array to state
        if (Array.isArray(data)) {
          setUsers(data);
        } else if (data && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          setUsers([]);
        }
      } else {
        setUsers([]);
        console.error('API Error:', data.error);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      setUsers([]);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/create-user`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: data.message || 'User created successfully!' });
        setFormData({ firstName: '', lastName: '', email: '', phoneNumber: '', password: '', role: 'leader' });
        setShowCreateModal(false);
        fetchUsers();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create user.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server communication error.' });
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}'s account?`)) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // FAIL-SAFE: Guarantee safeUsers is always an array before filtering/mapping
  const safeUsers = Array.isArray(users) ? users : [];
  
  const filteredUsers = filterRole === 'all' 
    ? safeUsers 
    : safeUsers.filter(u => u.role === filterRole);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-emerald-950">Admin Control Center</h1>
          <p className="text-slate-600">Manage user accounts, leaders, and system credentials.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          + Create New Account
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 border border-slate-200 rounded-lg shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Total Users</p>
          <p className="text-3xl font-bold text-emerald-900">{safeUsers.length}</p>
        </div>
        <div className="bg-white p-5 border border-slate-200 rounded-lg shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Leaders</p>
          <p className="text-3xl font-bold text-emerald-700">{safeUsers.filter(u => u.role === 'leader').length}</p>
        </div>
        <div className="bg-white p-5 border border-slate-200 rounded-lg shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Scouts</p>
          <p className="text-3xl font-bold text-emerald-700">{safeUsers.filter(u => u.role === 'scout').length}</p>
        </div>
        <div className="bg-white p-5 border border-slate-200 rounded-lg shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Parents</p>
          <p className="text-3xl font-bold text-emerald-700">{safeUsers.filter(u => u.role === 'parent').length}</p>
        </div>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded border text-sm ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-red-50 border-red-300 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">User Directory</h2>
          <select 
            value={filterRole} 
            onChange={(e) => setFilterRole(e.target.value)}
            className="p-2 border border-slate-300 rounded-md text-sm"
          >
            <option value="all">All Roles</option>
            <option value="leader">Leaders Only</option>
            <option value="scout">Scouts Only</option>
            <option value="parent">Parents Only</option>
            <option value="admin">Admins Only</option>
          </select>
        </div>

        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100 text-slate-600">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Role</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-slate-500">No users found.</td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-3 font-medium text-slate-800">{u.first_name} {u.last_name}</td>
                  <td className="p-3 text-slate-600">{u.email}</td>
                  <td className="p-3 text-slate-600">{u.phonenumber}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      u.role === 'leader' ? 'bg-blue-100 text-blue-800' :
                      u.role === 'scout' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button 
                      onClick={() => handleDeleteUser(u.id, `${u.first_name} ${u.last_name}`)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Create User Account</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600">First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="w-full p-2 border border-slate-300 rounded text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600">Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="w-full p-2 border border-slate-300 rounded text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full p-2 border border-slate-300 rounded text-sm" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600">Phone Number (8 Digits)</label>
                <input type="text" name="phoneNumber" maxLength="8" value={formData.phoneNumber} onChange={handleInputChange} required className="w-full p-2 border border-slate-300 rounded text-sm" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleInputChange} required className="w-full p-2 border border-slate-300 rounded text-sm" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600">Assign Role</label>
                <select name="role" value={formData.role} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded text-sm">
                  <option value="leader">Leader</option>
                  <option value="scout">Scout</option>
                  <option value="parent">Parent</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-700 text-white rounded text-sm font-semibold hover:bg-emerald-800">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;