-- Developer Portfolio: initial schema

create extension if not exists "uuid-ossp";

-- Single-row table holding the owner's details (feeds the hero and the CV PDF).
create table site_profile (
  id boolean primary key default true check (id), -- enforces a single row
  full_name text not null,
  headline text not null,
  bio text,
  location text,
  email text,
  avatar_url text,
  links jsonb not null default '{}'::jsonb, -- { "github": "...", "linkedin": "...", "website": "..." }
  skills jsonb not null default '{}'::jsonb -- { "Languages": ["TypeScript", ...], "Frameworks": [...] }
);

create table portfolio_projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  category text check (category in ('academic', 'personal', 'commercial')),
  short_description text not null,
  detailed_markdown text not null,
  tech_stack text[],
  featured_image_url text,
  gallery_urls text[], -- images or videos (.mp4/.webm) in Supabase Storage
  github_url text,
  live_demo_url text,
  order_index integer default 0
);

create table career_timeline (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  organization text not null,
  type text check (type in ('education', 'experience', 'award')),
  start_date date not null,
  end_date date, -- null = present
  description text,
  skills_acquired text[]
);

create table contact_inquiries (
  id uuid default uuid_generate_v4() primary key,
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  message text not null check (char_length(message) between 10 and 5000),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create index on portfolio_projects (order_index);
create index on career_timeline (start_date desc);

-- ---------------------------------------------------------------------------
-- Row Level Security: content is public-read; inquiries are write-only
-- ---------------------------------------------------------------------------

alter table site_profile enable row level security;
alter table portfolio_projects enable row level security;
alter table career_timeline enable row level security;
alter table contact_inquiries enable row level security;

create policy "Profile is public" on site_profile for select using (true);
create policy "Projects are public" on portfolio_projects for select using (true);
create policy "Timeline is public" on career_timeline for select using (true);

-- Anyone may send a message; nobody but the owner (dashboard / service role) can read them.
create policy "Anyone can send an inquiry" on contact_inquiries for insert with check (true);
revoke select, update, delete on contact_inquiries from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Storage: public bucket for screenshots and walkthrough videos
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do nothing;
