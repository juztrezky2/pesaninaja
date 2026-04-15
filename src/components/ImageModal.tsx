import { X } from "lucide-react";
import type { Product } from "@/hooks/useProducts";

type ImageModalProps = {
  product: Product | null;
  onClose: () => void;
};

export function ImageModal({ product, onClose }: ImageModalProps) {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-foreground/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-primary-foreground p-1"
        >
          <X className="h-6 w-6" />
        </button>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full rounded-lg"
          />
        ) : (
          <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center text-6xl">
            🍽️
          </div>
        )}
        <div className="mt-2 text-center">
          <p className="text-primary-foreground font-semibold">{product.name}</p>
          <p className="text-primary-foreground/70 text-sm">{product.vendor}</p>
        </div>
      </div>
    </div>
  );
}
