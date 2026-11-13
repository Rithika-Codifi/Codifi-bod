import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { screens } from '../visual/screens';

/**
 * Colour contrast is reported but not enforced: the light palette is fixed by the design
 * (e.g. white counts on the amber bar). Everything else must have zero violations.
 */
const REPORT_ONLY = ['color-contrast'];

for (const screen of screens) {
  test(`a11y: ${screen.name}`, async ({ page }) => {
    await page.goto(screen.route);
    await page.waitForFunction(() => !document.querySelector('[data-skeleton], [aria-busy="true"]'));
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze();
    const blocking = results.violations.filter((v) => !REPORT_ONLY.includes(v.id));
    for (const v of results.violations) {
      console.log(
        `${screen.name}: ${REPORT_ONLY.includes(v.id) ? '(report only) ' : ''}${v.id} ×${v.nodes.length} — ${v.help}\n` +
          v.nodes
            .slice(0, 4)
            .map((n) => `    ${n.target.join(' ')}`)
            .join('\n'),
      );
    }
    expect(blocking.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
  });
}
