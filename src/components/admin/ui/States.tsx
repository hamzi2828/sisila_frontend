import { AlertCircle, CheckCircle2, Info, Loader2, TriangleAlert, Inbox } from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn('h-5 w-5 animate-spin text-stone-400', className)} aria-hidden />;
}

export interface LoadingStateProps {
  label?: string;
  className?: string;
  /** Wrap in a white card (use when it replaces a whole card/table). */
  card?: boolean;
}

/** Centered spinner + label (Inked Wear: Loader2 h-8 w-8 + "Loading ..."). */
export function LoadingState({ label = 'Loading...', className, card }: LoadingStateProps) {
  return (
    <div
      role="status"
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-12',
        card && 'bg-white border border-stone-200 rounded-xl shadow-sm',
        className
      )}
    >
      <Loader2 className="h-8 w-8 animate-spin text-stone-400" aria-hidden />
      <p className="text-sm text-stone-500">{label}</p>
    </div>
  );
}

export interface EmptyStateProps {
  icon?: ComponentType<{ className?: string }>;
  title: ReactNode;
  description?: ReactNode;
  /** e.g. <ButtonLink href="/admin/blogs?tab=create" leftIcon={<Plus/>}>New post</ButtonLink> */
  action?: ReactNode;
  className?: string;
  card?: boolean;
}

export function EmptyState({ icon: Icon = Inbox, title, description, action, className, card }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-12 text-center',
        card && 'bg-white border border-stone-200 rounded-xl shadow-sm',
        className
      )}
    >
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-stone-100">
        <Icon className="h-6 w-6 text-stone-400" />
      </span>
      <h3 className="text-base font-medium text-stone-900">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-stone-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

type AlertTone = 'error' | 'success' | 'warning' | 'info';

const alertStyles: Record<AlertTone, { box: string; icon: string; title: string; text: string; Icon: ComponentType<{ className?: string }> }> = {
  error: { box: 'bg-red-50 border-red-200', icon: 'text-red-500', title: 'text-red-800', text: 'text-red-700', Icon: AlertCircle },
  success: { box: 'bg-emerald-50 border-emerald-200', icon: 'text-emerald-500', title: 'text-emerald-800', text: 'text-emerald-700', Icon: CheckCircle2 },
  warning: { box: 'bg-amber-50 border-amber-200', icon: 'text-amber-500', title: 'text-amber-800', text: 'text-amber-700', Icon: TriangleAlert },
  info: { box: 'bg-stone-100 border-stone-200', icon: 'text-stone-500', title: 'text-stone-800', text: 'text-stone-600', Icon: Info },
};

export interface AlertProps {
  tone?: AlertTone;
  title?: ReactNode;
  children?: ReactNode;
  /** Shows a "Try again" link. */
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

/** Inline message box. Use tone="error" + onRetry for failed fetches. */
export function Alert({ tone = 'info', title, children, onRetry, onDismiss, className }: AlertProps) {
  const s = alertStyles[tone];
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cn('rounded-xl border p-4', s.box, className)}>
      <div className="flex items-start gap-3">
        <s.Icon className={cn('mt-0.5 h-5 w-5 shrink-0', s.icon)} />
        <div className="min-w-0 flex-1">
          {title && <h3 className={cn('text-sm font-medium', s.title)}>{title}</h3>}
          {children && <div className={cn('text-sm', title && 'mt-1', s.text)}>{children}</div>}
          {onRetry && (
            <button type="button" onClick={onRetry} className={cn('mt-2 text-sm font-medium underline underline-offset-2', s.title)}>
              Try again
            </button>
          )}
        </div>
        {onDismiss && (
          <button type="button" onClick={onDismiss} aria-label="Dismiss" className={cn('text-sm opacity-70 hover:opacity-100', s.title)}>
            ×
          </button>
        )}
      </div>
    </div>
  );
}
