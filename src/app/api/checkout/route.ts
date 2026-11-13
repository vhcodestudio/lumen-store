import Stripe from "stripe";
import { price } from "@/lib/cart";

export async function POST(req: Request) {
  let body: unknown;
  try {
    const text = await req.text();
    if (text.length > 10_000) return Response.json({ error: "Pedido grande demais." }, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: "Pedido inválido." }, { status: 400 });
  }
  const { items, shipping } = price((body as { lines?: unknown })?.lines);
  if (!items.length) return Response.json({ error: "Sacola vazia." }, { status: 400 });

  const origin = new URL(req.url).origin;
  const key = process.env.STRIPE_SECRET_KEY;

  // No key configured: hand off to the local demo checkout (portfolio mode).
  if (!key) return Response.json({ url: `${origin}/checkout/demo` });
  if (!key.startsWith("sk_test_")) return Response.json({ error: "Somente chaves de teste são aceitas nesta loja de demonstração." }, { status: 500 });

  const stripe = new Stripe(key);
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "pt-BR",
      line_items: items.map((i) => ({
        quantity: i.qty,
        price_data: { currency: "brl", unit_amount: i.product.price, product_data: { name: `${i.product.name} · ${i.finish.name}`, description: i.product.tagline } },
      })),
      shipping_options: [{ shipping_rate_data: { display_name: shipping ? "Entrega padrão" : "Frete grátis", type: "fixed_amount", fixed_amount: { amount: shipping, currency: "brl" } } }],
      success_url: `${origin}/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=cancelado`,
    });
    return Response.json({ url: session.url });
  } catch {
    return Response.json({ error: "Não foi possível abrir o checkout agora." }, { status: 502 });
  }
}
