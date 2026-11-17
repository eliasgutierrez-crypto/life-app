import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export type SessionContext = {
  userId: string;
  coupleId: string;
};

// --- Para Server Actions: lanzan ---

export async function requireUser(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");
  return userId;
}

export async function requireCouple(): Promise<SessionContext> {
  const userId = await requireUser();
  const couple = await prisma.couple.findFirst({
    where: { OR: [{ memberAId: userId }, { memberBId: userId }] },
  });
  if (!couple) throw new Error("Sin pareja configurada");
  return { userId, coupleId: couple.id };
}

// --- Para páginas: devuelven null o redirigen ---

export async function getSession(): Promise<SessionContext | null> {
  const { userId } = await auth();
  if (!userId) return null;
  const couple = await prisma.couple.findFirst({
    where: { OR: [{ memberAId: userId }, { memberBId: userId }] },
  });
  if (!couple) return null;
  return { userId, coupleId: couple.id };
}

/**
 * Para layouts/páginas protegidas.
 * - Sin sesión → /sign-in
 * - Con sesión pero sin pareja → /onboarding/couple
 * - Con ambos → devuelve contexto
 */
export async function requireSessionPage(): Promise<SessionContext> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const couple = await prisma.couple.findFirst({
    where: { OR: [{ memberAId: userId }, { memberBId: userId }] },
  });
  if (!couple) redirect("/onboarding/couple");

  return { userId, coupleId: couple.id };
}