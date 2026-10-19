import axios from 'axios';

/**
 * Turns a failed API call into the most useful human-readable message, so toasts show
 * what the backend actually said (e.g. "Theme with this ID already exists") instead of
 * a generic "Failed to save".
 *
 * Handles the response shapes used by the theme / series controllers:
 *   { message }                         -> message
 *   { message: 'Validation error', errors: [...] } -> joined errors
 *   { message: 'Failed to ...', error: 'Series validation failed: ...' } -> cleaned detail
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data: unknown = error.response?.data;

    if (status === 413) {
      return 'The request is too large for the server (limit is about 4.5 MB). Use smaller images.';
    }

    if (data && typeof data === 'object') {
      const body = data as { message?: unknown; error?: unknown; errors?: unknown };

      if (Array.isArray(body.errors) && body.errors.length > 0) {
        return body.errors.map((e) => String(e)).join(' · ');
      }

      const message = typeof body.message === 'string' ? body.message.trim() : '';
      let detail = typeof body.error === 'string' ? body.error.trim() : '';

      // Mongoose: "Series validation failed: gallery: Gallery must contain ..." -> "Gallery must contain ..."
      if (/validation failed:/i.test(detail)) {
        detail = detail
          .replace(/^.*?validation failed:\s*/i, '')
          .split(/,\s*(?=[\w.]+:\s)/)
          .map((part) =>
            part
              .replace(/^[\w.]+:\s*/, '')
              // "Path `title` (`xxxx…`) is longer than…" -> "title is longer than…"
              .replace(/Path `([^`]+)` \(`[^`]*`\)/g, '$1')
              .replace(/Path `([^`]+)`/g, '$1')
          )
          .join(' · ');
        return detail || message || fallback;
      }

      // Append the technical detail only when the main message is a generic "Failed to ..." line.
      const generic = /^(failed to|validation error|internal server error)/i.test(message);
      if (message && detail && detail !== message && generic) return `${message}: ${detail}`;
      if (message || detail) return message || detail;
    }

    if (typeof data === 'string') {
      const text = data.trim();
      if (text && text.length < 300 && !text.startsWith('<')) return text;
    }

    if (!error.response) {
      return 'Could not reach the server. Check your connection and try again.';
    }

    return status ? `${fallback} (HTTP ${status})` : fallback;
  }

  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
