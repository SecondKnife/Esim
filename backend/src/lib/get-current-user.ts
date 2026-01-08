import { Request } from "express";
import { getSession } from "./auth";

export async function getCurrentUser(req: Request) {
  try {
    // Get token from cookie or Authorization header
    const token = req.cookies?.session || req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return null;
    }

    const session = await getSession(token);

    if (!session) {
      return null;
    }

    return session.user;
  } catch {
    return null;
  }
}
