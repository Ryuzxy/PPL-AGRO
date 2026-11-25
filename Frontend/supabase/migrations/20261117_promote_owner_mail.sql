do $$
declare
  target_user_id uuid;
begin
  select id into target_user_id
  from auth.users
  where lower(email) = lower('Owner@mail.com');

  if target_user_id is null then
    raise exception 'Auth user Owner@mail.com does not exist; create/invite it in Supabase Auth first';
  end if;

  insert into public.profiles (id, role)
  values (target_user_id, 'owner')
  on conflict (id) do update set role = 'owner';
end $$;
