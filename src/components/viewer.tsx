"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { kelvinToHex, type Product } from "@/lib/catalog";
import { dicts, money, type Lang } from "@/lib/i18n";
import { useCart } from "./cart";

const LampScene = dynamic(() => import("./lamp-scene"), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center text-sm text-dim" aria-hidden="true">✦</div>,
});

export function HeroLamp({ lang = "pt" }: { lang?: Lang }) {
  return (
    <div className="absolute inset-0">
      <LampScene shape="pendant" finish={{ id: "latao", name: "", color: "#b8915a", metal: 0.9, rough: 0.35 }} on kelvin={2700} interactive={false} className="!h-full" label={dicts[lang].product.model(true)} />
    </div>
  );
}

export function ProductStudio({ product, lang = "pt" }: { product: Product; lang?: Lang }) {
  const t = dicts[lang].product;
  const [finish, setFinish] = useState(product.finishes[0]);
  const [on, setOn] = useState(true);
  const [kelvin, setKelvin] = useState(2700);
  const { add } = useCart();
  const glow = kelvinToHex(kelvin);
  const mood = t.moods[kelvin < 3000 ? 0 : kelvin < 4000 ? 1 : 2];

  return (
    <div style={{ "--glow": glow, "--lit": on ? 1 : 0.15 } as React.CSSProperties} className="grid min-h-dvh gap-0 lg:grid-cols-[1.35fr_1fr]">
      <div className="halo relative h-[62vh] border-b border-line lg:sticky lg:top-0 lg:h-dvh lg:border-b-0 lg:border-r">
        <LampScene shape={product.shape} finish={finish} on={on} kelvin={kelvin} className="!h-full" label={t.model(on)} />
        <p className="pointer-events-none absolute bottom-4 left-5 text-xs text-dim">{t.drag}</p>
      </div>

      <div className="px-5 pb-16 pt-8 sm:px-10 lg:pt-28">
        <p className="text-xs uppercase tracking-[0.3em] text-dim">{product.line}</p>
        <h1 className="mt-2 font-display text-6xl leading-none sm:text-7xl">{product.name}</h1>
        <p className="mt-4 text-lg text-dim">{product.tagline}</p>
        <p className="mt-6 text-2xl tabular-nums">{money(product.price, lang)}</p>

        <div className="mt-10 space-y-8">
          <div className="flex items-center justify-between rounded-2xl border border-line p-4">
            <div>
              <p className="font-medium">{t.switch}</p>
              <p className="text-sm text-dim">{t.seeIt(on)}</p>
            </div>
            <button role="switch" aria-checked={on} onClick={() => setOn(!on)} aria-label={t.turnOn}
              className={`relative h-9 w-16 rounded-full border transition-colors ${on ? "border-glow bg-glow" : "border-line bg-night-2"}`}>
              <motion.span layout transition={{ type: "spring", stiffness: 500, damping: 32 }}
                className={`absolute top-1 size-7 rounded-full ${on ? "right-1 bg-night" : "left-1 bg-dim"}`} />
            </button>
          </div>

          <label className={`block transition-opacity ${on ? "" : "opacity-40"}`}>
            <span className="flex items-baseline justify-between">
              <span className="font-medium">{t.temp}</span>
              <span className="text-sm tabular-nums text-dim">{kelvin}K · {mood}</span>
            </span>
            <input type="range" min={2200} max={5000} step={100} value={kelvin} disabled={!on} onChange={(e) => setKelvin(Number(e.target.value))}
              aria-valuetext={t.tempText(kelvin, mood)}
              className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full accent-[var(--color-glow)]"
              style={{ background: `linear-gradient(90deg, ${kelvinToHex(2200)}, ${kelvinToHex(3500)}, ${kelvinToHex(5000)})` }} />
          </label>

          <fieldset>
            <legend className="font-medium">{t.finish} · <span className="text-dim">{finish.name}</span></legend>
            <div className="mt-3 flex gap-3">
              {product.finishes.map((f) => (
                <button key={f.id} onClick={() => setFinish(f)} aria-pressed={finish.id === f.id} aria-label={f.name}
                  className={`size-11 rounded-full border-2 transition-transform hover:scale-105 ${finish.id === f.id ? "border-ivory" : "border-transparent"}`}
                  style={{ background: `radial-gradient(circle at 35% 30%, #fff6 0, ${f.color} 40%, ${f.color} 100%)` }} />
              ))}
            </div>
          </fieldset>

          <motion.button whileTap={{ scale: 0.98 }} onClick={() => add(product.slug, finish.id)}
            className="w-full rounded-full bg-ivory py-4 text-lg font-medium text-night transition-colors hover:bg-glow">
            {t.add}
          </motion.button>
        </div>

        <div className="mt-14 border-t border-line pt-8">
          <p className="max-w-prose leading-relaxed text-dim">{product.story}</p>
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            {product.specs.map(([k, v]) => (
              <div key={k} className="border-t border-line pt-3"><dt className="text-dim">{k}</dt><dd className="mt-1">{v}</dd></div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

/** Collection card 3D: mounts when the card scrolls near, pauses rendering when it leaves. */
export function CardLamp({ product, lang = "pt" }: { product: Product; lang?: Lang }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { setVisible(e.isIntersecting); if (e.isIntersecting) setSeen(true); }, { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="absolute inset-0">
      {seen && <LampScene shape={product.shape} finish={product.finishes[0]} on kelvin={2700} interactive={false} paused={!visible} className="!h-full" label={dicts[lang].product.model(true)} />}
    </div>
  );
}
