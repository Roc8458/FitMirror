# Repository Guidelines

## Project Structure & Module Organization

This repository is a Next.js + TypeScript AI fitting-room prototype.

- `src/app/` contains App Router pages, layouts, global CSS, icons, and API routes.
- `src/app/api/generate/route.ts` implements the async try-on generation endpoint.
- `src/components/` contains interactive UI pieces such as the fitting studio, 2D body figure, and 3D preview.
- `src/lib/` contains shared domain types, preset garments, fit rules, and provider adapters.
- `scripts/visual-check.mjs` runs browser-based smoke checks and screenshots.
- Generated screenshots and design references live at the repository root, for example `design-concept.png` and `visual-mobile.png`.

## Build, Test, and Development Commands

- `npm install` installs project dependencies.
- `npm run dev` starts the local Next.js development server.
- `npm run build` creates a production build and runs TypeScript checks.
- `npm run start` serves the production build after `npm run build`.
- `npm run lint` runs ESLint across the repository.
- `node scripts/visual-check.mjs` performs a Playwright smoke check against `http://127.0.0.1:3000`.

## Coding Style & Naming Conventions

Use TypeScript with strict mode. Prefer small, typed modules in `src/lib/` for reusable logic and client components only where interactivity is required. Component files use kebab-case, for example `fitting-studio.tsx`; exported React components use PascalCase. Keep CSS selectors descriptive and scoped to feature areas. Use two-space indentation and avoid unrelated refactors.

## Testing Guidelines

There is no formal unit test framework yet. Treat `npm run build`, `npm run lint`, and `node scripts/visual-check.mjs` as the minimum verification set. Add future tests near the behavior they cover, using names like `fit-engine.test.ts` for domain rules and `*.spec.ts` for browser flows.

## Commit & Pull Request Guidelines

This folder is not currently a Git repository, so no existing commit history is available. Use concise imperative commit messages, for example `Add garment fit rules` or `Fix mobile generation bar`. Pull requests should include a short summary, screenshots for UI changes, verification commands run, and notes for any provider or environment changes.

## Security & Configuration Tips

Copy `.env.example` when adding secrets. Never commit real `FASHN_API_KEY`, database credentials, or object storage tokens. Real FASHN calls require hosted `modelImage` and `productImage` URLs; local development falls back to the mock provider when assets or keys are missing.

## Agent-Specific Instructions

Do not batch-delete files or directories. Never use `del /s`, `rd /s`, `rmdir /s`, `Remove-Item -Recurse`, or `rm -rf`. If deletion is required, remove one explicit file path at a time. For bulk deletion, stop and ask the user to handle it manually.
