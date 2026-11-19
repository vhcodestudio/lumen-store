import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dicts, isLang } from "@/lib/i18n";
import { DemoCheckout } from "./demo";

export async function generateMetadata({ params }: PageProps<"/[lang]/checkout/demo">): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLang(lang) ? dicts[lang].demo.title : "Checkout", robots: { index: false } };
}

export default async function Page({ params }: PageProps<"/[lang]/checkout/demo">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return <DemoCheckout lang={lang} />;
}
