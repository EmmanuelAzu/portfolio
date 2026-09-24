-- Portfolio seed data.
--
-- The three projects below are real work (this portfolio's sibling repos and
-- the Creative Chaos hackathon system). Every row marked TODO is a placeholder:
-- replace it with your real CV details before deploying.

insert into site_profile (full_name, headline, bio, location, email, avatar_url, links, skills) values (
  'Emmanuel Azubuike',
  'Full-stack developer · Next.js, TypeScript & Supabase',
  'TODO: two or three sentences about who you are, what you build and what you are looking for next.',
  'TODO: City, Country',
  'TODO: you@example.com',
  null, -- TODO: upload a headshot to the portfolio-media bucket and paste its public URL
  '{"github": "https://github.com/EmmanuelAzu"}',
  '{
    "Languages": ["TypeScript", "JavaScript", "SQL"],
    "Frameworks": ["Next.js", "React", "Tailwind CSS"],
    "Platforms": ["Supabase", "Vercel", "PostgreSQL"]
  }'
) on conflict (id) do update set
  full_name = excluded.full_name, headline = excluded.headline, bio = excluded.bio,
  location = excluded.location, email = excluded.email, avatar_url = excluded.avatar_url,
  links = excluded.links, skills = excluded.skills;

insert into portfolio_projects
  (title, slug, category, short_description, detailed_markdown, tech_stack, github_url, order_index)
values
(
  'Creative Chaos Hackathon System',
  'creative-chaos-hackathon',
  'commercial', -- TODO: confirm category
  'Registration, QR check-in, judging, live leaderboard and a final-reveal ceremony for a hackathon, in one app.',
  $md$
## Overview

An end-to-end event platform used to run the Creative Chaos hackathon.

- **Registration** for participants, judges and committee members
- **QR check-in**: every team gets a printable QR code
- **Judging**: judges scan a team's QR code to open its scoring sheet
- **Leaderboard**: public rankings behind an admin toggle
- **Final reveal**: a big-screen ceremony counting down from 5th to 1st, with audience voting from a shared QR page

## Engineering highlights

- Row Level Security so the public key can only register, score and vote
- Server-only admin actions using the service role key
- Aggregation views that turn raw judge scores into rankings
  $md$,
  array['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Framer Motion', 'pdf-lib'],
  'https://github.com/EmmanuelAzu/Creative-Chaos-Hackathon', -- TODO: set to null if the repo stays private
  1
),
(
  'ShareWallet',
  'sharewallet',
  'personal',
  'Shared wallets with consensus approvals: admins spend directly, member purchases wait for the group to sign off.',
  $md$
## Overview

A collaborative expense platform. Every ledger write runs through an atomic
Postgres function, and members vote on each other's purchases in real time.

## Engineering highlights

- Security-definer RPCs with row locking, so concurrent approvals can't overdraw a wallet
- Supabase Realtime pushes new requests and votes to every member
- Spend analytics: monthly burn, per-member leaderboard, category breakdown
  $md$,
  array['Next.js 15', 'TypeScript', 'Supabase', 'PostgreSQL', 'Recharts', 'shadcn/ui'],
  null, -- TODO: add the repo URL once published
  2
),
(
  'CodeSim',
  'codesim',
  'personal',
  'Interactive framework-mastery platform with an in-browser test runner, XP and a live leaderboard.',
  $md$
## Overview

Solve React, Next.js, TypeScript and Rust challenges in a Monaco editor with
instant test feedback.

## Engineering highlights

- A sandboxed iframe runner (opaque origin) with a self-hosted React runtime
- Rust problems run on Judge0, graded server-side
- XP and a realtime solve feed maintained by database triggers
  $md$,
  array['Next.js 15', 'TypeScript', 'Monaco', 'Supabase Realtime', 'Judge0'],
  null, -- TODO: add the repo URL once published
  3
),
(
  'TODO: Academic project title',
  'todo-academic-project',
  'academic',
  'TODO: one-line summary of a university or course project.',
  $md$
## TODO

Describe the problem, your role, the approach and the result. Add screenshots
to the `portfolio-media` bucket and list their URLs in `gallery_urls`.
  $md$,
  array['TODO'],
  null,
  4
)
on conflict (slug) do nothing;

insert into career_timeline (title, organization, type, start_date, end_date, description, skills_acquired) values
  ('TODO: Degree, e.g. B.Sc. Computer Science', 'TODO: University', 'education', '2021-09-01', null,
   'TODO: relevant coursework, grade or thesis.', array['TODO']),
  ('TODO: Role, e.g. Software Developer', 'TODO: Company', 'experience', '2024-01-01', null,
   'TODO: what you built and the impact it had.', array['TODO']),
  ('Organiser & developer, Creative Chaos Hackathon', 'Creative Chaos', 'experience', '2026-01-01', null, -- TODO: real start/end dates
   'Built and ran the event platform: registration, QR check-in, judging and the live final reveal.',
   array['Next.js', 'Supabase', 'Event operations']);
