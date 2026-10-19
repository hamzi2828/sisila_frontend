import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Padding = 'none' | 'sm' | 'md' | 'lg';

const paddings: Record<Padding, string> = {
  none: '',
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8',
};

export interface CardProps extends ComponentProps<'div'> {
  /** Inner padding. Use "none" when the card wraps a table or a CardHeader/CardBody pair. */
  padding?: Padding;
  /** Adds Inked Wear's lift-on-hover shadow. */
  hoverable?: boolean;
}

/** White surface: bg-white border border-stone-200 rounded-xl shadow-sm. */
export function Card({ padding = 'md', hoverable, className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-stone-200 rounded-xl shadow-sm',
        hoverable && 'transition-shadow duration-200 hover:shadow-md',
        paddings[padding],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps extends Omit<ComponentProps<'div'>, 'title'> {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Optional icon shown left of the title. */
  icon?: ReactNode;
  /** Right-aligned content: buttons, "View all" link, filters. */
  actions?: ReactNode;
  /** Draw a bottom border (use when followed by CardBody / a table). Default true. */
  bordered?: boolean;
}

export function CardHeader({ title, subtitle, icon, actions, bordered = true, className, ...rest }: CardHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 px-4 py-3 sm:px-6 sm:py-4 sm:flex-row sm:items-center sm:justify-between',
        bordered && 'border-b border-stone-200',
        className
      )}
      {...rest}
    >
      <div className="flex min-w-0 items-center gap-3">
        {icon && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-stone-900 truncate">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs sm:text-sm text-stone-500">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function CardBody({ className, ...rest }: ComponentProps<'div'>) {
  return <div className={cn('p-4 sm:p-6', className)} {...rest} />;
}

export function CardFooter({ className, ...rest }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-2 border-t border-stone-200 bg-stone-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-end sm:px-6 rounded-b-xl',
        className
      )}
      {...rest}
    />
  );
}

export interface SectionProps extends Omit<ComponentProps<'section'>, 'title'> {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  /** Remove the body padding (e.g. when the body is a full-bleed table). */
  flush?: boolean;
  bodyClassName?: string;
}

/** Card + header + body in one: the standard block for form sections and dashboard widgets. */
export function Section({ title, subtitle, icon, actions, flush, className, bodyClassName, children, ...rest }: SectionProps) {
  return (
    <section className={cn('bg-white border border-stone-200 rounded-xl shadow-sm', className)} {...rest}>
      <CardHeader title={title} subtitle={subtitle} icon={icon} actions={actions} />
      <div className={cn(!flush && 'p-4 sm:p-6', bodyClassName)}>{children}</div>
    </section>
  );
}
