import { db } from "./db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function createSession(userId: string): Promise<string> {
  const token = generateToken(userId);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await db.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
}

export async function getSession(token: string) {
  const session = await db.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || new Date() > session.expiresAt) {
    return null;
  }

  return session;
}

export async function deleteSession(token: string) {
  await db.session.deleteMany({
    where: { token },
  });
}

export async function getUserByEmail(email: string) {
  return await db.user.findUnique({
    where: { email },
  });
}

export async function getUserById(id: string) {
  return await db.user.findUnique({
    where: { id },
  });
}

export async function isAdmin(userId: string): Promise<boolean> {
  const user = await getUserById(userId);
  return user?.role === "ADMIN";
}
