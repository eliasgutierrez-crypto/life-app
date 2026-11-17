import { randomBytes } from "crypto";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin 0/O/1/I

function generateInviteCode(): string {
  const bytes = randomBytes(8);
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return code;
}

/**
 * Devuelve la pareja del usuario, creándola si no existe.
 * NUNCA se une a una pareja ajena. Para unirse, usar joinCouple().
 */
export async function ensureCouple() {
  const userId = await requireUser();

  const existing = await prisma.couple.findFirst({
    where: { OR: [{ memberAId: userId }, { memberBId: userId }] },
  });
  if (existing) return existing;

  return prisma.couple.create({
    data: { memberAId: userId, inviteCode: generateInviteCode() },
  });
}

/**
 * Une al usuario actual a una pareja existente mediante su inviteCode.
 * Lanza si el código no existe, la pareja está completa, o el usuario ya tiene pareja.
 */
export async function joinCouple(inviteCode: string) {
  const userId = await requireUser();

  const already = await prisma.couple.findFirst({
    where: { OR: [{ memberAId: userId }, { memberBId: userId }] },
  });
  if (already) throw new Error("Ya perteneces a una pareja");

  const code = inviteCode.trim().toUpperCase();
  if (code.length !== 8) throw new Error("Código inválido");

  const target = await prisma.couple.findUnique({ where: { inviteCode: code } });
  if (!target) throw new Error("Código inválido");
  if (target.memberBId) throw new Error("Esa pareja ya está completa");
  if (target.memberAId === userId) throw new Error("No puedes unirte a tu propia pareja");

  return prisma.couple.update({
    where: { id: target.id },
    data: { memberBId: userId },
  });
}