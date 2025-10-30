import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value;

  // Allow public routes
  const publicPaths = ["/login", "/signup", "/api/auth", "/", "/shop", "/featured", "/product", "/cart"];
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path)
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check authentication for protected routes (admin)
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!token) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // Token exists, allow access
    // Full verification will be done in API routes and server components
    // This middleware just checks for token presence
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
