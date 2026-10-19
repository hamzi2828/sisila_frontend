import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import { formatStatusLabel, statusTone, toneBadge, toneDot, type Tone } from './styles';

export interface BadgeProps extends ComponentProps<'span'> {
  tone?: Tone;
  /** Show a small coloured dot before the label. */
  dot?: boolean;
  size?: 'sm' | 'md';
}

/** Soft pill: bg-X-50 text-X-700 ring-1 ring-inset ring-X-600/20. */
export function Badge({ tone = 'neutral', dot, size = 'md', className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-medium ring-1 ring-inset',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-0.5 text-xs',
        toneBadge[tone],
        className
      )}
      {...rest}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', toneDot[tone])} aria-hidden />}
      {children}
    </span>
  );
}

export interface StatusBadgeProps extends Omit<BadgeProps, 'tone' | 'children'> {
  /** Any status string: published, draft, pending, paid, shipped, delivered, cancelled, out_of_stock, active... */
  status: string | null | undefined;
  /** Override the auto-formatted label. */
  label?: string;
  /** Override the auto-detected tone. */
  tone?: Tone;
}

/** Badge whose colour and label are derived from a status value. */
export function StatusBadge({ status, label, tone, dot = true, ...rest }: StatusBadgeProps) {
  return (
    <Badge tone={tone ?? statusTone(status)} dot={dot} {...rest}>
      {label ?? formatStatusLabel(status)}
    </Badge>
  );
}
