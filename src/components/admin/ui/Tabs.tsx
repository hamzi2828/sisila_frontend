'use client';

import type { ComponentType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface TabItem<K extends string = string> {
  key: K;
  label: ReactNode;
  icon?: ComponentType<{ className?: string }>;
  /** Optional count chip. */
  count?: number;
  disabled?: boolean;
}

export interface TabsProps<K extends string = string> {
  tabs: TabItem<K>[];
  value: K;
  onChange: (key: K) => void;
  /**
   * underline = Inked Wear's card-top tabs (border-b-2 border-stone-900 on active).
   * pills     = segmented chips (active bg-stone-900 text-white).
   */
  variant?: 'underline' | 'pills';
  className?: string;
}

export function Tabs<K extends string = string>({ tabs, value, onChange, variant = 'underline', className }: TabsProps<K>) {
  if (variant === 'pills') {
    return (
      <div role="tablist" className={cn('flex flex-wrap items-center gap-1.5 sm:gap-2', className)}>
        {tabs.map((tab) => {
          const active = tab.key === value;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={active}
              disabled={tab.disabled}
              onClick={() => onChange(tab.key)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/30 disabled:opacity-50',
                active ? 'bg-stone-900 text-white shadow-sm' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              )}
            >
              {Icon && <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
              {tab.label}
              {typeof tab.count === 'number' && (
                <span className={cn('rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none', active ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600')}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('border-b border-stone-200', className)}>
      <nav role="tablist" className="-mb-px flex overflow-x-auto admin-scrollbar">
        {tabs.map((tab) => {
          const active = tab.key === value;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={active}
              disabled={tab.disabled}
              onClick={() => onChange(tab.key)}
              className={cn(
                'flex items-center gap-1.5 sm:gap-2 whitespace-nowrap border-b-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:bg-stone-50 disabled:opacity-50',
                active ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700'
              )}
            >
              {Icon && <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
              {tab.label}
              {typeof tab.count === 'number' && (
                <span className={cn('rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-medium', active ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600')}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
