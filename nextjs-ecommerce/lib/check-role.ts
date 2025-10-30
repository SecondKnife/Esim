/**
 * Role-based authorization utilities
 */

import { getCurrentUser } from "./get-current-user";
import { redirect } from "next/navigation";

export type UserRole = "ADMIN" | "MODERATOR" | "USER";

/**
 * Check if user has required role
 */
export async function requireRole(
  allowedRoles: UserRole[],
  redirectTo: string = "/unauthorized"
) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!allowedRoles.includes(user.role as UserRole)) {
    redirect(redirectTo);
  }

  return user;
}

/**
 * Check if user is admin
 */
export async function requireAdmin() {
  return requireRole(["ADMIN"]);
}

/**
 * Check if user is admin or moderator
 */
export async function requireAdminOrModerator() {
  return requireRole(["ADMIN", "MODERATOR"]);
}

/**
 * Check if current user has specific role (for client components)
 */
export function hasRole(userRole: string, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole as UserRole);
}

/**
 * Check if user is admin (for client components)
 */
export function isAdmin(userRole: string): boolean {
  return userRole === "ADMIN";
}

/**
 * Check if user is admin or moderator (for client components)
 */
export function isAdminOrModerator(userRole: string): boolean {
  return ["ADMIN", "MODERATOR"].includes(userRole);
}

