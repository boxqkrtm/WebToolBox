export type Language = 'en' | 'ko' | 'ja' | 'zh';

export interface Translation {
  common: {
    title: string;
    subtitle: string;
    backToCategories: string;
    home: {
      eyebrow: string;
      overviewTitle: string;
      stats: {
        categories: string;
        tools: string;
        languages: string;
        browser: string;
      };
    };
    uploadZone: {
      pasteHint: string;
      dragDropHint: string;
    };
    header: {
      themeToggleAriaLabel: string;
      languages: Record<string, string>;
    };
    categories: Record<string, {
      title: string;
      description: string;
    }>;
    tools: Record<string, {
      title: string;
      description: string;
      page?: Record<string, unknown>;
    }>;
  };
  errors?: {
    common: {
      invalidFile: string;
      invalidJson: string;
      unknownError: string;
    };
  };
}

export const translations: Record<Language, Translation> = {
  en: require('./en.json') as Translation,
  ko: require('./ko.json') as Translation,
  ja: require('./ja.json') as Translation,
  zh: require('./zh.json') as Translation
};