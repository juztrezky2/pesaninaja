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
  const [bgFile, setBgFile] = useState<File | null>(null);
  const [orderFormat, setOrderFormat] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setCtaColor(settings.cta_color);
      setOrderFormat(settings.order_format);
    }
  }, [settings]);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);

    let bgUrl = settings.background_image_url;
    if (bgFile) {
      const ext = bgFile.name.split(".").pop();
      const path = `bg/background.${ext}`;
      const { error: upErr } = await supabase.storage.from("images").upload(path, bgFile, { upsert: true });
      if (!upErr) {
        const { data } = supabase.storage.from("images").getPublicUrl(path);
        bgUrl = data.publicUrl;
      }
    }

    const { error } = await supabase
      .from("site_settings")
      .update({ cta_color: ctaColor, background_image_url: bgUrl, order_format: orderFormat })
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
        <label className="text-sm font-medium mb-1 block">Background Image</label>
        {settings?.background_image_url && (
          <img src={settings.background_image_url} alt="BG" className="h-24 rounded-lg mb-2 object-cover" />
        )}
        <input type="file" accept="image/*" onChange={(e) => setBgFile(e.target.files?.[0] || null)} className="text-sm" />
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
