-- Rename background_image_url to hero_background_image_url for clarity
ALTER TABLE public.site_settings RENAME COLUMN background_image_url TO hero_background_image_url;