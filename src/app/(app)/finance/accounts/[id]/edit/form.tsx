"use client";

import { useActionState } from "react";
import { updateAccount, type ActionState } from "../../../actions";
import { FormField } from "@/components/ui/form-field";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";

export default function EditAccountForm({ item }: { item: { id: string; name: string; type: string; balance: string } }) {
  const [state, action, pending] = useActionState(updateAccount.bind(null, item.id), null as ActionState);
  return <main className="mx-auto max-w-2xl p-6"><h1 className="mb-4 text-2xl font-semibold">Editar cuenta</h1><ErrorMessage message={state?.error}/><form action={action} className="space-y-4 rounded border bg-white p-4"><FormField label="Nombre" name="name" defaultValue={item.name} required/><FormField label="Tipo" name="type"><Select name="type" defaultValue={item.type}><option value="CHECKING">Cuenta corriente</option><option value="SAVINGS">Ahorro</option><option value="INVESTMENT">Inversión</option><option value="CASH">Efectivo</option></Select></FormField><FormField label="Saldo" name="balance" type="number" step="0.01" defaultValue={item.balance}/><div className="flex gap-2"><Button type="submit" disabled={pending}>{pending ? "Guardando…" : "Guardar"}</Button><Button href="/finance/accounts" variant="secondary">Cancelar</Button></div></form></main>;
}