# Contributing

Setup is in the [README](README.md).

## Branches and pull requests

- Work is tracked in [GitHub Issues](https://github.com/exb-fan-group/bowlathon/issues). Assign yourself before starting; each issue's "Depends on" line says what has to land first.
- Branch off `main` as `feat/<thing>` or `fix/<thing>`.
- Put `Closes #<issue>` in the PR so merging closes the issue.
- Merge with **Squash and merge**.
- `main` takes PRs only, with 1 approval from someone else and CI passing.
- Run `npm run format` and `npm run lint` before pushing. VS Code formats on save once the recommended extensions are installed.

## Migrations

Run Prisma commands from `backend/`.

1. Change `prisma/schema.prisma`, then run `npx prisma migrate dev --name <what_changed>`. It writes `prisma/migrations/<timestamp>_<what_changed>/` and applies it to your local database.
2. A PR carries one migration, committed together with the schema change.
3. Renaming a column or table: Prisma writes a drop and an add, which deletes the data. Change the generated SQL to `ALTER TABLE ... RENAME` before committing.
4. When your branch has more than one migration, or `main` gains a migration while your PR is open: merge `main` into your branch, delete your branch's migration folders, run `npx prisma migrate reset` (wipes only your local database), then repeat step 1 once (and step 3 if it applies).
5. A migration on `main` is never edited or deleted. Fix it with a new one.
6. `migrate dev` and `migrate reset` never run against the server. The API container runs `prisma migrate deploy` when it starts.

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every PR and every push to `main`: Prettier check, ESLint, typecheck, migrations applied to a fresh PostgreSQL 18 database, a check that `schema.prisma` and the migrations agree, tests, and the frontend build. Its job is named `ci`, which is the status check `main` requires.

## Deploys

Until automatic deploys exist, Krepre deploys by hand on the homelab. Automatic deploys will have CI on `main` push `ghcr.io/exb-fan-group/bowlathon-api` and `bowlathon-web` images tagged with the commit, and a timer on the server pull them.
