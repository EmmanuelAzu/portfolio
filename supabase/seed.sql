-- Portfolio seed data, from Emmanuel Azubuike's CV (29 Aug 2026).
-- Academic marks are intentionally left out. Re-running is safe: every table is cleared and re-seeded.

begin;

insert into site_profile (full_name, headline, bio, location, email, avatar_url, links, skills) values (
  'Emmanuel Azubuike',
  'Computer Science Honours student · Data science, machine learning & software',
  'Computer Science graduate and Honours student at Wits University with a passion for problem-solving, '
  'mathematics and technology. I have led teams and events across student societies at Wits, co-authored '
  'quantum machine learning research, and I enjoy communicating complex ideas clearly. My goal is a career '
  'in data science and analytics.',
  'Johannesburg, South Africa',
  'azubuikee290@gmail.com',
  null, -- upload a headshot to the portfolio-media bucket and paste its public URL here
  '{"github": "https://github.com/EmmanuelAzu"}',
  '[
    {"group": "Languages", "items": ["Python", "Java", "C++", "C", "CUDA", "SQL", "JavaScript", "TypeScript"]},
    {"group": "Frameworks & tools", "items": ["Qiskit", "Next.js", "React", "Supabase", "Tailwind CSS"]},
    {"group": "Strengths", "items": ["Strategic thinking", "Problem solving", "Leadership", "Research"]}
  ]'
) on conflict (id) do update set
  full_name = excluded.full_name, headline = excluded.headline, bio = excluded.bio,
  location = excluded.location, email = excluded.email, avatar_url = excluded.avatar_url,
  links = excluded.links, skills = excluded.skills;

delete from portfolio_projects;

insert into portfolio_projects
  (title, slug, category, short_description, detailed_markdown, tech_stack, github_url, order_index)
values
(
  'Quantum Neural Networks for Optical Mode Classification',
  'quantum-neural-network-hg-modes',
  'academic',
  'A deep quantum neural network that classifies Hermite-Gaussian (HG) laser modes, built during a research internship at SA QuTI.',
  $md$
## Overview

Research internship at the **South African Quantum Technology Initiative** (January 2026),
working with the Wits School of Physics.

- Designed and implemented a **deep quantum neural network** for Hermite-Gaussian (HG) mode image classification
- Built with **Python** and IBM's **Qiskit** library
- Reached **85% model prediction accuracy**
- Implemented research experiments from the Wits School of Physics

## Publication

Co-author of *Inverse design of optical neural networks with qubit-based quantum computers*,
presented at the South African Institute of Physics Conference (SAIP2026), Track F – Applied Physics.

> Azevedo, N., Azubuike, E., Ornelas, P. D., Gaikwad, A., Nape, I., Sinayskiy, I., Snyman, J., & Koni, M. (2026).
  $md$,
  array['Python', 'Qiskit', 'Quantum machine learning'],
  null,
  1
),
(
  'Creative Chaos Hackathon System',
  'creative-chaos-hackathon',
  'personal',
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
  array['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Framer Motion'],
  'https://github.com/EmmanuelAzu/Creative-Chaos-Hackathon',
  2
),
(
  'MarketIQ',
  'marketiq',
  'personal',
  'AI-powered stock research: annotated candlestick charts, Claude news-sentiment analysis and a strategy backtester.',
  $md$
## Overview

A financial-intelligence app combining interactive charts, AI analysis and backtesting.

## Engineering highlights

- A canvas drawing layer on TradingView Lightweight Charts (trendlines, Fibonacci, notes), anchored in date/price space
- News sentiment from Claude, returned as structured, validated output and cached per ticker
- SMA-crossover backtester with stop loss / take profit and next-open fills, so there's no look-ahead bias
  $md$,
  array['Next.js 15', 'TypeScript', 'Lightweight Charts', 'Anthropic API', 'Supabase'],
  'https://github.com/EmmanuelAzu/market_Iq',
  3
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
  array['Next.js 15', 'TypeScript', 'Supabase', 'PostgreSQL', 'Recharts'],
  'https://github.com/EmmanuelAzu/share-wallet',
  4
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
  'https://github.com/EmmanuelAzu/code-sim',
  5
);

delete from career_timeline;

insert into career_timeline
  (title, organization, type, start_date, end_date, date_precision, description, skills_acquired)
