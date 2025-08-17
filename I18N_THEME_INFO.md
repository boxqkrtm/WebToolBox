# Multi-language Support & Theme System

## Features Added

### 1. Multi-language Support (i18n)
- **Languages supported**: English (en), Korean (ko), Japanese (ja), Chinese (zh)
- **Automatic language detection**: Detects browser language on first visit
- **Language persistence**: Selected language is saved in localStorage
- **Language switcher**: Dropdown in header to switch between languages

### 2. Dark/Light Theme Support
- **Theme modes**: Light and Dark themes
- **Automatic detection**: Respects system color scheme preference on first visit
- **Theme persistence**: Selected theme is saved in localStorage
- **Theme toggle**: Button in header to switch between themes

## Implementation Details

### File Structure
```
lib/
├── i18n/
│   ├── translations.ts     # All translation strings
│   └── i18nContext.tsx     # i18n context and provider
└── theme/
    └── themeContext.tsx    # Theme context and provider

components/
└── Header.tsx             # Header with language and theme controls
```

### Key Components

1. **I18nProvider** (`lib/i18n/i18nContext.tsx`)
   - Provides translation functionality
   - Detects browser language
   - Manages language state

2. **ThemeProvider** (`lib/theme/themeContext.tsx`)
   - Manages dark/light theme
   - Applies theme class to document
   - Persists theme preference

3. **Header** (`components/Header.tsx`)
   - Language selector dropdown
   - Theme toggle button

### Usage in Components

```tsx
import { useI18n } from '@/lib/i18n/i18nContext';

function MyComponent() {
  const { t } = useI18n();
  
  return <h1>{t('common.title')}</h1>;
}
```

### Adding New Translations

Edit `lib/i18n/translations.ts` and add your translations in all languages:

```ts
export const translations = {
  en: {
    common: {
      myNewKey: "My English text"
    }
  },
  ko: {
    common: {
      myNewKey: "한국어 텍스트"
    }
  },
  // ... other languages
};
```

### Theme Classes

The theme system uses Tailwind CSS classes with CSS variables. All color classes automatically adapt to the theme:
- `text-foreground` - Main text color
- `bg-background` - Main background color
- `text-muted-foreground` - Secondary text color
- `border` - Border color
- etc.

### Notes

1. The project uses static export (`output: 'export'` in next.config.mjs), which is temporarily commented out for development with API routes.
2. Language detection prioritizes: localStorage > browser language > English (fallback)
3. Theme detection prioritizes: localStorage > system preference > light (fallback)