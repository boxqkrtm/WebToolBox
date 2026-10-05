// E2E V8 coverage harness: measures browser-side V8 coverage of app source
// exercised by the existing Playwright E2E flows (tests/*.spec.ts), without
// adding any new tests. Mirrors each spec's state-changing actions in a
// fresh context, collects coverage per flow block, converts V8 ranges to
// Istanbul via v8-to-istanbul, merges with istanbul-lib-coverage, and
// reports per-file + rollup percentages.

import { spawn, execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFile } from 'node:fs/promises';

import { chromium } from 'playwright';
import istanbulLibCoverage from 'istanbul-lib-coverage';
import v8toIstanbul from 'v8-to-istanbul';

const { createCoverageMap } = istanbulLibCoverage;
const ROOT = dirname(dirname(fileURLToPath(import.meta.url))) + '/';
const BASE_URL = 'http://localhost:3000';
const COVERAGE_ROOT = 'coverage/';
const COVERAGE_JSON = `${COVERAGE_ROOT}e2e-coverage.json`;

// --- (a) Dev server -------------------------------------------------------

async function isServerUp() {
  try {
    const res = await fetch(BASE_URL, { cache: 'no-store' });
    res.body?.cancel?.();
    return true;
  } catch {
    return false;
  }
}

async function startDevServer() {
  console.log('[coverage] starting dev server: pnpm dev');
  const child = spawn('pnpm', ['dev'], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: process.platform === 'win32',
  });
  child.stdout.on('data', () => {});
  child.stderr.on('data', () => {});
  const deadline = Date.now() + 120_000;
  for (;;) {
    if (await isServerUp()) {
      console.log('[coverage] dev server ready');
      return child;
    }
    if (Date.now() > deadline) throw new Error('dev server did not become ready in 120s');
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
}

async function ensureDevServer() {
  if (await isServerUp()) {
    console.log('[coverage] reusing existing dev server at', BASE_URL);
    return null;
  }
  return await startDevServer();
}

// --- Source inventory ------------------------------------------------------

const SOURCE_EXTS = new Set(['.ts', '.tsx', '.jsx']);

function isAppSourcePath(path) {
  const segments = path.split('/');
  if (segments[0] === 'node_modules' || segments[0] === '.next') return false;
  const last = segments[segments.length - 1];
  if (last.endsWith('.d.ts')) return false;
  return SOURCE_EXTS.has(last.slice(last.lastIndexOf('.')));
}

function sourceRoots() {
  const entries = [];
  const walk = (dir, rel) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      const relPath = rel ? rel + '/' + entry.name : entry.name;
      if (entry.isDirectory()) walk(full, relPath);
      else if (isAppSourcePath(relPath)) entries.push(relPath);
    }
  };
  for (const root of ['lib', 'components', 'pages']) walk(join(ROOT, root), root);
  return entries;
}

// --- Coverage collection ---------------------------------------------------

const SOURCES = sourceRoots();

