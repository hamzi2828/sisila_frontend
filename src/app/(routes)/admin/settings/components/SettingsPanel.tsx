import type { ComponentType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PanelHeaderProps {
  icon: ComponentType<{ className?: string }>;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}

/** Tab / sub-section heading: icon + title + muted description (settings layout). */
export function PanelHeader({ icon: Icon, title, description, className }: PanelHeaderProps) {
  return (
    <div className={cn('mb-4', className)}>
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-stone-700" />
        <h3 className="text-base font-semibold text-stone-900">{title}</h3>
      </div>
      {description && <p className="mt-1 text-sm text-stone-500">{description}</p>}
    </div>
  );
}

/** Divided block inside a tab (sections after the first get a top rule). */
export function PanelSection({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('border-t border-stone-200 pt-6 first:border-t-0 first:pt-0', className)}>{children}</div>;
}

/** Bottom action row of a tab: right-aligned buttons above a top rule. */
export function PanelFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col-reverse gap-2 border-t border-stone-200 pt-6 sm:flex-row sm:items-center sm:justify-end sm:gap-3', className)}>
      {children}
    </div>
  );
}
