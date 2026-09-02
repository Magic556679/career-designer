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

## Architecture

- **Stack**: Vite + React 19 + TypeScript, path alias `@` → `./src` (configured in both `vite.config.ts` and `tsconfig.json`).
- **App shell** (`src/main.tsx`): `StrictMode` → `QueryClientProvider` (TanStack Query, default `QueryClient`, no persistence/config yet) → `BrowserRouter` → `App`.
- **Routing** (`src/App.tsx`): routes are declared with `react-router-dom`'s `<Routes>/<Route>`. Currently only `/` → `Home`. `src/routes/` and `src/features/` exist but are empty — they're the intended locations for route modules and feature-organized code as the app grows.
- **UI components**: shadcn/ui, installed into `src/components/ui`. Config lives in `components.json` (style `radix-nova`, neutral base color, Lucide icons). Use the `cn()` helper (`src/lib/utils.ts`, `clsx` + `tailwind-merge`) for conditional/merged class names rather than manual string concatenation.
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite` — there is no `tailwind.config.*` file; v4 configures via CSS in `src/index.css` instead.
- **Data fetching**: `@tanstack/react-query` is wired up at the root but no queries/mutations exist yet.
- **HTTP client**: `axios` is a dependency and `src/lib/axios.ts` is the designated location for a shared client instance, but that file is currently empty.
- **State management**: `zustand` is installed for client-side state but not yet used anywhere.
- **Forms**: `react-hook-form`, `zod`, and `@hookform/resolvers` are installed for schema-validated forms but not yet used anywhere.
- **Formatting rules** (`.prettierrc`): no semicolons, single quotes, trailing commas, 80-char print width.
