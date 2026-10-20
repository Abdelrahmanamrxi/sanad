alter table business
  drop column if exists allowed_domains,
  drop column if exists welcome_message;