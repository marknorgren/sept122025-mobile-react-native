# Repository Guidelines

## Project Structure & Module Organization
- `app/` hosts Expo Router screens; keep tabs in `app/(tabs)` and modals in `app/(modal)` for native transitions.
- `components/` stores reusable, theme-aware UI kept presentation-first and strongly typed.
- `contexts/ThemeProvider.tsx` owns design tokens and persistence; extend tokens here before altering screens.
- `assets/` holds icons, fonts, and imagery referenced by routes and `app.json`.
- `maestro/` captures end-to-end flows, emitting screenshots to `artifacts/`.

## Build, Test, and Development Commands
- Run every task with `pnpm` to reuse the workspace toolchain.
- `pnpm install` installs dependencies.
- `pnpm start` boots the Expo dev server; press `i`/`a` for simulators.
- `pnpm ios` / `pnpm android` run native dev clients locally; no EAS workflows are used.
- `pnpm lint` runs ESLint; autofix with `pnpm lint -- --fix`.
- `pnpm exec prettier --write "app/**" "components/**" "scripts/**"` enforces Prettier formatting (swap to `--check` in CI).
- `pnpm exec tsc --noEmit` performs TypeScript checks.
- `pnpm screenshots` runs Maestro tests after `pnpm start -- --dev-client`, saving artifacts under `artifacts/`.

## Coding Style & Naming Conventions
- Stick to `tsx` with 2-space indentation; ESLint and Prettier govern formatting and imports.
- Components use `PascalCase`; hooks/utilities use `camelCase`; route filenames mirror segments.
- Rely on theme tokens for color/spacing and colocate `StyleSheet.create` blocks with their component.
- Hoist constants and configuration objects outside component bodies to minimize rerenders.

## React Component Patterns
- Capture data fetching, derived state, and effects inside dedicated hooks, then consume them in views.
- Keep components pure: accept props, derive minimal state, and avoid side effects during render.
- Promote repeated layouts into shared `components/` entries once reused.

## Testing Guidelines
- Maestro flows in `maestro/tests` are the regression harness; update scenarios when UI shifts and re-run `pnpm screenshots`.
- Add `*.test.ts` beside complex modules and execute with `pnpm exec jest` once Jest is wired up.
- Document manual QA in PRs for platform-specific fixes, citing devices and OS versions.

## Commit & Pull Request Guidelines
- Keep commit subjects short and imperative (e.g., `Adjust modal selector for screenshot flows`) and group related work.
- Reference issues in bodies or PR descriptions (`Fixes #123`) and describe user-facing impact.
- PRs include a summary, before/after screenshots for UI changes, simulator coverage, and doc updates.
- Before requesting review, run `pnpm lint`, `pnpm exec prettier --check "app/**" "components/**" "scripts/**"`, `pnpm exec tsc --noEmit`, and `pnpm screenshots`.
