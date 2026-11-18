"use client";
import { useActionState } from "react";
import { createTransaction, type ActionState } from "../../actions";
import { FormField } from "@/components/ui/form-field";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";

export default function NewTransactionPage() {
  const [state, action, pending] = useActionState(createTransaction, null as ActionState);
  return <main className="mx-auto max-w-2xl p-6"><h1 className="mb-4 text-2xl font-semibold">Nuevo movimiento</h1><ErrorMessage message={state?.error}/><form action={action} className="space-y-4 rounded border bg-white p-4"><FormField label="Tipo" name="type"><Select name="type" defaultValue="EXPENSE"><option value="EXPENSE">Gasto</option><option value="INCOME">Ingreso</option><option value="TRANSFER">Transferencia</option><option value="SAVING">Ahorro</option><option value="INVESTMENT">Inversión</option><option value="DEBT_PAYMENT">Pago de deuda</option></Select></FormField><FormField label="Monto" name="amount" type="number" step="0.01" required/><FormField label="Fecha" name="date" type="date" required/><FormField label="Descripción" name="description"/><FormField label="Cuenta (ID)" name="accountId"/><FormField label="Categoría (ID)" name="categoryId"/><FormField label="Tarjeta (ID)" name="creditCardId"/><div className="flex gap-2"><Button type="submit" disabled={pending}>Guardar</Button><Button href="/finance/transactions" variant="secondary">Cancelar</Button></div></form></main>;
}