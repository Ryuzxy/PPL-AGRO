-- Bind user-created operational and cash records to the authenticated actor.
-- Defaults preserve existing frontend inserts that omit created_by.
alter table public.pemasukan
  add column if not exists created_by uuid references auth.users(id) default auth.uid();
alter table public.pengeluaran
  add column if not exists created_by uuid references auth.users(id) default auth.uid();
alter table public.hasil_deteksi_mastitis
  add column if not exists created_by uuid references auth.users(id) default auth.uid();
alter table public.foto_sapi
  add column if not exists created_by uuid references auth.users(id) default auth.uid();

-- Replace unrestricted authenticated insert policies.
drop policy if exists "Authenticated users can add income" on public.pemasukan;
create policy "Authenticated users can add own income" on public.pemasukan
  for insert to authenticated
  with check (created_by = (select auth.uid()));

drop policy if exists "Authenticated users can add expense" on public.pengeluaran;
create policy "Authenticated users can add own expense" on public.pengeluaran
  for insert to authenticated
  with check (created_by = (select auth.uid()));

drop policy if exists "Authenticated users can add udder checks" on public.hasil_deteksi_mastitis;
drop policy if exists "Authenticated users can add health history" on public.hasil_deteksi_mastitis;
create policy "Authenticated users can add own udder checks" on public.hasil_deteksi_mastitis
  for insert to authenticated
  with check (created_by = (select auth.uid()));

drop policy if exists "Authenticated users can add cattle photos" on public.foto_sapi;
create policy "Authenticated users can add own cattle photos" on public.foto_sapi
  for insert to authenticated
  with check (created_by = (select auth.uid()));
