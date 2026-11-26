# Bowlathon

Web app for our friend group to record bowling scores, run team nights, and keep each crew's history and leaderboard. Design: [docs/architecture.md](docs/architecture.md). Workflow: [CONTRIBUTING.md](CONTRIBUTING.md).

## Prerequisites

- Node.js 26 LTS
- Git
- PostgreSQL 18, running locally. Remember the `postgres` password you set while installing it.
- VS Code. Accept the recommended extensions it offers (ESLint, Prettier, Prisma, Tailwind CSS), or install them with:
  ```sh
  code --install-extension dbaeumer.vscode-eslint
  code --install-extension esbenp.prettier-vscode
  code --install-extension prisma.prisma
  code --install-extension bradlc.vscode-tailwindcss
  ```

## Setup

1. Clone and install:
   ```sh
   git clone https://github.com/exb-fan-group/bowlathon.git
   cd bowlathon
   npm install
   ```
2. Create the local database:
   ```sh
   psql -U postgres -c "CREATE DATABASE bowlathon;"
   ```
3. Copy `backend/.env.example` to `backend/.env` and put your `postgres` password in `DATABASE_URL`.
4. Create the tables and the Prisma client:
   ```sh
   cd backend
   npx prisma migrate dev
   npm run generate
   cd ..
   ```

## Running

Two terminals:

```sh
npm run dev:api   # API on http://localhost:4000
npm run dev:web   # app on http://localhost:5173
```

## Checks

Same as CI:

```sh
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```
