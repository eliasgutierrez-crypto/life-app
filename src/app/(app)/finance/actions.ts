"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireCouple } from "@/lib/auth";
import { accountSchema, categorySchema, transactionSchema } from "@/lib/validations/finance";

export type ActionState = { error?: string } | null;

function firstIssue(parsed: { success: false; error: { issues: Array<{ message: string }> } }): string {
  return parsed.error.issues[0]?.message ?? "Datos inválidos";
}

export async function createAccount(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { coupleId } = await requireCouple();
  const parsed = accountSchema.safeParse({ name: formData.get("name"), type: formData.get("type"), balance: formData.get("balance") ?? "0" });
  if (!parsed.success) return { error: firstIssue(parsed) };
  await prisma.account.create({ data: { coupleId, ...parsed.data } });
  revalidatePath("/finance");
  revalidatePath("/finance/accounts");
  redirect("/finance/accounts");
}
export async function updateAccount(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { coupleId } = await requireCouple();
  const parsed = accountSchema.safeParse({ name: formData.get("name"), type: formData.get("type"), balance: formData.get("balance") ?? "0" });
  if (!parsed.success) return { error: firstIssue(parsed) };
  const existing = await prisma.account.findFirst({ where: { id, coupleId } });
  if (!existing) return { error: "Cuenta no encontrada" };
  await prisma.account.update({ where: { id }, data: parsed.data });
  revalidatePath("/finance/accounts");
  redirect("/finance/accounts");
}
export async function deleteAccount(formData: FormData) {
  const { coupleId } = await requireCouple();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  if (!await prisma.account.findFirst({ where: { id, coupleId } })) return;
  await prisma.account.delete({ where: { id } });
  revalidatePath("/finance/accounts");
}

export async function createCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { coupleId } = await requireCouple();
  const parsed = categorySchema.safeParse({ name: formData.get("name"), type: formData.get("type"), icon: formData.get("icon") ?? "" });
  if (!parsed.success) return { error: firstIssue(parsed) };
  await prisma.category.create({ data: { coupleId, ...parsed.data } });
  revalidatePath("/finance/categories");
  redirect("/finance/categories");
}
export async function updateCategory(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { coupleId } = await requireCouple();
  const parsed = categorySchema.safeParse({ name: formData.get("name"), type: formData.get("type"), icon: formData.get("icon") ?? "" });
  if (!parsed.success) return { error: firstIssue(parsed) };
  if (!await prisma.category.findFirst({ where: { id, coupleId } })) return { error: "Categoría no encontrada" };
  await prisma.category.update({ where: { id }, data: parsed.data });
  revalidatePath("/finance/categories");
  redirect("/finance/categories");
}
export async function deleteCategory(formData: FormData) {
  const { coupleId } = await requireCouple();
  const id = String(formData.get("id") ?? "");
  if (!id || !await prisma.category.findFirst({ where: { id, coupleId } })) return;
  await prisma.category.delete({ where: { id } });
  revalidatePath("/finance/categories");
}

export async function createTransaction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { coupleId } = await requireCouple();
  const parsed = transactionSchema.safeParse({
    type: formData.get("type"), amount: formData.get("amount"), date: formData.get("date"),
    description: formData.get("description") ?? "", categoryId: formData.get("categoryId") || undefined,
    accountId: formData.get("accountId") || undefined, creditCardId: formData.get("creditCardId") || undefined,
  });
  if (!parsed.success) return { error: firstIssue(parsed) };
  await prisma.transaction.create({ data: { coupleId, ...parsed.data } });
  revalidatePath("/finance");
  revalidatePath("/finance/transactions");
  redirect("/finance/transactions");
}
export async function updateTransaction(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { coupleId } = await requireCouple();
  const parsed = transactionSchema.safeParse({
    type: formData.get("type"), amount: formData.get("amount"), date: formData.get("date"),
    description: formData.get("description") ?? "", categoryId: formData.get("categoryId") || undefined,
    accountId: formData.get("accountId") || undefined, creditCardId: formData.get("creditCardId") || undefined,
  });
  if (!parsed.success) return { error: firstIssue(parsed) };
  if (!await prisma.transaction.findFirst({ where: { id, coupleId } })) return { error: "Transacción no encontrada" };
  await prisma.transaction.update({ where: { id }, data: parsed.data });
  revalidatePath("/finance/transactions");
  redirect("/finance/transactions");
}
export async function deleteTransaction(formData: FormData) {
  const { coupleId } = await requireCouple();
  const id = String(formData.get("id") ?? "");
  if (!id || !await prisma.transaction.findFirst({ where: { id, coupleId } })) return;
  await prisma.transaction.delete({ where: { id } });
  revalidatePath("/finance");
  revalidatePath("/finance/transactions");
}

