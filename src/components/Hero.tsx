import heroImage from "@/assets/hero-food.jpg";

type HeroProps = {
  onClickMenu: () => void;
  tagline?: string;
  description?: string;
  backgroundUrl?: string | null;
};

export function Hero({ onClickMenu, tagline, description, backgroundUrl }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={backgroundUrl || heroImage} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 to-foreground/80" />
      </div>
      <div className="relative container py-12 px-4 text-center">
        <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-3 leading-tight">
          {tagline || "Pesan Makanan & Minuman Mudah via WhatsApp"}
        </h2>
        <p className="text-primary-foreground/80 text-sm md:text-base mb-6 max-w-md mx-auto">
          {description || "Platform digital untuk UMKM kuliner Soppeng by juztrezky.  Pesan langsung, bayar mudah!"}
        </p>
        <button
          onClick={onClickMenu}
          className="bg-wa hover:bg-wa-hover text-primary-foreground font-semibold px-6 py-3 rounded-full transition-colors shadow-lg"
        >
          🍽️ Lihat Menu
        </button>
      </div>
    </section>
  );
}
