// Error messages for the Blogs, Blog Settings and Hero Slides admin sections.
// Axios errors go through the shared `getApiErrorMessage`; this file adds what the
// fetch()-based blog hero service needs (reading the backend's message from a Response).
import axios from 'axios';
import { getApiErrorMessage } from '@/lib/apiError';

/** Error thrown by fetch-based services, carrying the HTTP status. */
export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const TOO_LARGE = 'The upload is too large (the limit is 4.5 MB per save). Please use a smaller image.';
const UNREACHABLE = 'Could not reach the server. Check your internet connection and try again.';
const UNREACHABLE_UPLOAD =
  'Could not reach the server. Check your internet connection and try again. If you were uploading an image, try a smaller one.';

// Messages the backend sends that say nothing on their own ("Failed to create hero").
const GENERIC_MESSAGE = /^(failed|error|validation error|internal server error|something went wrong)/i;

/** Pulls the most useful text out of a backend error body ({ message, error, errors[] } or plain text). */
function messageFromBody(body: unknown): string | undefined {
  if (!body) return undefined;
  if (typeof body === 'string') {
    const text = body.trim();
    // Ignore HTML error pages and stack dumps.
    return text && !text.startsWith('<') && text.length < 300 ? text : undefined;
  }
  if (typeof body !== 'object') return undefined;

  const { message, error, errors } = body as { message?: unknown; error?: unknown; errors?: unknown };
  const msg = typeof message === 'string' ? message.trim() : '';
  const detail = Array.isArray(errors)
    ? errors.filter((e): e is string => typeof e === 'string').join(', ')
    : typeof error === 'string'
      ? error.trim()
      : '';

  if (msg && detail && detail !== msg && GENERIC_MESSAGE.test(msg)) return `${msg}: ${detail}`;
  return msg || detail || undefined;
}

/** Builds an ApiError from a failed fetch() Response, using the backend's own message. */
export async function errorFromResponse(response: Response, fallback: string): Promise<ApiError> {
  let body: unknown;
  try {
    const text = await response.text();
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  } catch {
    body = undefined;
  }
  // Vercel's own 413 is a plain-text page; only trust a JSON message from our backend.
  if (response.status === 413 && (!body || typeof body !== 'object')) return new ApiError(TOO_LARGE, 413);
  return new ApiError(messageFromBody(body) || `${fallback} (error ${response.status})`, response.status);
}

interface Options {
  /** The request carried an image; a dropped connection most likely means it was too big. */
  upload?: boolean;
}

/** Best message for a toast: the backend's own reason when there is one, otherwise `fallback`. */
export function getErrorMessage(error: unknown, fallback: string, { upload = false }: Options = {}): string {
  if (axios.isAxiosError(error)) return getApiErrorMessage(error, fallback);
  if (error instanceof ApiError) return error.message || fallback;
  // fetch() rejects with a TypeError when the request is blocked (e.g. Vercel's 413 without CORS) or the network fails.
  if (error instanceof TypeError && /fetch|network/i.test(error.message)) return upload ? UNREACHABLE_UPLOAD : UNREACHABLE;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
