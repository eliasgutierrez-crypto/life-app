"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireCouple } from "@/lib/auth";
import { pantryItemSchema } from "@/lib/validations/pantry";

export type ActionState = { error?: string } | null;

function parseForm(formData: FormData) {
  return pantryItemSchema.safeParse({
    name: formData.get("name"),
    currentQty: formData.get("currentQty"),
    unit: formData.get("unit"),
    minStock: formData.get("minStock") ?? "0",
    expiresAt: formData.get("expiresAt") ?? "",
  });
}

export async function createPantryItem(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { coupleId } = await requireCouple();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await prisma.pantryItem.create({
    data: { coupleId, ...parsed.data },
  });

  revalidatePath("/pantry");
  redirect("/pantry");
}

export async function updatePantryItem(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { coupleId } = await requireCouple();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  // Verificar pertenencia antes de actualizar
  const existing = await prisma.pantryItem.findFirst({
    where: { id, coupleId },
    select: { id: true },
  });
  if (!existing) return { error: "Item no encontrado" };

  await prisma.pantryItem.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/pantry");
  redirect("/pantry");
}

export async function deletePantryItem(formData: FormData) {
  const { coupleId } = await requireCouple();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  // Verificar pertenencia antes de borrar
  const existing = await prisma.pantryItem.findFirst({
    where: { id, coupleId },
    select: { id: true },
  });
  if (!existing) return;

  await prisma.pantryItem.delete({ where: { id } });
  revalidatePath("/pantry");
}