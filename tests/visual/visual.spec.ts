import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { expect, test, type Page } from '@playwright/test';
import { PNG } from 'pngjs';

import { compare, type CompareResult } from './compare';
import { screens } from './screens';

// Thu 12 Nov 2026 07:42 IST
const FROZEN_NOW = new Date('2026-11-12T07:42:00+05:30');
const DESIGN_DIR = path.resolve('docs/design');
const OUT_DIR = path.resolve('visual-diffs');
const MAX_MISMATCH_PCT = 1;
/** Allowed gap to the source render when the PNG itself can't be matched by Chromium. */
const MAX_SOURCE_MISMATCH_PCT = 0.5;
const only = process.env.SCREEN?.split(',');

interface ScreenResult {
  /** Ours vs the design PNG. */
  png: CompareResult;
  /** Original source rendered in Chromium vs the design PNG (best achievable with this engine). */
  floor: number;
  /** Ours vs the original source rendered in Chromium. */
  source: CompareResult;
}

const results: Record<string, ScreenResult> = {};

test.afterAll(() => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, 'report.json'), JSON.stringify(results, null, 2));
  console.log('screen            vs PNG   PNG floor  vs source   height ours/design');
  for (const [name, r] of Object.entries(results)) {
    console.log(
      `${name.padEnd(16)} ${String(r.png.mismatchPct).padStart(7)}%  ${String(r.floor).padStart(7)}%  ` +
        `${String(r.source.mismatchPct).padStart(7)}%   ${r.png.actualHeight}/${r.png.expectedHeight} (Δ ${r.png.heightDiff})`,
    );
  }
});

async function stabilise(page: Page) {
  await page.addStyleTag({
    content: `*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}
      html{scrollbar-width:none}::-webkit-scrollbar{display:none}`,
  });
  await page.evaluate(() => document.fonts.ready);
}

/** Renders the original self-unpacking design bundle at its frame size. */
async function renderSource(page: Page, file: string, height: number): Promise<Buffer> {
  await page.setViewportSize({ width: 390, height });
  await page.goto(pathToFileURL(path.join(DESIGN_DIR, 'render', file)).href);
  await page.waitForLoadState('networkidle');
  for (const frame of page.frames()) await frame.evaluate(() => document.fonts.ready).catch(() => undefined);
  await page.waitForTimeout(500);
  return page.screenshot({ clip: { x: 0, y: 0, width: 390, height } });
}

for (const screen of screens.filter((s) => !only || only.includes(s.name))) {
  test(screen.name, async ({ page, browser }) => {
    await page.clock.setFixedTime(FROZEN_NOW);
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
    await page.goto(screen.route);
    await stabilise(page);
    await page.waitForFunction(
      () => !document.querySelector('[data-skeleton], [aria-busy="true"]'),
      undefined,
      {
        timeout: 10_000,
      },
    );
    await page.waitForLoadState('networkidle');
    // Full-page shots keep the viewport height, which would pin sticky elements mid-page.
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.setViewportSize({ width: 390, height });
    await page.evaluate(() => document.fonts.ready);
    const shot = await page.screenshot({ fullPage: true, animations: 'disabled' });

    const designBuf = fs.readFileSync(path.join(DESIGN_DIR, screen.design));
    const designHeight = PNG.sync.read(designBuf).height;
    const srcPage = await browser.newPage({ deviceScaleFactor: 1 });
    const sourceBuf = await renderSource(srcPage, screen.render, designHeight);
    await srcPage.close();

    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(path.join(OUT_DIR, `${screen.name}.actual.png`), shot);
    fs.writeFileSync(path.join(OUT_DIR, `${screen.name}.source.png`), sourceBuf);

    const png = compare(shot, designBuf, OUT_DIR, screen.name);
    const floor = compare(sourceBuf, designBuf, OUT_DIR, `${screen.name}.floor`).mismatchPct;
    const source = compare(shot, sourceBuf, OUT_DIR, `${screen.name}.vs-source`);
    results[screen.name] = { png, floor, source };

    const ok =
      png.mismatchPct < MAX_MISMATCH_PCT ||
      (source.mismatchPct < MAX_SOURCE_MISMATCH_PCT && png.mismatchPct <= floor + 0.1);
    expect
      .soft(
        ok,
        `${screen.name}: vs PNG ${png.mismatchPct}% (floor ${floor}%), vs source ${source.mismatchPct}%`,
      )
      .toBe(true);
  });
}
