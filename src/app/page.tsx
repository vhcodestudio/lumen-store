import Link from "next/link";
import { products, brl } from "@/lib/catalog";
import { CardLamp, HeroLamp } from "@/components/viewer";

export default function Home() {
  return (
    <>
      <section className="relative h-[100svh] min-h-[38rem] overflow-hidden">
        <HeroLamp />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night via-night/20 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-14 sm:px-8 sm:pb-20">
          <p className="text-xs uppercase tracking-[0.35em] text-dim">Coleção Noite · 2026</p>
          <h1 className="mt-4 max-w-4xl font-display text-[clamp(3rem,9vw,7.5rem)] leading-[0.92]">
            Luz para depois<br /><em className="text-glow">que o sol vai embora.</em>
          </h1>
          <div className="pointer-events-auto mt-8 flex flex-wrap items-center gap-6">
            <Link href="#colecao" className="rounded-full bg-ivory px-7 py-3.5 font-medium text-night transition-colors hover:bg-glow">Ver a coleção</Link>
            <p className="max-w-xs text-sm text-dim">Cada peça pode ser vista acesa, em 3D, na cor de luz que você escolher.</p>
          </div>
        </div>
      </section>

      <section id="colecao" aria-labelledby="colecao-h" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-24 sm:px-8">
        <div className="flex items-end justify-between gap-6 border-b border-line pb-6">
          <h2 id="colecao-h" className="font-display text-5xl">Coleção</h2>
          <p className="text-sm text-dim">{products.length} peças</p>
        </div>
        <ul className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2">
          {products.map((p, i) => (
            <li key={p.slug} className={i % 2 ? "sm:mt-24" : ""}>
              <Link href={`/p/${p.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-night-2">
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]"><CardLamp product={p} /></div>
                  <span className="absolute left-5 top-5 text-xs uppercase tracking-[0.3em] text-dim">{String(i + 1).padStart(2, "0")} · {p.line}</span>
                  <span className="absolute bottom-5 right-5 rounded-full border border-line bg-night/60 px-3 py-1 text-xs backdrop-blur transition-colors group-hover:border-glow group-hover:text-glow">Ver em 3D →</span>
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-4xl transition-colors group-hover:text-glow">{p.name}</h3>
                  <p className="tabular-nums text-dim">{brl(p.price)}</p>
                </div>
                <p className="mt-1 text-dim">{p.tagline}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="atelie" aria-labelledby="atelie-h" className="border-t border-line">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-8 md:grid-cols-[1fr_1.4fr]">
          <h2 id="atelie-h" className="font-display text-5xl leading-tight">Feitas para<br /><em>luz baixa.</em></h2>
          <div className="grid gap-10 sm:grid-cols-3">
            {[
              ["2700K", "Todas as peças saem com sugestão de lâmpada quente. É a cor da luz de vela, a que menos atrapalha o sono."],
              ["Sem ofuscar", "As cúpulas escondem a lâmpada de quem está sentado. Você vê a luz, não o bulbo."],
              ["Feito à mão", "Torneamento, solda e vidro soprado em oficinas pequenas no interior de São Paulo."],
            ].map(([t, d]) => (
              <div key={t}><p className="font-display text-3xl text-glow">{t}</p><p className="mt-3 text-sm leading-relaxed text-dim">{d}</p></div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
