'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, LineChart } from 'lucide-react';
import type { TrendPoint } from './trend';

interface SalesTrendChartProps {
  title: string;
  /** e.g. "Last 7 days" */
  subtitle?: string;
  data: TrendPoint[];
  valueKey: 'sales' | 'orders';
  /** Formats values in the tooltip and headline. */
  formatValue: (value: number) => string;
  /** Formats y-axis tick labels (defaults to compact numbers: 12K). */
  formatAxis?: (value: number) => string;
  /** Headline shown top-right (e.g. period total). */
  total?: React.ReactNode;
  /** Real period-over-period change, if a baseline exists. */
  change?: { value: string; direction: 'up' | 'down' } | null;
  emptyTitle?: string;
  emptyDescription?: string;
}

const HEIGHT = 200;
const MARGIN = { top: 12, right: 12, bottom: 26, left: 44 };
const INK = '#1c1917'; // stone-900
const GRID = '#e7e5e4'; // stone-200
const AXIS_TEXT = '#a8a29e'; // stone-400
const CROSSHAIR = '#d6d3d1'; // stone-300

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });

function niceTicks(max: number, integer: boolean): number[] {
  if (!(max > 0)) return [0, 1];
  const raw = max / 3;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const r = raw / mag;
  let step = (r > 5 ? 10 : r > 2 ? 5 : r > 1 ? 2 : 1) * mag;
  if (integer) step = Math.max(1, Math.ceil(step));
  const top = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = 0; v <= top + step / 2; v += step) ticks.push(Math.round(v * 1000) / 1000);
  return ticks;
}

