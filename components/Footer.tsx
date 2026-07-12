import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/i18nContext';
import { PageContainer } from '@/components/layout/PageContainer';

export const Footer: React.FC = () => {
  const { t } = useI18n();

  return (
    <footer className="border-t">
      <PageContainer
        className="py-4"
        contentClassName="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground"
      >
        <span>© {new Date().getFullYear()} WebToolBox</span>
        <div className="flex items-center gap-4">
          <Link href="/licenses" className="hover:text-foreground hover:underline">
            {t('common.footer.openSourceLicenses')}
          </Link>
          <a
            href="https://github.com/boxqkrtm/WebToolBox"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground hover:underline"
          >
            GitHub
          </a>
        </div>
      </PageContainer>
    </footer>
  );
};
