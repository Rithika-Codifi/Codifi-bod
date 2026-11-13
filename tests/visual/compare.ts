import fs from 'node:fs';
import path from 'node:path';

import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

export interface CompareResult {
  width: number;
  comparedHeight: number;
  actualHeight: number;
  expectedHeight: number;
  heightDiff: number;
  mismatchedPixels: number;
  mismatchPct: number;
  diffPath: string;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CompareOptions {
  /** Regions excluded from the diff (intentional design deviations). */
  mask?: Rect[];
  /** Compare only the top N pixels. */
  maxHeight?: number;
}

function paint(img: PNG, rects: Rect[]) {
  for (const r of rects) {
    const x0 = Math.max(0, Math.floor(r.x)),
      x1 = Math.min(img.width, Math.ceil(r.x + r.width));
    const y0 = Math.max(0, Math.floor(r.y)),
      y1 = Math.min(img.height, Math.ceil(r.y + r.height));
    for (let y = y0; y < y1; y++)
      for (let x = x0; x < x1; x++) {
        const i = (y * img.width + x) * 4;
        img.data[i] = 255;
        img.data[i + 1] = 0;
        img.data[i + 2] = 255;
        img.data[i + 3] = 255;
      }
  }
}

function crop(src: PNG, width: number, height: number): PNG {
  const out = new PNG({ width, height });
  PNG.bitblt(src, out, 0, 0, width, height, 0, 0);
  return out;
}

export function compare(
  actualBuf: Buffer,
  expectedBuf: Buffer,
  outDir: string,
  name: string,
  { mask = [], maxHeight }: CompareOptions = {},
): CompareResult {
  const actual = PNG.sync.read(actualBuf);
  const expected = PNG.sync.read(expectedBuf);
  const width = Math.min(actual.width, expected.width);
  const height = Math.min(actual.height, expected.height, maxHeight ?? Infinity);
  const a = crop(actual, width, height);
  const e = crop(expected, width, height);
  paint(a, mask);
  paint(e, mask);
  const diff = new PNG({ width, height });
  const mismatched = pixelmatch(a.data, e.data, diff.data, width, height, {
    threshold: 0.1,
    includeAA: false,
  });

  fs.mkdirSync(outDir, { recursive: true });
  const diffPath = path.join(outDir, `${name}.diff.png`);
  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  return {
    width,
    comparedHeight: height,
    actualHeight: actual.height,
    expectedHeight: expected.height,
    heightDiff: actual.height - expected.height,
    mismatchedPixels: mismatched,
    mismatchPct: Number(((mismatched / (width * height)) * 100).toFixed(3)),
    diffPath,
  };
}
