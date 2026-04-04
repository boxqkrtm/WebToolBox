---
name: tool-add
description: Add a new tool page to WebToolBox using the project’s manual route, category, translation, and SEO wiring.
metadata:
  short-description: Add a WebToolBox tool
---

# Tool Add

Use this skill when adding a new page under `pages/utils/<tool-slug>.tsx` and wiring it into the correct category.

## Source of truth

Adding a tool in WebToolBox is manual. Usually update all of these:
1. `pages/utils/<tool-slug>.tsx`
2. the owning category page under `pages/category/*.tsx`
3. `lib/i18n/translations.ts`
4. `lib/seo/routeMeta.ts`
5. optionally tests under `tests/`

Do not assume the home page changes for an ordinary tool addition. Home lists categories, not tools.

## Best reference patterns

Use these as templates depending on tool type:
- Small translated utility page: `pages/utils/escaped-string-decoder.tsx`
- Upload-driven tool page: `pages/utils/mp4-to-gif.tsx`
- Category card wiring: `pages/category/gif.tsx` or `pages/category/database.tsx`
- SEO registration: `lib/seo/routeMeta.ts`
- Runtime translations: `lib/i18n/translations.ts`

## Choose the page shell

### Prefer `UtilsLayout` when
- it is a utility/editor-style page
- the tool has paste/drop/upload interactions
- the page mostly contains one focused workflow

### Prefer `PageContainer` when
- the page is more custom
- the layout does not match the usual utility shell
- existing nearby tools use `PageContainer`

For upload tools, also inspect:
- `components/ui/file-upload-button.tsx`

## Translation conventions

Runtime keys live under:
- `common.tools.<toolKey>.title`
- `common.tools.<toolKey>.description`
- `common.tools.<toolKey>.page.<field>`

Update all locales in `lib/i18n/translations.ts`:
- `en`
- `ko`
- `ja`
- `zh`

Do not update only `lib/i18n/<lang>/**`; runtime does not use those files.

## Step-by-step

### 1. Create the route file

Create `pages/utils/<tool-slug>.tsx`.

Follow an existing tool with similar behavior.
Common imports may include:
- `useState`, `useMemo`, or other React hooks
- `UtilsLayout` or `PageContainer`
- `Card`, `Button`, `Label`, `Textarea`, etc.
- `useI18n`
- `FileUploadButton` for file-based workflows

Use translated strings from the start.
Avoid introducing new hardcoded English UI if a nearby translated pattern exists.

### 2. Add translations

In `lib/i18n/translations.ts`, add:
- `common.tools.<toolKey>.title`
- `common.tools.<toolKey>.description`
- `common.tools.<toolKey>.page.*` keys used by the page

Keep the page key names aligned with the actual UI labels and states.

### 3. Wire the category card

Update the correct category page under `pages/category/`.

Add a new `Link href="/utils/<tool-slug>"` card in the intended order.
Prefer this translated pattern:
- `CardTitle>{t('common.tools.<toolKey>.title')}`
- description from `t('common.tools.<toolKey>.description')`

### 4. Add route metadata

Update `lib/seo/routeMeta.ts` with a `/utils/<tool-slug>` entry:
- `slug`
- `title`
- `description`
- `section`

If this is omitted, the route still works but SEO falls back to defaults.

### 5. Add focused verification if behavior is non-trivial

Use the smallest relevant test:
- i18n/rendering: `tests/i18n.spec.ts`
- metadata/OG: `tests/og.spec.ts`

For upload tools, use Playwright `setInputFiles(...)` against the hidden file input id if the page exposes one.

## Project-specific warnings

- The runtime i18n source is `lib/i18n/translations.ts`.
- `lib/seo/routeMeta.ts` is a manual registry and easy to forget.
- Several older tools are not ideal templates because they hardcode English text. Prefer translated modern pages such as `escaped-string-decoder.tsx`, `gif-crop.tsx`, or `mp4-to-gif.tsx` depending on shape.
- Home page changes are only required when adding a category, not a tool.

## Minimal checklist

- [ ] Created `pages/utils/<tool-slug>.tsx`
- [ ] Added `common.tools.<toolKey>` translations for all locales
- [ ] Added category card in the owning `pages/category/*.tsx`
- [ ] Added `/utils/<tool-slug>` metadata in `lib/seo/routeMeta.ts`
- [ ] Added or ran focused verification for the new route
