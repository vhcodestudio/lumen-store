import type { Metadata } from "next";
import Link from "next/link";
import { ClearCart } from "./clear";

export const metadata: Metadata = { title: "Pedido confirmado", robots: { index: false } };

export default function Page() {
  return (
    <div className="halo grid min-h-dvh place-items-center px-5 text-center">
      <ClearCart />
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-dim">Pedido de teste confirmado</p>
        <h1 className="mt-4 font-display text-6xl sm:text-7xl">Obrigado.<br /><em className="text-glow">Boa noite.</em></h1>
        <p className="mx-auto mt-6 max-w-sm text-dim">Como a Lumen é uma loja de demonstração, nada foi cobrado e nenhuma peça vai sair daqui.</p>
        <Link href="/" className="mt-8 inline-block rounded-full border border-line px-6 py-3 hover:border-glow hover:text-glow">Voltar para a loja</Link>
      </div>
    </div>
  );
}
