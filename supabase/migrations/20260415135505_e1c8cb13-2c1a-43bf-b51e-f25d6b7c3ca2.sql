
ALTER TABLE public.site_settings
ADD COLUMN hero_tagline text NOT NULL DEFAULT 'Pesan Makanan & Minuman Mudah via WhatsApp',
ADD COLUMN hero_description text NOT NULL DEFAULT 'Platform digital untuk UMKM kuliner Soppeng. Pesan langsung, bayar mudah!';