function matchAppFile(k) {
  const key = k.replace(/\\/g, '/').split(/[?#]/)[0];
  for (const rel of SOURCES) {
    if (key.endsWith('/' + rel)) return rel;
  }
  return null;
}

async function collectBlock(browser, block) {
  const context = await browser.newContext({
    locale: block.locale,
    colorScheme: block.colorScheme,
  });
  const page = await context.newPage();
  if (block.clearLocalStorage) {
    await page.addInitScript(() => localStorage.clear());
  }

  const cdp = await context.newCDPSession(page);
  await page.coverage.startJSCoverage({ resetOnNavigation: false });
  try {
    await block.run(page);
    const entries = await page.coverage.stopJSCoverage();

    const map = {};
    for (const entry of entries) {
      if (!entry.url) continue;
      if (!entry.url.startsWith('http') && !entry.url.startsWith('webpack-internal')) continue;
      if (matchAppFile(entry.url) === null) continue;

      // Source recovery order: entry.source -> fetch by URL -> CDP.
      let source = entry.source;
      if (!source) {
        try {
          const res = await page.request.get(entry.url);
          if (res.ok()) source = await res.text();
        } catch {
          // data:/blob: URLs and navigations fail here
        }
      }
      if (!source) {
        try {
          const out = await cdp.send('Runtime.getScriptSource', { scriptId: entry.scriptId });
          source = out.result?.value;
        } catch {
          // script already gone from the runtime
        }
      }
      if (!source) {
        console.warn(`[coverage] no source for ${entry.url}`);
        continue;
      }

      const converter = v8toIstanbul(entry.url, 0, { source }, (p) => matchAppFile(p) === null);
      await converter.load();
      converter.applyCoverage(entry.functions);
      const ist = converter.toIstanbul();
      for (const [key, cov] of Object.entries(ist)) {
        if (map[key]) {
          map[key].merge(cov);
        } else {
          map[key] = istanbulLibCoverage.createFileCoverage(cov);
        }
      }
    }
    return map;
  } finally {
    await context.close();
  }
}

const SAMPLE_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAIAAADZSiLoAAAAG0lEQVR4nAXBgQEAIAzDINznvTyCEDrpJWeG+Y7yCILgHF5wAAAAAElFTkSuQmCC';

function createAnimatedWebp() {
  const directory = mkdtempSync(join(tmpdir(), 'studio-webp-'));
  const outputPath = join(directory, 'animated-color.webp');
  execFileSync('python3', [
    '-c',
    `
from PIL import Image
frames = [Image.new('RGB', (48, 32), color) for color in ('#ff3b30', '#34c759', '#007aff')]
frames[0].save(${JSON.stringify(outputPath)}, format='WEBP', save_all=True, append_images=frames[1:], duration=[120, 120, 120], loop=0, quality=80)
`,
  ]);
  return {
    name: 'animated-color.webp',
    mimeType: 'image/webp',
    buffer: readFileSync(outputPath),
  };
}

async function selectLanguage(page, language) {
  const optionLabel = language === 'ko' ? 'Korean' : language === 'ja' ? 'Japanese' : 'Chinese';
  await page.getByTestId('language-selector').click();
  await page.getByRole('option', { name: optionLabel }).click();
  await page.waitForTimeout(200);
}

const blocks = [
  {
    // tests/i18n.spec.ts
    name: 'i18n',
    locale: 'en-US',
    colorScheme: 'light',
    clearLocalStorage: true,
    run: async (page) => {
      for (const lang of ['ko', 'ja', 'zh']) {
        await page.goto(BASE_URL, { waitUntil: 'networkidle' });
        await selectLanguage(page, lang);
        if (lang === 'ko') {
          await page.goto(BASE_URL + '/category/etc', { waitUntil: 'networkidle' });
          await page.goto(BASE_URL, { waitUntil: 'networkidle' });
        }
      }
      await page.evaluate(() => localStorage.clear());
      await page.goto(BASE_URL + '/utils/mp4-gif-studio', { waitUntil: 'networkidle' });
      await selectLanguage(page, 'ko');
    },
  },
  {
    // tests/theme.spec.ts
    name: 'theme',
    locale: undefined,
    colorScheme: 'dark',
    clearLocalStorage: true,
    run: async (page) => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      const toggle = page.getByTestId('theme-toggle');
      await toggle.click();
      await page.waitForTimeout(100);
      await toggle.click();
      await page.waitForTimeout(100);
    },
  },
  {
    // tests/og.spec.ts
    name: 'og',
    locale: 'en-US',
    colorScheme: 'light',
    clearLocalStorage: true,
    run: async (page) => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      await page.goto(BASE_URL + '/utils/csv-sorter', { waitUntil: 'networkidle' });
    },
  },
  {
    // tests/qr-code-generator.spec.ts
    name: 'qr-code-generator',
    locale: 'en-US',
    colorScheme: 'light',
    clearLocalStorage: false,
    run: async (page) => {
      await page.goto(BASE_URL + '/utils/qr-code-generator', { waitUntil: 'networkidle' });
      await page.getByTestId('dithered-qr-fun-button').click();
      await page
        .getByTestId('dithered-qr-image-input')
        .setInputFiles({
          name: 'sample.png',
          mimeType: 'image/png',
          buffer: Buffer.from(SAMPLE_PNG_BASE64, 'base64'),
        });
      await page.waitForTimeout(500);
      // Close the dithered panel to reveal the generate tab
      await page.getByTestId('dithered-qr-fun-button').click();
      await page.getByTestId('qr-code-input').fill('HELLO-WORLD-123');
      await page.waitForTimeout(500);
      const canvas = page.getByTestId('qr-code-canvas-container').locator('canvas');
      await canvas.evaluate((node) => node.toDataURL('image/png'));
      await page.getByTestId('tab-read').click();
      await page.getByTestId('qr-file-input').setInputFiles({
        name: 'sample-qr.png',
        mimeType: 'image/png',
        buffer: Buffer.from(SAMPLE_PNG_BASE64, 'base64'),
      });
      await page.waitForTimeout(500);
    },
  },
  {
    // tests/mp4-gif-studio.spec.ts
    name: 'mp4-gif-studio',
    locale: 'en-US',
    colorScheme: 'light',
    clearLocalStorage: false,
    run: async (page) => {
      await page.goto(BASE_URL + '/utils/mp4-gif-studio', { waitUntil: 'networkidle' });
      await page.locator('#mp4-gif-studio-upload').setInputFiles(createAnimatedWebp());
      await page.getByText('Ready to edit').waitFor({ state: 'visible', timeout: 150_000 });
      await page.locator('#studio-auto-download').uncheck();
      await page.getByTestId('studio-export-button').click();
      await page
        .getByTestId('studio-result')
        .waitFor({ state: 'visible', timeout: 150_000 });
    },
  },
];

