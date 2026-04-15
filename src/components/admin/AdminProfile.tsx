import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/hooks/useSettings";
import { useToast } from "@/hooks/use-toast";

export function AdminProfile() {
  const { data: settings, isLoading } = useSettings();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [businessName, setBusinessName] = useState("");
  const [waNumber, setWaNumber] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setBusinessName(settings.business_name);
      setWaNumber(settings.whatsapp_number);
    }
  }, [settings]);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);

    let logoUrl = settings.logo_url;

    if (logoFile) {
      const ext = logoFile.name.split(".").pop();
      const path = `logo/logo.${ext}`;
      const { error: upErr } = await supabase.storage.from("images").upload(path, logoFile, { upsert: true });
      if (!upErr) {
        const { data: urlData } = supabase.storage.from("images").getPublicUrl(path);
        logoUrl = urlData.publicUrl;
      }
    }

    const { error } = await supabase
      .from("site_settings")
      .update({ business_name: businessName, whatsapp_number: waNumber, logo_url: logoUrl })
      .eq("id", settings.id);

    setSaving(false);
    if (error) {
      toast({ title: "Gagal menyimpan", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Berhasil disimpan!" });
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    }
  };

  if (isLoading) return <div className="text-muted-foreground">Memuat...</div>;

  return (
    <div className="max-w-lg space-y-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Nama Bisnis / Platform</label>
        <input
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Nomor WhatsApp</label>
        <input
          value={waNumber}
          onChange={(e) => setWaNumber(e.target.value)}
          placeholder="+6281234567890"
          className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <p className="text-xs text-muted-foreground mt-1">Format Indonesia: +62...</p>
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Logo</label>
        {settings?.logo_url && (
          <img src={settings.logo_url} alt="Logo" className="h-12 mb-2" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
          className="text-sm"
        />
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
