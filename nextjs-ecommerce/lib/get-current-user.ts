import { cookies } from "next/headers";
import { getSession } from "./auth";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

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
