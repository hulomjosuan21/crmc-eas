import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/dashboard", "/manage", "/profile"];
const PUBLIC_AUTH_PATHS = ["/auth/signin", "/auth/signup", "/auth/error"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has("auth_session");

  if (pathname === "/") {
    if (hasSession) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  if (PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
    if (!hasSession) {
      const url = new URL("/auth/signin", request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (PUBLIC_AUTH_PATHS.some((path) => pathname.startsWith(path))) {
    if (hasSession) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
