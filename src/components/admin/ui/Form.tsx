'use client';

import { Search, X } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const fieldBase =
  'block w-full px-3.5 py-2.5 text-sm text-stone-900 bg-white border rounded-lg placeholder:text-stone-400 transition-colors duration-200 focus:outline-none focus:ring-2 disabled:bg-stone-50 disabled:text-stone-500 disabled:cursor-not-allowed';
const fieldOk = 'border-stone-300 focus:border-stone-900 focus:ring-stone-900/10';
const fieldErr = 'border-red-300 focus:border-red-500 focus:ring-red-500/10';

export function fieldClasses(invalid?: boolean, className?: string) {
  return cn(fieldBase, invalid ? fieldErr : fieldOk, className);
}

export interface LabelProps extends ComponentProps<'label'> {
  required?: boolean;
}

export function Label({ required, className, children, ...rest }: LabelProps) {
  return (
    <label className={cn('block text-sm font-medium text-stone-700 mb-1', className)} {...rest}>
      {children}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
  );
}

export interface InputProps extends Omit<ComponentProps<'input'>, 'prefix'> {
  invalid?: boolean;
  /** Text/icon rendered inside the field on the left, e.g. "Rs" */
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid, prefix, suffix, className, ...rest },
  ref
) {
  if (!prefix && !suffix) {
    return <input ref={ref} aria-invalid={invalid || undefined} className={fieldClasses(invalid, className)} {...rest} />;
  }
  return (
    <div className="relative">
      {prefix && (
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm text-stone-500">
          {prefix}
        </span>
      )}
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={fieldClasses(invalid, cn(prefix && 'pl-10', suffix && 'pr-10', className))}
        {...rest}
      />
      {suffix && (
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-sm text-stone-500">
          {suffix}
        </span>
      )}
    </div>
  );
});

export const Select = forwardRef<HTMLSelectElement, ComponentProps<'select'> & { invalid?: boolean }>(function Select(
  { invalid, className, children, ...rest },
  ref
) {
  return (
    <select ref={ref} aria-invalid={invalid || undefined} className={fieldClasses(invalid, cn('pr-9', className))} {...rest}>
      {children}
    </select>
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, ComponentProps<'textarea'> & { invalid?: boolean }>(
  function Textarea({ invalid, className, rows = 4, ...rest }, ref) {
    return <textarea ref={ref} rows={rows} aria-invalid={invalid || undefined} className={fieldClasses(invalid, className)} {...rest} />;
  }
);

export interface FormFieldProps {
  label?: ReactNode;
  htmlFor?: string;
  required?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Label + control + hint/error. */
export function FormField({ label, htmlFor, required, hint, error, className, children }: FormFieldProps) {
  return (
    <div className={className}>
      {label && (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      )}
      {children}
      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-stone-500">{hint}</p>
      ) : null}
    </div>
  );
}

export interface CheckboxProps extends Omit<ComponentProps<'input'>, 'type'> {
  label?: ReactNode;
  description?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, className, id, ...rest },
  ref
) {
  const input = (
    <input
      ref={ref}
      id={id}
      type="checkbox"
      className={cn(
        'h-4 w-4 shrink-0 rounded border-stone-300 text-stone-900 accent-stone-900 focus:ring-2 focus:ring-stone-900/20',
        className
      )}
      {...rest}
    />
  );
  if (!label) return input;
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-2.5">
      <span className="mt-0.5 flex">{input}</span>
      <span>
        <span className="block text-sm font-medium text-stone-700">{label}</span>
        {description && <span className="block text-xs text-stone-500">{description}</span>}
      </span>
    </label>
  );
});

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  id?: string;
  className?: string;
}

/** Toggle switch (on = stone-900). */
export function Switch({ checked, onChange, label, description, disabled, id, className }: SwitchProps) {
  const control = (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/30 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed',
        checked ? 'bg-stone-900' : 'bg-stone-300'
      )}
    >
      <span
        className={cn(
          'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200',
          checked ? 'translate-x-[22px]' : 'translate-x-0.5'
        )}
      />
    </button>
  );
  if (!label) return <span className={className}>{control}</span>;
  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-stone-700">
          {label}
        </label>
        {description && <p className="text-xs text-stone-500">{description}</p>}
      </div>
      {control}
    </div>
  );
}

export interface SearchInputProps extends Omit<ComponentProps<'input'>, 'onChange' | 'value' | 'type'> {
  value: string;
  onChange: (value: string) => void;
  /** Wrapper class; defaults to full width on mobile, max-w-md on sm+. */
  wrapperClassName?: string;
}

/** Search field with leading icon and clear button. */
export function SearchInput({ value, onChange, placeholder = 'Search...', wrapperClassName, className, ...rest }: SearchInputProps) {
  return (
    <div className={cn('relative w-full sm:max-w-md', wrapperClassName)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={fieldClasses(false, cn('pl-10 pr-9 py-2 sm:py-2.5 [&::-webkit-search-cancel-button]:hidden', className))}
        {...rest}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-stone-400 hover:text-stone-700"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
