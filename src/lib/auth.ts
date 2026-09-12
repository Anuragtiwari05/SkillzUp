import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getUserId(): Promise<string | null> {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string };
    return decoded?.userId ?? null;
  } catch {
    return null;
  }
}
