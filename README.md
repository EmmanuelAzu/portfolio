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

### Filling in your details

`supabase/seed.sql` has real entries for the Creative Chaos, ShareWallet and
CodeSim projects. Everything else is a **`TODO`** placeholder: bio, location,
email, education, work history and an academic project. The site and the CV
**hide any row or field that still starts with `TODO`**, so a half-filled seed
never shows placeholders to visitors.

Add pictures and walkthrough videos to the public `portfolio-media` Storage
bucket, then paste their public URLs into `featured_image_url`, `gallery_urls`
or `site_profile.avatar_url`. `.mp4` / `.webm` files play as videos in the lightbox.

## Features

| | |
| --- | --- |
| **Filterable masonry grid** | Academic / Personal / Commercial filters with Framer Motion layout animations and a shared-layout active pill. |
| **Project pages** | Markdown write-ups, tech stack, live/source links and a keyboard-navigable lightbox (←/→/Esc) for images and videos. |
| **Career timeline** | Education, experience and awards, newest first. |
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
