create type public.user_role as enum ('owner', 'farmer');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'farmer',
  created_at timestamptz not null default now()
);

create table public.activity_logs (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.activity_logs enable row level security;

create policy "Users can read own profile" on public.profiles
  for select to authenticated using (id = auth.uid());
create policy "Users can write own activity" on public.activity_logs
  for insert to authenticated with check (user_id = auth.uid());
create policy "Owners can read activity" on public.activity_logs
  for select to authenticated using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'owner')
  );

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, role)
  values (new.id, coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'farmer'));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Existing users need profiles inserted once after running this migration:
-- insert into public.profiles (id, role) select id, 'farmer' from auth.users on conflict do nothing;
-- Promote an owner explicitly: update public.profiles set role = 'owner' where id = '<auth-user-uuid>';
