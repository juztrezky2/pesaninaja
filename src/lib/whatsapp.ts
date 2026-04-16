import type { CartItem } from "@/hooks/useCart";
import type { Product } from "@/hooks/useProducts";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

function makeWaLink(phone: string, text: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

export function buildOrderText(
  items: CartItem[],
  total: number,
  nama: string,
  alamat: string,
  orderFormat?: string
): string {
  const itemsText = items
    .map(
      (i) =>
        `- ${i.product.name} (${i.product.vendor}) x ${i.quantity} @ ${formatPrice(i.product.price)}`
    )
    .join("\n");

  if (orderFormat) {
    return orderFormat
      .replace("{items}", itemsText)
      .replace("{total}", formatPrice(total))
      .replace("{nama}", nama || "[belum diisi]")
      .replace("{alamat}", alamat || "[belum diisi]");
  }

  return `Halo, saya ingin pesan:\n\n${itemsText}\n\nTotal: ${formatPrice(total)}\n\nNama: ${nama || "[belum diisi]"}\nAlamat: ${alamat || "[belum diisi]"}\n\nTerima kasih!`;
}

export function buildWhatsAppUrl(
  phone: string,
  items: CartItem[],
  total: number,
  nama: string,
  alamat: string,
  orderFormat?: string
) {
  const text = buildOrderText(items, total, nama, alamat, orderFormat);
  return makeWaLink(phone, text);
}

export function buildSingleItemOrderText(
  product: Product,
  nama: string,
  alamat: string,
  orderFormat?: string
): string {
  const itemsText = `- ${product.name} (${product.vendor}) x 1 @ ${formatPrice(product.price)}`;
  const total = product.price;

  if (orderFormat) {
    return orderFormat
      .replace("{items}", itemsText)
      .replace("{total}", formatPrice(total))
      .replace("{nama}", nama || "[belum diisi]")
      .replace("{alamat}", alamat || "[belum diisi]");
  }

  return `Halo, saya ingin pesan:\n\n${itemsText}\n\nTotal: ${formatPrice(total)}\n\nNama: ${nama || "[belum diisi]"}\nAlamat: ${alamat || "[belum diisi]"}\n\nTerima kasih!`;
}

export function buildSingleItemWAUrl(
  phone: string,
  product: Product,
  nama: string,
  alamat: string,
  orderFormat?: string
) {
  const text = buildSingleItemOrderText(product, nama, alamat, orderFormat);
  return makeWaLink(phone, text);
}
