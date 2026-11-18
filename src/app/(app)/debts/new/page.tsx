"use client";
import { useActionState } from "react";
import { createDebt, type ActionState } from "../actions";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
export default function NewDebtPage() { const [state, action, pending] = useActionState(createDebt, null as ActionState); return <main className="mx-auto max-w-2xl p-6"><h1 className="mb-4 text-2xl font-semibold">Nueva deuda</h1><ErrorMessage message={state?.error}/><form action={action} className="space-y-4 rounded border bg-white p-4"><FormField label="Nombre" name="name" required/><FormField label="Monto principal" name="principal" type="number" step="0.01" required/><FormField label="Tasa anual (%)" name="annualRate" type="number" step="0.01" defaultValue="0"/><FormField label="Fecha inicial" name="startDate" type="date" required/><FormField label="Plazo (meses)" name="termMonths" type="number" min="1" required/><div className="flex gap-2"><Button type="submit" disabled={pending}>Guardar</Button><Button href="/debts" variant="secondary">Cancelar</Button></div></form></main>; }