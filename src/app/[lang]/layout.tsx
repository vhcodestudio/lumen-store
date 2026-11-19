import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Bodoni_Moda, Manrope } from "next/font/google";
import { LangLink } from "@/components/lang-link";
import { CartProvider, CartButton } from "@/components/cart";
import { dicts, href, htmlLang, isLang, LANGS, type Lang } from "@/lib/i18n";
import "../globals.css";

const display = Bodoni_Moda({ variable: "--font-bodoni", subsets: ["latin"], style: ["normal", "italic"] });
const sans = Manrope({ variable: "--font-manrope", subsets: ["latin"] });

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const { title, description } = dicts[lang].meta;
  return {
    title: { default: title, template: "%s · Lumen" },
    description,
    metadataBase: new URL("https://lumen-store-vhcode.vercel.app"),
    alternates: { canonical: href(lang), languages: { ...Object.fromEntries(LANGS.map((l) => [htmlLang[l], href(l)])), "x-default": "/" } },
    robots: { index: true, follow: true },
    referrer: "strict-origin-when-cross-origin",
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary", title: "Lumen", description },
  };
}

export const viewport: Viewport = { themeColor: "#0f0d0b" };

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const d = dicts[lang];
  return (
    <html lang={htmlLang[lang]} className={`${display.variable} ${sans.variable} antialiased`}>
      <body>
        <CartProvider lang={lang}>
          <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-full focus:bg-ivory focus:px-4 focus:py-2 focus:text-night">{d.skip}</a>
          <header className="fixed inset-x-0 top-0 z-30 border-b border-line/60 bg-night/70 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
              <Link href={href(lang)} className="font-display text-2xl tracking-[0.18em]">LUMEN</Link>
              <nav aria-label={d.nav.label} className="flex items-center gap-4 text-sm sm:gap-6">
                <Link href={`${href(lang)}#colecao`} className="hidden hover:text-glow sm:inline">{d.nav.collection}</Link>
                <Link href={`${href(lang)}#atelie`} className="hidden hover:text-glow sm:inline">{d.nav.atelier}</Link>
                <Suspense fallback={<span className="min-w-24" />}><LangSwitch lang={lang} label={d.nav.language} /></Suspense>
                <CartButton />
              </nav>
            </div>
          </header>
          <main id="conteudo">{children}</main>
          <footer className="border-t border-line">
            <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4 px-5 py-8 text-xs text-dim sm:px-8">
              <p>{d.footer.brand} <a href="https://github.com/vhcodestudio" className="underline hover:text-ivory">vhcodestudio</a>. {d.footer.noCharge}</p>
              <p>{d.footer.test}</p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}

function LangSwitch({ lang, label }: { lang: Lang; label: string }) {
  return (
    <ul aria-label={label} className="flex items-center text-xs uppercase tracking-wider">
      {LANGS.map((l) => (
        <li key={l}>
          {/* Plain links: switching language reloads the page in that language (the bag is kept). */}
          <LangLink to={l} current={lang} className={`inline-grid min-h-8 min-w-8 place-items-center px-1 ${l === lang ? "text-glow" : "text-dim hover:text-ivory"}`} />
        </li>
      ))}
    </ul>
  );
}
