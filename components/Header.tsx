import React from 'react';
import { useI18n } from '@/lib/i18n/i18nContext';
import { useTheme } from '@/lib/theme/themeContext';
import { Language } from '@/lib/i18n/translations';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/layout/PageContainer';
import { HiSun, HiMoon, HiArrowLeft } from 'react-icons/hi';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const Header: React.FC = () => {
  const router = useRouter();
  const { language, setLanguage, t } = useI18n();
  const { theme, toggleTheme } = useTheme();

  const languages = [
    { code: 'en', name: t('common.header.languages.en') },
    { code: 'ko', name: t('common.header.languages.ko') },
    { code: 'ja', name: t('common.header.languages.ja') },
    { code: 'zh', name: t('common.header.languages.zh') }
  ];

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }

    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <PageContainer className="py-3" contentClassName="flex items-center justify-between gap-4">
        {router.pathname !== '/' ? (
          <Button type="button" variant="outline" className="flex items-center" onClick={handleBack}>
            <HiArrowLeft className="mr-2 h-4 w-4" />
            {t('common.backToCategories')}
          </Button>
        ) : <div />}

        <div className="flex items-center gap-3 sm:gap-4">
          <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
            <SelectTrigger className="w-[140px]" data-testid="language-selector">
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
            className="rounded-md p-2 transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label={t('common.header.themeToggleAriaLabel')}
            data-testid="theme-toggle"
          >
            {theme === 'light' ? (
              <HiMoon className="h-5 w-5" />
            ) : (
              <HiSun className="h-5 w-5" />
            )}
          </button>
        </div>
      </PageContainer>
    </header>
  );
};
