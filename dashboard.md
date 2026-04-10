# Rakuda Air — Dashboard & API Plan

> Internal planning doc for the dashboard, API routes, database schema, and blog engine.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Authentication (Clerk)](#authentication-clerk)
3. [Database (Neon + Drizzle ORM)](#database-neon--drizzle-orm)
4. [Database Schema](#database-schema)
5. [File / Folder Structure](#file--folder-structure)
6. [Dashboard Pages](#dashboard-pages)
7. [API Routes](#api-routes)
8. [Article Editor](#article-editor)
9. [Media Management (Uploadthing)](#media-management-uploadthing)
10. [SEO System](#seo-system)
11. [Performance & Caching](#performance--caching)
12. [Theming & Style Management](#theming--style-management)
13. [Additional Entities & Features](#additional-entities--features)
14. [Packages to Install](#packages-to-install)
15. [Implementation Order](#implementation-order)

---

## Tech Stack

| Layer         | Technology                     |
| ------------- | ------------------------------ |
| Framework     | Next.js 16 (App Router)        |
| Auth          | Clerk (`@clerk/nextjs`)        |
| Database      | Neon (serverless Postgres)     |
| ORM           | Drizzle ORM + `drizzle-kit`    |
| Styling       | Tailwind CSS v4 + shadcn/ui    |
| Editor        | Tiptap (rich-text, extensible) |
| File uploads  | Uploadthing                    |
| Validation    | Zod                            |
| State / Forms | React Hook Form + Zod resolver |
| Date handling | date-fns                       |
| Icons         | Hugeicons (already installed)  |
| Notifications | Sonner (toast)                 |

---

## Authentication (Clerk)

### Setup

- Install `@clerk/nextjs`.
- Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` env variables.
- Wrap the app in `<ClerkProvider>` inside the root layout.
- Add Clerk middleware (`middleware.ts`) to protect `/dashboard/**` routes.

### Roles

| Role       | Access                                              |
| ---------- | --------------------------------------------------- |
| **admin**  | Full access — articles, categories, settings, users |
| **editor** | Create / edit / publish articles, manage media      |
| **viewer** | Read-only dashboard access (analytics preview)      |

Roles managed via Clerk metadata (`publicMetadata.role`). A utility `hasRole()` helper will gate server actions and UI.

---

## Database (Neon + Drizzle ORM)

### Setup

- Create a Neon project → get the `DATABASE_URL` connection string.
- Install `drizzle-orm`, `@neondatabase/serverless`, and `drizzle-kit`.
- Configure `drizzle.config.ts` at project root.
- DB client lives at `src/lib/db/index.ts`.
- Schema files live at `src/lib/db/schema/`.
- Migrations via `drizzle-kit generate` → `drizzle-kit migrate`.

---

## Database Schema

### `articles`

| Column         | Type           | Notes                                            |
| -------------- | -------------- | ------------------------------------------------ |
| `id`           | `uuid` PK      | `gen_random_uuid()`                              |
| `title`        | `varchar(255)` | Required                                         |
| `slug`         | `varchar(255)` | Unique, auto-generated from title                |
| `excerpt`      | `text`         | Short summary for cards                          |
| `content`      | `jsonb`        | Tiptap JSON document                             |
| `content_html` | `text`         | Pre-rendered HTML for blog display               |
| `cover_image`  | `text`         | URL to cover image                               |
| `status`       | `enum`         | `draft` · `published` · `scheduled` · `archived` |
| `published_at` | `timestamp`    | Nullable, set on publish                         |
| `scheduled_at` | `timestamp`    | Nullable, for scheduled publishing               |
| `author_id`    | `varchar(255)` | Clerk user ID                                    |
| `category_id`  | `uuid` FK      | References `categories.id`                       |
| `reading_time` | `integer`      | Auto-calculated on save (minutes)                |
| `is_featured`  | `boolean`      | Default false                                    |
| `locale`       | `varchar(10)`  | `en` or `ja` (multi-language support)            |
| `created_at`   | `timestamp`    | Default now                                      |
| `updated_at`   | `timestamp`    | Auto-updated                                     |

> SEO metadata for articles is stored in the `seo_metadata` table (see below).

### `pages`

Static/custom pages managed from the dashboard (About, Contact, Legal, etc.).

| Column         | Type           | Notes                                                        |
| -------------- | -------------- | ------------------------------------------------------------ |
| `id`           | `uuid` PK      | `gen_random_uuid()`                                          |
| `title`        | `varchar(255)` | Page title                                                   |
| `slug`         | `varchar(255)` | Unique — becomes the URL path `/:slug`                       |
| `content`      | `jsonb`        | Tiptap JSON document (same editor)                           |
| `content_html` | `text`         | Pre-rendered HTML                                            |
| `status`       | `enum`         | `draft` · `published`                                        |
| `template`     | `varchar(50)`  | Layout template: `default`, `full-width`, `contact`, `blank` |
| `show_in_nav`  | `boolean`      | Show in site navigation                                      |
| `nav_order`    | `integer`      | Sort order in navigation                                     |
| `locale`       | `varchar(10)`  | `en` or `ja`                                                 |
| `author_id`    | `varchar(255)` | Clerk user ID                                                |
| `created_at`   | `timestamp`    | Default now                                                  |
| `updated_at`   | `timestamp`    | Auto-updated                                                 |

> SEO metadata for pages is stored in the `seo_metadata` table (see below).

### `seo_metadata`

Dedicated SEO table — can be linked to **any entity** (article, page, or a global/custom entry). One row per entity. Managed from either inline SEO panels or the standalone SEO dashboard table.

| Column                | Type           | Notes                                                     |
| --------------------- | -------------- | --------------------------------------------------------- |
| `id`                  | `uuid` PK      | `gen_random_uuid()`                                       |
| `entity_type`         | `varchar(30)`  | `article` · `page` · `global` · `category`                |
| `entity_id`           | `uuid`         | FK to the related table (nullable for `global`)           |
| `meta_title`          | `varchar(120)` | `<title>` tag override                                    |
| `meta_description`    | `varchar(320)` | `<meta name="description">` override                      |
| `meta_keywords`       | `text[]`       | Keywords array                                            |
| `og_title`            | `varchar(120)` | Open Graph title (falls back to `meta_title`)             |
| `og_description`      | `varchar(320)` | Open Graph description                                    |
| `og_image`            | `text`         | Open Graph image URL                                      |
| `og_type`             | `varchar(30)`  | `article`, `website`, etc.                                |
| `twitter_card`        | `varchar(30)`  | `summary`, `summary_large_image`                          |
| `twitter_title`       | `varchar(120)` | Twitter-specific title override                           |
| `twitter_description` | `varchar(320)` | Twitter-specific description override                     |
| `twitter_image`       | `text`         | Twitter-specific image                                    |
| `canonical_url`       | `text`         | Canonical URL override                                    |
| `no_index`            | `boolean`      | Default false — set true to add noindex                   |
| `no_follow`           | `boolean`      | Default false — set true to add nofollow                  |
| `json_ld`             | `jsonb`        | Custom JSON-LD structured data (auto-generated or manual) |
| `created_at`          | `timestamp`    |                                                           |
| `updated_at`          | `timestamp`    |                                                           |

Unique constraint on (`entity_type`, `entity_id`).

> **Fallback chain**: SEO table → entity fields (title/excerpt) → site-level defaults from `site_settings`. The public frontend resolves metadata through this chain.

### `categories`

| Column        | Type           | Notes                   |
| ------------- | -------------- | ----------------------- |
| `id`          | `uuid` PK      |                         |
| `name`        | `varchar(100)` | e.g. "City Guides"      |
| `slug`        | `varchar(100)` | Unique                  |
| `description` | `text`         | Optional                |
| `color`       | `varchar(7)`   | Hex color for UI badges |
| `icon`        | `varchar(50)`  | Icon name reference     |
| `sort_order`  | `integer`      | Manual ordering         |
| `created_at`  | `timestamp`    |                         |

**Suggested seed categories:**

- City Guides (Tokyo, Kyoto, Osaka …)
- Nature & Outdoors
- Food & Drink
- Culture & Traditions
- Temples & Shrines
- Onsen & Ryokan
- Practical Tips
- Itineraries

### `tags`

| Column       | Type          | Notes  |
| ------------ | ------------- | ------ |
| `id`         | `uuid` PK     |        |
| `name`       | `varchar(80)` |        |
| `slug`       | `varchar(80)` | Unique |
| `created_at` | `timestamp`   |        |

### `article_tags` (join table)

| Column       | Type      | Notes                 |
| ------------ | --------- | --------------------- |
| `article_id` | `uuid` FK | References `articles` |
| `tag_id`     | `uuid` FK | References `tags`     |

Composite PK on (`article_id`, `tag_id`).

### `media`

| Column        | Type           | Notes                  |
| ------------- | -------------- | ---------------------- |
| `id`          | `uuid` PK      |                        |
| `url`         | `text`         | Public URL             |
| `key`         | `text`         | Storage key / path     |
| `filename`    | `varchar(255)` | Original filename      |
| `mime_type`   | `varchar(100)` |                        |
| `size`        | `integer`      | Bytes                  |
| `width`       | `integer`      | Nullable (images only) |
| `height`      | `integer`      | Nullable (images only) |
| `alt_text`    | `varchar(255)` | Accessibility / SEO    |
| `uploaded_by` | `varchar(255)` | Clerk user ID          |
| `created_at`  | `timestamp`    |                        |

### `site_settings`

| Column       | Type           | Notes                                     |
| ------------ | -------------- | ----------------------------------------- |
| `id`         | `uuid` PK      |                                           |
| `key`        | `varchar(100)` | Unique — e.g. `site_name`, `accent_color` |
| `value`      | `jsonb`        | Flexible value                            |
| `updated_at` | `timestamp`    |                                           |

Used for runtime site config: accent color, font, social links, footer text, hero image, etc.

### `subscribers`

Email subscribers from the "Coming Soon" page and future newsletter signups.

| Column            | Type           | Notes                           |
| ----------------- | -------------- | ------------------------------- |
| `id`              | `uuid` PK      |                                 |
| `email`           | `varchar(255)` | Unique                          |
| `name`            | `varchar(100)` | Optional                        |
| `status`          | `enum`         | `active` · `unsubscribed`       |
| `subscribed_at`   | `timestamp`    | Default now                     |
| `unsubscribed_at` | `timestamp`    | Nullable                        |
| `source`          | `varchar(50)`  | `coming_soon`, `blog`, `footer` |

### `contact_submissions`

Stores contact form submissions from the Contact page.

| Column       | Type           | Notes                      |
| ------------ | -------------- | -------------------------- |
| `id`         | `uuid` PK      |                            |
| `name`       | `varchar(100)` | Required                   |
| `email`      | `varchar(255)` | Required                   |
| `subject`    | `varchar(255)` | Optional                   |
| `message`    | `text`         | Required                   |
| `status`     | `enum`         | `new` · `read` · `replied` |
| `created_at` | `timestamp`    |                            |

### `navigation`

Configurable site navigation items (header, footer, or custom menus).

| Column       | Type           | Notes                                     |
| ------------ | -------------- | ----------------------------------------- |
| `id`         | `uuid` PK      |                                           |
| `label`      | `varchar(100)` | Display text                              |
| `url`        | `text`         | Internal path or external URL             |
| `target`     | `varchar(10)`  | `_self` or `_blank`                       |
| `position`   | `varchar(20)`  | `header` · `footer` · `social`            |
| `sort_order` | `integer`      | Ordering                                  |
| `parent_id`  | `uuid` FK      | Self-referencing for dropdowns (nullable) |
| `page_id`    | `uuid` FK      | Optional — auto-link to a managed page    |
| `is_visible` | `boolean`      | Default true                              |
| `created_at` | `timestamp`    |                                           |

### `redirects`

Manage URL redirects (old URLs, marketing links, SEO migrations).

| Column       | Type           | Notes                                  |
| ------------ | -------------- | -------------------------------------- |
| `id`         | `uuid` PK      |                                        |
| `from_path`  | `varchar(500)` | Source path (e.g. `/old-post`)         |
| `to_path`    | `varchar(500)` | Destination path or full URL           |
| `type`       | `integer`      | `301` (permanent) or `302` (temporary) |
| `is_active`  | `boolean`      | Default true                           |
| `created_at` | `timestamp`    |                                        |

---

## File / Folder Structure

```
src/
├── app/
│   ├── (blog)/                    # Public blog layout group
│   │   ├── layout.tsx
│   │   ├── page.tsx               # Landing / coming soon (current)
│   │   ├── blog/
│   │   │   ├── page.tsx           # Blog index (article list)
│   │   │   └── [slug]/
│   │   │       └── page.tsx       # Single article
│   │   ├── category/
│   │   │   └── [slug]/
│   │   │       └── page.tsx       # Category filter
│   │   ├── tag/
│   │   │   └── [slug]/
│   │   │       └── page.tsx       # Tag filter
│   │   └── [slug]/
│   │       └── page.tsx           # Dynamic custom pages (About, Contact, etc.)
│   │
│   ├── (dashboard)/               # Dashboard layout group (protected)
│   │   ├── layout.tsx             # Sidebar + topbar shell
│   │   └── dashboard/
│   │       ├── page.tsx           # Overview / analytics
│   │       ├── articles/
│   │       │   ├── page.tsx       # Article list table
│   │       │   ├── new/
│   │       │   │   └── page.tsx   # New article (editor)
│   │       │   └── [id]/
│   │       │       └── edit/
│   │       │           └── page.tsx # Edit article
│   │       ├── pages/
│   │       │   ├── page.tsx       # Pages list table
│   │       │   ├── new/
│   │       │   │   └── page.tsx   # New page (editor)
│   │       │   └── [id]/
│   │       │       └── edit/
│   │       │           └── page.tsx # Edit page
│   │       ├── categories/
│   │       │   └── page.tsx       # Manage categories
│   │       ├── tags/
│   │       │   └── page.tsx       # Manage tags
│   │       ├── media/
│   │       │   └── page.tsx       # Media library
│   │       ├── seo/
│   │       │   └── page.tsx       # SEO overview table (all entities)
│   │       ├── subscribers/
│   │       │   └── page.tsx       # Newsletter subscribers list
│   │       ├── messages/
│   │       │   └── page.tsx       # Contact form submissions
│   │       ├── navigation/
│   │       │   └── page.tsx       # Menu builder
│   │       ├── redirects/
│   │       │   └── page.tsx       # Redirect rules
│   │       └── settings/
│   │           └── page.tsx       # Site settings / theming
│   │
│   ├── api/
│   │   ├── articles/
│   │   │   ├── route.ts           # GET (list) + POST (create)
│   │   │   └── [id]/
│   │   │       └── route.ts       # GET + PATCH + DELETE
│   │   ├── pages/
│   │   │   ├── route.ts           # GET (list) + POST (create)
│   │   │   └── [id]/
│   │   │       └── route.ts       # GET + PATCH + DELETE
│   │   ├── categories/
│   │   │   ├── route.ts           # GET + POST
│   │   │   └── [id]/
│   │   │       └── route.ts       # PATCH + DELETE
│   │   ├── tags/
│   │   │   ├── route.ts           # GET + POST
│   │   │   └── [id]/
│   │   │       └── route.ts       # PATCH + DELETE
│   │   ├── seo/
│   │   │   ├── route.ts           # GET (list all SEO entries)
│   │   │   └── [id]/
│   │   │       └── route.ts       # GET + PATCH + DELETE
│   │   ├── media/
│   │   │   └── upload/
│   │   │       └── route.ts       # POST (file upload)
│   │   ├── subscribers/
│   │   │   └── route.ts           # GET (list) + POST (subscribe)
│   │   ├── contact/
│   │   │   └── route.ts           # POST (submit form) + GET (list for dashboard)
│   │   ├── navigation/
│   │   │   └── route.ts           # GET + POST + PATCH + DELETE
│   │   ├── redirects/
│   │   │   └── route.ts           # GET + POST + PATCH + DELETE
│   │   ├── settings/
│   │   │   └── route.ts           # GET + PATCH
│   │   ├── uploadthing/
│   │   │   └── route.ts           # Uploadthing API handler
│   │   ├── revalidate/
│   │   │   └── route.ts           # On-demand ISR revalidation endpoint
│   │   └── webhooks/
│   │       └── clerk/
│   │           └── route.ts       # Clerk webhook handler
│   │
│   ├── layout.tsx                 # Root layout (global)
│   ├── globals.css
│   ├── robots.ts
│   ├── sitemap.ts
│   └── feed.xml/
│       └── route.ts               # RSS feed
│
├── components/
│   ├── ui/                        # shadcn primitives
│   ├── dashboard/                 # Dashboard-specific components
│   │   ├── sidebar.tsx
│   │   ├── topbar.tsx
│   │   ├── article-table.tsx
│   │   ├── article-form.tsx
│   │   ├── page-table.tsx
│   │   ├── page-form.tsx
│   │   ├── category-form.tsx
│   │   ├── seo-form.tsx           # Reusable SEO editor panel
│   │   ├── seo-table.tsx          # SEO overview data table
│   │   ├── media-grid.tsx
│   │   ├── media-upload.tsx
│   │   ├── nav-builder.tsx        # Drag-and-drop navigation builder
│   │   ├── redirect-table.tsx
│   │   ├── subscriber-table.tsx
│   │   ├── message-table.tsx
│   │   ├── settings-form.tsx
│   │   └── stats-cards.tsx
│   ├── editor/                    # Tiptap editor components
│   │   ├── editor.tsx             # Main editor wrapper
│   │   ├── toolbar.tsx            # Formatting toolbar
│   │   ├── bubble-menu.tsx        # Selection popup menu
│   │   ├── image-upload.tsx       # Image node + upload
│   │   └── extensions/            # Custom Tiptap extensions
│   │       ├── callout.ts
│   │       └── travel-tip.ts
│   └── blog/                      # Public blog components
│       ├── article-card.tsx
│       ├── article-content.tsx
│       ├── category-badge.tsx
│       ├── tag-pill.tsx
│       ├── contact-form.tsx       # Public contact form (client component)
│       └── newsletter-form.tsx    # Public newsletter signup
│
├── lib/
│   ├── db/
│   │   ├── index.ts               # Drizzle client (neon connection)
│   │   └── schema/
│   │       ├── articles.ts
│   │       ├── pages.ts
│   │       ├── categories.ts
│   │       ├── tags.ts
│   │       ├── seo.ts
│   │       ├── media.ts
│   │       ├── subscribers.ts
│   │       ├── contact.ts
│   │       ├── navigation.ts
│   │       ├── redirects.ts
│   │       ├── settings.ts
│   │       └── index.ts           # Re-exports all schemas
│   ├── uploadthing.ts             # Uploadthing file router config
│   ├── utils.ts                   # cn() and general helpers
│   ├── auth.ts                    # Clerk helpers (getRole, requireAuth, etc.)
│   ├── seo.ts                     # SEO resolution utility (fallback chain)
│   ├── cache.ts                   # Caching helpers (use cache, revalidation)
│   ├── validations/
│   │   ├── article.ts             # Zod schemas for article CRUD
│   │   ├── page.ts
│   │   ├── category.ts
│   │   ├── tag.ts
│   │   ├── seo.ts
│   │   ├── contact.ts
│   │   ├── subscriber.ts
│   │   └── settings.ts
│   └── constants.ts               # Status enums, role names, defaults
│
├── hooks/
│   ├── use-debounce.ts
│   └── use-media-upload.ts
│
└── middleware.ts                   # Clerk auth + redirect rules middleware
```

---

## Dashboard Pages

### Overview (`/dashboard`)

- Total articles count (published / draft / scheduled)
- Total pages count
- Recent articles list (last 5)
- Unread contact messages count
- New subscribers count (last 7 days)
- Quick action buttons: New Article, New Page, Upload Media
- Articles by category breakdown (simple bar or donut)

### Articles (`/dashboard/articles`)

- Sortable, filterable data table (shadcn `<DataTable>`)
    - Columns: Title, Category, Status, Author, Published date, SEO score indicator, Actions
    - Filters: status, category, search (title)
    - Bulk actions: delete, change status
- "New Article" button → `/dashboard/articles/new`

### Article Editor (`/dashboard/articles/new` & `/dashboard/articles/[id]/edit`)

- Full-featured Tiptap editor (see [Article Editor](#article-editor) section)
- Right sidebar panel:
    - **Status & Publish** — draft / publish / schedule with date picker
    - **Category** — select dropdown
    - **Tags** — multi-select / create inline
    - **Cover Image** — upload or choose from media library
    - **Featured** — toggle
    - **Locale** — `en` / `ja` switch
    - **SEO** — collapsible panel: loads the `seo_metadata` record for this article (meta title, description, OG image, slug editor, canonical URL, noindex/nofollow, JSON-LD preview)
- Auto-save (debounced, saves draft every 10s of inactivity)
- Reading time auto-calculated on content change

### Pages (`/dashboard/pages`)

- Data table listing all custom pages
    - Columns: Title, Slug, Status, Template, Show in Nav, Actions
- "New Page" button → `/dashboard/pages/new`

### Page Editor (`/dashboard/pages/new` & `/dashboard/pages/[id]/edit`)

- Same Tiptap editor as articles
- Right sidebar:
    - **Status** — draft / published
    - **Template** — dropdown: `default`, `full-width`, `contact`, `blank`
    - **Navigation** — toggle "show in nav" + set order
    - **Locale** — `en` / `ja`
    - **SEO** — same collapsible SEO panel (linked to `seo_metadata` for this page)

### SEO (`/dashboard/seo`)

Master SEO overview — a single table showing SEO status for **all entities**.

- Data table columns: Entity Type, Title/Name, Slug, Meta Title, Meta Description, OG Image (thumbnail), noindex, Actions (edit)
- Filters: entity type (`article` / `page` / `category` / `global`)
- Quick indicators:
    - ✅ Green: meta title + description + OG image all set
    - ⚠️ Yellow: partially filled
    - ❌ Red: missing SEO entry entirely
- Clicking "Edit" opens the SEO form in a sheet/dialog
- Bulk action: "Generate meta descriptions" (optional — uses excerpt/content as base)

### Categories (`/dashboard/categories`)

- List with inline edit (name, slug, description, color, icon, sort order)
- Add new category form (dialog or inline)
- Delete with confirmation (warn if articles linked)

### Tags (`/dashboard/tags`)

- Tag cloud / list view
- Add / rename / delete tags
- Show article count per tag

### Media Library (`/dashboard/media`)

- Grid of thumbnails with overlay details
- Upload zone (drag & drop + click) via Uploadthing
- Select & copy URL
- Delete with confirmation
- Filter by type (image, video, file)

### Subscribers (`/dashboard/subscribers`)

- Data table: Email, Name, Status, Source, Subscribed date
- Export to CSV
- Unsubscribe / delete actions

### Messages (`/dashboard/messages`)

- Data table of contact form submissions
- Columns: Name, Email, Subject, Status (new/read/replied), Date
- Click to expand full message
- Mark as read / replied

### Navigation (`/dashboard/navigation`)

- Drag-and-drop menu builder
- Separate sections: Header nav, Footer nav, Social links
- Each item: label, URL (or pick from pages), target, visibility toggle
- Support for nested items (dropdowns)
- Preview of how nav looks

### Redirects (`/dashboard/redirects`)

- Data table: From, To, Type (301/302), Active toggle
- Add / edit / delete redirects
- Redirects applied via middleware at runtime

### Settings (`/dashboard/settings`)

- **General** — Site name, description, social links, contact email
- **Appearance** — Accent color picker, font selection (from a preset list), dark mode default
- **SEO Defaults** — Default OG image, meta description template
- All settings persisted to `site_settings` table and read at build/request time

---

## API Routes

All API routes are protected via Clerk `auth()`. Responses follow this shape:

```ts
// Success
{ data: T }

// Error
{ error: string, details?: ZodError["issues"] }
```

### Articles

| Method   | Route                | Description                  |
| -------- | -------------------- | ---------------------------- |
| `GET`    | `/api/articles`      | List (paginated, filterable) |
| `POST`   | `/api/articles`      | Create article               |
| `GET`    | `/api/articles/[id]` | Get single article           |
| `PATCH`  | `/api/articles/[id]` | Update article               |
| `DELETE` | `/api/articles/[id]` | Soft-delete / hard-delete    |

Query params for `GET /api/articles`:

- `page`, `limit` — pagination (default 1, 20)
- `status` — filter by status
- `category` — filter by category slug
- `search` — full-text search on title
- `sort` — `newest` | `oldest` | `title`
- `locale` — `en` | `ja`

### Pages

| Method   | Route             | Description                  |
| -------- | ----------------- | ---------------------------- |
| `GET`    | `/api/pages`      | List (paginated, filterable) |
| `POST`   | `/api/pages`      | Create page                  |
| `GET`    | `/api/pages/[id]` | Get single page              |
| `PATCH`  | `/api/pages/[id]` | Update page                  |
| `DELETE` | `/api/pages/[id]` | Delete page                  |

### Categories

| Method   | Route                  | Description |
| -------- | ---------------------- | ----------- |
| `GET`    | `/api/categories`      | List all    |
| `POST`   | `/api/categories`      | Create      |
| `PATCH`  | `/api/categories/[id]` | Update      |
| `DELETE` | `/api/categories/[id]` | Delete      |

### Tags

| Method   | Route            | Description |
| -------- | ---------------- | ----------- |
| `GET`    | `/api/tags`      | List all    |
| `POST`   | `/api/tags`      | Create      |
| `PATCH`  | `/api/tags/[id]` | Update      |
| `DELETE` | `/api/tags/[id]` | Delete      |

### SEO Metadata

| Method   | Route           | Description                               |
| -------- | --------------- | ----------------------------------------- |
| `GET`    | `/api/seo`      | List all SEO entries (filterable by type) |
| `GET`    | `/api/seo/[id]` | Get SEO entry                             |
| `PATCH`  | `/api/seo/[id]` | Update SEO entry                          |
| `DELETE` | `/api/seo/[id]` | Delete SEO entry                          |

> SEO entries are auto-created when an article/page is created. They can also be created manually for categories or a global entry.

### Media

| Method   | Route               | Description             |
| -------- | ------------------- | ----------------------- |
| `POST`   | `/api/media/upload` | Upload file, return URL |
| `GET`    | `/api/media`        | List media (paginated)  |
| `DELETE` | `/api/media/[id]`   | Delete file + record    |

### Subscribers

| Method   | Route                   | Description            |
| -------- | ----------------------- | ---------------------- |
| `GET`    | `/api/subscribers`      | List (dashboard, auth) |
| `POST`   | `/api/subscribers`      | Subscribe (public)     |
| `DELETE` | `/api/subscribers/[id]` | Unsubscribe / delete   |

### Contact

| Method  | Route               | Description                    |
| ------- | ------------------- | ------------------------------ |
| `POST`  | `/api/contact`      | Submit contact form (public)   |
| `GET`   | `/api/contact`      | List submissions (dashboard)   |
| `PATCH` | `/api/contact/[id]` | Update status (read / replied) |

### Navigation

| Method   | Route                     | Description       |
| -------- | ------------------------- | ----------------- |
| `GET`    | `/api/navigation`         | Get all nav items |
| `POST`   | `/api/navigation`         | Create nav item   |
| `PATCH`  | `/api/navigation/[id]`    | Update nav item   |
| `DELETE` | `/api/navigation/[id]`    | Delete nav item   |
| `PUT`    | `/api/navigation/reorder` | Bulk reorder      |

### Redirects

| Method   | Route                 | Description     |
| -------- | --------------------- | --------------- |
| `GET`    | `/api/redirects`      | List all        |
| `POST`   | `/api/redirects`      | Create redirect |
| `PATCH`  | `/api/redirects/[id]` | Update redirect |
| `DELETE` | `/api/redirects/[id]` | Delete redirect |

### Settings

| Method  | Route           | Description             |
| ------- | --------------- | ----------------------- |
| `GET`   | `/api/settings` | Get all settings        |
| `PATCH` | `/api/settings` | Update settings (batch) |

### Revalidation

| Method | Route             | Description                                        |
| ------ | ----------------- | -------------------------------------------------- |
| `POST` | `/api/revalidate` | On-demand ISR revalidation (called after CMS save) |

### Webhooks

| Method | Route                 | Description                       |
| ------ | --------------------- | --------------------------------- |
| `POST` | `/api/webhooks/clerk` | Clerk user events (sync metadata) |

---

## Article Editor

Built with **Tiptap** — a headless, extensible rich-text editor built on ProseMirror.

### Core Extensions

| Extension         | Purpose                                                         |
| ----------------- | --------------------------------------------------------------- |
| StarterKit        | Paragraphs, headings, bold, italic, lists, blockquote, code, hr |
| Placeholder       | "Start writing your article…"                                   |
| Image             | Drag & drop images, inline upload                               |
| Link              | Inline links with URL editing                                   |
| TextAlign         | Left, center, right                                             |
| Underline         | Text underline                                                  |
| Highlight         | Text highlight with color options                               |
| CodeBlockLowlight | Syntax-highlighted code blocks                                  |
| Table             | Tables with resize                                              |
| Youtube           | Embed YouTube videos                                            |
| CharacterCount    | Live word/char count                                            |

### Custom Extensions

| Extension   | Purpose                                    |
| ----------- | ------------------------------------------ |
| `Callout`   | Colored callout boxes (info, warning, tip) |
| `TravelTip` | Styled "travel tip" card (icon + text)     |

### Toolbar Features

- **Text**: Bold, Italic, Underline, Strikethrough, Highlight
- **Structure**: H2, H3, H4, Paragraph, Blockquote, Callout
- **Lists**: Bullet, Ordered, Task list
- **Insert**: Image, YouTube embed, Table, Horizontal rule, Code block
- **Align**: Left, Center, Right
- **Link**: Add / edit / remove link
- **Undo / Redo**

### Bubble Menu

Appears on text selection: Bold, Italic, Link, Highlight — quick inline formatting.

### Content Storage

- **JSON** stored in `articles.content` (Tiptap document format) — used for editing.
- **HTML** stored in `articles.content_html` — pre-rendered on save for fast blog display.

---

## Media Management (Uploadthing)

- **Provider**: Uploadthing (configured at `src/lib/uploadthing.ts`).
- **API route**: `/api/uploadthing/route.ts` — Uploadthing route handler.
- On upload: store record in `media` table with URL, key, dimensions, size, mime type.
- Dashboard media library: grid view, searchable, selectable for inserting into articles/pages.
- Image optimization via Next.js `<Image>` on the blog frontend.
- Max upload size: 10 MB for images, 50 MB for video.
- Accepted types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `video/mp4`.

---

## SEO System

### Architecture

SEO is managed via a **dedicated `seo_metadata` table** rather than inline columns on each entity. This provides:

- One unified SEO dashboard for all content.
- Consistent SEO fields across articles, pages, categories, and global entries.
- A single reusable `<SeoForm>` component used inside article/page editors AND as a standalone sheet in the SEO dashboard.

### SEO Resolution (Fallback Chain)

When rendering any page, SEO metadata is resolved through this chain:

```
seo_metadata (entity-specific) → entity fields (title, excerpt) → site_settings (global defaults)
```

A helper `resolveSeo(entityType, entityId)` in `src/lib/seo.ts` handles this:

```ts
// Pseudocode
async function resolveSeo(type: string, id: string): Promise<Metadata> {
  const seo = await db.query.seoMetadata.findFirst({ where: ... });
  const entity = await getEntity(type, id);
  const defaults = await getSiteSettings();

  return {
    title: seo?.metaTitle ?? entity.title ?? defaults.siteName,
    description: seo?.metaDescription ?? entity.excerpt ?? defaults.defaultDescription,
    openGraph: {
      title: seo?.ogTitle ?? seo?.metaTitle ?? entity.title,
      description: seo?.ogDescription ?? seo?.metaDescription ?? entity.excerpt,
      images: seo?.ogImage ?? entity.coverImage ?? defaults.defaultOgImage,
    },
    // ... twitter, canonical, robots, jsonLd
  };
}
```

### JSON-LD Structured Data

Auto-generated per entity type:

- **Articles** → `Article` schema (headline, author, datePublished, image, etc.)
- **Pages** → `WebPage` schema
- **Blog index** → `Blog` schema + `ItemList` of articles
- **Category pages** → `CollectionPage` schema

Can be overridden via the `json_ld` field in `seo_metadata`.

### Dashboard SEO Page

The `/dashboard/seo` page shows a master table of all SEO entries — see [Dashboard Pages → SEO](#seo-dashboardseo) above.

### Per-Article / Per-Page SEO

Inline collapsible SEO panel in the article/page editor — reads and writes to the `seo_metadata` row for that entity. Fields:

- Meta title (with character counter, max 120)
- Meta description (with character counter, max 320)
- Slug editor (with live URL preview)
- OG image (upload or pick from media)
- Canonical URL
- noindex / nofollow toggles
- JSON-LD preview (read-only, auto-generated)

### Site-Level SEO

- `robots.ts` ✅
- `sitemap.ts` ✅ → extended dynamically to include all published articles, pages, and categories
- Open Graph defaults in root layout ✅
- `manifest.json` for PWA basics
- RSS feed at `/feed.xml`

---

## Performance & Caching

### Static Generation with `generateStaticParams`

For known dynamic routes, use `generateStaticParams` to pre-build pages at build time:

```ts
// src/app/(blog)/blog/[slug]/page.tsx
export async function generateStaticParams() {
    const articles = await db.query.articles.findMany({
        where: eq(articles.status, "published"),
        columns: { slug: true },
    });
    return articles.map(a => ({ slug: a.slug }));
}
```

Applied to:

- `/blog/[slug]` — all published articles
- `/category/[slug]` — all categories
- `/tag/[slug]` — all tags
- `/[slug]` — all published pages (about, contact, etc.)

### Incremental Static Regeneration (ISR)

For pages that change occasionally, use time-based revalidation:

```ts
// Revalidate every 60 seconds
export const revalidate = 60;
```

Applied to:

- Blog index (`/blog`) — new articles show up within 60s
- Category/tag listing pages
- Custom pages

### On-Demand Revalidation

When content is saved in the dashboard, trigger instant revalidation via the `/api/revalidate` endpoint:

```ts
// Called after article/page save in API routes
import { revalidatePath, revalidateTag } from "next/cache";

// Revalidate the specific article
revalidatePath(`/blog/${article.slug}`);

// Revalidate the blog index
revalidateTag("articles");

// Revalidate sitemap
revalidatePath("/sitemap.xml");
```

### `use cache` Directive (Next.js 16)

Use the `use cache` directive for caching expensive server operations:

```ts
// src/lib/cache.ts
async function getPublishedArticles(page: number, limit: number) {
    "use cache";
    // This result is cached and shared across requests
    const result = await db.query.articles.findMany({
        where: eq(articles.status, "published"),
        limit,
        offset: (page - 1) * limit,
        orderBy: desc(articles.publishedAt),
    });
    return result;
}
```

Cache invalidated via `revalidateTag()` when articles are created/updated/deleted.

### Data Access Layer

Centralize all DB queries in `src/lib/data/` files with caching built in:

```
src/lib/data/
├── articles.ts    # getArticles, getArticleBySlug, etc.
├── pages.ts       # getPages, getPageBySlug
├── categories.ts  # getCategories, getCategoryBySlug
├── tags.ts        # getTags
├── seo.ts         # getSeoForEntity
├── navigation.ts  # getNavigation
└── settings.ts    # getSiteSettings
```

Each function uses `use cache` + tagged caching so revalidation is granular.

### Prefetching & Navigation

- **`<Link>` prefetching** — Next.js automatically prefetches linked routes when they enter the viewport. No extra config needed.
- **Route groups** — `(blog)` and `(dashboard)` route groups ensure the dashboard JS bundle is never loaded on the public blog and vice versa.
- **Streaming / Suspense** — Wrap data-dependent sections in `<Suspense>` with skeleton fallbacks for instant navigation.

### Image Optimization

- All images served via Next.js `<Image>` component with automatic `srcset`, `sizes`, lazy loading, and WebP/AVIF format negotiation.
- Cover images use `priority` prop on above-the-fold placements.
- Uploadthing-hosted images work with `next.config.ts` `images.remotePatterns`.

### Bundle Optimization

- **Dynamic imports** — Heavy components (Tiptap editor, media grid) loaded with `next/dynamic` + `ssr: false` in the dashboard.
- **Route groups** — Public blog and dashboard are separate groups → separate bundles.
- **Tree shaking** — Import only specific Tiptap extensions, not the full bundle.

### Middleware Performance

- Clerk middleware runs only on `/dashboard/**` and `/api/**` routes (matcher config).
- Redirect rules from the `redirects` table are loaded and cached in middleware, refreshed periodically.

---

## Theming & Style Management

### How It Works

All visual customizations are stored in the `site_settings` table and accessed via a server-side utility that reads them at request time (or cached with revalidation).

### Configurable Properties

| Setting            | Type     | Example               | Effect                      |
| ------------------ | -------- | --------------------- | --------------------------- |
| `accent_color`     | `string` | `#b91c1c` (red-700)   | Primary CTA, links, accents |
| `font_heading`     | `string` | `"Inter"`             | Heading font-family         |
| `font_body`        | `string` | `"Inter"`             | Body font-family            |
| `logo_url`         | `string` | `/logo.svg`           | Site logo                   |
| `dark_mode`        | `string` | `"system"`            | `light` / `dark` / `system` |
| `hero_image`       | `string` | `/hero.jpg`           | Blog landing hero           |
| `social_twitter`   | `string` | `@rakudair`           | Footer / share links        |
| `social_instagram` | `string` | `@rakudair`           | Footer / share links        |
| `footer_text`      | `string` | `"© 2026 Rakuda Air"` | Footer copy                 |

### Implementation

- Settings are applied via CSS custom properties injected in the root layout.
- Example: `accent_color` → `--color-accent: <value>` on `<html>`.
- shadcn theme tokens reference these custom properties, so changing a color in settings instantly propagates across all UI components.
- Font changes load the new Google Font dynamically and update `--font-heading` / `--font-body`.

### Dashboard Settings Page

- Color picker for accent color
- Dropdown for font selection (curated list of Google Fonts that pair well)
- Toggle for dark mode default
- Upload fields for logo and hero image
- Live preview panel showing how changes look before saving

---

## Additional Entities & Features

Beyond articles, pages, categories, and tags — here's what else the blog benefits from:

### Already Planned (above)

| Entity                  | Why                                                                  |
| ----------------------- | -------------------------------------------------------------------- |
| **Pages**               | Custom pages (About, Contact, Legal, etc.) — same editor as articles |
| **SEO Metadata**        | Unified SEO table for all entities                                   |
| **Subscribers**         | Newsletter / launch notification emails                              |
| **Contact Submissions** | Store and manage contact form messages                               |
| **Navigation**          | Configurable header/footer menus                                     |
| **Redirects**           | URL redirect management for SEO migrations                           |

### Blog Features (Public Frontend)

| Feature                  | Notes                                                              |
| ------------------------ | ------------------------------------------------------------------ |
| **Article listing**      | Paginated, filterable by category/tag                              |
| **Featured articles**    | Highlighted section on blog index                                  |
| **Related articles**     | Same category or shared tags, shown below each article             |
| **Table of contents**    | Auto-generated from headings for long articles                     |
| **Reading progress bar** | Scroll indicator on article pages                                  |
| **Share buttons**        | Twitter, Facebook, copy link                                       |
| **Multi-language**       | `en` / `ja` — articles and pages can be in either locale           |
| **RSS feed**             | `/feed.xml` route for subscribers                                  |
| **Search**               | Client-side across titles/excerpts (upgrade to Postgres FTS later) |
| **Comments**             | Optional — can add later via Disqus, Giscus, or custom table       |

### Nice-to-Have (Future)

| Feature                       | Notes                                                              |
| ----------------------------- | ------------------------------------------------------------------ |
| **Series/Collections**        | Group articles into ordered series (e.g., "7 Days in Kyoto")       |
| **Destinations**              | Dedicated entity for places (map, coordinates), linked to articles |
| **Authors table**             | If multiple writers — profile photo, bio, social links             |
| **Analytics integration**     | Plausible or Umami (privacy-friendly) embedded in dashboard        |
| **Scheduled publishing cron** | Vercel Cron or external service to auto-publish scheduled articles |
| **Email newsletter sending**  | Integrate with Resend or similar to send to subscribers            |
| **Image galleries**           | Tiptap extension for multi-image gallery blocks                    |
| **Embeds**                    | Instagram, Twitter/X, Google Maps embeds in the editor             |

---

## Packages to Install

```bash
# Auth
pnpm add @clerk/nextjs

# Database
pnpm add drizzle-orm @neondatabase/serverless
pnpm add -D drizzle-kit

# Editor
pnpm add @tiptap/react @tiptap/starter-kit @tiptap/pm
pnpm add @tiptap/extension-placeholder @tiptap/extension-image
pnpm add @tiptap/extension-link @tiptap/extension-text-align
pnpm add @tiptap/extension-underline @tiptap/extension-highlight
pnpm add @tiptap/extension-code-block-lowlight @tiptap/extension-table
pnpm add @tiptap/extension-table-row @tiptap/extension-table-cell
pnpm add @tiptap/extension-table-header @tiptap/extension-youtube
pnpm add @tiptap/extension-character-count
pnpm add lowlight

# File uploads
pnpm add uploadthing @uploadthing/react

# Validation & Forms
pnpm add zod react-hook-form @hookform/resolvers

# Utilities
pnpm add date-fns slugify sonner

# shadcn components to add
pnpm dlx shadcn@latest add dialog dropdown-menu select textarea table tabs \
  card avatar tooltip popover calendar date-picker switch label form \
  sheet command sonner skeleton progress checkbox radio-group \
  collapsible alert scroll-area toggle toggle-group \
  color-picker
```

### Environment Variables

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
CLERK_WEBHOOK_SECRET=whsec_...

# Neon
DATABASE_URL=postgresql://...@...neon.tech/rakudair?sslmode=require

# Uploadthing
UPLOADTHING_TOKEN=...

# Site
NEXT_PUBLIC_SITE_URL=https://www.rakudair.com
```

---

## Implementation Order

1. **Database setup** — Drizzle config, all schema files, initial migration
2. **Auth setup** — Clerk provider, middleware, role helpers
3. **Dashboard shell** — Layout with sidebar/topbar, protected routes
4. **Categories CRUD** — API + dashboard page (simplest entity, good to start)
5. **Tags CRUD** — API + dashboard page
6. **Media upload** — Uploadthing config, API + media library page
7. **Pages CRUD** — API + dashboard page + page editor (reuse Tiptap)
8. **Article editor** — Tiptap setup, article form, API routes
9. **Article list** — Dashboard data table with filters
10. **SEO system** — Schema, resolution utility, SEO form component, SEO dashboard table
11. **Navigation** — API + dashboard menu builder
12. **Redirects** — API + dashboard page + middleware integration
13. **Subscribers** — API + dashboard table + public signup form
14. **Contact** — API + dashboard messages + public contact form
15. **Settings** — API + settings page + theme injection
16. **Performance** — `generateStaticParams`, ISR, `use cache`, on-demand revalidation
17. **Blog frontend** — Public article list, single article, category/tag pages, custom pages
18. **SEO polish** — Dynamic sitemap, JSON-LD, RSS feed
