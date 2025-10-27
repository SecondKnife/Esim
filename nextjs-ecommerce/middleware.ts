import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value;

  // Allow public routes
  const publicPaths = ["/login", "/signup", "/api/auth"];
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check authentication for protected routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!token) {
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }

    const session = await getSession(token);
    if (!session) {
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      const url = new URL("/", request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
