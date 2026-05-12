# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
# Development
bun dev              # Start Next.js dev server
bun build            # Run DB migration then Next.js build
bun start            # Start production server
bun lint             # ESLint (flat config)

# Database
bun db:generate      # Generate Drizzle migration files
bun db:migrate       # Apply migrations (Neon/PostgreSQL)
bun db:push          # Push schema changes directly (dev shortcut)
bun db:studio        # Open Drizzle Studio UI
```

No test suite exists — linting is the only automated check.

## Architecture

**Rakuda Air** is a Japanese travel blog with a built-in headless CMS. The app is split into a public blog (`(blog)` route group) and a protected admin dashboard (`(dashboard)` route group), both served from the same Next.js app.

### Route groups

- `src/app/(blog)/` — public-facing pages: home, blog listing, article detail, contact, dynamic `[slug]` pages
- `src/app/(dashboard)/dashboard/` — Clerk-protected admin UI for all CMS entities
- `src/app/api/` — REST API routes consumed by dashboard React Query hooks

### Feature modules (`src/features/`)

Business logic is co-located by domain. Each feature typically contains:
- `hooks/` — React Query hooks (`useArticles`, `useCreateArticle`, etc.)
- `components/` — feature-specific UI
- `schemas/` or `validations/` — Zod schemas

The `shared` feature exposes `apiFetch<T>()` (`src/features/shared/api.ts`), a typed wrapper over `fetch` used in all client-side hooks.

### API route pattern

All API route handlers are wrapped with `apiRoute()` from `src/lib/api-utils.ts` for consistent error handling. Authentication uses Clerk via `src/lib/auth.ts`; `requireRole()` guards admin endpoints. Responses follow `{ data: T }` or `{ data: T[], total: number }` shapes.

### Database

Drizzle ORM on Neon PostgreSQL. Schema files live in `src/lib/db/schema/` (one file per entity). The Drizzle client is exported from `src/lib/db/index.ts`. Migrations output to `./drizzle/`. UUID primary keys, automatic timestamps, and Postgres enums for status fields are the standard pattern.

### State management

- **Server state**: React Query v5 (provider at `src/lib/providers/query-provider.tsx`)
- **Forms**: React Hook Form + Zod (`src/lib/validations/`)
- **UI state**: local React state; no global store

### Content editing

Tiptap v3 rich-text editor (`src/components/editor/`) with auto-save (10 s debounce). Articles store content as Tiptap JSON; display layer converts to HTML.

### Authentication & roles

Clerk (`@clerk/nextjs` v7). Roles are stored in Clerk user metadata. `requireRole()` in `src/lib/auth.ts` is used in API routes; Clerk middleware handles session-level protection for the dashboard route group.

### Media

Uploadthing handles file uploads. Metadata (URL, dimensions, MIME type) is persisted in the `media` table. Face detection/blur runs client-side via `src/lib/face-blur.ts` before upload.

### SEO system

A dedicated `seo_metadata` table covers all entities. Resolution falls back through: entity-specific SEO record → entity fields → global site settings. `src/app/sitemap.ts` and `src/app/robots.ts` are dynamically generated. JSON-LD structured data is produced at render time.

### Styling

Tailwind CSS v4 (PostCSS plugin) + shadcn/ui with the `radix-mira` preset (`components.json`). Theme accent color is read from `site_settings` at runtime and applied via CSS variables in `src/app/globals.css`. Path alias `@/` maps to `src/`.

### Puck visual editor

`src/features/puck/` integrates the Puck page builder for custom page templates. This is separate from the Tiptap article editor.
