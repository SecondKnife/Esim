import { Request, Response, NextFunction } from "express";
import { getCurrentUser } from "../lib/get-current-user";

export interface AuthRequest extends Request {
  user?: any;
}

/**
 * Middleware to require authentication
 */
export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const user = await getCurrentUser(req);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.user = user;
  next();
}

/**
 * Middleware to require admin role
 */
export async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const user = await getCurrentUser(req);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (user.role !== "ADMIN") {
    return res.status(403).json({ error: "Forbidden - Admin access required" });
  }

  req.user = user;
  next();
}
