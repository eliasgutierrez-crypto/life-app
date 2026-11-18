import { Suspense } from "react";
import { requireCouple } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatMoney } from "@/lib/finance-utils";
import { deleteAccount } from "../actions";

async function AccountsList() {
  const { coupleId } = await requireCouple();
  const accounts = await prisma.account.findMany({ where: { coupleId }, orderBy: { name: "asc" } });
  if (!accounts.length) return <EmptyState title="No hay cuentas" description="Agrega tu primera cuenta." action={<Button href="/finance/accounts/new">Añadir cuenta</Button>} />;
  return <div className="space-y-2">{accounts.map((account) => <div key={account.id} className="flex items-center justify-between rounded border bg-white p-4"><div><p className="font-medium">{account.name}</p><p className="text-sm text-gray-600">{account.type} · {formatMoney(account.balance)}</p></div><div className="flex gap-2"><Button href={`/finance/accounts/${account.id}/edit`} variant="secondary">Editar</Button><form action={deleteAccount}><input type="hidden" name="id" value={account.id}/><Button type="submit" variant="danger">Borrar</Button></form></div></div>)}</div>;
}

export default function AccountsPage() {
  return <main className="mx-auto max-w-4xl p-6"><div className="mb-4 flex justify-between"><h1 className="text-2xl font-semibold">Cuentas</h1><Button href="/finance/accounts/new">Añadir cuenta</Button></div><Suspense fallback={<p>Cargando…</p>}><AccountsList /></Suspense></main>;
}