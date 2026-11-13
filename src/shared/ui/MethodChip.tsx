export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DEL' | 'WS';

export function MethodChip({ method }: { method: HttpMethod }) {
  return <b className="bg-surface-muted px-[4px] py-[1px] text-[10px] text-text">{method}</b>;
}
