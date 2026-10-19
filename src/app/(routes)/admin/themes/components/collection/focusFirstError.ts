/**
 * After a failed client-side validation, scroll to and focus the first invalid field
 * (inputs mark themselves aria-invalid; composite blocks use data-field-error).
 */
export function focusFirstError() {
  if (typeof window === 'undefined') return;
  window.requestAnimationFrame(() => {
    const el = document.querySelector<HTMLElement>('[aria-invalid="true"], [data-field-error="true"]');
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (el.matches('input, textarea, select')) {
      el.focus({ preventScroll: true });
    }
  });
}
