-- Farmer permissions: database enforcement, not only hidden UI controls.
-- Owner checks read the authenticated user's server-backed profile role.
-- Inspection records are append-only for farmers; no UPDATE/DELETE policy is granted.

alter table public.sapi enable row level security;
alter table public.pakan enable row level security;
alter table public.formula_pakan_harian enable row level security;
alter table public.hasil_deteksi_mastitis enable row level security;
alter table public.foto_sapi enable row level security;
alter table public.pemasukan enable row level security;
alter table public.pengeluaran enable row level security;

-- Read-only cattle catalogue for authenticated users; writes remain owner-only.
drop policy if exists "Authenticated users can read cattle" on public.sapi;
create policy "Authenticated users can read cattle" on public.sapi
  for select to authenticated using (true);
drop policy if exists "Owners can manage cattle" on public.sapi;
create policy "Owners can manage cattle" on public.sapi
  for all to authenticated using (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner')) with check (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner'));

-- Feed options and saved scenarios are visible; only owners can change them.
drop policy if exists "Authenticated users can read feed" on public.pakan;
create policy "Authenticated users can read feed" on public.pakan
  for select to authenticated using (true);
drop policy if exists "Owners can manage feed" on public.pakan;
create policy "Owners can manage feed" on public.pakan
  for all to authenticated using (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner')) with check (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner'));
drop policy if exists "Authenticated users can read feed scenarios" on public.formula_pakan_harian;
create policy "Authenticated users can read feed scenarios" on public.formula_pakan_harian
  for select to authenticated using (true);
drop policy if exists "Owners can manage feed scenarios" on public.formula_pakan_harian;
create policy "Owners can manage feed scenarios" on public.formula_pakan_harian
  for all to authenticated using (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner')) with check (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner'));

-- Farmers may perform udder checks, but cannot edit cattle records.
drop policy if exists "Authenticated users can read udder checks" on public.hasil_deteksi_mastitis;
create policy "Authenticated users can read udder checks" on public.hasil_deteksi_mastitis
  for select to authenticated using (true);
drop policy if exists "Authenticated users can add udder checks" on public.hasil_deteksi_mastitis;
create policy "Authenticated users can add udder checks" on public.hasil_deteksi_mastitis
  for insert to authenticated with check (true);
drop policy if exists "Authenticated users can read cattle photos" on public.foto_sapi;
create policy "Authenticated users can read cattle photos" on public.foto_sapi
  for select to authenticated using (true);
drop policy if exists "Authenticated users can add cattle photos" on public.foto_sapi;
create policy "Authenticated users can add cattle photos" on public.foto_sapi
  for insert to authenticated with check (true);

-- Health history is readable by authenticated users and appended by inspection flows.
drop policy if exists "Authenticated users can read health history" on public.hasil_deteksi_mastitis;
create policy "Authenticated users can read health history" on public.hasil_deteksi_mastitis
  for select to authenticated using (true);

drop policy if exists "Authenticated users can add health history" on public.hasil_deteksi_mastitis;
create policy "Authenticated users can add health history" on public.hasil_deteksi_mastitis
  for insert to authenticated with check (true);

create policy "Owner-only health history updates" on public.hasil_deteksi_mastitis as restrictive
  for update to authenticated using (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner')) with check (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner'));
create policy "Owner-only health history deletes" on public.hasil_deteksi_mastitis as restrictive
  for delete to authenticated using (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner'));

create policy "Owner-only cattle photo updates" on public.foto_sapi as restrictive
  for update to authenticated using (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner')) with check (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner'));
create policy "Owner-only cattle photo deletes" on public.foto_sapi as restrictive
  for delete to authenticated using (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner'));

-- Cash: farmer can read and add. No update/delete policies means denied by RLS.
drop policy if exists "Authenticated users can read income" on public.pemasukan;
create policy "Authenticated users can read income" on public.pemasukan
  for select to authenticated using (true);
drop policy if exists "Authenticated users can add income" on public.pemasukan;
create policy "Authenticated users can add income" on public.pemasukan
  for insert to authenticated with check (true);
drop policy if exists "Owners can modify income" on public.pemasukan;
create policy "Owners can modify income" on public.pemasukan
  for update to authenticated using (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner')) with check (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner'));
drop policy if exists "Owners can delete income" on public.pemasukan;
create policy "Owners can delete income" on public.pemasukan
  for delete to authenticated using (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner'));

drop policy if exists "Authenticated users can read expense" on public.pengeluaran;
create policy "Authenticated users can read expense" on public.pengeluaran
  for select to authenticated using (true);
drop policy if exists "Authenticated users can add expense" on public.pengeluaran;
create policy "Authenticated users can add expense" on public.pengeluaran
  for insert to authenticated with check (true);
drop policy if exists "Owners can modify expense" on public.pengeluaran;
create policy "Owners can modify expense" on public.pengeluaran
  for update to authenticated using (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner')) with check (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner'));
drop policy if exists "Owners can delete expense" on public.pengeluaran;
create policy "Owners can delete expense" on public.pengeluaran
  for delete to authenticated using (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner'));

-- Restrictive guards ensure pre-existing permissive policies cannot grant farmers writes.
create policy "Owner-only cattle writes" on public.sapi as restrictive
  for insert to authenticated with check (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner'));
create policy "Owner-only cattle updates" on public.sapi as restrictive
  for update to authenticated using (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner')) with check (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner'));
create policy "Owner-only cattle deletes" on public.sapi as restrictive
  for delete to authenticated using (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner'));
create policy "Owner-only income updates" on public.pemasukan as restrictive
  for update to authenticated using (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner')) with check (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner'));
create policy "Owner-only income deletes" on public.pemasukan as restrictive
  for delete to authenticated using (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner'));
create policy "Owner-only expense updates" on public.pengeluaran as restrictive
  for update to authenticated using (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner')) with check (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner'));
create policy "Owner-only expense deletes" on public.pengeluaran as restrictive
  for delete to authenticated using (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner'));

-- Feed catalogue/scenario writes are owner-only as well.
create policy "Owner-only feed writes" on public.pakan as restrictive
  for all to authenticated using (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner')) with check (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner'));
create policy "Owner-only feed scenario writes" on public.formula_pakan_harian as restrictive
  for all to authenticated using (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner')) with check (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'owner'));
