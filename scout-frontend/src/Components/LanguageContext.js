import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from './translations';

// 1. Create Context
const LanguageContext = createContext();

// 2. Language Provider Component
export const LanguageProvider = ({ children }) => {
  // Start as null when nothing is stored, so <LanguagePrompt /> (which renders only
  // when `language` is falsy) can appear on the very first visit. Once the user picks
  // a language it is persisted and this becomes the stored value on later visits.
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('appLanguage') || null;
  });

  // Persist + apply direction ONLY once a language is actually chosen.
  useEffect(() => {
    if (!language) return; // no selection yet -> leave the prompt showing, write nothing
    localStorage.setItem('appLanguage', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Translation helper.
  // Usage: t('welcome') or t('missingKey', 'Default Fallback Text')
  // When no language is selected yet, fall back to the English dictionary.
  const t = (key, fallbackText = '') => {
    const langDict = translations[language] || translations['en'];
    if (langDict && langDict[key] !== undefined) {
      return langDict[key];
    }
    if (translations['en'] && translations['en'][key] !== undefined) {
      return translations['en'][key];
    }
    return fallbackText || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 3. Custom Hook for easy context consumption
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
