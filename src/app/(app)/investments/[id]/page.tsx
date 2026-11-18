import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireCouple } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table } from "@/components/ui/table";
import { formatMoney } from "@/lib/finance-utils";
import {
  currentGain,
  currentGainPercent,
  expectedAnnualReturn,
  projectValue,
  totalContributed,
} from "@/lib/investments-utils";
import { deleteContribution } from "../actions";
import { AddContribution } from "./add-contribution";

async function Detail({ id }: { id: string }) {
  const { coupleId } = await requireCouple();
  const investment = await prisma.investment.findFirst({
    where: { id, coupleId },
    include: { contributions: { orderBy: { date: "desc" } } },
  });
  if (!investment) notFound();

  const contributed = totalContributed(investment);
  const gain = currentGain(investment);
  const gainPercent = currentGainPercent(investment);
  const annualReturn = expectedAnnualReturn(investment);
  const value = Number(investment.currentValue);
  const projections = [1, 3, 5].map((years) => {
    const projected = projectValue(investment, years);
    return { years, projected, gain: projected - value };
  });

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">{investment.name}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">{investment.type || "Inversión"}</span>
          <Badge variant={investment.annualRate == null ? "default" : "info"}>
            {investment.annualRate == null ? "Sin tasa" : `${Number(investment.annualRate)}% anual`}
          </Badge>
          <Badge variant={investment.interestType === "COMPOUND" ? "info" : "default"}>
            {investment.interestType === "COMPOUND" ? "Compuesto" : "Simple"}
          </Badge>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Valor actual">
          <p className="text-xl font-semibold">{formatMoney(value)}</p>
        </Card>
        <Card title="Total aportado">
          <p className="text-xl font-semibold">{formatMoney(contributed)}</p>
        </Card>
        <Card title="Ganancia actual">
          <p className={`text-xl font-semibold ${gain > 0 ? "text-green-700" : gain < 0 ? "text-red-700" : ""}`}>
            {formatMoney(gain)}
          </p>
          {gainPercent !== null && (
            <p className="text-sm text-gray-600">
              {gainPercent.toLocaleString("es-MX", { maximumFractionDigits: 2 })}%
            </p>
          )}
        </Card>
        <Card title="Rendimiento anual esperado">
          <p className="text-xl font-semibold">
            {annualReturn === null ? "—" : `${formatMoney(annualReturn)}/año`}
          </p>
        </Card>
      </div>

      <Card title="Proyección">
        {investment.annualRate == null ? (
          <p className="text-sm text-gray-600">Sin tasa definida, no se puede proyectar</p>
        ) : (
          <Table headers={["Plazo", "Valor proyectado", "Ganancia proyectada"]}>
            {projections.map((projection) => (
              <tr key={projection.years}>
                <td className="px-4 py-3">{projection.years} {projection.years === 1 ? "año" : "años"}</td>
                <td className="px-4 py-3">{formatMoney(projection.projected)}</td>
                <td className="px-4 py-3">{formatMoney(projection.gain)}</td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Aportaciones</h2>
          <Button href="/investments" variant="secondary">Volver a inversiones</Button>
        </div>
        <AddContribution investmentId={investment.id} />
        {investment.contributions.length === 0 ? (
          <EmptyState title="Sin aportaciones" description="Aún no hay datos registrados." />
        ) : (
          <Table headers={["Fecha", "Monto", "Nota", "Acciones"]}>
            {investment.contributions.map((contribution) => (
              <tr key={contribution.id}>
                <td className="px-4 py-3">{contribution.date.toLocaleDateString("es-MX")}</td>
                <td className="px-4 py-3">{formatMoney(contribution.amount)}</td>
                <td className="px-4 py-3">{contribution.note || "—"}</td>
                <td className="px-4 py-3">
                  <form action={deleteContribution}>
                    <input type="hidden" name="id" value={contribution.id} />
                    <input type="hidden" name="investmentId" value={investment.id} />
                    <Button type="submit" variant="danger">Borrar</Button>
                  </form>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </section>
    </main>
  );
}

export default function InvestmentDetail(props: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="p-6 text-gray-500">Cargando…</p>}>
      <Load params={props.params} />
    </Suspense>
  );
}

async function Load({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Detail id={id} />;
}
