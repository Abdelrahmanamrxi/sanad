-- Migration: Add extended visual style and brand layout customization to widget_settings
-- Follows Sanad project standard: TEXT + CHECK constraints (preferred over custom ENUMs for safe zero-downtime evolution)

ALTER TABLE widget_settings
  -- 1. Outer container silhouette: Egyptian Arched Dome, Full Pill, or Square
  ADD COLUMN container_shape text NOT NULL DEFAULT 'arch'
    CHECK (container_shape IN ('arch', 'pill', 'square')),

  -- 2. Header architecture: Centered Concierge Hero Dome or Compact Docked Bar
  ADD COLUMN header_layout text NOT NULL DEFAULT 'hero'
    CHECK (header_layout IN ('hero', 'docked')),

  -- 3. Avatar brand presentation mode
  ADD COLUMN avatar_mode text NOT NULL DEFAULT 'monogram'
    CHECK (avatar_mode IN ('monogram', 'icon', 'image')),

  -- 4. Monogram letter text (1-3 characters, e.g. "س", "TZ", "ل", "أ")
  ADD COLUMN avatar_monogram text NOT NULL DEFAULT 'س'
    CHECK (char_length(avatar_monogram) >= 1 AND char_length(avatar_monogram) <= 4),

  -- 5. Border stroke & shadow personality: Hairline luxury, Hard brutalist stroke, or Accent gold line
  ADD COLUMN border_style text NOT NULL DEFAULT 'hairline'
    CHECK (border_style IN ('hairline', 'hard-brutalist', 'accent-gold', 'none')),

  -- 6. Grounded RAG citation presentation: Highlighted document excerpt card vs compact single-line tag vs standard message (none)
  ADD COLUMN citation_style text NOT NULL DEFAULT 'document-snippet'
    CHECK (citation_style IN ('document-snippet', 'compact', 'none'));
