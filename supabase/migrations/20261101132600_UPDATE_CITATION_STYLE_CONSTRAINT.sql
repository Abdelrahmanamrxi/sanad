-- Migration: Allow 'none' in widget_settings citation_style for standard text messages without document cards
ALTER TABLE widget_settings
  DROP CONSTRAINT IF EXISTS widget_settings_citation_style_check;

ALTER TABLE widget_settings
  ADD CONSTRAINT widget_settings_citation_style_check
  CHECK (citation_style IN ('document-snippet', 'compact', 'none'));