export const SalesTrendChart: React.FC<SalesTrendChartProps> = ({
  title,
  subtitle,
  data,
  valueKey,
  formatValue,
  formatAxis = (v) => compact.format(v),
  total,
  change,
  emptyTitle = 'No orders in this period',
  emptyDescription = 'The trend will appear here once orders come in.',
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    setWidth(el.clientWidth);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setWidth(Math.floor(w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const values = useMemo(() => data.map((d) => Math.max(0, Number(d[valueKey]) || 0)), [data, valueKey]);
  const hasData = values.some((v) => v > 0);
  const n = values.length;

  const geo = useMemo(() => {
    if (!width || n === 0) return null;
    const innerW = Math.max(10, width - MARGIN.left - MARGIN.right);
    const innerH = HEIGHT - MARGIN.top - MARGIN.bottom;
    const ticks = niceTicks(Math.max(...values), valueKey === 'orders');
    const yMax = ticks[ticks.length - 1] || 1;
    const stepX = n > 1 ? innerW / (n - 1) : 0;
    const x = (i: number) => MARGIN.left + (n > 1 ? i * stepX : innerW / 2);
    const y = (v: number) => MARGIN.top + innerH - (v / yMax) * innerH;
    const pts = values.map((v, i) => [x(i), y(v)] as const);
    const baseY = MARGIN.top + innerH;
    const line = n > 1 ? `M ${pts.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(' L ')}` : '';
    const area = n > 1 ? `${line} L ${pts[n - 1][0].toFixed(1)},${baseY} L ${pts[0][0].toFixed(1)},${baseY} Z` : '';
    // x labels: at most ~6 (3 on narrow cards), always include first and last
    const maxLabels = width < 420 ? 3 : 6;
    const every = Math.max(1, Math.ceil(n / maxLabels));
    const labelIdx = new Set<number>();
    for (let i = 0; i < n; i += every) labelIdx.add(i);
    if (n > 1) {
      const lastShown = Math.max(...Array.from(labelIdx));
      if (n - 1 - lastShown < every / 2) labelIdx.delete(lastShown);
      labelIdx.add(n - 1);
    }
    return { innerW, innerH, ticks, yMax, x, y, pts, baseY, line, area, labelIdx, stepX };
  }, [width, n, values, valueKey]);

  const indexFromClientX = (clientX: number, rect: DOMRect) => {
    if (!geo || n === 0) return null;
    if (n === 1) return 0;
    const rel = clientX - rect.left - MARGIN.left;
    return Math.min(n - 1, Math.max(0, Math.round(rel / geo.stepX)));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!n) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setHover((h) => (h === null ? 0 : Math.min(n - 1, h + 1)));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setHover((h) => (h === null ? n - 1 : Math.max(0, h - 1)));
    } else if (e.key === 'Escape') {
      setHover(null);
    }
  };

  const active = hover !== null && geo ? { i: hover, x: geo.pts[hover][0], y: geo.pts[hover][1], d: data[hover], v: values[hover] } : null;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-stone-900">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-stone-500">{subtitle}</p>}
        </div>
        <div className="shrink-0 text-right">
          {total !== undefined && <p className="text-sm sm:text-lg font-semibold text-stone-900">{total}</p>}
          {change && (
            <p
              className={`mt-0.5 inline-flex items-center gap-0.5 text-[11px] sm:text-xs font-medium ${
                change.direction === 'up' ? 'text-emerald-600' : 'text-red-600'
              }`}
              title="Compared with the previous period"
            >
              {change.direction === 'up' ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {change.value} <span className="font-normal text-stone-400">vs prev.</span>
            </p>
          )}
        </div>
      </div>

      <div ref={wrapRef} className="relative w-full" style={{ height: HEIGHT }}>
        {!hasData ? (
          <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed border-stone-200 bg-stone-50/60 px-4 text-center">
            <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-stone-200">
              <LineChart className="h-5 w-5 text-stone-400" />
            </span>
            <p className="text-sm font-medium text-stone-700">{emptyTitle}</p>
            <p className="mt-0.5 text-xs text-stone-500">{emptyDescription}</p>
          </div>
        ) : geo ? (
          <>
            <svg
              width={width}
              height={HEIGHT}
              role="img"
              aria-label={`${title} chart`}
              tabIndex={0}
              className="block touch-pan-y focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20 rounded-md"
              onPointerMove={(e) => setHover(indexFromClientX(e.clientX, e.currentTarget.getBoundingClientRect()))}
              onPointerLeave={() => setHover(null)}
              onKeyDown={onKeyDown}
              onBlur={() => setHover(null)}
            >
              {/* grid + y labels */}
              {geo.ticks.map((t) => {
                const ty = geo.y(t);
                return (
                  <g key={t}>
                    <line x1={MARGIN.left} x2={width - MARGIN.right} y1={ty} y2={ty} stroke={GRID} strokeWidth={1} shapeRendering="crispEdges" />
                    <text x={MARGIN.left - 8} y={ty} dy="0.32em" textAnchor="end" fontSize={11} fill={AXIS_TEXT}>
                      {formatAxis(t)}
                    </text>
                  </g>
                );
              })}

              {/* x labels */}
              {data.map((d, i) =>
                geo.labelIdx.has(i) ? (
                  <text
                    key={d.key}
                    x={geo.pts[i][0]}
                    y={HEIGHT - 6}
                    textAnchor={n === 1 ? 'middle' : i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}
                    fontSize={11}
                    fill={AXIS_TEXT}
                  >
                    {d.label}
                  </text>
                ) : null
              )}

              {/* area + line */}
              {n > 1 && (
                <>
                  <path d={geo.area} fill={INK} fillOpacity={0.08} />
                  <path d={geo.line} fill="none" stroke={INK} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                </>
              )}
              {n === 1 && (
                <line
                  x1={geo.pts[0][0]}
                  x2={geo.pts[0][0]}
                  y1={geo.baseY}
                  y2={geo.pts[0][1]}
                  stroke={INK}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              )}

              {/* end dot */}
              {!active && (
                <circle cx={geo.pts[n - 1][0]} cy={geo.pts[n - 1][1]} r={4} fill={INK} stroke="#fff" strokeWidth={2} />
              )}

              {/* hover */}
              {active && (
                <g pointerEvents="none">
                  <line x1={active.x} x2={active.x} y1={MARGIN.top} y2={geo.baseY} stroke={CROSSHAIR} strokeWidth={1} shapeRendering="crispEdges" />
                  <circle cx={active.x} cy={active.y} r={4.5} fill={INK} stroke="#fff" strokeWidth={2} />
                </g>
              )}
            </svg>

            {active && (
              <div
                className="pointer-events-none absolute z-10 whitespace-nowrap rounded-lg border border-stone-200 bg-white px-3 py-2 shadow-lg"
                style={{
                  left: Math.min(Math.max(active.x, 70), width - 70),
                  top: Math.max(0, active.y - 64),
                  transform: 'translateX(-50%)',
                }}
              >
                <p className="text-[11px] text-stone-500">{active.d.fullLabel}</p>
                <p className="text-sm font-semibold text-stone-900">{formatValue(active.v)}</p>
              </div>
            )}
          </>
        ) : null}

        {/* Accessible data table */}
        <table className="sr-only">
          <caption>{title}</caption>
          <thead>
            <tr>
              <th>Date</th>
              <th>{title}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={d.key}>
                <td>{d.fullLabel}</td>
                <td>{formatValue(values[i])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
