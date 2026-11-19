"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { addLine, setQty, price, FREE_SHIPPING, type Line } from "@/lib/cart";
import { dicts, finishFor, href, money, productFor, type Lang } from "@/lib/i18n";

type Ctx = { lang: Lang; lines: Line[]; add: (slug: string, finish: string) => void; set: (slug: string, finish: string, qty: number) => void; clear: () => void; open: boolean; setOpen: (o: boolean) => void };
const CartCtx = createContext<Ctx | null>(null);
const KEY = "lumen:cart:v1";

export function CartProvider({ children, lang = "pt" }: { children: ReactNode; lang?: Lang }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);
  const loaded = useRef(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate cart from storage after mount
      if (raw) setLines(JSON.parse(raw));
    } catch { /* ignore */ }
    loaded.current = true;
  }, []);
  useEffect(() => {
    if (loaded.current) try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* ignore */ }
  }, [lines]);
  const value: Ctx = {
    lang, lines, open, setOpen,
    add: (s, f) => { setLines((c) => addLine(c, s, f)); setOpen(true); },
    set: (s, f, q) => setLines((c) => setQty(c, s, f, q)),
    clear: () => setLines([]),
  };
  return <CartCtx.Provider value={value}>{children}<Drawer /></CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}

export function CartButton() {
  const { lines, setOpen, lang } = useCart();
  const t = dicts[lang].cart;
  const n = lines.reduce((a, l) => a + l.qty, 0);
  return (
    <button onClick={() => setOpen(true)} className="flex items-center gap-2 text-sm tracking-wide hover:text-glow" aria-label={t.open(n)}>
      {t.bag}
      <span className="grid size-6 place-items-center rounded-full border border-current text-[11px] tabular-nums">{n}</span>
    </button>
  );
}

function Drawer() {
  const { lines, set, open, setOpen, lang } = useCart();
  const t = dicts[lang].cart;
  const brl = (c: number) => money(c, lang);
  const ref = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const { items, subtotal, shipping, total } = price(lines);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  async function checkout() {
    setBusy(true); setErr("");
    try {
      const r = await fetch("/api/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ lines, lang }) });
      const data = (await r.json()) as { url?: string; error?: string };
      if (!r.ok || !data.url) throw new Error(data.error ?? t.fail);
      window.location.assign(data.url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : t.fail);
      setBusy(false);
    }
  }

  return (
    <dialog ref={ref} onClose={() => setOpen(false)} onClick={(e) => e.target === ref.current && setOpen(false)} aria-label={t.bag}
      className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-md border-l border-line bg-night p-0 text-ivory backdrop:bg-black/60">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-2xl">{t.bag}</h2>
          <button onClick={() => setOpen(false)} className="text-sm text-dim hover:text-ivory">{t.close}</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6">
          {subtotal > 0 && subtotal < FREE_SHIPPING && (
            <div className="mt-5">
              <p className="text-xs text-dim">{t.toFree(brl(FREE_SHIPPING - subtotal))}</p>
              <div className="mt-2 h-px bg-line"><motion.div className="h-px origin-left bg-glow" initial={false} animate={{ scaleX: subtotal / FREE_SHIPPING }} /></div>
            </div>
          )}
          <ul className="divide-y divide-line">
            <AnimatePresence initial={false}>
              {items.map(({ product: p0, finish: f0, qty, amount }) => { const product = productFor(p0, lang); const finish = finishFor(f0, lang); return (
                <motion.li key={product.slug + finish.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex gap-4 py-5">
                  <span className="grid size-16 shrink-0 place-items-center rounded-full" style={{ background: `radial-gradient(circle at 50% 40%, #ffd9a0 0, ${finish.color} 45%, #0f0d0b 75%)` }} aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <Link href={href(lang, `/p/${product.slug}`)} onClick={() => setOpen(false)} className="font-display text-xl hover:text-glow">{product.name}</Link>
                    <p className="text-sm text-dim">{product.line} · {finish.name}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center rounded-full border border-line">
                        <button onClick={() => set(product.slug, finish.id, qty - 1)} className="size-8" aria-label={t.less(product.name)}>−</button>
                        <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">{qty}</span>
                        <button onClick={() => set(product.slug, finish.id, qty + 1)} className="size-8" aria-label={t.more(product.name)}>+</button>
                      </div>
                      <button onClick={() => set(product.slug, finish.id, 0)} className="text-xs text-dim underline">{t.remove}</button>
                    </div>
                  </div>
                  <p className="text-sm tabular-nums">{brl(amount)}</p>
                </motion.li>
              ); })}
            </AnimatePresence>
          </ul>
          {!items.length && <p className="py-16 text-center text-dim">{t.empty}</p>}
        </div>
        {items.length > 0 && (
          <div className="border-t border-line px-6 py-5">
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between text-dim"><dt>{t.subtotal}</dt><dd className="tabular-nums">{brl(subtotal)}</dd></div>
              <div className="flex justify-between text-dim"><dt>{t.shipping}</dt><dd>{shipping ? brl(shipping) : t.free}</dd></div>
              <div className="flex justify-between pt-2 text-lg"><dt>{t.total}</dt><dd className="tabular-nums">{brl(total)}</dd></div>
            </dl>
            <button onClick={checkout} disabled={busy} className="mt-4 w-full rounded-full bg-ivory py-3.5 font-medium text-night transition-colors hover:bg-glow disabled:opacity-60">
              {busy ? t.opening : t.checkout}
            </button>
            {err && <p role="alert" className="mt-2 text-sm text-red-300">{err}</p>}
            <p className="mt-3 text-center text-xs text-dim">{t.testNote}</p>
          </div>
        )}
      </div>
    </dialog>
  );
}
