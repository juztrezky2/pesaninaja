import { Plus } from "lucide-react";
import type { Product } from "@/hooks/useProducts";
import { formatPrice, buildSingleItemWAUrl } from "@/lib/whatsapp";

type ProductCardProps = {
  product: Product;
  onAddToCart: (p: Product) => void;
  onImageClick: (p: Product) => void;
  waNumber: string;
  ctaColor?: string;
};

export function ProductCard({ product, onAddToCart, onImageClick, waNumber, ctaColor }: ProductCardProps) {
  const waUrl = buildSingleItemWAUrl(waNumber, product.name, product.price);

  return (
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
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-primary-foreground transition-colors"
              style={{ backgroundColor: ctaColor || "hsl(142, 70%, 49%)" }}
            >
              Pesan WA
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
