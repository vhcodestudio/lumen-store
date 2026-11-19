"use client";

import { usePathname } from "next/navigation";
import { htmlLang, langLabel, type Lang } from "@/lib/i18n";

/** Link to the same page in another language: strips the current prefix and adds the target one. */
export function LangLink({ to, current, className }: { to: Lang; current: Lang; className: string }) {
  const path = usePathname() ?? "/";
  const bare = current === "pt" ? path : path.replace(new RegExp(`^/${current}(?=/|$)`), "") || "/";
  const target = to === "pt" ? bare : `/${to}${bare === "/" ? "" : bare}`;
  return (
    <a href={target} hrefLang={htmlLang[to]} lang={htmlLang[to]} title={langLabel[to]} aria-current={to === current ? "page" : undefined} className={className}>
      <span aria-hidden="true">{to}</span><span className="sr-only">{langLabel[to]}</span>
    </a>
  );
}
