import { NextResponse, type NextRequest } from "next/server";

/**
 * Portuguese is served without a prefix: "/p/orla" renders app/[lang]/p/[slug] with lang "pt".
 * English and Spanish keep their prefix, and "/pt/..." redirects to the clean URL.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (/^\/(en|es)(\/|$)/.test(pathname)) return NextResponse.next();
  const url = request.nextUrl.clone();
  if (/^\/pt(\/|$)/.test(pathname)) {
    // Already rewritten by this proxy: let it through.
    if (request.headers.get("x-lumen-rewritten")) return NextResponse.next();
    url.pathname = pathname.replace(/^\/pt/, "") || "/";
    return NextResponse.redirect(url, 308);
  }
  url.pathname = `/pt${pathname === "/" ? "" : pathname}`;
  const headers = new Headers(request.headers);
  headers.set("x-lumen-rewritten", "1");
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
