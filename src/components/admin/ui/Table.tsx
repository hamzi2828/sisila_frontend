import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Table primitives. Put <Table> inside <Card padding="none"> (or <Section flush>) so the
 * header row runs edge to edge, as in Inked Wear's list pages.
 */
export function Table({ className, wrapperClassName, ...rest }: ComponentProps<'table'> & { wrapperClassName?: string }) {
  return (
    <div className={cn('overflow-x-auto', wrapperClassName)}>
      <table className={cn('min-w-full divide-y divide-stone-200', className)} {...rest} />
    </div>
  );
}

export function THead({ className, ...rest }: ComponentProps<'thead'>) {
  return <thead className={cn('bg-stone-50', className)} {...rest} />;
}

export function TBody({ className, ...rest }: ComponentProps<'tbody'>) {
  return <tbody className={cn('bg-white divide-y divide-stone-100', className)} {...rest} />;
}

export function TR({ className, interactive = true, ...rest }: ComponentProps<'tr'> & { interactive?: boolean }) {
  return <tr className={cn(interactive && 'hover:bg-stone-50 transition-colors', className)} {...rest} />;
}

type Align = 'left' | 'center' | 'right';
const alignClass: Record<Align, string> = { left: 'text-left', center: 'text-center', right: 'text-right' };

export function TH({ className, align = 'left', ...rest }: ComponentProps<'th'> & { align?: Align }) {
  return (
    <th
      scope="col"
      className={cn(
        'px-4 sm:px-6 py-3 text-xs font-medium uppercase tracking-wider text-stone-500 whitespace-nowrap',
        alignClass[align],
        className
      )}
      {...rest}
    />
  );
}

export function TD({ className, align = 'left', ...rest }: ComponentProps<'td'> & { align?: Align }) {
  return (
    <td
      className={cn('px-4 sm:px-6 py-4 text-sm text-stone-700 whitespace-nowrap', alignClass[align], className)}
      {...rest}
    />
  );
}

/** Full-width row for "no results" inside a table body. */
export function TableEmpty({ colSpan, children, icon }: { colSpan: number; children: ReactNode; icon?: ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-12 text-center">
        {icon && <div className="mx-auto mb-3 flex justify-center text-stone-300">{icon}</div>}
        <p className="text-sm text-stone-500">{children}</p>
      </td>
    </tr>
  );
}
