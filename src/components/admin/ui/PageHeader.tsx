import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface PageHeaderProps extends Omit<ComponentProps<'div'>, 'title'> {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Right-aligned actions (buttons). Wrap on mobile. */
  actions?: ReactNode;
  /** Renders a back arrow link before the title (edit/create pages). */
  backHref?: string;
  breadcrumbs?: Breadcrumb[];
}

/** Page title block: "text-xl sm:text-2xl font-semibold" + muted subtitle + actions. */
export function PageHeader({ title, subtitle, actions, backHref, breadcrumbs, className, ...rest }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6', className)} {...rest}>
      <div className="min-w-0 md:flex-1">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-1.5 flex flex-wrap items-center gap-1 text-xs text-stone-500">
            {breadcrumbs.map((crumb, i) => (
              <span key={`${crumb.label}-${i}`} className="inline-flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3 text-stone-400" aria-hidden />}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-stone-900 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-stone-700">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <div className="flex items-center gap-3">
          {backHref && (
            <Link
              href={backHref}
              aria-label="Back"
              className="shrink-0 rounded-lg p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          )}
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold text-stone-900">{title}</h1>
            {subtitle && <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-stone-500">{subtitle}</p>}
          </div>
        </div>
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:max-w-[70%] md:flex-none md:justify-end">{actions}</div>
      )}
    </div>
  );
}

/** Standard page container. The admin layout already paints bg-stone-50 and pads <main>. */
export function AdminPage({ className, ...rest }: ComponentProps<'div'>) {
  return <div className={cn('mx-auto w-full max-w-7xl space-y-4 sm:space-y-6', className)} {...rest} />;
}
