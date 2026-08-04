import React, { useState } from 'react';
import { useLanguage } from '../Components/LanguageContext';
import { API_BASE_URL } from '../config';

const Contact = () => {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setStatusMessage({ type: '', text: '' });
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage({ type: 'success', text: t('msgContactSuccess') });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatusMessage({ type: 'error', text: data.error || t('errContactFailed') });
      }
    } catch (err) {
      console.error('Network error:', err);
      setStatusMessage({ type: 'error', text: t('errNetwork') });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 border border-slate-200 rounded-lg shadow-sm mt-6">
      <h2 className="text-3xl font-bold text-emerald-900 mb-2 text-center">{t('contactUs')}</h2>
      <p className="text-center text-slate-600 mb-6">{t('haveQuestion')}</p>

      {statusMessage.text && (
        <div className={`mb-4 p-3 rounded text-sm text-center border ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-100 border-emerald-400 text-emerald-800' 
            : 'bg-red-100 border-red-400 text-red-700'
        }`}>
          {statusMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">{t('fullName')}</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            className="mt-1 block w-full p-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">{t('emailAddress')}</label>
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
          <label className="block text-sm font-medium text-slate-700">{t('message')}</label>
          <textarea 
            name="message" 
            value={formData.message} 
            onChange={handleChange} 
            required 
            rows="5"
            placeholder={t('messagePlaceholder')}
            className="mt-1 block w-full p-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full font-bold py-2 px-4 rounded transition mt-4 text-white 
            ${isLoading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-700 hover:bg-emerald-800'}`}
        >
          {isLoading ? t('sendingMessage') : t('sendMessage')}
        </button>
      </form>
    </div>
  );
};

export default Contact;