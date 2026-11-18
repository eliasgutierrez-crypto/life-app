"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireCouple } from "@/lib/auth";
import { recipeSchema, mealPlanSchema } from "@/lib/validations/meals";

export type ActionState = { error?: string } | null;

export async function createRecipe(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { coupleId } = await requireCouple();
  const parsed = recipeSchema.safeParse({ name: formData.get("name"), mealType: formData.get("mealType"), ingredients: formData.get("ingredients") ?? "", notes: formData.get("notes") ?? "" });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  await prisma.recipe.create({ data: { coupleId, ...parsed.data } });
  revalidatePath("/meals/recipes");
  redirect("/meals/recipes");
}
export async function updateRecipe(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { coupleId } = await requireCouple();
  const parsed = recipeSchema.safeParse({ name: formData.get("name"), mealType: formData.get("mealType"), ingredients: formData.get("ingredients") ?? "", notes: formData.get("notes") ?? "" });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  if (!await prisma.recipe.findFirst({ where: { id, coupleId } })) return { error: "Receta no encontrada" };
  await prisma.recipe.update({ where: { id }, data: parsed.data });
  revalidatePath("/meals/recipes");
  redirect("/meals/recipes");
}
export async function deleteRecipe(formData: FormData) {
  const { coupleId } = await requireCouple();
  const id = String(formData.get("id") ?? "");
  if (!id || !await prisma.recipe.findFirst({ where: { id, coupleId } })) return;
  await prisma.recipe.delete({ where: { id } });
  revalidatePath("/meals/recipes");
}
export async function createMealPlan(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { coupleId } = await requireCouple();
  const parsed = mealPlanSchema.safeParse({ weekStart: formData.get("weekStart") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  try {
    await prisma.mealPlan.create({ data: { coupleId, weekStart: parsed.data.weekStart } });
  } catch {
    return { error: "Ya existe un plan para esa semana" };
  }
  revalidatePath("/meals/plans");
  redirect("/meals/plans");
}
export async function addMealPlanEntry(planId: string, dayOfWeek: number, mealType: "BREAKFAST" | "LUNCH" | "DINNER", recipeId: string) {
  const { coupleId } = await requireCouple();
  const plan = await prisma.mealPlan.findFirst({ where: { id: planId, coupleId } });
  if (!plan) return;
  await prisma.mealPlanEntry.upsert({
    where: { planId_dayOfWeek_mealType: { planId, dayOfWeek, mealType } },
    update: { recipeId },
    create: { planId, dayOfWeek, mealType, recipeId },
  });
  revalidatePath(`/meals/plans/${planId}`);
}
export async function removeMealPlanEntry(formData: FormData) {
  const { coupleId } = await requireCouple();
  const planId = String(formData.get("planId") ?? "");
  const id = String(formData.get("id") ?? "");
  if (!planId || !id) return;
  if (!await prisma.mealPlan.findFirst({ where: { id: planId, coupleId } })) return;
  await prisma.mealPlanEntry.delete({ where: { id } });
  revalidatePath(`/meals/plans/${planId}`);
}