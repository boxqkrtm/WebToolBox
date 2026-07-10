import React, { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useDocumentClass } from '../hooks/useDocumentClass';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [storedTheme, setStoredTheme] = useLocalStorage<Theme | null>('theme', null);
  const theme: Theme = storedTheme ?? (systemPrefersDark ? 'dark' : 'light');

  useDocumentClass('dark', theme === 'dark');

  const toggleTheme = () => {
    setStoredTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
