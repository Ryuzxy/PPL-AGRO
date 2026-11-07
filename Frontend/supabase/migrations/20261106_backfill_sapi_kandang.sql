-- Restore missing barn/stall locations used by the feed optimizer.
-- Existing non-empty locations remain unchanged.

update public.sapi
set lokasi_kandang = case
  when lower(trim(nama)) = 'mawar' then 'Kandang A • Stall 04'
  when lower(trim(nama)) = 'cantik' then 'Kandang A • Stall 07'
  when lower(trim(nama)) = 'melati' then 'Kandang A • Stall 12'
  when lower(trim(nama)) = 'sekar' then 'Kandang B • Stall 03'
  when lower(trim(nama)) = 'kenanga' then 'Kandang B • Stall 09'
  when lower(trim(nama)) = 'srikandi' then 'Kandang A • Stall 01'
  when id = 1 then 'Kandang A • Stall 04'
  when id = 2 then 'Kandang A • Stall 07'
  when id = 3 then 'Kandang A • Stall 12'
  when id = 4 then 'Kandang B • Stall 03'
  when id = 5 then 'Kandang B • Stall 09'
  when id = 6 then 'Kandang A • Stall 01'
  else concat('Kandang A • Stall ', lpad(id::text, 2, '0'))
end
where lokasi_kandang is null or btrim(lokasi_kandang) = '';

-- Keep future inserts valid when the caller omits a barn.
alter table public.sapi
  alter column lokasi_kandang set default 'Kandang A';
