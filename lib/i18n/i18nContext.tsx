import React, { createContext, useContext, useState, useCallback } from 'react';
import { translations, Language } from './translations';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useMount } from '../hooks/useMount';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [language, setLanguageState] = useLocalStorage<Language>('language', 'en');

  useMount(() => {
    setMounted(true);

    const detectLanguage = (): Language => {
      const browserLang = navigator.language.toLowerCase();
      
      if (browserLang.startsWith('ko')) return 'ko';
      if (browserLang.startsWith('ja')) return 'ja';
      if (browserLang.startsWith('zh')) return 'zh';
      return 'en';
    };

    if (!language || !translations[language]) {
      const detectedLang = detectLanguage();
      setLanguageState(detectedLang);
    }
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, [setLanguageState]);

  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key;
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {mounted ? children : null}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
