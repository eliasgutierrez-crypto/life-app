import { Suspense } from "react";
import { requireCouple } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatMoney } from "@/lib/finance-utils";
import {
  currentGain,
  currentGainPercent,
  expectedAnnualReturn,
  totalContributed,
} from "@/lib/investments-utils";
import { deleteInvestment } from "./actions";

async function InvestmentList() {
  const { coupleId } = await requireCouple();
  const items = await prisma.investment.findMany({
    where: { coupleId },
    include: { contributions: true },
    orderBy: { name: "asc" },
  });

  if (!items.length) {
    return (
      <EmptyState
        title="No hay inversiones"
        action={<Button href="/investments/new">Añadir inversión</Button>}
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => {
        const contributed = totalContributed(item);
        const gain = currentGain(item);
        const gainPercent = currentGainPercent(item);
        const annualReturn = expectedAnnualReturn(item);

        return (
          <Card key={item.id} title={item.name}>
            <div className="flex flex-wrap gap-2">
              <Badge variant={item.annualRate == null ? "default" : "info"}>
                {item.annualRate == null ? "Sin tasa" : `${Number(item.annualRate)}% anual`}
              </Badge>
              <Badge variant={item.interestType === "COMPOUND" ? "info" : "default"}>
                {item.interestType === "COMPOUND" ? "Compuesto" : "Simple"}
              </Badge>
              <span className="text-sm text-gray-600">{item.type || "Inversión"}</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Valor actual</p>
                <p className="font-semibold">{formatMoney(Number(item.currentValue))}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total aportado</p>
                <p className="font-semibold">{formatMoney(contributed)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Ganancia actual</p>
                <p className={`font-semibold ${gain > 0 ? "text-green-700" : gain < 0 ? "text-red-700" : ""}`}>
                  {formatMoney(gain)}
                  {gainPercent !== null && (
                    <span className="ml-1 text-sm">
                      ({gainPercent.toLocaleString("es-MX", { maximumFractionDigits: 2 })}%)
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Rendimiento anual esperado</p>
                <p className="font-semibold">
                  {annualReturn === null ? "—" : `${formatMoney(annualReturn)}/año`}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button href={`/investments/${item.id}`} variant="secondary">Ver detalle</Button>
              <Button href={`/investments/${item.id}/edit`} variant="secondary">Editar</Button>
              <form action={deleteInvestment}>
                <input type="hidden" name="id" value={item.id} />
                <Button type="submit" variant="danger">Borrar</Button>
              </form>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default function InvestmentsPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-4 p-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Inversiones</h1>
        <Button href="/investments/new">Añadir inversión</Button>
      </div>
      <Suspense fallback={<p className="text-gray-500">Cargando…</p>}>
        <InvestmentList />
      </Suspense>
    </main>
  );
}
