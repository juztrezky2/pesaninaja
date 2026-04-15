import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminProfile } from "@/components/admin/AdminProfile";
import { AdminProducts } from "@/components/admin/AdminProducts";
import { AdminAppearance } from "@/components/admin/AdminAppearance";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

const AdminDashboard = () => {
  const [page, setPage] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/admin");
        return;
      }
      setLoading(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/admin");
    });

    checkAuth();
    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Memuat...
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar page={page} setPage={setPage} onLogout={handleLogout} />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b px-4 gap-3 bg-card">
            <SidebarTrigger>
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <h1 className="font-semibold capitalize">
              {page === "dashboard" ? "Dashboard" : page === "profil" ? "Profil" : page === "produk" ? "Katalog Produk" : "Atur Tampilan"}
            </h1>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            {page === "dashboard" && <DashboardOverview onNavigate={setPage} />}
            {page === "profil" && <AdminProfile />}
            {page === "produk" && <AdminProducts />}
            {page === "tampilan" && <AdminAppearance />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

function DashboardOverview({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Selamat Datang, Admin! 👋</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Profil", desc: "Kelola nama bisnis & WhatsApp", page: "profil", icon: "👤" },
          { title: "Katalog Produk", desc: "Tambah, edit, hapus produk", page: "produk", icon: "📦" },
          { title: "Atur Tampilan", desc: "Background, warna, format", page: "tampilan", icon: "🎨" },
        ].map((item) => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className="bg-card border rounded-xl p-6 text-left hover:border-primary/40 transition-colors"
          >
            <span className="text-3xl">{item.icon}</span>
            <h3 className="font-semibold mt-3">{item.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