export async function createCreditCard(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { coupleId } = await requireCouple();
  const name = String(formData.get("name") ?? "").trim();
  const limitAmount = Number(formData.get("limitAmount"));
  const cutoffDay = Number(formData.get("cutoffDay"));
  const paymentDay = Number(formData.get("paymentDay"));
  const interestRate = formData.get("interestRate") ? Number(formData.get("interestRate")) : null;
  if (!name || !Number.isFinite(limitAmount) || cutoffDay < 1 || cutoffDay > 31 || paymentDay < 1 || paymentDay > 31) return { error: "Datos de tarjeta inválidos" };
  await prisma.creditCard.create({ data: { coupleId, name, limitAmount, cutoffDay, paymentDay, interestRate } });
  revalidatePath("/finance/credit-cards");
  redirect("/finance/credit-cards");
}
export async function updateCreditCard(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { coupleId } = await requireCouple();
  const name = String(formData.get("name") ?? "").trim();
  const limitAmount = Number(formData.get("limitAmount"));
  const cutoffDay = Number(formData.get("cutoffDay"));
  const paymentDay = Number(formData.get("paymentDay"));
  const interestRate = formData.get("interestRate") ? Number(formData.get("interestRate")) : null;
  if (!name || !Number.isFinite(limitAmount)) return { error: "Datos de tarjeta inválidos" };
  if (!await prisma.creditCard.findFirst({ where: { id, coupleId } })) return { error: "Tarjeta no encontrada" };
  await prisma.creditCard.update({ where: { id }, data: { name, limitAmount, cutoffDay, paymentDay, interestRate } });
  revalidatePath("/finance/credit-cards");
  redirect("/finance/credit-cards");
}
export async function deleteCreditCard(formData: FormData) {
  const { coupleId } = await requireCouple();
  const id = String(formData.get("id") ?? "");
  if (!id || !await prisma.creditCard.findFirst({ where: { id, coupleId } })) return;
  await prisma.creditCard.delete({ where: { id } });
  revalidatePath("/finance/credit-cards");
}

export async function createInstallmentPlan(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { coupleId } = await requireCouple();
  const creditCardId = String(formData.get("creditCardId") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const totalAmount = Number(formData.get("totalAmount"));
  const months = Number(formData.get("months"));
  const startDateValue = String(formData.get("startDate") ?? "");
  if (!creditCardId || !description || !Number.isFinite(totalAmount) || totalAmount <= 0 || months < 1 || !startDateValue) {
    return { error: "Datos del plan inválidos" };
  }
  const card = await prisma.creditCard.findFirst({ where: { id: creditCardId, coupleId } });
  if (!card) return { error: "Tarjeta no encontrada" };
  const startDate = new Date(startDateValue);
  const monthlyAmount = totalAmount / months;
  const plan = await prisma.installmentPlan.create({
    data: { coupleId, creditCardId, description, totalAmount, months, monthlyAmount, startDate },
  });
  await prisma.installmentPayment.createMany({
    data: Array.from({ length: months }, (_, index) => {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + index);
      return { planId: plan.id, number: index + 1, dueDate, paid: false };
    }),
  });
  revalidatePath("/finance/installments");
  redirect("/finance/installments");
}

export async function markInstallmentPaid(paymentId: string) {
  const { coupleId } = await requireCouple();
  const payment = await prisma.installmentPayment.findFirst({
    where: { id: paymentId, plan: { coupleId } },
  });
  if (!payment) return;
  await prisma.installmentPayment.update({
    where: { id: paymentId },
    data: { paid: !payment.paid, paidAt: !payment.paid ? new Date() : null },
  });
  revalidatePath("/finance/installments");
}