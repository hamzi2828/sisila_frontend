import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { toneIcon, type Tone } from './styles';

type IconComponent = ComponentType<{ className?: string }>;

export interface StatCardProps {
  label: string;
  value: ReactNode;
  /** A lucide-react / react-icons component, e.g. icon={Package} */
  icon?: IconComponent;
  tone?: Tone;
  /** Small muted line under the label (e.g. "Last 7 days"). */
  hint?: ReactNode;
  /** Optional real trend value, e.g. { value: '+12.5%', direction: 'up' }. Only pass real data. */
  change?: { value: string; direction: 'up' | 'down' };
  /**
   * "md" = Inked Wear dashboard tile (icon top, big value).
   * "sm" = compact inline tile used above list pages (icon left, value + label).
   */
  size?: 'sm' | 'md';
  onClick?: () => void;
  active?: boolean;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, tone = 'neutral', hint, change, size = 'md', onClick, active, className }: StatCardProps) {
  const interactive = typeof onClick === 'function';
  const Wrapper = interactive ? 'button' : 'div';

  const shell = cn(
    'bg-white border rounded-lg sm:rounded-xl text-left transition-all duration-200',
    active ? 'border-stone-900 ring-1 ring-stone-900' : 'border-stone-200',
    interactive && 'hover:shadow-md hover:border-stone-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/30',
    className
  );

  if (size === 'sm') {
    return (
      <Wrapper {...(interactive ? { type: 'button' as const, onClick } : {})} className={cn(shell, 'p-2.5 sm:p-3')}>
        <div className="flex items-center gap-2 sm:gap-3">
          {Icon && (
            <span className={cn('shrink-0 rounded-md p-1.5 sm:p-2', toneIcon[tone])}>
              <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </span>
          )}
          <div className="min-w-0">
            <p className="text-sm sm:text-lg font-semibold text-stone-900 leading-tight truncate">{value}</p>
            <p className="text-[10px] sm:text-xs text-stone-500 truncate">{label}</p>
          </div>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper
      {...(interactive ? { type: 'button' as const, onClick } : {})}
      className={cn(shell, 'p-3 sm:p-4 hover:shadow-md')}
    >
      <div className="flex items-center justify-between gap-2">
        {Icon && (
          <span className={cn('rounded-lg p-1.5 sm:p-2', toneIcon[tone])}>
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
        )}
        {change && (
          <span
            className={cn(
              'flex items-center gap-0.5 text-[10px] sm:text-xs font-medium',
              change.direction === 'up' ? 'text-emerald-600' : 'text-red-600'
            )}
          >
            {change.direction === 'up' ? (
              <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
            {change.value}
          </span>
        )}
      </div>
      <div className="mt-2 sm:mt-3 min-w-0">
        <p className="text-lg sm:text-2xl font-semibold text-stone-900 truncate">{value}</p>
        <p className="mt-0.5 text-[11px] sm:text-xs text-stone-500">{label}</p>
        {hint && <p className="mt-0.5 text-[10px] sm:text-xs text-stone-400">{hint}</p>}
      </div>
    </Wrapper>
  );
}

/** Responsive grid for StatCards: 2 columns on mobile, `cols` on large screens. */
export function StatGrid({ cols = 4, className, children }: { cols?: 2 | 3 | 4 | 5 | 6; className?: string; children: ReactNode }) {
  const lg: Record<number, string> = {
    2: 'lg:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'sm:grid-cols-3 lg:grid-cols-5',
    6: 'sm:grid-cols-3 lg:grid-cols-6',
  };
  return <div className={cn('grid grid-cols-2 gap-2 sm:gap-4', lg[cols], className)}>{children}</div>;
}
