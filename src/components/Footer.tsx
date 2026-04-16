import { Link } from "react-router-dom";
import { Settings } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card py-6 mt-8">
      <div className="container px-4">
        <div className="flex items-end justify-between">
          <Link
            to="/admin"
            className="p-2 rounded-full hover:bg-accent transition-colors text-muted-foreground"
            aria-label="Admin"
          >
            <Settings className="h-5 w-5" />
          </Link>
          <div className="text-right">
            <p className="text-xs text-muted-foreground text-left">
              © 2026 Platform Digital UMKM Soppeng by juztrezky
            </p>
            <p className="text-xs text-muted-foreground mt-1 text-center">
              Pesan mudah via WhatsApp
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
