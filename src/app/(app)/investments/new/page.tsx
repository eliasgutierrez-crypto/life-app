"use client";

import { useActionState } from "react";
import { createInvestment, type ActionState } from "../actions";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
import { Select } from "@/components/ui/select";

export default function NewInvestmentPage() {
  const [state, action, pending] = useActionState(createInvestment, null as ActionState);
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Nueva inversión</h1>
      <ErrorMessage message={state?.error} />
      <form action={action} className="space-y-4 rounded border bg-white p-4">
        <FormField label="Nombre" name="name" required />
        <FormField label="Tipo" name="type" />
        <FormField label="Valor actual" name="currentValue" type="number" step="0.01" defaultValue="0" />
        <div>
          <FormField label="Tasa anual (%)" name="annualRate" type="number" step="0.01" min="0" max="100" />
          <p className="mt-1 text-xs text-gray-500">Déjalo vacío si no aplica (ej. cripto).</p>
        </div>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Tipo de interés</span>
          <Select name="interestType" defaultValue="COMPOUND">
            <option value="COMPOUND">Compuesto</option>
            <option value="SIMPLE">Simple</option>
          </Select>
        </label>
        <div className="flex gap-2">
          <Button type="submit" disabled={pending}>{pending ? "Guardando…" : "Guardar"}</Button>
          <Button href="/investments" variant="secondary">Cancelar</Button>
        </div>
      </form>
    </main>
  );
}