-- 1. Allow authenticated users to upload files to sanad-file-storage
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'sanad-file-storage');

-- 2. Allow authenticated users to read/view their uploaded files
CREATE POLICY "Allow authenticated reads"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'sanad-file-storage');

-- 3. Allow authenticated users to delete files (needed for rollback if upload fails)
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'sanad-file-storage');
