import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import { API_BASE_URL } from '../config';

const ForgotPassword = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Step 1: Request Code | Step 2: Input Code & New Password
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Submit Request for Reset Code
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/forgot-password/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage({ type: 'success', text: 'Reset code sent! Check your inbox.' });
        setStep(2);
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to request reset.' });
      }
    } catch (err) {
      console.error('Network error:', err);
      setStatusMessage({ type: 'error', text: t('errNetwork') });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Submit Reset Verification & New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });

    if (newPassword.length < 8 || !/\d/.test(newPassword)) {
      return setStatusMessage({ 
        type: 'error', 
        text: 'Password must be at least 8 characters long and contain at least one number.' 
      });
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/forgot-password/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Password updated successfully! Redirecting to login...');
        navigate('/login');
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Password reset failed.' });
      }
    } catch (err) {
      console.error('Network error:', err);
      setStatusMessage({ type: 'error', text: t('errNetwork') });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 border border-slate-200 rounded-lg shadow-sm mt-10">
      <h2 className="text-2xl font-bold text-emerald-900 mb-2 text-center">
        {step === 1 ? 'Reset Password' : 'Enter Reset Code'}
      </h2>
      <p className="text-sm text-slate-600 mb-6 text-center">
        {step === 1 
          ? 'Enter your registered email address to receive a 6-digit reset code.' 
          : `Enter the code sent to ${email} and your new password.`}
      </p>

      {statusMessage.text && (
        <div className={`mb-4 p-3 rounded text-sm text-center border ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-100 border-emerald-400 text-emerald-800' 
            : 'bg-red-100 border-red-400 text-red-700'
        }`}>
          {statusMessage.text}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleRequestCode} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">{t('emailAddress')}</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="mt-1 block w-full p-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full font-bold py-2 px-4 rounded transition text-white 
              ${isLoading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-700 hover:bg-emerald-800'}`}
          >
            {isLoading ? 'Sending Code...' : 'Send Reset Code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">6-Digit Code</label>
            <input 
              type="text" 
              maxLength="6"
              value={code} 
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} 
              required 
              placeholder="123456"
              className="mt-1 block w-full p-2 text-center tracking-widest text-xl border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">New Password</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
              className="mt-1 block w-full p-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full font-bold py-2 px-4 rounded transition text-white 
              ${isLoading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-700 hover:bg-emerald-800'}`}
          >
            {isLoading ? 'Updating Password...' : 'Reset Password'}
          </button>
        </form>
      )}

      <div className="mt-4 text-center text-sm">
        <Link to="/login" className="text-emerald-700 hover:underline">
          Return to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;