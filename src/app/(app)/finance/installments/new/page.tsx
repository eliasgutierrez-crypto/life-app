"use client";
import { useActionState } from "react";
import { createInstallmentPlan, type ActionState } from "../../actions";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
export default function NewInstallmentPage() { const [state, action, pending] = useActionState(createInstallmentPlan, null as ActionState); return <main className="mx-auto max-w-2xl p-6"><h1 className="mb-4 text-2xl font-semibold">Nuevo plan</h1><ErrorMessage message={state?.error}/><form action={action} className="space-y-4 rounded border bg-white p-4"><FormField label="Descripción" name="description" required/><FormField label="Monto total" name="totalAmount" type="number" step="0.01" required/><FormField label="Meses" name="months" type="number" min="1" required/><FormField label="Fecha inicial" name="startDate" type="date" required/><FormField label="ID de tarjeta" name="creditCardId" required/><div className="flex gap-2"><Button type="submit" disabled={pending}>Guardar</Button><Button href="/finance/installments" variant="secondary">Cancelar</Button></div></form></main>; }