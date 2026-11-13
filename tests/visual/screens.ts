export interface Screen {
  name: string;
  route: string;
  design: string;
  /** Original design source (self-unpacking bundle) rendered in the same Chromium. */
  render: string;
  /**
   * Compare only down to the bottom of this element. Used when a requested change removed a
   * section, so everything below it no longer lines up with the design.
   */
  compareUntil?: string;
}

/** Elements that intentionally differ from the design are marked and masked in every diff. */
export const DEVIATION_SELECTOR = '[data-design-deviation]';

export const screens: Screen[] = [
  {
    name: 'overview',
    route: '/',
    design: '1-overview.png',
    render: '1-overview.html',
    // The 2×2 stat cards below the BOD window were removed on request.
    compareUntil: 'section[aria-label="BOD window"]',
  },
  { name: 'customers', route: '/customers', design: '2-customers.png', render: '2-customers.html' },
  {
    name: 'customer-detail',
    route: '/customers/cholamandalam',
    design: '3-customer-detail.png',
    render: '3-customer-detail.html',
  },
  {
    name: 'module-checks',
    route: '/customers/cholamandalam/modules/open-api',
    design: '4-module-checks.png',
    render: '4-module-checks.html',
  },
  // ETL row tap opens the same checks screen; it must match design screen 4 exactly.
  {
    name: 'etl-checks',
    route: '/customers/cholamandalam/etl/cm-fo',
    design: '4-module-checks.png',
    render: '4-module-checks.html',
  },
  { name: 'report', route: '/reports/4812', design: '5-report.png', render: '5-report.html' },
];
