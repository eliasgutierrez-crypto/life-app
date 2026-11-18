"use client";
import { useActionState } from "react";
import { updateTransaction, type ActionState } from "../../../actions";
import { FormField } from "@/components/ui/form-field";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
export default function EditTransactionForm({ item }: { item: { id: string; type: string; amount: string; date: string; description: string; accountId: string; categoryId: string; creditCardId: string } }) {
  const [state, action, pending] = useActionState(updateTransaction.bind(null, item.id), null as ActionState);
  return <main className="mx-auto max-w-2xl p-6"><h1 className="mb-4 text-2xl font-semibold">Editar movimiento</h1><ErrorMessage message={state?.error}/><form action={action} className="space-y-4 rounded border bg-white p-4"><FormField label="Tipo" name="type"><Select name="type" defaultValue={item.type}><option value="EXPENSE">Gasto</option><option value="INCOME">Ingreso</option><option value="TRANSFER">Transferencia</option><option value="SAVING">Ahorro</option><option value="INVESTMENT">Inversión</option><option value="DEBT_PAYMENT">Pago de deuda</option></Select></FormField><FormField label="Monto" name="amount" type="number" step="0.01" defaultValue={item.amount}/><FormField label="Fecha" name="date" type="date" defaultValue={item.date}/><FormField label="Descripción" name="description" defaultValue={item.description}/><FormField label="Cuenta (ID)" name="accountId" defaultValue={item.accountId}/><FormField label="Categoría (ID)" name="categoryId" defaultValue={item.categoryId}/><FormField label="Tarjeta (ID)" name="creditCardId" defaultValue={item.creditCardId}/><div className="flex gap-2"><Button type="submit" disabled={pending}>Guardar</Button><Button href="/finance/transactions" variant="secondary">Cancelar</Button></div></form></main>;
}