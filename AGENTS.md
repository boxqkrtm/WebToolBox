# AGENTS.md - Project Workflow & Development Guidelines

This document describes the development workflow and conventions used in the WebToolBox project.

## Project Overview

WebToolBox is a Next.js application providing various web utilities. Built with:
- **Framework**: Next.js 16.1.3 (with Turbopack)
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: shadcn/ui with Radix UI primitives
- **Testing**: Playwright for E2E testing
- **Language**: TypeScript 5.8.2
- **Package Manager**: pnpm (project standard)

## Package Manager Policy

- Use `pnpm` for all dependency installation and script execution.
- Do not add or commit npm lockfiles such as `package-lock.json`.
- Use the committed `pnpm-lock.yaml` as the single lockfile source of truth.

## Core Features

### Multi-language Support (i18n)
- **Supported Languages**: English (en), Korean (ko), Japanese (ja), Chinese (zh)
- **Auto-detection**: Browser language detection on first visit
- **Persistence**: Selected language saved in localStorage
- **Implementation**: `lib/i18n/` - Context-based translation system

### Dark/Light Theme Support
- **Theme Modes**: Light and Dark
- **Auto-detection**: System color scheme preference
- **Persistence**: Theme preference saved in localStorage
- **Implementation**: `lib/theme/` - Theme context with CSS variables
- **CSS Variables**: Tailwind-based `:root` and `.dark` selectors in `styles/globals.css`

## Directory Structure

```
lib/
├── hooks/              # Custom React hooks
│   ├── useLocalStorage.ts    # localStorage state management
│   ├── useMediaQuery.ts      # Media query detection
│   ├── useDocumentClass.ts    # Document class manipulation
│   ├── useMount.ts          # Mount effect hook
│   └── index.ts
├── i18n/              # Internationalization
│   ├── translations.ts    # All translation strings
│   └── i18nContext.tsx   # i18n context and provider
├── theme/             # Theme management
│   └── themeContext.tsx     # Theme context and provider
└── utils.ts           # Utility functions

components/
├── ui/               # shadcn/ui components
├── layout/            # Layout components
│   └── UtilsLayout.tsx
└── Header.tsx         # Main header with language/theme controls

pages/
├── index.tsx          # Home page with categories
├── category/          # Category pages
│   ├── database.tsx    # Combined JSON/CSV/SQL tools
│   ├── game.tsx
│   ├── image-video.tsx
│   ├── discord.tsx
│   ├── llm.tsx
│   ├── geolocation.tsx
│   └── etc.tsx
├── utils/             # Individual tool pages
└── api/              # API routes

tests/
├── i18n.spec.ts      # i18n E2E tests
└── theme.spec.ts      # Theme E2E tests
```

## Development Workflow

### Adding a New Tool

1. **Create Tool Page**: Add new page in `pages/utils/[tool-name].tsx`
2. **Add Translations**: Update `lib/i18n/translations.ts` in all languages
3. **Update Category**: Add to appropriate category page in `pages/category/`
4. **Dark Mode**: Use Tailwind theme classes (`bg-background`, `text-foreground`, etc.)
5. **Test**: Run Playwright tests to ensure compatibility

### Adding Translations

Edit `lib/i18n/translations.ts`:

```typescript
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
  ja: {
    common: {
      myNewKey: "日本語テキスト"
    }
  },
  zh: {
    common: {
      myNewKey: "中文文本"
    }
  }
};
```

### Using i18n in Components

```tsx
import { useI18n } from '@/lib/i18n/i18nContext';

function MyComponent() {
  const { t } = useI18n();
  return <h1>{t('common.myNewKey')}</h1>;
}
```

### Using Theme Classes

All color classes automatically adapt to theme:
- `bg-background` - Main background
- `text-foreground` - Main text
- `text-muted-foreground` - Secondary text
- `bg-card` - Card background
- `border` - Border colors
- `bg-muted` - Muted backgrounds

Example:
```tsx
<div className="bg-card text-card-foreground border rounded-lg">
  <h2 className="text-muted-foreground">Subheading</h2>
</div>
```

### Custom Hooks

Available in `lib/hooks/`:

- `useLocalStorage<T>(key, initialValue)` - localStorage state management
- `useMediaQuery(query)` - CSS media query detection
- `useDocumentClass(className, condition)` - Toggle document classes
- `useMount(callback)` - Execute callback on mount only

## Testing

### Run Tests

```bash
# Run all tests
pnpm exec playwright test

# Run specific test file
pnpm exec playwright test tests/theme.spec.ts

# Run with UI
pnpm exec playwright test --ui

# Run with headed mode
pnpm exec playwright test --headed
```

### Test Conventions

- Use `test.use({ colorScheme: 'light' })` for non-theme tests
- Clear localStorage in `beforeEach` when needed
- Use `page.waitForTimeout(100)` after state changes
- Test for accessibility (ARIA labels, button roles)

## Build & Deploy

```bash
# Build project
pnpm build

# Run dev server
pnpm dev

# Start production server
pnpm start

# Lint code
pnpm lint

# Type check
pnpm typecheck
```

## Important Notes

1. **SSR Compatibility**: Use `useMount` or check `typeof window` for browser-specific code
2. **CSS Variables**: Dark mode colors defined in `.dark` selector outside `@layer base`
3. **localStorage**: Uses `JSON.stringify` for complex values, can return `null`
4. **Language Priority**: localStorage > browser language > English (fallback)
5. **Theme Priority**: localStorage > system preference > light (fallback)

## Category Structure

Current categories:
- **Database**: JSON, CSV, SQL tools (previously separate JSON/SQL categories)
- **Game**: Game-related utilities
- **Image & Video**: Video and image manipulation tools
- **Discord**: Discord-specific utilities
- **LLM**: Large Language Model tools
- **Geolocation**: Geographic data tools
- **Etc**: Miscellaneous utilities
