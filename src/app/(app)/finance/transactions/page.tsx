import { Suspense } from "react";
import { requireCouple } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatMoney } from "@/lib/finance-utils";
import { deleteTransaction } from "../actions";

async function TransactionList() {
  const { coupleId } = await requireCouple();
  const items = await prisma.transaction.findMany({ where: { coupleId }, orderBy: [{ date: "desc" }], include: { category: true, account: true } });
  if (!items.length) return <EmptyState title="No hay movimientos" action={<Button href="/finance/transactions/new">Añadir movimiento</Button>} />;
  return <div className="space-y-2">{items.map((item) => <div key={item.id} className="flex items-center justify-between rounded border bg-white p-4"><div><p className="font-medium">{item.description || item.category?.name || item.type}</p><p className="text-sm text-gray-600">{item.date.toLocaleDateString("es-MX")} · {item.account?.name ?? "Sin cuenta"}</p></div><div className="flex items-center gap-3"><span className="font-medium">{formatMoney(item.amount)}</span><Button href={`/finance/transactions/${item.id}/edit`} variant="secondary">Editar</Button><form action={deleteTransaction}><input type="hidden" name="id" value={item.id}/><Button type="submit" variant="danger">Borrar</Button></form></div></div>)}</div>;
}
export default function TransactionsPage() {
  return <main className="mx-auto max-w-5xl p-6"><div className="mb-4 flex justify-between"><h1 className="text-2xl font-semibold">Movimientos</h1><Button href="/finance/transactions/new">Añadir movimiento</Button></div><Suspense fallback={<p>Cargando…</p>}><TransactionList/></Suspense></main>;
}