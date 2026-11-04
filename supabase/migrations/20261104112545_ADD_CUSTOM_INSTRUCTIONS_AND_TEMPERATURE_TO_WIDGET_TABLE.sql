alter table widget_settings
  add column if not exists custom_instructions text default '',
  add column if not exists temperature numeric not null default 0.2 
    check (temperature >= 0.0 and temperature <= 0.5);