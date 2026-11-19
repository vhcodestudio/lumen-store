import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dicts, href, isLang } from "@/lib/i18n";
import { ClearCart } from "./clear";

export async function generateMetadata({ params }: PageProps<"/[lang]/checkout/sucesso">): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLang(lang) ? dicts[lang].done.title : "OK", robots: { index: false } };
}

export default async function Page({ params }: PageProps<"/[lang]/checkout/sucesso">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const d = dicts[lang].done;
  return (
    <div className="halo grid min-h-dvh place-items-center px-5 text-center">
      <ClearCart />
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-dim">{d.eyebrow}</p>
        <h1 className="mt-4 font-display text-6xl sm:text-7xl">{d.h1[0]}<br /><em className="text-glow">{d.h1[1]}</em></h1>
        <p className="mx-auto mt-6 max-w-sm text-dim">{d.text}</p>
        <Link href={href(lang)} className="mt-8 inline-block rounded-full border border-line px-6 py-3 hover:border-glow hover:text-glow">{d.back}</Link>
      </div>
    </div>
  );
}
