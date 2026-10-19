// Shared Tailwind class recipes for the Silsilla admin panel.
// Visual language follows Inked Wear's admin (layout, spacing, shapes) recoloured to
// Silsilla's monochrome storefront theme: black / white / Tailwind `stone` greys.
// Use these strings when a primitive component doesn't fit (e.g. a native element
// inside a third-party widget), so every page stays visually consistent.

export const adminStyles = {
  /** Outer page wrapper (the layout already paints bg-stone-50 and pads <main>). */
  page: 'mx-auto w-full max-w-7xl space-y-4 sm:space-y-6',
  /** White surface used for sections, tables, forms. */
  card: 'bg-white border border-stone-200 rounded-xl shadow-sm',
  cardPadding: 'p-4 sm:p-6',
  /** Section heading inside a card. */
  cardTitle: 'text-base font-semibold text-stone-900',
  cardSubtitle: 'mt-0.5 text-xs sm:text-sm text-stone-500',

  pageTitle: 'text-xl sm:text-2xl font-semibold text-stone-900',
  pageSubtitle: 'mt-0.5 sm:mt-1 text-xs sm:text-sm text-stone-500',

  // Form fields
  label: 'block text-sm font-medium text-stone-700 mb-1',
  input:
    'block w-full px-3.5 py-2.5 text-sm text-stone-900 bg-white border border-stone-300 rounded-lg placeholder:text-stone-400 transition-colors duration-200 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 disabled:bg-stone-50 disabled:text-stone-500 disabled:cursor-not-allowed',
  inputError: 'border-red-300 focus:border-red-500 focus:ring-red-500/10',
  hint: 'mt-1 text-xs text-stone-500',
  error: 'mt-1 text-xs text-red-600',
  checkbox:
    'h-4 w-4 rounded border-stone-300 text-stone-900 accent-stone-900 focus:ring-2 focus:ring-stone-900/20',

  // Tables
  tableWrap: 'overflow-x-auto',
  table: 'min-w-full divide-y divide-stone-200',
  thead: 'bg-stone-50',
  th: 'px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 whitespace-nowrap',
  tbody: 'bg-white divide-y divide-stone-100',
  tr: 'hover:bg-stone-50 transition-colors',
  td: 'px-4 sm:px-6 py-4 text-sm text-stone-700 whitespace-nowrap',

  // Misc
  divider: 'border-t border-stone-200',
  link: 'text-sm font-medium text-stone-900 underline-offset-4 hover:underline',
  focusRing: 'focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/30 focus-visible:ring-offset-1',
} as const;

export type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'violet';

/** Soft pill colours (bg-X-50 text-X-700 ring-X-600/20). */
export const toneBadge: Record<Tone, string> = {
  neutral: 'bg-stone-100 text-stone-700 ring-stone-500/20',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  warning: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  danger: 'bg-red-50 text-red-700 ring-red-600/20',
  info: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  violet: 'bg-violet-50 text-violet-700 ring-violet-600/20',
};

export const toneDot: Record<Tone, string> = {
  neutral: 'bg-stone-400',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-sky-500',
  violet: 'bg-violet-500',
};

/** Icon tile colours used by StatCard / quick stats (Inked Wear: bg-X-50 + text-X-600). */
export const toneIcon: Record<Tone, string> = {
  neutral: 'bg-stone-100 text-stone-700',
  success: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600',
  danger: 'bg-red-50 text-red-600',
  info: 'bg-sky-50 text-sky-600',
  violet: 'bg-violet-50 text-violet-600',
};

/**
 * Maps any status string used across Silsilla (orders, payments, products, blogs,
 * slides, contact queries, users) to a tone. Unknown values fall back to neutral.
 */
const STATUS_TONES: Record<string, Tone> = {
  // positive
  published: 'success',
  active: 'success',
  paid: 'success',
  completed: 'success',
  delivered: 'success',
  resolved: 'success',
  in_stock: 'success',
  instock: 'success',
  approved: 'success',
  success: 'success',
  verified: 'success',
  // waiting / not live yet
  draft: 'warning',
  pending: 'warning',
  unpaid: 'warning',
  low_stock: 'warning',
  scheduled: 'warning',
  on_hold: 'warning',
  // in motion
  processing: 'info',
  shipped: 'info',
  confirmed: 'info',
  in_progress: 'info',
  new: 'info',
  open: 'info',
  // negative
  cancelled: 'danger',
  canceled: 'danger',
  failed: 'danger',
  out_of_stock: 'danger',
  outofstock: 'danger',
  rejected: 'danger',
  expired: 'danger',
  blocked: 'danger',
  // money back
  refunded: 'violet',
  returned: 'violet',
  // neutral
  inactive: 'neutral',
  archived: 'neutral',
  closed: 'neutral',
  hidden: 'neutral',
  read: 'neutral',
};

export function normalizeStatus(status: string): string {
  return status.trim().toLowerCase().replace(/[\s-]+/g, '_');
}

export function statusTone(status: string | null | undefined): Tone {
  if (!status) return 'neutral';
  return STATUS_TONES[normalizeStatus(status)] ?? 'neutral';
}

/** "out_of_stock" -> "Out of stock", "in-progress" -> "In progress" */
export function formatStatusLabel(status: string | null | undefined): string {
  if (!status) return 'Unknown';
  const s = status.trim().replace(/[_-]+/g, ' ').toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}
