-- Run this in Supabase SQL Editor to ensure your existing user has a profile
-- This prevents a "Violates foreign key constraint" error

insert into public.profiles (id, email)
select id, email from auth.users
on conflict (id) do nothing;

