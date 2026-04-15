import type { CartItem } from "@/hooks/useCart";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

function isMobile(): boolean {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  );
}

function makeWaLink(phone: string, text: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const encoded = encodeURIComponent(text);
  if (isMobile()) {
    return `https://wa.me/${cleanPhone}?text=${encoded}`;
  }
  return `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`;
}

export function buildWhatsAppUrl(
  phone: string,
  items: CartItem[],
  total: number,
  nama: string,
  alamat: string,
  orderFormat?: string
) {
  const itemsText = items
    .map(
      (i) =>
        `- ${i.product.name} x ${i.quantity} @ ${formatPrice(i.product.price)}`
    )
    .join("\n");

  let text: string;
  if (orderFormat) {
    text = orderFormat
      .replace("{items}", itemsText)
      .replace("{total}", formatPrice(total))
      .replace("{nama}", nama || "[belum diisi]")
      .replace("{alamat}", alamat || "[belum diisi]");
  } else {
    text = `Halo, saya ingin pesan:\n\n${itemsText}\n\nTotal: ${formatPrice(total)}\n\nNama: ${nama || "[belum diisi]"}\nAlamat: ${alamat || "[belum diisi]"}\n\nTerima kasih!`;
  }

  return makeWaLink(phone, text);
}

export function buildSingleItemWAUrl(
  phone: string,
  productName: string,
  price: number
) {
  const text = `Halo, saya ingin pesan:\n\n- ${productName} x 1 @ ${formatPrice(price)}\n\nTotal: ${formatPrice(price)}\n\nTerima kasih!`;
  return makeWaLink(phone, text);
}
