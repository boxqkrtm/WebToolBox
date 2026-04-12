import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const languages = ['en', 'ko', 'ja', 'zh'];
const localeDir = path.join(repoRoot, 'lib', 'i18n');
const sourceRoots = ['components', 'lib', 'pages', 'tests'].map((dir) => path.join(repoRoot, dir));
const sourceExtensions = new Set(['.ts', '.tsx']);
const translationKeyPattern = /t\(\s*['"]([^'"]+)['"]\s*\)/g;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function walk(dirPath, files = []) {
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next') {
      continue;
    }

    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
      continue;
    }

    if (sourceExtensions.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function resolveKey(locale, key) {
  return key.split('.').reduce((value, part) => {
    if (value && typeof value === 'object' && part in value) {
      return value[part];
    }
    return undefined;
  }, locale);
}

const locales = Object.fromEntries(
  languages.map((language) => [language, readJson(path.join(localeDir, `${language}.json`))])
);

const usedKeys = [];
for (const root of sourceRoots) {
  for (const filePath of walk(root)) {
    const content = fs.readFileSync(filePath, 'utf8');
    for (const match of content.matchAll(translationKeyPattern)) {
      if (match[1].startsWith('common.') || match[1].startsWith('errors.')) {
        usedKeys.push({ key: match[1], filePath });
      }
    }
  }
}

const errors = [];
const seen = new Set();
for (const { key, filePath } of usedKeys) {
  const dedupeKey = `${filePath}::${key}`;
  if (seen.has(dedupeKey)) {
    continue;
  }
  seen.add(dedupeKey);

  for (const language of languages) {
    const value = resolveKey(locales[language], key);
    if (typeof value !== 'string') {
      errors.push(`${language}: missing or non-string key ${key} in ${path.relative(repoRoot, filePath)}`);
    }
  }
}

if (errors.length > 0) {
  console.error('i18n check failed');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('i18n check passed');
