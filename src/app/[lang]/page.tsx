import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/lib/catalog";
import { dicts, href, isLang, money, productFor } from "@/lib/i18n";
import { CardLamp, HeroLamp } from "@/components/viewer";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const d = dicts[lang].home;
  const list = products.map((p) => productFor(p, lang));
  return (
    <>
      <section className="relative h-[100svh] min-h-[38rem] overflow-hidden">
        <HeroLamp lang={lang} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night via-night/20 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-14 sm:px-8 sm:pb-20">
          <p className="text-xs uppercase tracking-[0.35em] text-dim">{d.eyebrow}</p>
          <h1 className="mt-4 max-w-4xl font-display text-[clamp(3rem,9vw,7.5rem)] leading-[0.92]">
            {d.h1[0]}<br /><em className="text-glow">{d.h1[1]}</em>
          </h1>
          <div className="pointer-events-auto mt-8 flex flex-wrap items-center gap-6">
            <Link href="#colecao" className="rounded-full bg-ivory px-7 py-3.5 font-medium text-night transition-colors hover:bg-glow">{d.cta}</Link>
            <p className="max-w-xs text-sm text-dim">{d.lead}</p>
          </div>
        </div>
      </section>

      <section id="colecao" aria-labelledby="colecao-h" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-24 sm:px-8">
        <div className="flex items-end justify-between gap-6 border-b border-line pb-6">
          <h2 id="colecao-h" className="font-display text-5xl">{d.collection}</h2>
          <p className="text-sm text-dim">{d.pieces(list.length)}</p>
        </div>
        <ul className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2">
          {list.map((p, i) => (
            <li key={p.slug} className={i % 2 ? "sm:mt-24" : ""}>
              <Link href={href(lang, `/p/${p.slug}`)} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-night-2">
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]"><CardLamp product={p} lang={lang} /></div>
                  <span className="absolute left-5 top-5 text-xs uppercase tracking-[0.3em] text-dim">{String(i + 1).padStart(2, "0")} · {p.line}</span>
                  <span className="absolute bottom-5 right-5 rounded-full border border-line bg-night/60 px-3 py-1 text-xs backdrop-blur transition-colors group-hover:border-glow group-hover:text-glow">{d.see3d}</span>
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-4xl transition-colors group-hover:text-glow">{p.name}</h3>
                  <p className="tabular-nums text-dim">{money(p.price, lang)}</p>
                </div>
                <p className="mt-1 text-dim">{p.tagline}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="atelie" aria-labelledby="atelie-h" className="border-t border-line">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-8 md:grid-cols-[1fr_1.4fr]">
          <h2 id="atelie-h" className="font-display text-5xl leading-tight">{d.atelier[0]}<br /><em>{d.atelier[1]}</em></h2>
          <div className="grid gap-10 sm:grid-cols-3">
            {d.notes.map(([t, desc]) => (
              <div key={t}><p className="font-display text-3xl text-glow">{t}</p><p className="mt-3 text-sm leading-relaxed text-dim">{desc}</p></div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
