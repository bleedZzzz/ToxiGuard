-- Run this in Supabase SQL Editor to add the missing delete policy for reports

-- Allow users to delete their own reports
create policy "Users can delete own reports" on public.reports
  for delete using (auth.uid() = user_id);

-- Allow users to update their own reports (for dismiss/resolve)
create policy "Users can update own reports" on public.reports
  for update using (auth.uid() = user_id);
