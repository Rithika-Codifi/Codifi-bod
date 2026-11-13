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

function crop(src: PNG, width: number, height: number): PNG {
  const out = new PNG({ width, height });
  PNG.bitblt(src, out, 0, 0, width, height, 0, 0);
  return out;
}

export function compare(actualBuf: Buffer, expectedBuf: Buffer, outDir: string, name: string): CompareResult {
  const actual = PNG.sync.read(actualBuf);
  const expected = PNG.sync.read(expectedBuf);
  const width = Math.min(actual.width, expected.width);
  const height = Math.min(actual.height, expected.height);
  const a = crop(actual, width, height);
  const e = crop(expected, width, height);
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
