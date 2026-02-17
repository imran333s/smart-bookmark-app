-- Enable Extensions
create extension if not exists "uuid-ossp";

-- Create Bookmarks Table
create table bookmarks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  title text not null,
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table bookmarks enable row level security;

-- Policies for Bookmarks
create policy "Individuals can view their own bookmarks."
on bookmarks for select
using ( auth.uid() = user_id );

create policy "Individuals can insert their own bookmarks."
on bookmarks for insert
with check ( auth.uid() = user_id );

create policy "Individuals can update their own bookmarks."
on bookmarks for update
using ( auth.uid() = user_id );

create policy "Individuals can delete their own bookmarks."
on bookmarks for delete
using ( auth.uid() = user_id );

-- Enable Realtime
alter publication supabase_realtime add table bookmarks;
