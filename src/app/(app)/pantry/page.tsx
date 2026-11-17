import Link from "next/link";
import { Suspense } from "react";
import { requireCouple } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatQty, isExpiringSoon, isExpired, isLowStock } from "@/lib/pantry-utils";
import { deletePantryItem } from "./actions";

async function PantryList() {
  const { coupleId } = await requireCouple();

  const items = await prisma.pantryItem.findMany({
    where: { coupleId },
    orderBy: [{ name: "asc" }],
  });

  if (items.length === 0) {
    return (
      <div className="rounded border bg-white p-8 text-center">
        <p className="text-gray-600">Aún no hay items en la despensa.</p>
        <Link
          href="/pantry/new"
          className="mt-4 inline-block rounded bg-black px-4 py-2 text-white"
        >
          Añadir el primero
        </Link>
      </div>
    );
  }

  // Ordenar por urgencia: vencidos, bajo stock, resto
  const sorted = [...items].sort((a, b) => {
    const score = (item: typeof a) => {
      if (isExpired(item.expiresAt)) return 0;
      if (isLowStock(item)) return 1;
      if (isExpiringSoon(item.expiresAt)) return 2;
      return 3;
    };
    return score(a) - score(b);
  });

  return (
    <div className="space-y-2">
      {sorted.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between rounded border bg-white p-3"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{item.name}</span>
              {isExpired(item.expiresAt) && (
                <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-800">
                  Vencido
                </span>
              )}
              {isLowStock(item) && (
                <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">
                  Bajo stock
                </span>
              )}
              {isExpiringSoon(item.expiresAt) && !isExpired(item.expiresAt) && (
                <span className="rounded bg-orange-100 px-2 py-0.5 text-xs text-orange-800">
                  Por vencer
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">
              {formatQty(item.currentQty)} {item.unit}
              {Number(item.minStock) > 0 && ` · mín ${formatQty(item.minStock)}`}
              {item.expiresAt &&
                ` · vence ${new Date(item.expiresAt).toLocaleDateString("es-MX")}`}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/pantry/${item.id}/edit`}
              className="rounded border px-3 py-1 text-sm hover:bg-gray-100"
            >
              Editar
            </Link>
            <form action={deletePantryItem}>
              <input type="hidden" name="id" value={item.id} />
              <button
                type="submit"
                className="rounded border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
              >
                Borrar
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PantryPage() {
  return (
    <main className="mx-auto max-w-4xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Despensa</h1>
        <Link
          href="/pantry/new"
          className="rounded bg-black px-4 py-2 text-white"
        >
          Añadir item
        </Link>
      </div>
      <Suspense fallback={<p className="text-gray-500">Cargando…</p>}>
        <PantryList />
      </Suspense>
    </main>
  );
}