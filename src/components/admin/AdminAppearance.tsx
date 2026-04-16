import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/hooks/useSettings";
import { useToast } from "@/hooks/use-toast";

export function AdminAppearance() {
  const { data: settings, isLoading } = useSettings();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [ctaColor, setCtaColor] = useState("#25D366");
  const [heroBgFile, setHeroBgFile] = useState<File | null>(null);
  const [orderFormat, setOrderFormat] = useState("");
  const [heroTagline, setHeroTagline] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setCtaColor(settings.cta_color);
      setOrderFormat(settings.order_format);
      setHeroTagline(settings.hero_tagline);
      setHeroDescription(settings.hero_description);
    }
  }, [settings]);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);

    let heroBgUrl = settings.hero_background_image_url;
    if (heroBgFile) {
      const ext = heroBgFile.name.split(".").pop();
      const path = `bg/hero-background.${ext}`;
      const { error: upErr } = await supabase.storage.from("images").upload(path, heroBgFile, { upsert: true });
      if (!upErr) {
        const { data } = supabase.storage.from("images").getPublicUrl(path);
        heroBgUrl = data.publicUrl;
      }
    }

    const { error } = await supabase
      .from("site_settings")
      .update({
        cta_color: ctaColor,
        hero_background_image_url: heroBgUrl,
        order_format: orderFormat,
        hero_tagline: heroTagline,
        hero_description: heroDescription,
      })
      .eq("id", settings.id);

    setSaving(false);
    if (error) {
      toast({ title: "Gagal menyimpan", variant: "destructive" });
    } else {
      toast({ title: "Tampilan diperbarui!" });
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    }
  };

  if (isLoading) return <div className="text-muted-foreground">Memuat...</div>;

  return (
    <div className="max-w-lg space-y-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Tagline Hero</label>
        <input
          value={heroTagline}
          onChange={(e) => setHeroTagline(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="Pesan Makanan & Minuman Mudah via WhatsApp"
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Deskripsi Hero</label>
        <textarea
          value={heroDescription}
          onChange={(e) => setHeroDescription(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="Platform digital untuk UMKM kuliner Soppeng..."
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Background Image Hero</label>
        {settings?.hero_background_image_url && (
          <img src={settings.hero_background_image_url} alt="Hero BG" className="h-24 rounded-lg mb-2 object-cover" />
        )}
        <input type="file" accept="image/*" onChange={(e) => setHeroBgFile(e.target.files?.[0] || null)} className="text-sm" />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Warna Tombol CTA</label>
        <div className="flex items-center gap-3">
          <input type="color" value={ctaColor} onChange={(e) => setCtaColor(e.target.value)} className="h-10 w-14 rounded border cursor-pointer" />
          <input
            value={ctaColor}
            onChange={(e) => setCtaColor(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-background text-sm w-32 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <div className="px-4 py-2 rounded-full text-sm font-semibold text-primary-foreground" style={{ backgroundColor: ctaColor }}>
            Preview
          </div>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Format Pemesanan WhatsApp</label>
        <textarea
          value={orderFormat}
          onChange={(e) => setOrderFormat(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 rounded-lg border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Gunakan placeholder: {"{items}"}, {"{total}"}, {"{nama}"}, {"{alamat}"}
        </p>
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "Menyimpan..." : "Simpan"}
      </button>
    </div>
  );
}
