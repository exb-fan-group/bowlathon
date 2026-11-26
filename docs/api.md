# API

The zod schemas in [`shared/src/api/`](../shared/src/api/) are the contract. The backend validates request bodies with them and the frontend takes its types from them, so a change breaks the build on whichever side is behind. Update this table in the same PR as the endpoint.

## Errors

Every error body is `{ "error": { "code": "...", "message": "..." } }`. Codes live in [`shared/src/api/errors.ts`](../shared/src/api/errors.ts):

| Code                | Status | When                                                                      |
| ------------------- | ------ | ------------------------------------------------------------------------- |
| `VALIDATION_FAILED` | 400    | Body fails its schema, or isn't valid JSON                                |
| `UNAUTHENTICATED`   | 401    | No valid login or guest seat                                              |
| `FORBIDDEN`         | 403    | Logged in, but not allowed (see the permissions table in architecture.md) |
| `NOT_FOUND`         | 404    | No such endpoint or record                                                |
| `VERSION_CONFLICT`  | 409    | `baseVersion` is stale. The body also holds the current `game`            |
| `SESSION_ENDED`     | 409    | The session ended, so its games are final                                 |
| `INTERNAL`          | 500    | Server bug. Details are in the API logs, never in the response            |

## Endpoints

| Method | Path          | Who    | Request | Response       | Errors |
| ------ | ------------- | ------ | ------- | -------------- | ------ |
| GET    | `/api/health` | anyone |         | `{ ok: true }` |        |
