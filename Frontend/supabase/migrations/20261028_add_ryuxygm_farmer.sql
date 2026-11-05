do $$
declare
  target_user_id uuid;
begin
  select id into target_user_id
  from auth.users
  where lower(email) = lower('ryuxygm@gmail.com');

  if target_user_id is null then
    raise exception 'Auth user ryuxygm@gmail.com does not exist; create it in Supabase Auth first';
  end if;

  insert into public.profiles (id, role)
  values (target_user_id, 'farmer')
  on conflict (id) do update set role = 'farmer';
end $$;
