import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  id: string;
  business_name: string;
  whatsapp_number: string;
  logo_url: string | null;
  background_image_url: string | null;
  cta_color: string;
  order_format: string;
  hero_tagline: string;
  hero_description: string;
};

export function useSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .single();
      if (error) throw error;
      return data as SiteSettings;
    },
  });
}
