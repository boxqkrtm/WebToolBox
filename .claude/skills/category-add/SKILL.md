---
name: category-add
description: Add a new category to WebToolBox using the project’s manual category routing, translation, and SEO patterns.
metadata:
  short-description: Add a WebToolBox category
---

# Category Add

Use this skill when adding a new top-level category page such as `/category/<slug>`.

## Source of truth

Adding a category in WebToolBox is manual. There is no single registry.

You must update these areas:
1. `pages/category/<slug>.tsx`
2. `pages/index.tsx`
3. `lib/i18n/translations.ts`
4. `lib/seo/routeMeta.ts`

## Canonical pattern

Use these files as references:
- `pages/category/gif.tsx`
- `pages/category/database.tsx`
- `pages/index.tsx`
- `lib/i18n/translations.ts`
- `lib/seo/routeMeta.ts`

The common structure is:
- category page uses `PageContainer`
- heading/description come from `t('common.categories.<categoryKey>.*')`
- tool cards are hardcoded `Link` + `Card` blocks
- home page card is manually added in JSX order
- route SEO is manually added in `routeMetaMap`

## Step-by-step

### 1. Choose slug and translation key

Define both explicitly:
- route slug: e.g. `/category/image-video`
- translation key: often camelCase when needed, e.g. `imageVideo`

Do not assume slug and translation key are identical.

### 2. Create the category page

Create `pages/category/<slug>.tsx`.

Preferred structure:
- import `Link`
- import `Card`, `CardHeader`, `CardTitle`, `CardContent`
- import `PageContainer`
- import `useI18n`
- render heading from `common.categories.<categoryKey>.title`
- render description from `common.categories.<categoryKey>.description`
- render one `Link` + `Card` per tool in the category
- use `common.tools.<toolKey>.title` and `.description` for tool cards when available

Prefer the translated pattern used by `pages/category/gif.tsx` and `pages/category/database.tsx`.
Do not copy older hardcoded-English exceptions unless explicitly matching legacy behavior.

### 3. Add the home page card

Update `pages/index.tsx`.

Add a new category card in the desired visual order.
The home page is not data-driven; ordering is the JSX order in the file.

Wire these values:
- route href: `/category/<slug>`
- title: `t('common.categories.<categoryKey>.title')`
- description: `t('common.categories.<categoryKey>.description')`
- icon: choose an existing lucide/react-icons pattern consistent with nearby categories

### 4. Add translations

Update `lib/i18n/translations.ts` for all locales:
- `en`
- `ko`
- `ja`
- `zh`

Add:
- `common.categories.<categoryKey>.title`
- `common.categories.<categoryKey>.description`

If category-page tool cards use new tool keys, add those tool translations too.

### 5. Add SEO metadata

Update `lib/seo/routeMeta.ts`.

Add a `/category/<slug>` entry with:
- `slug`
- `title`
- `description`
- `section: "Category"`

Without this, `SeoHead` falls back to generic metadata.

## Verification

Minimum checks:
1. Open `/category/<slug>` and confirm the page renders.
2. Open `/` and confirm the new category card appears in the expected order.
3. Switch language and confirm category title/description translate.
4. Verify page title/description metadata through the route meta path.

Helpful test references:
- `tests/i18n.spec.ts` for translation assertions
- `tests/og.spec.ts` for route metadata assertions

## Project-specific warnings

- Runtime i18n reads `lib/i18n/translations.ts`, not the modular locale files.
- Category pages are manual JSX, not generated from config.
- `routeMeta.ts` is easy to miss; missing it degrades SEO silently.
- Existing category pages have some drift; prefer the translated card pattern, not the hardcoded exceptions.

## Minimal checklist

- [ ] Created `pages/category/<slug>.tsx`
- [ ] Added home page category card in `pages/index.tsx`
- [ ] Added `common.categories.<categoryKey>` translations for all locales
- [ ] Added `/category/<slug>` metadata in `lib/seo/routeMeta.ts`
- [ ] Verified route render, translation, and metadata
