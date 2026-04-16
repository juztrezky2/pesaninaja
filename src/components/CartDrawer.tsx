import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { CartItem } from "@/hooks/useCart";
import { formatPrice, buildWhatsAppUrl, buildOrderText } from "@/lib/whatsapp";
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

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  totalPrice: number;
  updateQuantity: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  waNumber: string;
  orderFormat?: string;
  ctaColor?: string;
};

export function CartDrawer({
  open,
  onClose,
  items,
  totalPrice,
  updateQuantity,
  removeItem,
  clearCart,
  waNumber,
  orderFormat,
  ctaColor,
}: CartDrawerProps) {
  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  if (!open) return null;

  const handleCheckout = () => {
    if (!nama.trim() || !alamat.trim()) {
      alert("Mohon isi nama dan alamat terlebih dahulu.");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmSend = () => {
    const url = buildWhatsAppUrl(waNumber, items, totalPrice, nama, alamat, orderFormat);
    window.open(url, "_blank");
    setShowConfirm(false);
  };

  const previewText = buildOrderText(items, totalPrice, nama, alamat, orderFormat);

  return (
    <div className="fixed inset-0 z-[55]">
      <div className="absolute inset-0 bg-foreground/40" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-card shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold text-lg">🛒 Keranjang</h2>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            Keranjang kosong
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 bg-secondary/50 rounded-lg p-3">
                  <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    {item.product.image_url ? (
                      <img src={item.product.image_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-lg">🍽️</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(item.product.price)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-accent"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-accent"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="p-1 rounded-full hover:bg-destructive/10 text-destructive ml-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-4 space-y-3">
              <input
                type="text"
                placeholder="Nama Anda (wajib)"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                type="text"
                placeholder="Alamat Pengiriman (wajib)"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <div className="flex items-center justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(totalPrice)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full py-3 rounded-full font-semibold text-primary-foreground transition-colors"
                style={{ backgroundColor: ctaColor || "hsl(142, 70%, 49%)" }}
              >
                Checkout via WhatsApp
              </button>
              <button
                onClick={clearCart}
                className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors"
              >
                Kosongkan Keranjang
              </button>
            </div>
          </>
        )}
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="max-w-md z-[60]">
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Pesanan</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Berikut pesan yang akan dikirim ke WhatsApp:</p>
                <pre className="whitespace-pre-wrap text-xs bg-secondary/50 rounded-lg p-3 max-h-60 overflow-y-auto font-sans text-foreground">
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
    </div>
  );
}
