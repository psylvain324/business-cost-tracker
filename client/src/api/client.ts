/**
 * API client for Business Cost Tracker
 * Base HTTP client with configurable base URL from env.
 */

const getBaseUrl = () => {
  const url = import.meta.env.VITE_API_BASE_URL;
  if (!url || url === "") return null;
  return url.replace(/\/$/, ""); // strip trailing slash
};

export const apiBaseUrl = getBaseUrl();

export function isApiConfigured(): boolean {
  return apiBaseUrl != null && apiBaseUrl.length > 0;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!res.ok) {
    const msg =
      (body && typeof body === "object" && "message" in body
        ? String((body as { message: unknown }).message)
        : null) ||
      (body && typeof body === "object" && "error" in body
        ? String((body as { error: unknown }).error)
        : null) ||
      `Request failed: ${res.status} ${res.statusText}`;
    throw new ApiError(msg, res.status, body);
  }

  return body as T;
}

export async function apiGet<T>(path: string): Promise<T> {
  const base = apiBaseUrl;
  if (!base) throw new ApiError("API base URL not configured", 0);

  const res = await fetch(`${base}${path.startsWith("/") ? path : `/${path}`}`);
  return handleResponse<T>(res);
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const base = apiBaseUrl;
  if (!base) throw new ApiError("API base URL not configured", 0);

  const res = await fetch(`${base}${path.startsWith("/") ? path : `/${path}`}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const base = apiBaseUrl;
  if (!base) throw new ApiError("API base URL not configured", 0);

  const res = await fetch(`${base}${path.startsWith("/") ? path : `/${path}`}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const base = apiBaseUrl;
  if (!base) throw new ApiError("API base URL not configured", 0);

  const res = await fetch(`${base}${path.startsWith("/") ? path : `/${path}`}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

export async function apiDelete(path: string): Promise<void> {
  const base = apiBaseUrl;
  if (!base) throw new ApiError("API base URL not configured", 0);

  const res = await fetch(`${base}${path.startsWith("/") ? path : `/${path}`}`, {
    method: "DELETE",
  });
  if (!res.ok) await handleResponse<unknown>(res);
}
