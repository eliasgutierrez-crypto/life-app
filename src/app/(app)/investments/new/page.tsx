"use client";
import { useActionState } from "react";
import { createInvestment, type ActionState } from "../actions";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
export default function NewInvestmentPage() { const [state, action, pending] = useActionState(createInvestment, null as ActionState); return <main className="mx-auto max-w-2xl p-6"><h1 className="mb-4 text-2xl font-semibold">Nueva inversión</h1><ErrorMessage message={state?.error}/><form action={action} className="space-y-4 rounded border bg-white p-4"><FormField label="Nombre" name="name" required/><FormField label="Tipo" name="type"/><FormField label="Valor actual" name="currentValue" type="number" step="0.01" defaultValue="0"/><div className="flex gap-2"><Button type="submit" disabled={pending}>Guardar</Button><Button href="/investments" variant="secondary">Cancelar</Button></div></form></main>; }