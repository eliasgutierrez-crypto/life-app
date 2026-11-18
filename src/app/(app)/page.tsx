import Link from "next/link";
import { Suspense } from "react";
import { requireCouple } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { isLowStock, isExpired, isExpiringSoon } from "@/lib/pantry-utils";

async function DashboardContent() {
  const { coupleId } = await requireCouple();

  const [pantryItems, couple] = await Promise.all([
    prisma.pantryItem.findMany({ where: { coupleId } }),
    prisma.couple.findUnique({ where: { id: coupleId } }),
  ]);

  const lowStock = pantryItems.filter((i) => isLowStock(i)).length;
  const expired = pantryItems.filter((i) => isExpired(i.expiresAt)).length;
  const expiringSoon = pantryItems.filter(
    (i) => isExpiringSoon(i.expiresAt) && !isExpired(i.expiresAt),
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Inicio</h1>
        <Badge variant="info">
          Pareja: {couple?.inviteCode ?? "—"}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Despensa" action={<Link href="/pantry" className="text-sm text-blue-600 underline">Ver</Link>}>
          <p className="text-3xl font-semibold text-gray-900">{pantryItems.length}</p>
          <p className="text-sm text-gray-600">items totales</p>
          {lowStock > 0 && (
            <p className="mt-2 text-sm text-yellow-800">
              {lowStock} con bajo stock
            </p>
          )}
          {expired > 0 && (
            <p className="text-sm text-red-800">{expired} vencidos</p>
          )}
          {expiringSoon > 0 && (
            <p className="text-sm text-orange-800">
              {expiringSoon} por vencer
            </p>
          )}
        </Card>

        <Card title="Finanzas">
          <p className="text-sm text-gray-500">Aún no implementado</p>
        </Card>

        <Card title="Hábitos">
          <p className="text-sm text-gray-500">Aún no implementado</p>
        </Card>
      </div>

      {pantryItems.length > 0 && (
        <Card title="Últimos items">
          <ul className="divide-y">
            {pantryItems.slice(0, 5).map((item) => (
              <li key={item.id} className="flex items-center justify-between py-2">
                <span className="text-gray-900">{item.name}</span>
                <span className="text-sm text-gray-600">
                  {Number(item.currentQty)} {item.unit}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="p-6">
      <Suspense fallback={<p className="text-gray-500">Cargando…</p>}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}