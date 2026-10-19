import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'danger-outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-medium rounded-lg whitespace-nowrap transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-stone-900 text-white shadow-sm hover:bg-stone-800 hover:shadow-md focus-visible:ring-stone-900/30',
  secondary:
    'bg-white text-stone-700 border border-stone-300 hover:bg-stone-50 hover:text-stone-900 focus-visible:ring-stone-900/20',
  danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-600/30',
  'danger-outline':
    'bg-white text-red-600 border border-red-200 hover:bg-red-50 focus-visible:ring-red-600/20',
  ghost: 'text-stone-600 hover:bg-stone-100 hover:text-stone-900 focus-visible:ring-stone-900/20',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs sm:text-sm',
  md: 'px-3 sm:px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm sm:text-base',
};

/** Class string for any element that should look like a button. */
export function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icon element rendered before the label, e.g. <Plus className="h-4 w-4" /> */
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export interface ButtonProps extends ComponentProps<'button'>, CommonProps {
  loading?: boolean;
  /** Label shown while loading (defaults to children). */
  loadingText?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', leftIcon, rightIcon, fullWidth, loading, loadingText, className, children, disabled, type = 'button', ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses(variant, size, cn(fullWidth && 'w-full', className))}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : leftIcon}
      {loading && loadingText ? loadingText : children}
      {!loading && rightIcon}
    </button>
  );
});

export interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, 'className'>, CommonProps {
  className?: string;
}

/** Next.js <Link> styled as a button (e.g. "Add product" -> /admin/products/create). */
export function ButtonLink({ variant = 'primary', size = 'md', leftIcon, rightIcon, fullWidth, className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, size, cn(fullWidth && 'w-full', className))} {...rest}>
      {leftIcon}
      {children}
      {rightIcon}
    </Link>
  );
}

export type IconButtonTone = 'neutral' | 'danger' | 'success' | 'warning' | 'info';

const iconTones: Record<IconButtonTone, string> = {
  neutral: 'text-stone-500 hover:text-stone-900 hover:bg-stone-100',
  danger: 'text-stone-500 hover:text-red-600 hover:bg-red-50',
  success: 'text-stone-500 hover:text-emerald-600 hover:bg-emerald-50',
  warning: 'text-stone-500 hover:text-amber-600 hover:bg-amber-50',
  info: 'text-stone-500 hover:text-sky-600 hover:bg-sky-50',
};

export interface IconButtonProps extends Omit<ComponentProps<'button'>, 'children'> {
  /** Accessible label; also used as the tooltip (title). */
  label: string;
  icon: ReactNode;
  tone?: IconButtonTone;
  size?: 'sm' | 'md';
  loading?: boolean;
}

/** Square icon-only button for table row actions (view / edit / delete). */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, icon, tone = 'neutral', size = 'md', loading, className, disabled, type = 'button', ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      title={label}
      aria-label={label}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20 disabled:opacity-50 disabled:cursor-not-allowed',
        size === 'sm' ? 'p-1.5' : 'p-2',
        iconTones[tone],
        className
      )}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : icon}
    </button>
  );
});
