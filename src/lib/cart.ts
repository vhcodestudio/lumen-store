import { bySlug } from "./catalog";

export type Line = { slug: string; finish: string; qty: number };
export const MAX_QTY = 10;
export const FREE_SHIPPING = 150000;
export const SHIPPING = 4900;

export function addLine(cart: Line[], slug: string, finish: string, qty = 1): Line[] {
  const i = cart.findIndex((l) => l.slug === slug && l.finish === finish);
  if (i < 0) return [...cart, { slug, finish, qty: Math.min(qty, MAX_QTY) }];
  return cart.map((l, j) => (j === i ? { ...l, qty: Math.min(l.qty + qty, MAX_QTY) } : l));
}

export function setQty(cart: Line[], slug: string, finish: string, qty: number): Line[] {
  if (qty <= 0) return cart.filter((l) => !(l.slug === slug && l.finish === finish));
  return cart.map((l) => (l.slug === slug && l.finish === finish ? { ...l, qty: Math.min(qty, MAX_QTY) } : l));
}

/** Server-trusted pricing: ignores anything but slug/finish/qty and drops unknown items. */
export function price(lines: unknown) {
  if (!Array.isArray(lines)) return { items: [], subtotal: 0, shipping: 0, total: 0 };
  const items = lines.slice(0, 20).flatMap((raw) => {
    const l = raw as Partial<Line>;
    const p = typeof l.slug === "string" ? bySlug(l.slug) : undefined;
    const f = p?.finishes.find((x) => x.id === l.finish);
    const qty = Number.isInteger(l.qty) ? Math.min(Math.max(l.qty as number, 1), MAX_QTY) : 0;
    return p && f && qty ? [{ product: p, finish: f, qty, amount: p.price * qty }] : [];
  });
  const subtotal = items.reduce((a, i) => a + i.amount, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING ? 0 : SHIPPING;
  return { items, subtotal, shipping, total: subtotal + shipping };
}
