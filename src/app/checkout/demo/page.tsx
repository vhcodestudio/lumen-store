import type { Metadata } from "next";
import { DemoCheckout } from "./demo";

export const metadata: Metadata = { title: "Checkout de demonstração", robots: { index: false } };

export default function Page() {
  return <DemoCheckout />;
}
