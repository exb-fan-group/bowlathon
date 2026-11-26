# AGENTS.md

Rules for AI tools and new contributors. `CLAUDE.md` only imports this file. Design decisions live in [docs/architecture.md](docs/architecture.md), the API contract in [docs/api.md](docs/api.md), the team workflow in [CONTRIBUTING.md](CONTRIBUTING.md). Read the relevant one before changing that area.

## Layout

| Folder      | Holds                                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------------- |
| `shared/`   | Bowling scorer and the zod API schemas. Imported by both apps as `@bowlathon/shared`                          |
| `backend/`  | Express 5 API (`src/`), Prisma schema and migrations (`prisma/`), generated client (`generated/`, gitignored) |
| `frontend/` | React app: Vite, Tailwind, React Router, TanStack Query                                                       |
| `docs/`     | Architecture and API docs                                                                                     |

`backend/.agents/`, `backend/.claude/`, `backend/.windsurf/` and `backend/skills-lock.json` are Prisma's AI skills, added by `prisma init` and left unformatted on purpose. Under review: likely to keep only `prisma-cli`, `prisma-client-api` and `prisma-database-setup`.

## Commands

Run from the repo root unless noted.

| Command                                             | Does                                                        |
| --------------------------------------------------- | ----------------------------------------------------------- |
| `npm run dev:api`, `npm run dev:web`                | API on :4000, frontend on :5173 (proxies `/api` to the API) |
| `npm run lint`, `npm run format`                    | ESLint, Prettier                                            |
| `npm run typecheck`                                 | `tsc` in every workspace                                    |
| `npm test`                                          | Vitest in every workspace                                   |
| `npm run generate -w backend`                       | Regenerate the Prisma client after a schema change          |
| `npx prisma migrate dev --name <x>` (in `backend/`) | New migration; follow CONTRIBUTING.md#migrations            |

## Rules

- **Scores come from rolls.** In `frames` mode the server computes `score` and `complete` with `scoreGame` from `@bowlathon/shared`. Never trust a score sent by the client, and never duplicate scoring logic.
- **Every game save checks `version`** in the same `UPDATE ... WHERE id AND version` statement. Never read-then-write.
- **The API contract is `shared/src/api/`.** Validate every request body with its schema. Errors use `{ error: { code, message } }` with a code from `errors.ts`. Update `docs/api.md` with every endpoint change.
- **Backend `.ts` runs directly on Node (type stripping, no build).** No `enum`, `namespace` or constructor parameter properties. Use `import type` for types and `.ts` extensions on relative imports. `tsc` only type-checks.
- **Prisma 7 only.** Install with `prisma@~7.10.1` and `@prisma/client@~7.10.1`; plain `npm install prisma` pulls the 8.0 RC. CLI config is `backend/prisma7.config.ts`.
- **Migrations** follow CONTRIBUTING.md#migrations. Never edit one that's on `main`, never run `migrate dev` or `migrate reset` against a shared database.
- **Don't install packages without asking.** The team runs installs themselves.
- **Style:** Prettier (no semicolons, single quotes) and ESLint decide formatting. LF line endings (`.gitattributes`).
- **Tests:** new logic in `shared/` or the API gets a Vitest test next to it (`*.test.ts`). API tests use supertest on `createApp()`.
