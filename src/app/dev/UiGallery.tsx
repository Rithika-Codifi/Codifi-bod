import { useState, type ReactNode } from 'react';

import {
  Button,
  Card,
  CodeBlock,
  EmptyState,
  ErrorState,
  FilterChips,
  FilterTabs,
  IconButton,
  LinkButton,
  ListRow,
  MetaGrid,
  MethodChip,
  ProgressLine,
  RefreshIcon,
  SearchInput,
  SectionHeader,
  SegmentedBar,
  SegmentedLine,
  SkeletonList,
  Spinner,
  StatCard,
  StatCardGrid,
  StatStrip,
  StatusBadge,
  StatusDot,
  StatusIcon,
  StatusLegend,
  Timeline,
  toast,
} from '@/shared/ui';

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-[8px]">
      <span className="font-mono text-[10.5px] tracking-[0.12em] text-muted uppercase">{title}</span>
      {children}
    </section>
  );
}

/** Dev-only component gallery at /__ui. */
export default function UiGallery() {
  const [tab, setTab] = useState<'all' | 'fail' | 'warn' | 'pass'>('all');
  const [q, setQ] = useState('');
  return (
    <div className="flex flex-col gap-[24px] p-[16px]">
      <h1 className="m-0 font-serif text-[30px] leading-[1.05] font-normal">
        Shared UI <em className="text-[22px] text-subtle italic">gallery</em>
      </h1>

      <Block title="StatusBadge md / sm">
        <div className="flex flex-wrap gap-[8px]">
          {(['fail', 'warn', 'pass', 'running'] as const).map((s) => (
            <StatusBadge key={s} status={s} />
          ))}
          {(['fail', 'warn', 'pass', 'running'] as const).map((s) => (
            <StatusBadge key={`sm-${s}`} status={s} size="sm" />
          ))}
        </div>
      </Block>

      <Block title="StatusIcon 56 / 26 / 24 · StatusDot">
        <div className="flex flex-wrap items-center gap-[16px] pl-[8px]">
          <StatusIcon status="fail" size={56} ring />
          <StatusIcon status="warn" size={56} ring />
          <StatusIcon status="pass" size={56} ring />
          <StatusIcon status="fail" size={26} />
          <StatusIcon status="warn" size={26} />
          <StatusIcon status="pass" size={24} />
          <StatusIcon status="running" size={24} />
          <StatusDot status="fail" />
          <StatusDot status="warn" />
          <StatusDot status="pass" />
        </div>
      </Block>

      <Block title="Buttons">
        <div className="flex gap-[10px]">
          <Button fill>Retest all failed</Button>
          <LinkButton to="/reports/4812" variant="secondary" fill>
            Latest report
          </LinkButton>
        </div>
        <div className="flex gap-[10px]">
          <Button fill loading>
            Retesting
          </Button>
          <Button fill variant="secondary" onClick={() => toast.show('Retest queued for 3 checks')}>
            Show toast
          </Button>
        </div>
        <div className="flex items-center gap-[8px]">
          <IconButton label="Retest">
            <RefreshIcon size={18} />
          </IconButton>
          <Spinner label="Loading" />
        </div>
      </Block>

      <Block title="SegmentedBar · ProgressLine · SegmentedLine">
        <SegmentedBar
          height={30}
          minSegmentWidth={28}
          segments={[
            { status: 'pass', n: 12 },
            { status: 'warn', n: 3 },
            { status: 'fail', n: 2 },
          ]}
        />
        <SegmentedBar
          segments={[
            { status: 'pass', n: 31 },
            { status: 'warn', n: 1, width: 34 },
            { status: 'fail', n: 2, width: 34 },
          ]}
        />
        <ProgressLine status="fail" ratio={37 / 42} />
        <SegmentedLine pass={31} warn={1} fail={2} />
      </Block>

      <Block title="StatusLegend">
        <StatusLegend
          items={[
            { status: 'pass', label: 'Passed', n: 12, pct: '70.6%' },
            { status: 'warn', label: 'Warning', n: 3, pct: '17.6%' },
            { status: 'fail', label: 'Failed', n: 2, pct: '11.8%' },
          ]}
        />
      </Block>

      <Block title="Timeline">
        <Timeline
          startLabel="05:30 start"
          nowLabel="07:42 now"
          cutoffLabel="08:30 cutoff"
          nowRatio={0.63}
          cutoffRatio={0.86}
        />
      </Block>

      <Block title="SearchInput · FilterTabs · FilterChips">
        <SearchInput value={q} onChange={setQ} placeholder="Search customer" label="Search customers" />
        <FilterTabs
          label="Filter by status"
          value={tab}
          onChange={setTab}
          tabs={[
            { key: 'all', label: 'All', count: 17 },
            { key: 'fail', label: 'Failed', count: 2, status: 'fail' },
            { key: 'warn', label: 'Warning', count: 3, status: 'warn' },
            { key: 'pass', label: 'Passed', count: 12, status: 'pass' },
          ]}
        />
        <FilterChips
          label="Filter checks"
          value={tab}
          onChange={setTab}
          chips={[
            { key: 'all', label: 'All', count: 34 },
            { key: 'fail', label: 'Failed', count: 2 },
            { key: 'warn', label: 'Warning', count: 1 },
            { key: 'pass', label: 'Passed', count: 31 },
          ]}
        />
      </Block>

      <Block title="StatCardGrid · StatStrip · MetaGrid">
        <StatCardGrid>
          <StatCard label="Failed checks" value={9} caption="3 ETL · 6 API" tone="fail" highlight />
          <StatCard label="Warnings" value={14} caption="Delays · slow APIs" tone="warn" />
          <StatCard
            label="ETL jobs done"
            value={130}
            suffix="/136"
            caption="Across 17 customers"
            tone="pass"
          />
          <StatCard label="Avg run time" value="3m 48s" caption="Per customer sanity" />
        </StatCardGrid>
        <StatStrip
          items={[
            { label: 'ETL', value: 6, suffix: '/8' },
            { label: 'Modules', value: 7, suffix: '/9' },
            { label: 'Last run', value: '07:38' },
          ]}
        />
        <MetaGrid
          label="Run details"
          items={[
            { label: 'Trigger', value: 'Scheduled · 07:35' },
            { label: 'Duration', value: '2m 41s' },
          ]}
        />
      </Block>

      <Block title="Card · SectionHeader · ListRow · MethodChip · CodeBlock">
        <Card>
          <SectionHeader
            title="ETL process"
            right="Upload → validate → load"
            rightClassName="tracking-[0.08em] uppercase text-subtle"
            className="border-b border-border pt-[16px] pr-[16px] pb-[12px] pl-[18px]"
          />
          <ListRow className="min-h-[64px] gap-[12px] py-[10px] pr-[8px] pl-[18px]">
            <StatusDot status="fail" />
            <div className="flex min-w-0 flex-auto flex-col gap-[3px]">
              <span className="text-[14px] font-semibold">Contract master</span>
              <span className="flex items-center gap-[6px] font-mono text-[11px] text-muted">
                <MethodChip method="POST" />
                /orders/regular
              </span>
            </div>
            <StatusBadge status="fail" size="sm" />
          </ListRow>
        </Card>
        <CodeBlock>{'> POST /orders/regular\n< 502 Bad Gateway  (30,004 ms)'}</CodeBlock>
      </Block>

      <Block title="EmptyState · ErrorState · Skeleton">
        <Card>
          <EmptyState>No customers match this filter.</EmptyState>
        </Card>
        <ErrorState message="Network unavailable. Check your connection." onRetry={() => undefined} />
        <SkeletonList rows={2} />
      </Block>
    </div>
  );
}
