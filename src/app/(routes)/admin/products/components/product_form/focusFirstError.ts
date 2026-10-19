/**
 * After a failed client-side validation, scroll to (and focus) the first invalid field inside
 * `root`. Inputs mark themselves aria-invalid; composite blocks (chips, image pickers) use
 * data-field-error="true".
 */
export function focusFirstError(root: HTMLElement | null) {
  if (typeof window === 'undefined' || !root) return;
  window.requestAnimationFrame(() => {
    const el = root.querySelector<HTMLElement>('[aria-invalid="true"], [data-field-error="true"]');
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (el.matches('input, textarea, select')) el.focus({ preventScroll: true });
  });
}
