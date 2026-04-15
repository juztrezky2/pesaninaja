import type { CartItem } from "@/hooks/useCart";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
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

  const cleanPhone = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function buildSingleItemWAUrl(
  phone: string,
  productName: string,
  price: number
) {
  const text = `Halo, saya ingin pesan:\n\n- ${productName} x 1 @ ${formatPrice(price)}\n\nTotal: ${formatPrice(price)}\n\nTerima kasih!`;
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