values
  -- Education
  ('BSc Honours in Computer Science', 'University of the Witwatersrand', 'education',
   '2026-02-01', '2026-12-31', 'month',
   'Postgraduate Merit Award recipient 2026 (fully funded scholarship). Teaching Assistant for Machine Learning III, '
   'Software Design III and Parallel Computing III; Head Tutor for Basic Computer Organization I.',
   array['Machine learning', 'Teaching', 'Parallel computing']),
  ('BSc in Computer Science', 'University of the Witwatersrand', 'education',
   '2023-02-01', '2025-12-31', 'month',
   'Wits Council Merit Scholarship (2025) and Wits Entrance Scholarship (2023). Computer Science III Class Representative.',
   array['Algorithms', 'Software design', 'Leadership']),
  ('National Senior Certificate', 'Liberty Community School', 'education',
   '2018-01-01', '2022-12-31', 'month',
   'Head Boy (2022) and Prefect (2018–2021). Merit Bursary alumnus (2017–2022). Best Performer in Computer Applications '
   'Technology in the Johannesburg East District.',
   null),

  -- Experience
  ('Research Intern', 'South African Quantum Technology Initiative', 'experience',
   '2026-01-01', '2026-01-31', 'month',
   'Designed and implemented a deep quantum neural network for HG mode image classification with Python and IBM''s Qiskit, '
   'reaching 85% model prediction accuracy, and implemented research experiments from the Wits School of Physics.',
   array['Python', 'Qiskit', 'Quantum machine learning']),
  ('Head of Events & Partnerships', 'Wits Developer Society', 'experience',
   '2025-02-01', null, 'month',
   'Plan events for a 600+ member club and drive initiatives that upskill students in software development. '
   'Established partnerships and sponsorships with renowned tech firms.',
   array['Event management', 'Partnerships']),
  ('Outreach Manager', 'Wits AWS Cloud Club', 'experience',
   '2025-03-01', '2025-12-31', 'month',
   'Led the "AI IN ACTION" hackathon for 130 students, raising R50,000 from sponsors including Standard Bank, '
   'BBD Software, BSG, Elenjical Solutions, BoxFusion and MWR CyberSec. Coordinated workshops with tech companies '
   'to build AWS cloud skills for 600+ members.',
   array['Fundraising', 'AWS', 'Hackathon operations']),
  ('Director of Case Workshops', 'Wits Consulting Club', 'experience',
   '2024-11-01', '2026-02-28', 'month',
   'Led case workshop preparation and competitions for aspiring consultants, and co-founded the "Case Buddy Programme", '
   'a biweekly case prep series led by experienced consultants.',
   array['Case interviews', 'Workshop design']),

  -- Publications
  ('Inverse design of optical neural networks with qubit-based quantum computers',
   'SAIP2026 · South African Institute of Physics Conference, Track F – Applied Physics', 'publication',
   '2026-01-01', '2026-01-01', 'year',
   'Co-author with Azevedo, N., Ornelas, P. D., Gaikwad, A., Nape, I., Sinayskiy, I., Snyman, J. and Koni, M.',
   array['Quantum computing', 'Optical neural networks']),

  -- Awards & competitions
  ('BCG Case Competition: First Runner-Up', 'Boston Consulting Group', 'award',
   '2025-07-01', '2025-07-01', 'month',
   'Placed 2nd of 30 teams in a national competition on South Africa''s energy transition, proposing data-driven '
   'initiatives for energy security across policy, infrastructure and financing.',
   array['Strategy', 'Data-driven analysis']),

  -- Certifications
  ('M&A Finance Accelerator', 'AmplifyME', 'certification',
   '2026-05-01', '2026-05-01', 'month',
   'Built a multi-year projected operating model for Tesla Inc. from historical data, market trends and broker estimates, '
   'then ran DCF and trading-multiples valuations to construct a valuation football field.',
   array['Financial modelling', 'DCF valuation']),
  ('Investment Banking Job Simulation', 'JPMorganChase (via Forage)', 'certification',
   '2024-11-01', '2024-11-01', 'month',
   'Identified M&A targets against strategic and financial criteria and built a DCF model accounting for competitor bids '
   'and supply chain interruptions.',
   array['M&A', 'DCF valuation']);

commit;
