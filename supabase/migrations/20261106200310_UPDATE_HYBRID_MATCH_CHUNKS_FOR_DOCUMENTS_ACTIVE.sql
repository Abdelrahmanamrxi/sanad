create or replace function hybrid_match_chunks(
  query_text text,
  query_embedding vector(1024),
  match_business_id uuid,
  match_count int default 6,
  rrf_k int default 60
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  heading_path text,
  similarity float,
  score float
)
language sql stable
as $$
with
q as (
  select case 
    when nullif(trim(regexp_replace(arabic_normalize(query_text), '[^\w\s]', ' ', 'g')), '') is null 
    then null::tsquery
    else to_tsquery('simple',
      array_to_string(
        array_remove(
          regexp_split_to_array(
            trim(regexp_replace(arabic_normalize(query_text), '[^\w\s]', ' ', 'g')),
            '\s+'
          ),
          ''
        ),
        ' | '
      )
    )
  end as tsq
),

base as (
  select c.id, c.document_id, c.content, c.heading_path, c.embedding, c.fts
  from public.chunks c
  join public.documents d
    on d.id = c.document_id and d.business_id = c.business_id
  where c.business_id = match_business_id
    and d.doc_status = 'active' -- 👈 CHANGED FROM 'ready' TO 'active'
    and c.index_version = d.current_index_version
),

semantic as (
  select
    b.id,
    row_number() over (order by b.embedding <=> query_embedding) as rank,
    1 - (b.embedding <=> query_embedding) as similarity
  from base b
  order by b.embedding <=> query_embedding
  limit 20
),

keyword as (
  select
    b.id,
    row_number() over (order by ts_rank_cd(b.fts, q.tsq) desc) as rank
  from base b, q
  where q.tsq is not null and b.fts @@ q.tsq
  order by ts_rank_cd(b.fts, q.tsq) desc
  limit 20
),

fusion as (
  select
    coalesce(s.id, k.id) as id,
    coalesce(1.0 / (rrf_k + s.rank), 0.0) + coalesce(1.0 / (rrf_k + k.rank), 0.0) as rrf_score,
    coalesce(s.similarity, 0.0) as similarity
  from semantic s
  full outer join keyword k on s.id = k.id
)

select
  b.id,
  b.document_id,
  b.content,
  b.heading_path,
  f.similarity::float,
  f.rrf_score::float as score
from fusion f
join base b on b.id = f.id
order by f.rrf_score desc
limit match_count;
$$;