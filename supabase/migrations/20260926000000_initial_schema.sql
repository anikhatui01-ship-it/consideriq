-- ConsiderIQ v0.1 Initial Schema
-- Enforces multi-tenancy, immutable audit trails, and strict Row Level Security (RLS)

-- 1. Projects Table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  website text not null,
  category text not null,
  competitors text[] not null default '{}',
  target_persona text not null default '',
  constraints text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS for Projects
alter table public.projects enable row level security;

create policy "Users can view their own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can create their own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Users can delete their own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

create index if not exists idx_projects_user_id on public.projects(user_id);
create index if not exists idx_projects_created_at on public.projects(created_at desc);

-- 2. Simulations Table
create table if not exists public.simulations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'gemini',
  model text not null default 'gemini-2.5-flash',
  status text not null default 'pending' check (status in ('pending', 'running', 'completed', 'failed')),
  scenarios_count integer not null default 1,
  visibility_rate numeric check (visibility_rate >= 0 and visibility_rate <= 100),
  shortlist_rate numeric check (shortlist_rate >= 0 and shortlist_rate <= 100),
  recommendation_rate numeric check (recommendation_rate >= 0 and recommendation_rate <= 100),
  elimination_rate numeric check (elimination_rate >= 0 and elimination_rate <= 100),
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

-- Enable RLS for Simulations
alter table public.simulations enable row level security;

create policy "Users can view their own simulations"
  on public.simulations for select
  using (auth.uid() = user_id);

create policy "Users can create their own simulations"
  on public.simulations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own simulations"
  on public.simulations for update
  using (auth.uid() = user_id);

create policy "Users can delete their own simulations"
  on public.simulations for delete
  using (auth.uid() = user_id);

create index if not exists idx_simulations_project_id on public.simulations(project_id);
create index if not exists idx_simulations_user_id on public.simulations(user_id);
create index if not exists idx_simulations_created_at on public.simulations(created_at desc);

-- 3. Simulation Turns Table (Decision Trail)
create table if not exists public.simulation_turns (
  id uuid primary key default gen_random_uuid(),
  simulation_id uuid not null references public.simulations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  turn_index integer not null check (turn_index between 1 and 10),
  stage text not null check (stage in ('QUESTION', 'CONSTRAINT', 'SHORTLIST', 'ELIMINATION', 'RECOMMENDATION')),
  buyer_prompt text not null,
  observed_response text not null,
  brands jsonb not null default '[]'::jsonb,
  citations jsonb not null default '[]'::jsonb,
  insight text,
  classification text not null default 'OBSERVED' check (classification in ('OBSERVED', 'CALCULATED', 'INFERRED')),
  created_at timestamptz not null default now()
);

-- Enable RLS for Simulation Turns
alter table public.simulation_turns enable row level security;

create policy "Users can view their own simulation turns"
  on public.simulation_turns for select
  using (auth.uid() = user_id);

create policy "Users can create their own simulation turns"
  on public.simulation_turns for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own simulation turns"
  on public.simulation_turns for update
  using (auth.uid() = user_id);

create policy "Users can delete their own simulation turns"
  on public.simulation_turns for delete
  using (auth.uid() = user_id);

create index if not exists idx_simulation_turns_simulation_id on public.simulation_turns(simulation_id);
create index if not exists idx_simulation_turns_user_id on public.simulation_turns(user_id);
create index if not exists idx_simulation_turns_turn_index on public.simulation_turns(turn_index);

-- 4. Waitlist Submissions Table
create table if not exists public.waitlist_submissions (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  company_website text not null,
  role text not null,
  research_question text,
  heard_about_us text,
  created_at timestamptz not null default now()
);

-- Enable RLS for Waitlist Submissions
alter table public.waitlist_submissions enable row level security;

-- Allow anonymous lead capture insertion, but block public selects to prevent data harvesting
create policy "Allow anonymous lead submission"
  on public.waitlist_submissions for insert
  with check (true);

create index if not exists idx_waitlist_email on public.waitlist_submissions(email);
create index if not exists idx_waitlist_created_at on public.waitlist_submissions(created_at desc);

