import { Link } from 'react-router-dom';

import { PageHeader } from '@/shared/layout';

export default function NotFoundView() {
  return (
    <PageHeader className="flex flex-col gap-[4px] px-[16px] py-[14px]">
      <h1 className="m-0 font-serif text-[22px] leading-[1.1] font-normal">
        Not found <em className="text-subtle italic">— 404</em>
      </h1>
      <Link to="/" className="font-mono text-[11px] tracking-[0.1em] text-muted uppercase">
        Back to overview →
      </Link>
    </PageHeader>
  );
}
