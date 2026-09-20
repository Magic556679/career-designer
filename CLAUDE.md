# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` — start the Vite dev server
- `pnpm build` — type-check (`tsc -b`) then production build
- `pnpm preview` — preview the production build locally
- `pnpm lint` — run ESLint (`eslint.config.js` is the active config)
- `pnpm format` / `pnpm format:check` — apply/check Prettier formatting

There is no test runner configured in this project (no test script, no Vitest/Jest dependency).

Note: `.oxlintrc.json` exists at the repo root but `oxlint` is not installed as a dependency and no script invokes it — it is not part of the active lint pipeline. Treat ESLint as the real linter.

## Documentation

- `docs/product.md` — 產品目標、目標使用者、核心使用者流程、核心概念、業務規則、範圍界定
- `docs/questionnaire-flow-design.md` — Step1~4 問卷流程的後端資料模型、API 設計，以及與前端 `features/exploration` 切片的串接方式

## Architecture

- **Stack**: Vite + React 19 + TypeScript, path alias `@` → `./src` (configured in both `vite.config.ts` and `tsconfig.json`).
- **Import style**: always use the `@` alias (`@/features/exploration/types`), never relative imports (`./`, `../`) — including inside a feature slice's own `index.ts` barrel importing its own `api/`/`stores`/`types.ts`. Chosen for refactor safety (moving a file doesn't invalidate other files' import paths) and consistent grep-ability across the codebase, at the cost of not visually distinguishing same-slice imports from cross-slice ones in the import path itself.
- **App shell** (`src/main.tsx`): `StrictMode` → `QueryClientProvider` (TanStack Query, default `QueryClient`, no persistence/config yet) → `BrowserRouter` → `App`.
- **Routing** (`src/App.tsx`): routes are declared with `react-router-dom`'s `<Routes>/<Route>`. Currently only `/` → `Home` (`src/routes/home.tsx`).
- **Project structure**: feature-based. `src/routes/` holds thin route/page components (compose features, handle navigation — no domain logic). `src/features/<name>/` holds domain slices, each with its own `api/`, `components/`, `stores/`, `schema/`, and a public `index.ts` (import slices only via that barrel; slices never import each other). Shared code stays at the top level: `src/components/ui` (shadcn), `src/lib`, `src/stores` (global stores only — `auth`), `src/types`. Dependency direction is one-way: `routes → features → shared`.
- **UI components**: shadcn/ui, installed into `src/components/ui`. Config lives in `components.json` (style `radix-nova`, neutral base color, Lucide icons). Use the `cn()` helper (imported from the `cn` package) for conditional/merged class names rather than manual string concatenation.
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite` — there is no `tailwind.config.*` file; v4 configures via CSS in `src/index.css` instead.
- **Data fetching**: `@tanstack/react-query` is wired up at the root but no queries/mutations exist yet.
- **HTTP client** (`src/lib/axios.ts`): a shared `axios` instance (`baseURL` from `VITE_API_BASE_URL`, 10s timeout). A request interceptor reads the token from `useAuthStore` and sets the `Authorization: Bearer` header; a response interceptor calls `useAuthStore.getState().logout()` on a 401. Import this instance (`import api from '@/lib/axios'`) rather than calling `axios` directly.
- **Auth state** (`src/stores/auth.ts`): `zustand` store `useAuthStore`, persisted to storage under the key `auth` via `zustand/middleware`'s `persist`. Holds `token`/`user` and exposes `setAuth`/`logout`.
- **API response shape** (`src/types/api.ts`): backend responses are expected to match `ApiResponse<T>` (`{ code, message, data }`) and paginated lists `PageResponse<T>` (`{ item, page, pageSize, total }`).
- **Forms**: `react-hook-form`, `zod`, and `@hookform/resolvers` are installed for schema-validated forms but not yet used anywhere.
- **Formatting rules** (`.prettierrc`): no semicolons, single quotes, trailing commas, 80-char print width.
- **Env vars**: copy `.env.example` to `.env` (gitignored) and set `VITE_API_BASE_URL` before running the app against a real backend.
