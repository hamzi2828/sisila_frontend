import type { SalesTrendPoint } from '../services/dashboardService';

export interface TrendPoint {
  /** "YYYY-MM-DD" (day buckets) or "YYYY-MM" (month buckets, year view). */
  key: string;
  /** Short axis label, e.g. "Oct 19" / "Oct". */
  label: string;
  /** Tooltip label, e.g. "Sun, Oct 19, 2026" / "October 2026". */
  fullLabel: string;
  sales: number;
  orders: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

// The backend groups orders by UTC day ($dateToString default), so buckets are built in UTC too.
const dayKey = (d: Date) => d.toISOString().slice(0, 10);
const monthKey = (d: Date) => d.toISOString().slice(0, 7);
const parseDay = (key: string) => new Date(`${key}T00:00:00Z`);
const parseMonth = (key: string) => new Date(`${key}-01T00:00:00Z`);

const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', ...opts });
const shortDay = fmt({ month: 'short', day: 'numeric' });
const longDay = fmt({ weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
const shortMonth = fmt({ month: 'short' });
const longMonth = fmt({ month: 'long', year: 'numeric' });

const RANGE_DAYS: Record<string, number> = { today: 0, week: 7, month: 30, year: 365 };

/**
 * Turns the sparse per-day trend from the API (only days that had orders) into a
 * continuous series covering the whole selected period, with zero-filled gaps.
 * The year view is rolled up into calendar months.
 */
export function buildTrendSeries(points: SalesTrendPoint[] | null | undefined, timeRange: string): TrendPoint[] {
  const clean = (points ?? []).filter((p) => p && typeof p.date === 'string' && /^\d{4}-\d{2}/.test(p.date));
  const now = new Date();
  const lookback = RANGE_DAYS[timeRange] ?? 7;

  if (timeRange === 'year') {
    const totals = new Map<string, { sales: number; orders: number }>();
    for (const p of clean) {
      const k = p.date.slice(0, 7);
      const t = totals.get(k) ?? { sales: 0, orders: 0 };
      t.sales += Number(p.sales) || 0;
      t.orders += Number(p.orders) || 0;
      totals.set(k, t);
    }
    let startKey = monthKey(new Date(now.getTime() - lookback * DAY_MS));
    for (const k of Array.from(totals.keys())) if (k < startKey) startKey = k;
    const endKey = monthKey(now);

    const series: TrendPoint[] = [];
    const cursor = parseMonth(startKey);
    while (monthKey(cursor) <= endKey && series.length < 36) {
      const k = monthKey(cursor);
      const t = totals.get(k);
      series.push({ key: k, label: shortMonth.format(cursor), fullLabel: longMonth.format(cursor), sales: t?.sales ?? 0, orders: t?.orders ?? 0 });
      cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    }
    return series;
  }

  const byDay = new Map<string, { sales: number; orders: number }>();
  for (const p of clean) {
    const k = p.date.slice(0, 10);
    const t = byDay.get(k) ?? { sales: 0, orders: 0 };
    t.sales += Number(p.sales) || 0;
    t.orders += Number(p.orders) || 0;
    byDay.set(k, t);
  }
  let startKey = dayKey(new Date(now.getTime() - lookback * DAY_MS));
  for (const k of Array.from(byDay.keys())) if (k < startKey) startKey = k;
  let endKey = dayKey(now);
  for (const k of Array.from(byDay.keys())) if (k > endKey) endKey = k;

  const series: TrendPoint[] = [];
  const cursor = parseDay(startKey);
  while (dayKey(cursor) <= endKey && series.length < 400) {
    const k = dayKey(cursor);
    const t = byDay.get(k);
    series.push({ key: k, label: shortDay.format(cursor), fullLabel: longDay.format(cursor), sales: t?.sales ?? 0, orders: t?.orders ?? 0 });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return series;
}

/** Real period-over-period change. Returns null when there is no baseline to compare with. */
export function periodChange(current: number | undefined, previous: number | undefined): { value: string; direction: 'up' | 'down' } | null {
  if (typeof current !== 'number' || typeof previous !== 'number' || !Number.isFinite(current) || !Number.isFinite(previous)) return null;
  if (previous === 0) return null;
  const pct = ((current - previous) / previous) * 100;
  if (!Number.isFinite(pct)) return null;
  const rounded = Math.abs(pct) >= 100 ? Math.round(pct) : Math.round(pct * 10) / 10;
  return { value: `${rounded >= 0 ? '+' : ''}${rounded}%`, direction: rounded >= 0 ? 'up' : 'down' };
}
