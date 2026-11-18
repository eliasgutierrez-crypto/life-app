"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireCouple } from "@/lib/auth";
import { scheduleBlockSchema } from "@/lib/validations/schedule";
import { timeToMinutes } from "@/lib/schedule-utils";

export type ActionState = { error?: string } | null;

function dataFromForm(formData: FormData) {
  const start = String(formData.get("startTime") ?? "");
  const end = String(formData.get("endTime") ?? "");
  return scheduleBlockSchema.safeParse({
    title: formData.get("title"), description: formData.get("description") ?? "",
    color: formData.get("color") ?? "", startTime: start.includes(":") ? timeToMinutes(start) : start,
    endTime: end.includes(":") ? timeToMinutes(end) : end,
    daysOfWeek: formData.getAll("daysOfWeek").map(Number),
  });
}
export async function createScheduleBlock(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { coupleId } = await requireCouple();
  const parsed = dataFromForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  await prisma.scheduleBlock.create({ data: { coupleId, ...parsed.data } });
  revalidatePath("/schedule");
  redirect("/schedule");
}
export async function updateScheduleBlock(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { coupleId } = await requireCouple();
  const parsed = dataFromForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  if (!await prisma.scheduleBlock.findFirst({ where: { id, coupleId } })) return { error: "Bloque no encontrado" };
  await prisma.scheduleBlock.update({ where: { id }, data: parsed.data });
  revalidatePath("/schedule");
  redirect("/schedule");
}
export async function deleteScheduleBlock(formData: FormData) {
  const { coupleId } = await requireCouple();
  const id = String(formData.get("id") ?? "");
  if (!id || !await prisma.scheduleBlock.findFirst({ where: { id, coupleId } })) return;
  await prisma.scheduleBlock.delete({ where: { id } });
  revalidatePath("/schedule");
}