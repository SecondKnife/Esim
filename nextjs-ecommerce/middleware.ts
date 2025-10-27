import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

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

    try {
      // Verify JWT token (no database query)
      jwt.verify(token, JWT_SECRET);
      // Token is valid, allow access
      // Note: We can't check user role here without database query
      // Role check will be done in the admin layout or individual pages
      return NextResponse.next();
    } catch (error) {
      // Invalid or expired token
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
