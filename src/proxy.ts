import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public launch gate (added Nov 9, 2026, before the official launch):
// visitors on the public domain see the coming soon page instead of the app,
// while the exact same deployment stays fully usable on every other host
// (the Vercel address, preview links, localhost) so the team can keep testing.
// This is a display gate only: it stops the public site from showing account
// details and payment flows, it cannot stop transfers to accounts a person
// already has. To launch publicly, empty this list or delete this file.
const GATED_HOSTS = ["odedalga.com", "www.odedalga.com"];

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") || "").split(":")[0].toLowerCase();
  if (GATED_HOSTS.includes(host) && request.nextUrl.pathname !== "/coming-soon") {
    const url = request.nextUrl.clone();
    url.pathname = "/coming-soon";
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Pages only: skip Next internals, API routes and static files, so the
    // coming soon page can load its own styles, images and fonts, and the
    // app's API behaviour is unchanged on every host.
    "/((?!_next/static|_next/image|api|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|map|webmanifest|txt|xml)$).*)",
  ],
};
