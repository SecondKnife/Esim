import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    console.log("🔐 Login attempt:", { email });

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    console.log("👤 User found:", user ? "Yes" : "No");

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials - User not found" },
        { status: 401 }
      );
    }

    console.log("🔑 Verifying password...");
    const isValid = await verifyPassword(password, user.password);
    console.log("✅ Password valid:", isValid);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials - Wrong password" },
        { status: 401 }
      );
    }

    const token = await createSession(user.id);
    console.log("🎫 Session token created:", token.substring(0, 20) + "...");

    // Set cookie
    const cookieStore = cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    console.log("✅ Login successful for:", user.email);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
