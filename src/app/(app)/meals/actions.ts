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
export async function saveMealPlanEntry(
  planId: string,
  dayOfWeek: number,
  mealType: "BREAKFAST" | "LUNCH" | "DINNER",
  recipeId: string,
) {
  const { coupleId } = await requireCouple();
  const plan = await prisma.mealPlan.findFirst({ where: { id: planId, coupleId } });
  if (!plan) return;

  if (!Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
    throw new Error("Día de comida inválido");
  }

  if (!recipeId) {
    await prisma.mealPlanEntry.deleteMany({
      where: { planId, dayOfWeek, mealType },
    });
    revalidatePath(`/meals/plans/${planId}`);
    return;
  }

  const recipe = await prisma.recipe.findFirst({
    where: { id: recipeId, coupleId, mealType },
    select: { id: true },
  });
  if (!recipe) throw new Error("La receta no pertenece a esta pareja o no coincide con la comida");

  await prisma.mealPlanEntry.upsert({
    where: { planId_dayOfWeek_mealType: { planId, dayOfWeek, mealType } },
    update: { recipeId: recipe.id },
    create: { planId, dayOfWeek, mealType, recipeId: recipe.id },
  });
  revalidatePath(`/meals/plans/${planId}`);
}

export async function saveAllMealPlanEntries(planId: string, formData: FormData) {
  const { coupleId } = await requireCouple();
  const plan = await prisma.mealPlan.findFirst({
    where: { id: planId, coupleId },
    select: { id: true },
  });
  if (!plan) return;

  const mealTypes = ["BREAKFAST", "LUNCH", "DINNER"] as const;
  const selections = Array.from({ length: 7 }, (_, dayOfWeek) =>
    mealTypes.map((mealType) => ({
      dayOfWeek,
      mealType,
      recipeId: String(formData.get(`menu-${dayOfWeek}-${mealType}`) ?? ""),
    })),
  ).flat();
  const recipeIds = [...new Set(selections.map((entry) => entry.recipeId).filter(Boolean))];
  const recipes = recipeIds.length
    ? await prisma.recipe.findMany({
        where: { coupleId, id: { in: recipeIds } },
        select: { id: true, mealType: true },
      })
    : [];
  const recipesById = new Map(recipes.map((recipe) => [recipe.id, recipe]));

  for (const selection of selections) {
    if (!selection.recipeId) continue;
    const recipe = recipesById.get(selection.recipeId);
    if (!recipe || recipe.mealType !== selection.mealType) {
      throw new Error("Una receta seleccionada no pertenece a esta pareja o no coincide con la comida");
    }
  }

  await prisma.$transaction(async (transaction) => {
    for (const selection of selections) {
      if (!selection.recipeId) {
        await transaction.mealPlanEntry.deleteMany({
          where: {
            planId,
            dayOfWeek: selection.dayOfWeek,
            mealType: selection.mealType,
          },
        });
        continue;
      }

      await transaction.mealPlanEntry.upsert({
        where: {
          planId_dayOfWeek_mealType: {
            planId,
            dayOfWeek: selection.dayOfWeek,
            mealType: selection.mealType,
          },
        },
        update: { recipeId: selection.recipeId },
        create: {
          planId,
          dayOfWeek: selection.dayOfWeek,
          mealType: selection.mealType,
          recipeId: selection.recipeId,
        },
      });
    }
  });
  revalidatePath(`/meals/plans/${planId}`);
}

export async function removeMealPlanEntryById(planId: string, entryId: string) {
  const { coupleId } = await requireCouple();
  const entry = await prisma.mealPlanEntry.findFirst({
    where: { id: entryId, plan: { id: planId, coupleId } },
    select: { id: true },
  });
  if (!entry) return;
  await prisma.mealPlanEntry.delete({ where: { id: entry.id } });
  revalidatePath(`/meals/plans/${planId}`);
}