import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireCouple } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/finance-utils";
import { markPaymentPaid } from "../actions";

async function Detail({ id }: { id: string }) {
  const { coupleId } = await requireCouple();
  const debt = await prisma.debt.findFirst({
    where: { id, coupleId },
    include: { payments: { orderBy: { number: "asc" } } },
  });
  if (!debt) notFound();

  const totalPagado = debt.payments
    .filter((payment) => payment.paid)
    .reduce((total, payment) => total + Number(payment.amount), 0);
  const capitalPendiente = debt.payments
    .filter((payment) => !payment.paid)
    .reduce((total, payment) => total + Number(payment.principal), 0);
  const interesPendiente = debt.payments
    .filter((payment) => !payment.paid)
    .reduce((total, payment) => total + Number(payment.interest), 0);
  const totalBarra = totalPagado + capitalPendiente + interesPendiente;

  const segments = [
    { key: "paid", amount: totalPagado, color: "bg-green-600" },
    { key: "principal", amount: capitalPendiente, color: "bg-gray-400" },
    { key: "interest", amount: interesPendiente, color: "bg-orange-500" },
  ].filter((segment) => segment.amount > 0);

  return (
    <main className="mx-auto max-w-5xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">{debt.name}</h1>

      <Card title="Progreso de la deuda">
        {totalBarra === 0 ? (
          <p className="text-sm text-gray-600">Sin pagos registrados</p>
        ) : (
          <>
            <div
              aria-label="Progreso de pagos de la deuda"
              className="flex h-6 overflow-hidden rounded border"
            >
              {segments.map((segment) => (
                <div
                  key={segment.key}
                  className={segment.color}
                  style={{ width: `${(segment.amount / totalBarra) * 100}%` }}
                />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <p>🟩 Pagado: {formatMoney(totalPagado)}</p>
              <p>⬜ Capital pendiente: {formatMoney(capitalPendiente)}</p>
              <p>🟧 Intereses pendientes: {formatMoney(interesPendiente)}</p>
            </div>
            <p className="mt-3 font-semibold">Total: {formatMoney(totalBarra)}</p>
          </>
        )}
      </Card>

      <div className="overflow-x-auto rounded border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Pago", "Vencimiento", "Monto", "Capital", "Interés", "Estado"].map((header) => (
                <th key={header} className="px-3 py-2 text-left">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {debt.payments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-3 py-2">{payment.number}</td>
                <td className="px-3 py-2">{payment.dueDate.toLocaleDateString("es-MX")}</td>
                <td className="px-3 py-2">{formatMoney(payment.amount)}</td>
                <td className="px-3 py-2">{formatMoney(payment.principal)}</td>
                <td className="px-3 py-2">{formatMoney(payment.interest)}</td>
                <td className="px-3 py-2">
                  <form action={async () => {
                    "use server";
                    await markPaymentPaid(payment.id);
                  }}>
                    <button type="submit">
                      <Badge variant={payment.paid ? "success" : "warning"}>
                        {payment.paid ? "Pagado" : "Pendiente"}
                      </Badge>
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default function DebtDetail(props: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="p-6">Cargando…</p>}>
      <Load params={props.params} />
    </Suspense>
  );
}

async function Load({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Detail id={id} />;
}
