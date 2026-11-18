"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireCouple } from "@/lib/auth";
import { investmentSchema, contributionSchema } from "@/lib/validations/investments";

export type ActionState = { error?: string } | null;

export async function createInvestment(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { coupleId } = await requireCouple();
  const parsed = investmentSchema.safeParse({ name: formData.get("name"), type: formData.get("type") ?? "", currentValue: formData.get("currentValue") ?? "0" });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  await prisma.investment.create({ data: { coupleId, ...parsed.data } });
  revalidatePath("/investments");
  redirect("/investments");
}
export async function updateInvestment(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { coupleId } = await requireCouple();
  const parsed = investmentSchema.safeParse({ name: formData.get("name"), type: formData.get("type") ?? "", currentValue: formData.get("currentValue") ?? "0" });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  if (!await prisma.investment.findFirst({ where: { id, coupleId } })) return { error: "Inversión no encontrada" };
  await prisma.investment.update({ where: { id }, data: parsed.data });
  revalidatePath("/investments");
  redirect("/investments");
}
export async function deleteInvestment(formData: FormData) {
  const { coupleId } = await requireCouple();
  const id = String(formData.get("id") ?? "");
  if (!id || !await prisma.investment.findFirst({ where: { id, coupleId } })) return;
  await prisma.investment.delete({ where: { id } });
  revalidatePath("/investments");
}
export async function addContribution(investmentId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { coupleId } = await requireCouple();
  const parsed = contributionSchema.safeParse({ amount: formData.get("amount"), date: formData.get("date"), note: formData.get("note") ?? "" });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  if (!await prisma.investment.findFirst({ where: { id: investmentId, coupleId } })) return { error: "Inversión no encontrada" };
  await prisma.investmentContribution.create({ data: { investmentId, ...parsed.data } });
  revalidatePath(`/investments/${investmentId}`);
  return null;
}
export async function deleteContribution(formData: FormData) {
  const { coupleId } = await requireCouple();
  const id = String(formData.get("id") ?? "");
  const investmentId = String(formData.get("investmentId") ?? "");
  const contribution = await prisma.investmentContribution.findFirst({ where: { id, investment: { id: investmentId, coupleId } } });
  if (!contribution) return;
  await prisma.investmentContribution.delete({ where: { id } });
  revalidatePath(`/investments/${investmentId}`);
}