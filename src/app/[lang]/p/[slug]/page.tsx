import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { bySlug, products } from "@/lib/catalog";
import { href, htmlLang, isLang, LANGS, productFor } from "@/lib/i18n";
import { ProductStudio } from "@/components/viewer";

export function generateStaticParams() {
  return LANGS.flatMap((lang) => products.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/p/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const base = bySlug(slug);
  if (!base || !isLang(lang)) return {};
  const p = productFor(base, lang);
  return {
    title: `${p.name}, ${p.line.toLowerCase()}`,
    description: p.tagline,
    alternates: { canonical: href(lang, `/p/${p.slug}`), languages: Object.fromEntries(LANGS.map((l) => [htmlLang[l], href(l, `/p/${p.slug}`)])) },
  };
}

export default async function ProductPage({ params }: PageProps<"/[lang]/p/[slug]">) {
  const { lang, slug } = await params;
  const base = bySlug(slug);
  if (!base || !isLang(lang)) notFound();
  const p = productFor(base, lang);
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Product", name: `Lumen ${p.name}`, description: p.story, brand: { "@type": "Brand", name: "Lumen" },
    offers: { "@type": "Offer", priceCurrency: "BRL", price: (p.price / 100).toFixed(2), availability: "https://schema.org/InStock" },
  };
  return (
    <>
      <ProductStudio product={p} lang={lang} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
