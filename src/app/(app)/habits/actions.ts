"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireCouple } from "@/lib/auth";
import { habitSchema } from "@/lib/validations/habits";

export type ActionState = { error?: string } | null;

export async function createHabit(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { coupleId } = await requireCouple();
  const parsed = habitSchema.safeParse({
    name: formData.get("name"), description: formData.get("description") ?? "",
    frequency: formData.get("frequency"), timesPerWeek: formData.get("timesPerWeek") || undefined,
    daysOfWeek: formData.getAll("daysOfWeek").map(Number),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  await prisma.habit.create({ data: { coupleId, ...parsed.data } });
  revalidatePath("/habits");
  redirect("/habits");
}
export async function updateHabit(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { coupleId } = await requireCouple();
  const parsed = habitSchema.safeParse({
    name: formData.get("name"), description: formData.get("description") ?? "",
    frequency: formData.get("frequency"), timesPerWeek: formData.get("timesPerWeek") || undefined,
    daysOfWeek: formData.getAll("daysOfWeek").map(Number),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  if (!await prisma.habit.findFirst({ where: { id, coupleId } })) return { error: "Hábito no encontrado" };
  await prisma.habit.update({ where: { id }, data: parsed.data });
  revalidatePath("/habits");
  redirect("/habits");
}
export async function deleteHabit(formData: FormData) {
  const { coupleId } = await requireCouple();
  const id = String(formData.get("id") ?? "");
  if (!id || !await prisma.habit.findFirst({ where: { id, coupleId } })) return;
  await prisma.habit.delete({ where: { id } });
  revalidatePath("/habits");
}
export async function toggleHabitEntry(habitId: string, date: Date) {
  const { coupleId } = await requireCouple();
  const habit = await prisma.habit.findFirst({ where: { id: habitId, coupleId } });
  if (!habit) return;
  const day = new Date(date);
  day.setHours(12, 0, 0, 0);
  const existing = await prisma.habitEntry.findUnique({ where: { habitId_date: { habitId, date: day } } });
  if (existing) {
    await prisma.habitEntry.update({ where: { id: existing.id }, data: { completed: !existing.completed } });
  } else {
    await prisma.habitEntry.create({ data: { habitId, date: day, completed: true } });
  }
  revalidatePath("/habits");
  revalidatePath(`/habits/${habitId}`);
}