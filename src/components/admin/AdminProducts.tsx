import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/whatsapp";
import { Pencil, Trash2, Plus, Upload, Download } from "lucide-react";
import type { Product } from "@/hooks/useProducts";

const CATEGORIES = ["Makanan", "Minuman", "Snack", "Lainnya"];

export function AdminProducts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", price: "", description: "", category: "Makanan", vendor: "", imageFile: null as File | null });

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const resetForm = () => {
    setForm({ name: "", price: "", description: "", category: "Makanan", vendor: "", imageFile: null });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      toast({ title: "Nama dan harga wajib diisi", variant: "destructive" });
      return;
    }

    let imageUrl: string | null = null;
    if (form.imageFile) {
      const ext = form.imageFile.name.split(".").pop();
      const path = `products/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("images").upload(path, form.imageFile);
      if (!upErr) {
        const { data } = supabase.storage.from("images").getPublicUrl(path);
        imageUrl = data.publicUrl;
      }
    }

    const payload = {
      name: form.name,
      price: parseInt(form.price),
      description: form.description || null,
      category: form.category,
      vendor: form.vendor,
      ...(imageUrl ? { image_url: imageUrl } : {}),
    };

    if (editingId) {
      const { error } = await supabase.from("products").update(payload).eq("id", editingId);
      if (error) { toast({ title: "Gagal mengupdate", variant: "destructive" }); return; }
      toast({ title: "Produk diperbarui!" });
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) { toast({ title: "Gagal menambah", variant: "destructive" }); return; }
      toast({ title: "Produk ditambahkan!" });
    }

    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus produk ini?")) return;
    await supabase.from("products").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
    toast({ title: "Produk dihapus" });
  };

  const handleEdit = (p: Product) => {
    setForm({ name: p.name, price: String(p.price), description: p.description || "", category: p.category, vendor: p.vendor, imageFile: null });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split("\n").filter((l) => l.trim());
    if (lines.length < 2) { toast({ title: "CSV kosong", variant: "destructive" }); return; }

    const rows = lines.slice(1).map((line) => {
      const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
      return { name: cols[0], price: parseInt(cols[1]) || 0, description: cols[2] || null, category: cols[3] || "Makanan", vendor: cols[4] || "" };
    }).filter((r) => r.name);

    const { error } = await supabase.from("products").insert(rows);
    if (error) { toast({ title: "Gagal import CSV", description: error.message, variant: "destructive" }); return; }
    toast({ title: `${rows.length} produk berhasil diimport!` });
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
    e.target.value = "";
  };

  const handleExportCSV = () => {
    if (!products) return;
    const header = "nama,harga,deskripsi,kategori,vendor";
    const rows = products.map((p) => `"${p.name}",${p.price},"${p.description || ""}","${p.category}","${p.vendor}"`);
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "katalog_produk.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => { resetForm(); setShowForm(true); }} className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90">
          <Plus className="h-4 w-4" /> Tambah Produk
        </button>
        <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold hover:bg-accent cursor-pointer">
          <Upload className="h-4 w-4" /> Upload CSV
          <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
        </label>
        <button onClick={handleExportCSV} className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold hover:bg-accent">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {showForm && (
        <div className="bg-card border rounded-xl p-4 space-y-3">
          <h3 className="font-semibold">{editingId ? "Edit Produk" : "Tambah Produk Baru"}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <input placeholder="Nama Produk" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input placeholder="Harga (angka)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input placeholder="Deskripsi" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input placeholder="Nama Vendor/Penjual" value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} className="px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, imageFile: e.target.files?.[0] || null })} className="text-sm" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90">
              {editingId ? "Perbarui" : "Simpan"}
            </button>
            <button onClick={resetForm} className="px-5 py-2 bg-secondary rounded-lg text-sm hover:bg-accent">Batal</button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-muted-foreground text-sm">Memuat produk...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 pr-2">Foto</th>
                <th className="py-2 pr-2">Nama</th>
                <th className="py-2 pr-2">Harga</th>
                <th className="py-2 pr-2 hidden sm:table-cell">Kategori</th>
                <th className="py-2 pr-2 hidden sm:table-cell">Vendor</th>
                <th className="py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((p) => (
                <tr key={p.id} className="border-b hover:bg-accent/30">
                  <td className="py-2 pr-2">
                    <div className="h-10 w-10 rounded bg-muted overflow-hidden">
                      {p.image_url ? <img src={p.image_url} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-lg">🍽️</div>}
                    </div>
                  </td>
                  <td className="py-2 pr-2 font-medium">{p.name}</td>
                  <td className="py-2 pr-2">{formatPrice(p.price)}</td>
                  <td className="py-2 pr-2 hidden sm:table-cell">{p.category}</td>
                  <td className="py-2 pr-2 hidden sm:table-cell">{p.vendor}</td>
                  <td className="py-2">
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(p as Product)} className="p-1.5 rounded hover:bg-accent"><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products?.length === 0 && <p className="text-center py-8 text-muted-foreground">Belum ada produk</p>}
        </div>
      )}
    </div>
  );
}
