import { ShoppingCart, Settings } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

type HeaderProps = {
  totalItems: number;
  onCartClick: () => void;
};

export function Header({ totalItems, onCartClick }: HeaderProps) {
  const { data: settings } = useSettings();

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b shadow-sm">
      <div className="container flex items-center justify-center h-14 relative">
        <div className="flex items-center gap-2">
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt={settings.business_name} className="h-8 w-auto" />
          ) : (
            <h1 className="text-lg font-bold text-primary">
              {settings?.business_name || "UMKM Soppeng"}
            </h1>
          )}
        </div>

        <button
          onClick={onCartClick}
          className="absolute right-4 p-2 rounded-full hover:bg-accent transition-colors relative"
          aria-label="Keranjang"
        >
          <ShoppingCart className="h-5 w-5 text-foreground" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-wa text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
