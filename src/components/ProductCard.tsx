import { useState } from "react";
import { Plus } from "lucide-react";
import type { Product } from "@/hooks/useProducts";
import { formatPrice, buildSingleItemOrderText, buildSingleItemWAUrl } from "@/lib/whatsapp";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type ProductCardProps = {
  product: Product;
  onAddToCart: (p: Product) => void;
  onImageClick: (p: Product) => void;
  waNumber: string;
  ctaColor?: string;
  orderFormat?: string;
};

export function ProductCard({ product, onAddToCart, onImageClick, waNumber, ctaColor, orderFormat }: ProductCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");

  const handleOrderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirmSend = () => {
    if (!nama.trim() || !alamat.trim()) {
      alert("Mohon isi nama dan alamat terlebih dahulu.");
      return;
    }
    const url = buildSingleItemWAUrl(waNumber, product, nama, alamat, orderFormat);
    window.open(url, "_blank");
    setShowConfirm(false);
  };

  const previewText = buildSingleItemOrderText(product, nama, alamat, orderFormat);

  return (
    <>
      <div className="bg-card rounded-lg overflow-hidden shadow-sm border animate-fade-in">
        <div
          className="relative aspect-[4/3] bg-muted cursor-pointer overflow-hidden group"
          onClick={() => onImageClick(product)}
        >
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              🍽️
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/70 to-transparent p-2">
            <span className="text-xs text-primary-foreground font-medium">{product.vendor}</span>
          </div>
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-1">{product.name}</h3>
          {product.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
          )}
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-primary text-sm">{formatPrice(product.price)}</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => onAddToCart(product)}
                className="p-1.5 rounded-full bg-secondary hover:bg-accent transition-colors"
                aria-label="Tambah ke keranjang"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                onClick={handleOrderClick}
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-primary-foreground transition-colors"
                style={{ backgroundColor: ctaColor || "hsl(142, 70%, 49%)" }}
              >
                Pesan WA
              </button>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="max-w-md z-[60]">
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Pesanan</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Nama Anda (wajib)"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
                  />
                  <input
                    type="text"
                    placeholder="Alamat Pengiriman (wajib)"
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
                  />
                </div>
                <p className="text-sm text-muted-foreground">Pesan yang akan dikirim:</p>
                <pre className="whitespace-pre-wrap text-xs bg-secondary/50 rounded-lg p-3 max-h-48 overflow-y-auto font-sans text-foreground">
                  {previewText}
                </pre>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSend}
              className="text-primary-foreground"
              style={{ backgroundColor: ctaColor || "hsl(142, 70%, 49%)" }}
            >
              Kirim ke WhatsApp
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
