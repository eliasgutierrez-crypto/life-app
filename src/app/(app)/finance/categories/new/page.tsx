"use client";

import { useActionState } from "react";
import { createCategory, type ActionState } from "../../actions";
import { FormField } from "@/components/ui/form-field";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";

export default function NewCategoryPage() {
  const [state, action, pending] = useActionState(createCategory, null as ActionState);
  return <main className="mx-auto max-w-2xl p-6"><h1 className="mb-4 text-2xl font-semibold">Nueva categoría</h1><ErrorMessage message={state?.error}/><form action={action} className="space-y-4 rounded border bg-white p-4"><FormField label="Nombre" name="name" required/><FormField label="Tipo" name="type"><Select name="type" defaultValue="EXPENSE"><option value="EXPENSE">Gasto</option><option value="INCOME">Ingreso</option><option value="TRANSFER">Transferencia</option><option value="SAVING">Ahorro</option><option value="INVESTMENT">Inversión</option><option value="DEBT_PAYMENT">Pago de deuda</option></Select></FormField><FormField label="Icono" name="icon"/><div className="flex gap-2"><Button type="submit" disabled={pending}>Guardar</Button><Button href="/finance/categories" variant="secondary">Cancelar</Button></div></form></main>;
}