// --- Reporting -------------------------------------------------------------

function summarize(map) {
  const total = { statements: 0, functions: 0, branches: 0, lines: 0 };
  const perFile = {};
  for (const [file, cov] of Object.entries(map)) {
    // cov is a plain object from CoverageMap.toJSON() with s, f, b, statementMap, fnMap, branchMap
    const data = cov;
    const s = data.statementMap;
    const f = data.fnMap;
    const b = data.branchMap;
    // Compute line coverage from statementMap
    const lineMap = {};
    const lineCounts = {};
    for (const [k, loc] of Object.entries(s)) {
      const startLine = loc.start.line;
      const endLine = loc.end.line;
      const count = data.s[k] ?? 0;
      for (let line = startLine; line <= endLine; line++) {
        lineMap[line] = true;
        lineCounts[line] = Math.max(lineCounts[line] ?? 0, count);
      }
    }
    const sum = (m, c) => {
      let hit = 0;
      let total = 0;
      for (const k of Object.keys(m)) {
        total += 1;
        if ((c[k] ?? 0) > 0) hit += 1;
      }
      return { hit, total };
    };
    const stats = {
      statements: sum(s, data.s),
      functions: sum(f, data.f),
      branches: sum(b, data.b),
      lines: sum(lineMap, lineCounts),
    };
    const pct = (x) => (x.total === 0 ? 100 : (100 * x.hit) / x.total);
    for (const key of ['statements', 'functions', 'branches', 'lines']) {
      total[key] += stats[key].total;
      total[`${key}Hit`] = (total[`${key}Hit`] ?? 0) + stats[key].hit;
    }
    perFile[file] = {
      statements: pct(stats.statements),
      functions: pct(stats.functions),
      branches: pct(stats.branches),
      lines: pct(stats.lines),
    };
  }
  const pct = (key) =>
    total[key] === 0 ? 100 : (100 * (total[`${key}Hit`] ?? 0)) / total[key];
  return {
    perFile,
    rollup: {
      statements: pct('statements'),
      functions: pct('functions'),
      branches: pct('branches'),
      lines: pct('lines'),
    },
  };
}

