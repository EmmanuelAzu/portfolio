# Deploying Portfolio

Next.js on **Vercel**, data on **Supabase**.

## 1. Create or reuse the Supabase project

The Supabase free plan allows **2 active projects**, so the four apps are paired
without clashing table names:

| Supabase project | Apps |
| --- | --- |
| `sharewallet-portfolio` | ShareWallet + Portfolio |
| `codesim-marketiq` | CodeSim + MarketIQ |

This app uses `sharewallet-portfolio` (shared with ShareWallet). (ShareWallet and CodeSim both define `profiles`, so
they must live in different projects.)

## 2. Apply the database schema

In the Supabase dashboard open **SQL Editor → New query**, paste each file in
order and click **Run**:

   1. `supabase/migrations/20260924000000_init.sql`
   2. `supabase/seed.sql`

Or, with the Supabase CLI: `npx supabase link --project-ref <ref>` then
`npx supabase db push` and `psql "$DATABASE_URL" -f supabase/seed.sql`.

## 3. Auth

No sign-in is needed. Contact-form messages land in `contact_inquiries`; read them
in the Supabase Table Editor.

## 4. Deploy on Vercel

1. <https://vercel.com/new> → **Import** `EmmanuelAzu/portfolio`. Framework
   preset: Next.js (auto-detected), default build settings.
2. Add these **Environment Variables** before the first deploy:

| Variable | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API → anon public key |

3. Click **Deploy**. Every push to `main` redeploys automatically.

The migration creates the public `portfolio-media` Storage bucket. Upload a headshot or screenshots there, then paste the public URLs into `site_profile.avatar_url`, `featured_image_url` or `gallery_urls`. Content edits show up within 5 minutes without a redeploy.
