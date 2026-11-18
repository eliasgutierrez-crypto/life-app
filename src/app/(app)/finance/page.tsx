import { Suspense } from "react";
import { requireCouple } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/finance-utils";

async function FinanceDashboard() {
  const { coupleId } = await requireCouple();
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const [accounts, transactions, cards] = await Promise.all([
    prisma.account.findMany({ where: { coupleId } }),
    prisma.transaction.findMany({ where: { coupleId, date: { gte: first } } }),
    prisma.creditCard.findMany({ where: { coupleId } }),
  ]);
  const balance = accounts.reduce((sum, item) => sum + Number(item.balance), 0);
  const income = transactions.filter((item) => item.type === "INCOME").reduce((sum, item) => sum + Number(item.amount), 0);
  const expenses = transactions.filter((item) => item.type !== "INCOME").reduce((sum, item) => sum + Number(item.amount), 0);
  const debt = cards.reduce((sum, card) => sum + Number(card.currentBalance), 0);
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Resumen financiero</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Balance total"><p className="text-2xl font-semibold">{formatMoney(balance)}</p></Card>
        <Card title="Ingresos del mes"><p className="text-2xl font-semibold text-green-700">{formatMoney(income)}</p></Card>
        <Card title="Gastos del mes"><p className="text-2xl font-semibold text-red-700">{formatMoney(expenses)}</p></Card>
        <Card title="Deuda en tarjetas"><p className="text-2xl font-semibold">{formatMoney(debt)}</p></Card>
      </div>
    </main>
  );
}

export default function FinancePage() {
  return <Suspense fallback={<p className="p-6 text-gray-500">Cargando…</p>}><FinanceDashboard /></Suspense>;
}