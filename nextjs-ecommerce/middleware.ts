import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    
    // Skip middleware for static files, images, and Next.js internals
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api/') ||
      pathname.includes('.') // Skip files with extensions (images, fonts, etc.)
    ) {
      return NextResponse.next();
    }

    const token = request.cookies.get("session")?.value;

    // Public routes that don't require authentication
    const publicPaths = ["/", "/login", "/signup", "/shop", "/featured", "/product", "/cart", "/unauthorized"];
    const isPublicPath = publicPaths.some((path) =>
      pathname === path || pathname.startsWith(path + "/")
    );

    if (isPublicPath) {
      return NextResponse.next();
    }

    // Check authentication for protected routes (admin)
    if (pathname.startsWith("/admin")) {
      if (!token) {
        const url = new URL("/login", request.url);
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
