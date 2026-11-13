import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { bySlug, products } from "@/lib/catalog";
import { ProductStudio } from "@/components/viewer";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/p/[slug]">): Promise<Metadata> {
  const p = bySlug((await params).slug);
  return p ? { title: `${p.name}, ${p.line.toLowerCase()}`, description: p.tagline, alternates: { canonical: `/p/${p.slug}` } } : {};
}

export default async function ProductPage({ params }: PageProps<"/p/[slug]">) {
  const p = bySlug((await params).slug);
  if (!p) notFound();
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Product", name: `Lumen ${p.name}`, description: p.story, brand: { "@type": "Brand", name: "Lumen" },
    offers: { "@type": "Offer", priceCurrency: "BRL", price: (p.price / 100).toFixed(2), availability: "https://schema.org/InStock" },
  };
  return (
    <>
      <ProductStudio product={p} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
