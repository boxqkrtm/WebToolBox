module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko', 'ja', 'zh'],
  },
  fallbackLng: 'en',
  supportedLngs: ['en', 'ko', 'ja', 'zh'],
  ns: ['common'],
  defaultNS: 'common',
  localePath: './public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};