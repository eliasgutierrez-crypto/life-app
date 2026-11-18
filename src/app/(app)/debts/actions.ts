"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireCouple } from "@/lib/auth";
import { debtSchema } from "@/lib/validations/debts";
import { amortizationTable } from "@/lib/debts-utils";

export type ActionState = { error?: string } | null;

export async function createDebt(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { coupleId } = await requireCouple();
  const parsed = debtSchema.safeParse({
    name: formData.get("name"), principal: formData.get("principal"), annualRate: formData.get("annualRate"),
    startDate: formData.get("startDate"), termMonths: formData.get("termMonths"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  const debt = await prisma.debt.create({ data: { coupleId, ...parsed.data } });
  const rows = amortizationTable({ ...parsed.data, principal: parsed.data.principal });
  await prisma.debtPayment.createMany({
    data: rows.map((row) => ({ debtId: debt.id, number: row.number, dueDate: row.dueDate, amount: row.amount, principal: row.principal, interest: row.interest, paid: false })),
  });
  revalidatePath("/debts");
  redirect("/debts");
}
export async function updateDebt(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { coupleId } = await requireCouple();
  const parsed = debtSchema.safeParse({
    name: formData.get("name"), principal: formData.get("principal"), annualRate: formData.get("annualRate"),
    startDate: formData.get("startDate"), termMonths: formData.get("termMonths"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  if (!await prisma.debt.findFirst({ where: { id, coupleId } })) return { error: "Deuda no encontrada" };
  await prisma.debt.update({ where: { id }, data: parsed.data });
  revalidatePath("/debts");
  redirect("/debts");
}
export async function deleteDebt(formData: FormData) {
  const { coupleId } = await requireCouple();
  const id = String(formData.get("id") ?? "");
  if (!id || !await prisma.debt.findFirst({ where: { id, coupleId } })) return;
  await prisma.debt.delete({ where: { id } });
  revalidatePath("/debts");
}
export async function markPaymentPaid(paymentId: string) {
  const { coupleId } = await requireCouple();
  const payment = await prisma.debtPayment.findFirst({ where: { id: paymentId, debt: { coupleId } } });
  if (!payment) return;
  await prisma.debtPayment.update({ where: { id: paymentId }, data: { paid: !payment.paid, paidAt: !payment.paid ? new Date() : null } });
  revalidatePath("/debts");
}