"use client";

import { useActionState } from "react";
import { addContribution, type ActionState } from "../actions";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";

export function AddContribution({ investmentId }: { investmentId: string }) {
  const [state, action, pending] = useActionState(addContribution.bind(null, investmentId), null as ActionState);
  return (
    <form action={action} className="grid gap-3 rounded border bg-white p-4 md:grid-cols-4">
      <ErrorMessage message={state?.error}/>
      <FormField label="Monto" name="amount" type="number" step="0.01" required />
      <FormField label="Fecha" name="date" type="date" required />
      <FormField label="Nota" name="note" />
      <Button type="submit" disabled={pending} className="self-end">{pending ? "Guardando…" : "Añadir"}</Button>
    </form>
  );
}