function printReport(title, summary, files) {
  const rows = files
    .map((file) => {
      const p = summary.perFile[file];
      if (!p) return null;
      const fmt = (v) => `${v.toFixed(1)}%`;
      return [file, fmt(p.statements), fmt(p.functions), fmt(p.branches), fmt(p.lines)];
    })
    .filter(Boolean);
  const widths = [
    Math.max(10, ...rows.map((r) => r[0].length)),
    12,
    12,
    12,
    12,
  ];
  const line = (cells) =>
    cells.map((c, i) => c.toString().padEnd(widths[i], ' ')).join(' | ');
  console.log(`\n=== ${title} ===`);
  console.log(
    line(['file', 'stmts %', 'fns %', 'br %', 'lines %'])
  );
  console.log(line(['-'.repeat(widths[0]), '-'.repeat(9), '-'.repeat(9), '-'.repeat(9), '-'.repeat(9)]));
  for (const row of rows) console.log(line(row));
  const r = summary.rollup;
  console.log(
    line([
      'TOTAL',
      `${r.statements.toFixed(1)}%`,
      `${r.functions.toFixed(1)}%`,
      `${r.branches.toFixed(1)}%`,
      `${r.lines.toFixed(1)}%`,
    ])
  );
}

// --- Main ------------------------------------------------------------------

async function main() {
  console.log(`[coverage] ${SOURCES.length} app source files inventoried`);

  const server = await ensureDevServer();
  const browser = await chromium.launch();
  try {
    const merged = createCoverageMap();
    for (const block of blocks) {
      console.log(`[coverage] block: ${block.name}`);
      const map = await collectBlock(browser, block);
      merged.merge(map);
      console.log(`[coverage]   ${Object.keys(map).length} converted files`);
    }

    const all = merged.toJSON();
    const summaryAll = summarize(all);
    const summaryApp = summarize(
      Object.fromEntries(Object.entries(all).filter(([f]) => f.startsWith('pages/api/') === false))
    );

    const sorted = Object.keys(all).sort();
    printReport('Per-file coverage (all app source)', summaryAll, sorted);
    printReport('Per-file coverage (excluding pages/api)', summaryApp, sorted.filter((f) => !f.startsWith('pages/api/')));

    await writeFile(
      join(ROOT, COVERAGE_JSON),
      JSON.stringify({ generatedAt: new Date().toISOString(), all, app: Object.fromEntries(Object.entries(all).filter(([f]) => !f.startsWith('pages/api/'))) }, null, 2)
    );
    console.log(`\n[coverage] wrote ${COVERAGE_JSON}`);

    // Verification: files that must show >0%
    const mustCover = [
      'C:\\repo\\WebToolBox\\lib\\i18n\\translations.ts',
      'C:\\repo\\WebToolBox\\components\\Header.tsx',
      'C:\\repo\\WebToolBox\\lib\\theme\\themeContext.tsx',
      'C:\\repo\\WebToolBox\\pages\\utils\\qr-code-generator.tsx',
      'C:\\repo\\WebToolBox\\lib\\ditheredQr.ts',
      'C:\\repo\\WebToolBox\\lib\\media\\mp4GifStudio.ts',
    ];
    const missing = mustCover.filter((f) => {
      const p = summaryAll.perFile[f];
      return !p || p.lines === 0;
    });
    if (missing.length > 0) {
      console.error(`[coverage] VERIFICATION FAILED: expected >0% for: ${missing.join(', ')}`);
      process.exitCode = 1;
    } else {
      console.log('[coverage] verification: all expected files covered');
    }
  } finally {
    await browser.close();
    if (server) {
      server.kill('SIGTERM');
      await new Promise((resolve) => setTimeout(resolve, 2_000));
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
