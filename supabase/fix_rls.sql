-- Run this in your Supabase Dashboard -> SQL Editor

-- 1. Create profiles table if it doesn't exist
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  threshold float default 0.7,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Create policies for profiles
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- 2. Create social_accounts table if it doesn't exist
create table if not exists public.social_accounts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  platform text not null, -- 'facebook' or 'instagram'
  access_token text not null,
  page_id text not null unique, -- added unique to support upsert
  page_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for social_accounts
alter table public.social_accounts enable row level security;

-- Create policies for social_accounts
drop policy if exists "Users can view own social accounts" on public.social_accounts;
drop policy if exists "Users can insert own social accounts" on public.social_accounts;
drop policy if exists "Users can delete own social accounts" on public.social_accounts;
drop policy if exists "Users can update own social accounts" on public.social_accounts;

create policy "Users can view own social accounts" on public.social_accounts
  for select using (auth.uid() = user_id);

create policy "Users can insert own social accounts" on public.social_accounts
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own social accounts" on public.social_accounts
  for delete using (auth.uid() = user_id);

create policy "Users can update own social accounts" on public.social_accounts
  for update using (auth.uid() = user_id);

-- 3. Create function and trigger for new users (if they don't exist)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing; -- Prevent error if profile already exists
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger first to avoid error "trigger already exists"
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
