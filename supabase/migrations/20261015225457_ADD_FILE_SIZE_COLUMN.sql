
-- ADD A NEW COLUMN FOR STORING FILE SIZE 
alter table public.documents
  add column if not exists file_size bigint check (file_size >= 0);
-- FILL PREVIOUS EMPTY FILE SIZE ROWS
update public.documents d
set file_size = (o.metadata->>'size')::bigint
from storage.objects o
where o.bucket_id = 'sanad-file-storage'
  and o.name = d.storage_path
  and d.file_size is null;