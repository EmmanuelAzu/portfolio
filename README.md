<p align="center"><img src="public/logo.svg" width="72" alt="EA monogram"></p>

# Developer Portfolio

A dynamic career showcase. Projects, work history and skills live in Supabase,
and the same rows drive the website **and** a downloadable PDF CV.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui ·
Supabase (Postgres, Storage) · Framer Motion · @react-pdf/renderer · Vercel

## Getting started

```bash
cp .env.example .env.local        # Supabase URL + anon key
npm install
npx supabase db push              # schema, RLS, storage bucket
psql "$DATABASE_URL" -f supabase/seed.sql
npm run dev
```

### Content

`supabase/seed.sql` is generated from the CV (29 Aug 2026), with **academic marks
and the phone number deliberately left out**. It's safe to re-run: it replaces
all projects and timeline rows.

- **Timeline types:** `education`, `experience`, `award`, `publication`, `certification`.
  One-off items (awards, publications, certifications) set `end_date = start_date`.
  Use `date_precision = 'year'` when only the year is known.
- **Skills** are an ordered list: `[{ "group": "Languages", "items": [...] }]`.
- Any row or field whose text starts with `TODO` is hidden on the site and in the CV.

Add a headshot, screenshots and walkthrough videos to the public `portfolio-media`
Storage bucket, then paste their public URLs into `site_profile.avatar_url`,
`featured_image_url` or `gallery_urls`. `.mp4` / `.webm` files play as videos.

## Features

| | |
| --- | --- |
| **Filterable masonry grid** | Academic / Personal / Commercial filters with Framer Motion layout animations and a shared-layout active pill. |
| **Project pages** | Markdown write-ups, tech stack, live/source links and a keyboard-navigable lightbox (←/→/Esc) for images and videos. |
| **Career timeline** | Education, experience, publications, awards and certifications, newest first. |
| **Dynamic CV** | `GET /cv` renders an A4 PDF from `site_profile`, `career_timeline` and `portfolio_projects` (`/cv?view` opens it inline). |
| **Contact form** | Zod-validated `/api/contact` with a honeypot, stored in `contact_inquiries`. |

Pages are statically generated and revalidated every 5 minutes, so edits in the
Supabase dashboard show up without a redeploy.

## Data model & security

| Table | Public access |
| --- | --- |
| `site_profile` (single row) | read |
| `portfolio_projects` | read |
| `career_timeline` | read |
| `contact_inquiries` | **insert only**. Visitors can send messages but never read them. The DB enforces length and email checks. |

Read inquiries in the Supabase table editor, or add an authenticated admin
view later.

## Design system

| Token | Hex |
| --- | --- |
| Canvas | `#FAFAFA` Off-white |
| Primary | `#4A5D4E` Olive green |
| Accent | `#D4AF37` Metallic gold |
| Text | `#1F2937` Charcoal |
| Card | `#FFFFFF` |

Typography pairs **Fraunces** (headings) with **Geist** (body). Logo: a
geometric "EA" monogram in olive inside a fine gold frame
([public/logo.svg](public/logo.svg)).
