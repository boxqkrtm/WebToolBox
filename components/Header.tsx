import React from 'react';
import Link from 'next/link';
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
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/75">
      <PageContainer className="py-3" contentClassName="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {router.pathname !== '/' && (
            <Button type="button" variant="outline" className="px-4" onClick={handleBack}>
              <HiArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">{t('common.backToCategories')}</span>
            </Button>
          )}
          <Link href="/" className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-[0.14em] text-foreground/80 uppercase">
              WebToolBox
            </p>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
            <SelectTrigger className="h-10 w-[120px] rounded-full sm:w-[140px]" data-testid="language-selector">
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
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-input bg-background transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label={t('common.header.themeToggleAriaLabel')}
            data-testid="theme-toggle"
          >
            {theme === 'light' ? (
              <HiMoon className="h-4 w-4" />
            ) : (
              <HiSun className="h-4 w-4" />
            )}
          </button>
        </div>
      </PageContainer>
    </header>
  );
};
