import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowRight, Boxes, CheckCircle2, XCircle } from 'lucide-react';
import type { InventoryStatus as InventoryStatusData } from '../services/dashboardService';

interface InventoryStatusProps {
  data: InventoryStatusData | null;
}

/** Stock health of published products (from /dashboard/inventory-status). */
export const InventoryStatus: React.FC<InventoryStatusProps> = ({ data }) => {
  const total = data?.totalProducts ?? 0;
  const segments = data
    ? [
        { key: 'in', label: 'In stock', hint: '10+ units', value: data.inStock, bar: 'bg-emerald-500', icon: CheckCircle2, iconCls: 'text-emerald-600' },
        { key: 'low', label: 'Low stock', hint: '1–9 units', value: data.lowStock, bar: 'bg-amber-400', icon: AlertTriangle, iconCls: 'text-amber-600' },
        { key: 'out', label: 'Out of stock', hint: '0 units', value: data.outOfStock, bar: 'bg-red-500', icon: XCircle, iconCls: 'text-red-600' },
      ]
    : [];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 border-b border-stone-200">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-stone-900">Inventory Health</h3>
          <p className="mt-0.5 text-xs text-stone-500">Published products by stock level</p>
        </div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
        >
          Manage <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="flex-1 p-4 sm:p-6">
        {!data ? (
          <div className="flex h-full flex-col items-center justify-center py-8 text-center">
            <Boxes className="mb-2 h-8 w-8 text-stone-300" />
            <p className="text-sm text-stone-500">Inventory data is unavailable right now.</p>
          </div>
        ) : (
          <>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-semibold text-stone-900">{total.toLocaleString()}</p>
              <p className="text-xs text-stone-500">published products</p>
            </div>

            <div
              className="mt-4 flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full bg-stone-100"
              role="img"
              aria-label={segments.map((s) => `${s.label}: ${s.value}`).join(', ')}
            >
              {total > 0 &&
                segments
                  .filter((s) => s.value > 0)
                  .map((s) => (
                    <div
                      key={s.key}
                      className={`${s.bar} h-full first:rounded-l-full last:rounded-r-full`}
                      style={{ width: `${(s.value / total) * 100}%` }}
                      title={`${s.label}: ${s.value}`}
                    />
                  ))}
            </div>

            <ul className="mt-5 space-y-3">
              {segments.map((s) => {
                const Icon = s.icon;
                const pct = total > 0 ? Math.round((s.value / total) * 100) : 0;
                return (
                  <li key={s.key} className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${s.iconCls}`} />
                      <span>
                        <span className="block text-sm text-stone-700">{s.label}</span>
                        <span className="block text-[11px] text-stone-400">{s.hint}</span>
                      </span>
                    </span>
                    <span className="text-right">
                      <span className="text-sm font-semibold text-stone-900">{s.value.toLocaleString()}</span>
                      <span className="ml-1.5 text-xs text-stone-400">{pct}%</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};
