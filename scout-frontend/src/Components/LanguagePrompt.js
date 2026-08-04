// src/LanguagePrompt.js
import React from 'react';
import { useLanguage } from './LanguageContext';

const LanguagePrompt = () => {
  const { language, setLanguage } = useLanguage();

  // If a language is already selected, don't show the prompt
  if (language) return null;

  return (
    <div className="fixed inset-0 bg-emerald-900 bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-emerald-900 mb-2">Welcome / مرحباً</h2>
        <p className="text-slate-600 mb-8">Please choose your preferred language to continue.<br/>الرجاء اختيار لغتك المفضلة للمتابعة.</p>
        
        <div className="flex flex-col space-y-4">
          <button 
            onClick={() => setLanguage('en')}
            className="w-full bg-emerald-700 text-white font-bold py-3 rounded hover:bg-emerald-800 transition"
          >
            English
          </button>
          <button 
            onClick={() => setLanguage('ar')}
            className="w-full bg-emerald-700 text-white font-bold py-3 rounded hover:bg-emerald-800 transition text-xl"
            dir="rtl"
          >
            العربية
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguagePrompt;