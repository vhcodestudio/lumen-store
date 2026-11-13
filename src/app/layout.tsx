import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Bodoni_Moda, Manrope } from "next/font/google";
import { CartProvider, CartButton } from "@/components/cart";
import "./globals.css";

const display = Bodoni_Moda({ variable: "--font-bodoni", subsets: ["latin"], style: ["normal", "italic"] });
const sans = Manrope({ variable: "--font-manrope", subsets: ["latin"] });

const description = "Luminárias desenhadas para a luz baixa da noite. Veja cada peça em 3D, acesa, na temperatura de cor que você escolher.";

export const metadata: Metadata = {
  title: { default: "Lumen — luminárias para a noite", template: "%s · Lumen" },
  description,
  metadataBase: new URL("https://lumen-store-vhcode.vercel.app"),
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  referrer: "strict-origin-when-cross-origin",
  openGraph: { title: "Lumen — luminárias para a noite", description, type: "website" },
  twitter: { card: "summary", title: "Lumen", description },
};

export const viewport: Viewport = { themeColor: "#0f0d0b" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable} antialiased`}>
      <body>
        <CartProvider>
          <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-full focus:bg-ivory focus:px-4 focus:py-2 focus:text-night">Pular para o conteúdo</a>
          <header className="fixed inset-x-0 top-0 z-30 border-b border-line/60 bg-night/70 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
              <Link href="/" className="font-display text-2xl tracking-[0.18em]">LUMEN</Link>
              <nav aria-label="Principal" className="flex items-center gap-6 text-sm">
                <Link href="/#colecao" className="hidden hover:text-glow sm:inline">Coleção</Link>
                <Link href="/#atelie" className="hidden hover:text-glow sm:inline">Ateliê</Link>
                <CartButton />
              </nav>
            </div>
          </header>
          <main id="conteudo">{children}</main>
          <footer className="border-t border-line">
            <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4 px-5 py-8 text-xs text-dim sm:px-8">
              <p>Lumen é uma marca fictícia criada para portfólio por <a href="https://github.com/vhcodestudio" className="underline hover:text-ivory">vhcodestudio</a>. Nenhuma compra é cobrada.</p>
              <p>Pagamentos em modo de teste</p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
