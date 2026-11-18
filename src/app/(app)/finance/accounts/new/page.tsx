"use client";

import { useActionState } from "react";
import { createAccount, type ActionState } from "../../actions";
import { FormField } from "@/components/ui/form-field";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";

export default function NewAccountPage() {
  const [state, action, pending] = useActionState(createAccount, null as ActionState);
  return <main className="mx-auto max-w-2xl p-6"><h1 className="mb-4 text-2xl font-semibold">Nueva cuenta</h1><ErrorMessage message={state?.error}/><form action={action} className="space-y-4 rounded border bg-white p-4"><FormField label="Nombre" name="name" required/><FormField label="Tipo" name="type"><Select name="type" defaultValue="CHECKING"><option value="CHECKING">Cuenta corriente</option><option value="SAVINGS">Ahorro</option><option value="INVESTMENT">Inversión</option><option value="CASH">Efectivo</option></Select></FormField><FormField label="Saldo inicial" name="balance" type="number" step="0.01" defaultValue="0"/><div className="flex gap-2"><Button type="submit" disabled={pending}>{pending ? "Guardando…" : "Guardar"}</Button><Button href="/finance/accounts" variant="secondary">Cancelar</Button></div></form></main>;
}