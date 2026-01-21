-- Create profiles table
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  threshold float default 0.7,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Create social_accounts table
create table public.social_accounts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  platform text not null, -- 'facebook' or 'instagram'
  access_token text not null, -- Encrypt this in production!
  page_id text not null unique,
  page_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.social_accounts enable row level security;

create policy "Users can view own social accounts" on public.social_accounts
  for select using (auth.uid() = user_id);

create policy "Users can insert own social accounts" on public.social_accounts
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own social accounts" on public.social_accounts
  for delete using (auth.uid() = user_id);

create policy "Users can update own social accounts" on public.social_accounts
  for update using (auth.uid() = user_id);

-- Create posts table
create table public.posts (
  id text primary key, -- Platform Post ID
  user_id uuid references public.profiles(id) not null,
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.posts enable row level security;

create policy "Users can view own posts" on public.posts
  for select using (auth.uid() = user_id);

create policy "Ingestion can insert posts" on public.posts
  for insert with check (true); -- Secured by Service Role in API

-- Create comments table
create table public.comments (
  id text primary key, -- Platform Comment ID
  post_id text references public.posts(id) not null,
  user_id uuid references public.profiles(id) not null, -- Denormalized for easier RLS
  content text,
  commenter_name text,
  commented_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.comments enable row level security;

create policy "Users can view own comments" on public.comments
  for select using (auth.uid() = user_id);

create policy "Ingestion can insert comments" on public.comments
  for insert with check (true); -- Secured by Service Role

-- Create toxicity_scores table
create table public.toxicity_scores (
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

-- Create reports table
create table public.reports (
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

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
