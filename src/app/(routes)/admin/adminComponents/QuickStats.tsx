import React from 'react';
import Link from 'next/link';
import type { ComponentType } from 'react';
import { cn } from '@/lib/utils';
import { toneIcon, type Tone } from '@/components/admin/ui';

export interface QuickStat {
  name: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
  tone: Tone;
  hint?: string;
  href?: string;
}

interface QuickStatsProps {
  stats: QuickStat[];
  title?: string;
}

/** Inked Wear's "Quick Stats" box: a white card holding small stone-50 tiles. */
export const QuickStats: React.FC<QuickStatsProps> = ({ stats, title = 'Quick Stats' }) => {
  return (
    <div className="bg-white border border-stone-200 rounded-xl shadow-sm p-3 sm:p-4">
      <h3 className="mb-3 sm:mb-4 text-sm sm:text-base font-semibold text-stone-900">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const inner = (
            <>
              <span className={cn('shrink-0 rounded-lg p-1.5 sm:p-2', toneIcon[stat.tone])}>
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm sm:text-lg font-semibold leading-tight text-stone-900">{stat.value}</span>
                <span className="block truncate text-[10px] sm:text-xs text-stone-500">{stat.name}</span>
                {stat.hint && <span className="block truncate text-[10px] text-stone-400">{stat.hint}</span>}
              </span>
            </>
          );
          const cls = 'flex items-center gap-2 sm:gap-3 rounded-lg bg-stone-50 p-2 sm:p-3';
          return stat.href ? (
            <Link
              key={stat.name}
              href={stat.href}
              className={cn(cls, 'border border-transparent transition-colors hover:border-stone-200 hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20')}
            >
              {inner}
            </Link>
          ) : (
            <div key={stat.name} className={cls}>
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
};
