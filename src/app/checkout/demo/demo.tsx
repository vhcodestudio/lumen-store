"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { price } from "@/lib/cart";
import { brl } from "@/lib/catalog";
import { useCart } from "@/components/cart";

export function DemoCheckout() {
  const { lines, clear } = useCart();
  const router = useRouter();
  const [card, setCard] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const { items, total } = price(lines);

  function pay(e: React.FormEvent) {
    e.preventDefault();
    const digits = card.replace(/\D/g, "");
    if (digits !== "4242424242424242") return setErr("No modo de demonstração só o cartão de teste 4242 4242 4242 4242 é aceito.");
    setBusy(true);
    setTimeout(() => { clear(); router.push("/checkout/sucesso?demo=1"); }, 900);
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-5 pb-20 pt-28 sm:px-8 md:grid-cols-[1fr_22rem]">
      <form onSubmit={pay} className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-dim">Checkout de demonstração</p>
          <h1 className="mt-2 font-display text-5xl">Pagamento</h1>
          <p className="mt-3 text-sm text-dim">A loja não tem uma chave Stripe configurada, então este formulário simula o checkout. Nenhum dado sai do seu navegador e nada é cobrado.</p>
        </div>
        <label className="block">
          <span className="text-sm text-dim">Número do cartão (teste)</span>
          <input inputMode="numeric" autoComplete="off" value={card} onChange={(e) => setCard(e.target.value)} placeholder="4242 4242 4242 4242" maxLength={19} required
            className="mt-1 w-full rounded-xl border border-line bg-night-2 px-4 py-3.5 tabular-nums tracking-widest placeholder:text-dim/50" />
        </label>
        {err && <p role="alert" className="text-sm text-red-300">{err}</p>}
        <button disabled={busy || !items.length} className="w-full rounded-full bg-ivory py-4 font-medium text-night hover:bg-glow disabled:opacity-50">
          {busy ? "Processando…" : `Pagar ${brl(total)}`}
        </button>
      </form>
      <aside className="h-fit rounded-2xl border border-line p-6">
        <h2 className="font-display text-2xl">Resumo</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((i) => <li key={i.product.slug + i.finish.id} className="flex justify-between gap-3"><span>{i.qty}× {i.product.name} <span className="text-dim">· {i.finish.name}</span></span><span className="tabular-nums">{brl(i.amount)}</span></li>)}
          {!items.length && <li className="text-dim">Sacola vazia.</li>}
        </ul>
        <p className="mt-4 flex justify-between border-t border-line pt-4"><span>Total</span><span className="tabular-nums">{brl(total)}</span></p>
      </aside>
    </div>
  );
}
