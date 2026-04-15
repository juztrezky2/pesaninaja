import { useState, useRef, useMemo } from "react";
import { LayoutGrid, List } from "lucide-react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SearchFilter } from "@/components/SearchFilter";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { ImageModal } from "@/components/ImageModal";
import { Footer } from "@/components/Footer";
import { useProducts, type Product } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useSettings } from "@/hooks/useSettings";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data: products, isLoading, error } = useProducts();
  const { data: settings } = useSettings();
  const cart = useCart();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Product | null>(null);
  const [gridCols, setGridCols] = useState<2 | 1>(2);

  const menuRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.vendor.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "Semua" || p.category === category;
      return matchSearch && matchCategory;
    });
  }, [products, search, category]);

  const scrollToMenu = () => {
    menuRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={
        settings?.background_image_url
          ? { backgroundImage: `url(${settings.background_image_url})`, backgroundSize: "cover", backgroundAttachment: "fixed" }
          : undefined
      }
    >
      <Header totalItems={cart.totalItems} onCartClick={() => setCartOpen(true)} />
      <Hero
        onClickMenu={scrollToMenu}
        tagline={settings?.hero_tagline}
        description={settings?.hero_description}
        backgroundUrl={settings?.background_image_url}
      />

      <main className="flex-1 container px-4 py-6" ref={menuRef}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Menu</h2>
          <div className="flex gap-1 bg-secondary rounded-lg p-0.5">
            <button
              onClick={() => setGridCols(2)}
              className={`p-1.5 rounded-md transition-colors ${gridCols === 2 ? "bg-card shadow-sm" : ""}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setGridCols(1)}
              className={`p-1.5 rounded-md transition-colors ${gridCols === 1 ? "bg-card shadow-sm" : ""}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        <SearchFilter
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
        />

        {isLoading && (
          <div className={`grid gap-4 mt-4 ${gridCols === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg overflow-hidden border">
                <Skeleton className="aspect-[4/3]" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-destructive">
            <p>Gagal memuat produk. Silakan coba lagi.</p>
          </div>
        )}

        {!isLoading && !error && filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-4xl mb-2">🔍</p>
            <p>Produk tidak ditemukan</p>
          </div>
        )}

        {!isLoading && !error && filtered.length > 0 && (
          <div className={`grid gap-4 mt-4 ${gridCols === 2 ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 max-w-lg mx-auto"}`}>
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={cart.addItem}
                onImageClick={setSelectedImage}
                waNumber={settings?.whatsapp_number || "+6281234567890"}
                ctaColor={settings?.cta_color}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart.items}
        totalPrice={cart.totalPrice}
        updateQuantity={cart.updateQuantity}
        removeItem={cart.removeItem}
        clearCart={cart.clearCart}
        waNumber={settings?.whatsapp_number || "+6281234567890"}
        orderFormat={settings?.order_format}
        ctaColor={settings?.cta_color}
      />

      <ImageModal product={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
};

export default Index;
