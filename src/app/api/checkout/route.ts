import Stripe from "stripe";
import { price } from "@/lib/cart";
import { finishFor, href, isLang, productFor, type Lang } from "@/lib/i18n";

const ERR: Record<Lang, Record<"big" | "bad" | "empty" | "live" | "down", string>> = {
  pt: { big: "Pedido grande demais.", bad: "Pedido inválido.", empty: "Sacola vazia.", live: "Somente chaves de teste são aceitas nesta loja de demonstração.", down: "Não foi possível abrir o checkout agora." },
  en: { big: "Request too large.", bad: "Invalid request.", empty: "Your bag is empty.", live: "Only test keys are accepted in this demo store.", down: "Could not open checkout right now." },
  es: { big: "Pedido demasiado grande.", bad: "Pedido inválido.", empty: "Bolsa vacía.", live: "Solo se aceptan claves de prueba en esta tienda de demostración.", down: "No se pudo abrir el checkout ahora." },
};
const STRIPE_LOCALE = { pt: "pt-BR", en: "en", es: "es" } as const;
const SHIP: Record<Lang, [string, string]> = { pt: ["Entrega padrão", "Frete grátis"], en: ["Standard delivery", "Free shipping"], es: ["Envío estándar", "Envío gratis"] };

export async function POST(req: Request) {
  let body: unknown;
  try {
    const text = await req.text();
    if (text.length > 10_000) return Response.json({ error: ERR.pt.big }, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: ERR.pt.bad }, { status: 400 });
  }
  const rawLang = (body as { lang?: unknown })?.lang;
  const lang: Lang = typeof rawLang === "string" && isLang(rawLang) ? rawLang : "pt";
  const { items, shipping } = price((body as { lines?: unknown })?.lines);
  if (!items.length) return Response.json({ error: ERR[lang].empty }, { status: 400 });

  const origin = new URL(req.url).origin;
  const key = process.env.STRIPE_SECRET_KEY;

  // No key configured: hand off to the local demo checkout (portfolio mode).
  if (!key) return Response.json({ url: `${origin}${href(lang, "/checkout/demo")}` });
  if (!key.startsWith("sk_test_")) return Response.json({ error: ERR[lang].live }, { status: 500 });

  const stripe = new Stripe(key);
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: STRIPE_LOCALE[lang],
      line_items: items.map((i) => ({
        quantity: i.qty,
        price_data: { currency: "brl", unit_amount: i.product.price, product_data: { name: `${i.product.name} · ${finishFor(i.finish, lang).name}`, description: productFor(i.product, lang).tagline } },
      })),
      shipping_options: [{ shipping_rate_data: { display_name: shipping ? SHIP[lang][0] : SHIP[lang][1], type: "fixed_amount", fixed_amount: { amount: shipping, currency: "brl" } } }],
      success_url: `${origin}${href(lang, "/checkout/sucesso")}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${href(lang)}?checkout=cancelado`,
    });
    return Response.json({ url: session.url });
  } catch {
    return Response.json({ error: ERR[lang].down }, { status: 502 });
  }
}
