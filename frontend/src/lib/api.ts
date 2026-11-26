import type { ApiErrorBody, ErrorCode } from '@bowlathon/shared'

export class ApiError extends Error {
  readonly status: number
  readonly code: ErrorCode

  constructor(status: number, code: ErrorCode, message: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

/** JSON fetch against the API. Non-2xx responses throw an ApiError carrying the server's error code. */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  const body: unknown = await res.json().catch(() => null)
  if (!res.ok) {
    const error = (body as ApiErrorBody | null)?.error
    throw new ApiError(res.status, error?.code ?? 'INTERNAL', error?.message ?? res.statusText)
  }
  return body as T
}
