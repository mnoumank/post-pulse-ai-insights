-- Fix previous attempt: add FK using guard block
-- Ensure table exists first
create table if not exists public.comparison_actuals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  comparison_id uuid not null unique,
  post_a_url text,
  post_b_url text,
  post_a_likes integer,
  post_a_comments integer,
  post_a_shares integer,
  post_a_impressions integer,
  post_b_likes integer,
  post_b_comments integer,
  post_b_shares integer,
  post_b_impressions integer,
  actual_winner smallint,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add FK if missing
do $$ begin
  alter table public.comparison_actuals
    add constraint comparison_actuals_comparison_id_fkey
    foreign key (comparison_id)
    references public.comparisons (id)
    on delete cascade;
exception when duplicate_object then null; end $$;

-- Indexes
create index if not exists idx_comparison_actuals_user_id on public.comparison_actuals(user_id);
create index if not exists idx_comparison_actuals_comparison_id on public.comparison_actuals(comparison_id);

-- Enable RLS (idempotent)
alter table public.comparison_actuals enable row level security;

-- Policies (idempotent)
create policy if not exists "Users can view their own actuals"
  on public.comparison_actuals for select
  using (auth.uid() = user_id);

create policy if not exists "Users can insert their own actuals"
  on public.comparison_actuals for insert
  with check (auth.uid() = user_id);

create policy if not exists "Users can update their own actuals"
  on public.comparison_actuals for update
  using (auth.uid() = user_id);

create policy if not exists "Users can delete their own actuals"
  on public.comparison_actuals for delete
  using (auth.uid() = user_id);

-- Trigger function
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end; $$ language plpgsql;

-- Trigger
drop trigger if exists trg_comparison_actuals_updated_at on public.comparison_actuals;
create trigger trg_comparison_actuals_updated_at
before update on public.comparison_actuals
for each row execute function public.update_updated_at_column();