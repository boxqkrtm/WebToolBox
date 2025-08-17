import React from 'react';
import { useI18n } from '@/lib/i18n/i18nContext';
import { useTheme } from '@/lib/theme/themeContext';
import { Language } from '@/lib/i18n/translations';
import { HiSun, HiMoon } from 'react-icons/hi';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const Header: React.FC = () => {
  const { language, setLanguage } = useI18n();
  const { theme, toggleTheme } = useTheme();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ko', name: '한국어' },
    { code: 'ja', name: '日本語' },
    { code: 'zh', name: '中文' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 py-3 flex justify-end items-center gap-4">
        <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map(lang => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <HiMoon className="h-5 w-5" />
          ) : (
            <HiSun className="h-5 w-5" />
          )}
        </button>
      </div>
    </header>
  );
};