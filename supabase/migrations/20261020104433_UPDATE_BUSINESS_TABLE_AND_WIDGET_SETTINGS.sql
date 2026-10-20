-- 1. Add background_color to widget_settings
alter table widget_settings 
  add column if not exists background_color text default '#FFFFFF';

-- 2. Backfill existing businesses into widget_settings (preserving primary_color, secondary_color, background_color, border_radius, corner_radius)
insert into widget_settings (
  business_id,
  primary_color,
  secondary_color,
  background_color,
  border_radius,
  corner_radius,
  bot_name
)
select 
  b.id,
  coalesce(b.primary_color, '#0F5C55'),
  coalesce(b.secondary_color, '#D3E6E2'),
  coalesce(b.background_color, '#FFFFFF'),
  coalesce(b.border_radius::int, 0),
  0, -- default corner_radius to 0
  coalesce(b.name, 'Sanad AI Support')
from business b
on conflict (business_id) do update set
  primary_color = excluded.primary_color,
  secondary_color = excluded.secondary_color,
  background_color = excluded.background_color,
  border_radius = excluded.border_radius,
  corner_radius = coalesce(widget_settings.corner_radius, 0);

-- 3. Drop repeated widget styling columns from the business table
alter table business
  drop column if exists primary_color,
  drop column if exists secondary_color,
  drop column if exists border_radius,
  drop column if exists background_color;
