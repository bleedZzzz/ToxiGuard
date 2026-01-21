
-- 1. Create posts table
create table if not exists public.posts (
  id text primary key, -- Platform Post ID
  user_id uuid references public.profiles(id) not null,
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.posts enable row level security;

-- Policy: Users can view their own posts
create policy "Users can view own posts" on public.posts
  for select using (auth.uid() = user_id);

-- Policy: Ingestion (Service Role) can insert
create policy "Ingestion can insert posts" on public.posts
  for insert with check (true);


-- 2. Create comments table
create table if not exists public.comments (
  id text primary key, -- Platform Comment ID
  post_id text references public.posts(id) not null,
  user_id uuid references public.profiles(id) not null,
  content text,
  commenter_name text,
  commented_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.comments enable row level security;

create policy "Users can view own comments" on public.comments
  for select using (auth.uid() = user_id);

create policy "Ingestion can insert comments" on public.comments
  for insert with check (true);


-- 3. Create toxicity_scores table
create table if not exists public.toxicity_scores (
  id uuid default gen_random_uuid() primary key,
  comment_id text references public.comments(id) not null,
  score float not null,
  label text not null,
  model text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.toxicity_scores enable row level security;

create policy "Users can view scores for own comments" on public.toxicity_scores
  for select using (
    exists (
      select 1 from public.comments
      where comments.id = toxicity_scores.comment_id
      and comments.user_id = auth.uid()
    )
  );

create policy "Ingestion can insert scores" on public.toxicity_scores
  for insert with check (true);


-- 4. Create reports table
create table if not exists public.reports (
  id uuid default gen_random_uuid() primary key,
  comment_id text references public.comments(id) not null,
  user_id uuid references public.profiles(id) not null,
  reason text,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.reports enable row level security;

create policy "Users can view own reports" on public.reports
  for select using (auth.uid() = user_id);

create policy "Users can insert own reports" on public.reports
  for insert with check (auth.uid() = user_id);
