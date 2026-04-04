---
name: translation-add-fix
description: Add translations or fix raw translation-key issues in WebToolBox using the active runtime i18n source.
metadata:
  short-description: Add/fix WebToolBox translations
---

# Translation Add / Translation Issue Fix

Use this skill when WebToolBox needs a new translated string or when the UI shows a raw key such as `common.tools.gifCrop.page.dragHint`.

## Scope

This project’s active runtime i18n source is:
- `lib/i18n/translations.ts`
- `lib/i18n/i18nContext.tsx`

Do not treat these as the source of truth for runtime fixes:
- `lib/i18n/loader.ts`
- `lib/i18n/en/**`
- `lib/i18n/ko/**`
- `lib/i18n/ja/**`
- `lib/i18n/zh/**`

The app resolves translations through `useI18n().t(key)`. On a miss, it:
1. tries the selected language
2. falls back to English
3. returns the raw key string

That means raw-key-on-screen bugs almost always mean the key is missing from both the selected locale and English, or the path resolves to a non-string.

## When the screen shows the key itself

Example symptom:
- UI shows `common.tools.gifCrop.page.dragHint`

Fast diagnosis:
1. Find the render call using the key in the page/component.
2. Check the exact dotted path in `lib/i18n/translations.ts`.
3. Verify the key exists under all four locales: `en`, `ko`, `ja`, `zh`.
4. Verify the final leaf is a string, not an object.
5. If the component uses `t(...) || 'fallback text'`, remember that fallback is usually ineffective because the raw key string is truthy.

## Canonical key layout

Runtime keys live under `translations.<lang>.common...`

Common patterns:
- Category labels: `common.categories.<categoryKey>.title`
- Category descriptions: `common.categories.<categoryKey>.description`
- Tool labels: `common.tools.<toolKey>.title`
- Tool descriptions: `common.tools.<toolKey>.description`
- Tool page copy: `common.tools.<toolKey>.page.<field>`

## Add a new translation key

1. Find an existing sibling key in the consuming UI.
2. Open `lib/i18n/translations.ts`.
3. Add the new key at the exact same nesting path for all locales:
   - `en`
   - `ko`
   - `ja`
   - `zh`
4. Keep naming consistent with nearby keys.
5. Use the same dotted key in the component via `t('...')`.
6. Prefer fixing the translation source over adding local string fallbacks.

## Fix a missing translation issue

1. Confirm the page/component already uses the correct key.
2. Add the missing key to `lib/i18n/translations.ts` in all locales.
3. If the page has a local fallback string next to `t(...)`, remove it only if it is misleading or dead; do not make unnecessary churn.
4. Re-run a focused UI verification.

## Fast verification pattern

Prefer focused Playwright coverage in `tests/i18n.spec.ts`.

Useful pattern:
- navigate to the route
- switch language using the existing language selector
- trigger the UI state that reveals the translated text
- assert the translated text is visible
- assert the raw key is not visible when appropriate

Example project-specific command:
- `pnpm exec playwright test tests/i18n.spec.ts -g "should render translated gif crop drag hint instead of raw key"`

## Project-specific warnings

- Do not update only the modular locale files under `lib/i18n/<lang>/`; runtime does not read them.
- Do not assume a local JSX fallback after `t(...)` will rescue missing keys.
- Read `lib/i18n/i18nContext.tsx` if behavior looks surprising; the resolver behavior matters.
- For tool pages, search for nearby `common.tools.<toolKey>.page.*` keys and follow that structure exactly.

## Minimal checklist

- [ ] Found the exact render call
- [ ] Verified exact key path in `translations.ts`
- [ ] Added/fixed the key in `en/ko/ja/zh`
- [ ] Verified the leaf is a string
- [ ] Ran a focused verification for the affected route
