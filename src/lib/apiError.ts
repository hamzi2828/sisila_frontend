// Turn an API/axios error into a message the admin can act on, instead of a generic "Failed to ...".
import axios from 'axios';

// Backend messages that only say *that* something failed; the `error` field then holds the reason
const GENERIC_MESSAGE = /^(error|failed|could not)\b.*\b(creating|updating|deleting|fetching|create|update|delete|fetch)\b/i;

function messageFromBody(data: unknown): string | null {
  if (!data) return null;
  if (typeof data === 'string') {
    const text = data.trim();
    if (!text || text.startsWith('<') || text.length > 300) return null;
    return text;
  }
  if (typeof data === 'object') {
    const body = data as { message?: unknown; error?: unknown; errors?: unknown };
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const detail = typeof body.error === 'string' ? body.error.trim() : '';
    if (message && detail && GENERIC_MESSAGE.test(message) && detail !== message) return `${message}: ${detail}`;
    if (message) return message;
    if (detail) return detail;
    if (Array.isArray(body.errors) && body.errors.length) {
      return body.errors
        .map((e) => (typeof e === 'string' ? e : (e as { message?: string })?.message))
        .filter(Boolean)
        .join('. ');
    }
  }
  return null;
}

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (axios.isAxiosError(error)) {
    const res = error.response;
    if (!res) {
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        return 'The server took too long to respond. Please try again.';
      }
      // Also what an upload over Vercel's 4.5 MB limit looks like: Vercel's 413 page has no CORS headers
      return 'Could not reach the server. Check your internet connection and try again. If you were uploading images, try fewer or smaller images.';
    }

    const message = messageFromBody(res.data);
    if (res.status === 413) {
      return message && !/FUNCTION_PAYLOAD_TOO_LARGE|Request Entity Too Large/i.test(message)
        ? message
        : 'The upload is too large (the limit is 4.5 MB per save). Please use fewer or smaller images.';
    }
    if (res.status === 401) return message || 'Your session has expired. Please log in again.';
    if (res.status === 403) return message || 'You need admin access to do this.';
    if (message) return message;
    return `${fallback} (error ${res.status})`;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
