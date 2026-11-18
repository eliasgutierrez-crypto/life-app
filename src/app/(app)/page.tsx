import { Suspense } from "react";
import { requireCouple } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatMoney } from "@/lib/finance-utils";
import { isExpired, isExpiringSoon, isLowStock } from "@/lib/pantry-utils";

async function DashboardContent() {
  const { coupleId } = await requireCouple();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [
    couple,
    pantryItems,
    accounts,
    monthTransactions,
    recentTransactions,
    habits,
  ] = await Promise.all([
    prisma.couple.findUnique({ where: { id: coupleId } }),
    prisma.pantryItem.findMany({ where: { coupleId } }),
    prisma.account.findMany({ where: { coupleId } }),
    prisma.transaction.findMany({
      where: {
        coupleId,
        date: { gte: monthStart, lt: nextMonth },
      },
    }),
    prisma.transaction.findMany({
      where: { coupleId },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      take: 5,
    }),
    prisma.habit.findMany({
      where: { coupleId },
      include: {
        entries: {
          where: { date: { gte: today, lt: tomorrow } },
          take: 1,
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const lowStockCount = pantryItems.filter((item) => isLowStock(item)).length;
  const expiredCount = pantryItems.filter((item) => isExpired(item.expiresAt)).length;
  const expiringSoonCount = pantryItems.filter(
    (item) => isExpiringSoon(item.expiresAt) && !isExpired(item.expiresAt),
  ).length;
  const upcomingPantry = [...pantryItems]
    .filter((item) => item.expiresAt && !isExpired(item.expiresAt))
    .sort((a, b) => (a.expiresAt?.getTime() ?? 0) - (b.expiresAt?.getTime() ?? 0))
    .slice(0, 3);

  const accountBalance = accounts.reduce(
    (total, account) => total + Number(account.balance),
    0,
  );
  const monthlyExpenses = monthTransactions
    .filter((transaction) => transaction.type === "EXPENSE")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);
  const monthlyIncome = monthTransactions
    .filter((transaction) => transaction.type === "INCOME")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);
  const completedToday = habits.filter(
    (habit) => habit.entries.some((entry) => entry.completed),
  ).length;

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">Inicio</h1>
        <div className="flex flex-wrap gap-2">
          <Badge variant="info">Pareja: {couple?.inviteCode ?? "—"}</Badge>
          {couple?.memberBId ? (
            <Badge variant="success">Pareja completa</Badge>
          ) : (
            <Badge variant="warning">Esperando pareja</Badge>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card
          title="Despensa"
          action={<Button href="/pantry" variant="ghost" className="px-2 py-1">Ver</Button>}
        >
          {pantryItems.length === 0 ? (
            <p className="text-sm text-gray-500">Sin datos aún</p>
          ) : (
            <>
              <p className="text-3xl font-semibold text-gray-900">{pantryItems.length}</p>
              <p className="text-sm text-gray-600">items totales</p>
              <div className="mt-3 space-y-1 text-sm">
                <p className="text-yellow-800">{lowStockCount} con bajo stock</p>
                <p className="text-red-800">{expiredCount} vencidos</p>
                <p className="text-orange-800">{expiringSoonCount} por vencer</p>
              </div>
            </>
          )}
        </Card>

        <Card
          title="Finanzas"
          action={<Button href="/finance" variant="ghost" className="px-2 py-1">Ver</Button>}
        >
          {accounts.length === 0 && monthTransactions.length === 0 ? (
            <p className="text-sm text-gray-500">Sin datos aún</p>
          ) : (
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">Balance total</p>
                <p className="text-xl font-semibold">{formatMoney(accountBalance)}</p>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Ingresos</span>
                <span className="font-medium text-green-700">{formatMoney(monthlyIncome)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Gastos</span>
                <span className="font-medium text-red-700">{formatMoney(monthlyExpenses)}</span>
              </div>
            </div>
          )}
        </Card>

        <Card
          title="Hábitos"
          action={<Button href="/habits" variant="ghost" className="px-2 py-1">Ver</Button>}
        >
          {habits.length === 0 ? (
            <p className="text-sm text-gray-500">Sin datos aún</p>
          ) : (
            <>
              <p className="text-3xl font-semibold text-gray-900">{habits.length}</p>
              <p className="text-sm text-gray-600">hábitos totales</p>
              <p className="mt-3 text-sm text-green-700">
                {completedToday} completados hoy
              </p>
            </>
          )}
        </Card>

        <Card title="Próximos vencimientos">
          {upcomingPantry.length === 0 ? (
            <p className="text-sm text-gray-500">Sin datos aún</p>
          ) : (
            <ul className="space-y-2">
              {upcomingPantry.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-gray-900">{item.name}</span>
                  <span className="text-gray-600">
                    {item.expiresAt?.toLocaleDateString("es-MX")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card
        title="Últimos movimientos"
        action={<Button href="/finance/transactions" variant="ghost" className="px-2 py-1">Ver todos</Button>}
      >
        {recentTransactions.length === 0 ? (
          <EmptyState title="Sin movimientos" description="Aún no hay datos registrados." />
        ) : (
          <ul className="divide-y">
            {recentTransactions.map((transaction) => (
              <li key={transaction.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="font-medium text-gray-900">
                    {transaction.description || "Movimiento sin descripción"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {transaction.date.toLocaleDateString("es-MX")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {transaction.type === "EXPENSE" && (
                    <Badge variant="danger">EXPENSE</Badge>
                  )}
                  {transaction.type === "INCOME" && (
                    <Badge variant="success">INCOME</Badge>
                  )}
                  {transaction.type === "SAVING" && (
                    <Badge variant="info">SAVING</Badge>
                  )}
                  {transaction.type !== "EXPENSE" &&
                    transaction.type !== "INCOME" &&
                    transaction.type !== "SAVING" && (
                      <Badge>{transaction.type}</Badge>
                    )}
                  <span className="min-w-28 text-right font-semibold">
                    {formatMoney(transaction.amount)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Hábitos de hoy">
        {habits.length === 0 ? (
          <EmptyState title="Sin hábitos" description="Aún no hay datos registrados." />
        ) : (
          <ul className="divide-y">
            {habits.map((habit) => {
              const completed = habit.entries.some((entry) => entry.completed);
              return (
                <li key={habit.id} className="flex items-center justify-between py-3">
                  <span className="font-medium text-gray-900">{habit.name}</span>
                  <span className="text-sm">
                    {completed ? "✅ Completado" : "⏳ Pendiente"}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<p className="p-6 text-gray-500">Cargando…</p>}>
      <DashboardContent />
    </Suspense>
  );
}
