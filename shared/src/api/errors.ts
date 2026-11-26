/** Every API error body is `{ error: { code, message } }`. */
export const ERROR_CODES = [
  'VALIDATION_FAILED',
  'UNAUTHENTICATED',
  'FORBIDDEN',
  'NOT_FOUND',
  'VERSION_CONFLICT',
  'SESSION_ENDED',
  'INTERNAL',
] as const

export type ErrorCode = (typeof ERROR_CODES)[number]

export type ApiErrorBody = { error: { code: ErrorCode; message: string } }
