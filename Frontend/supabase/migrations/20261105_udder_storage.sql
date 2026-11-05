-- Storage for auditable udder inspection photos.
insert into storage.buckets (id, name, public)
values ('udder-inspections', 'udder-inspections', false)
on conflict (id) do nothing;

create policy "Authenticated users can read udder inspection photos"
on storage.objects for select to authenticated
using (bucket_id = 'udder-inspections');

create policy "Authenticated users can upload udder inspection photos"
on storage.objects for insert to authenticated
with check (bucket_id = 'udder-inspections');

create policy "Owners can update udder inspection photos"
on storage.objects for update to authenticated
using (bucket_id = 'udder-inspections' and exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner'))
with check (bucket_id = 'udder-inspections' and exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner'));

create policy "Owners can delete udder inspection photos"
on storage.objects for delete to authenticated
using (bucket_id = 'udder-inspections' and exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner'));
