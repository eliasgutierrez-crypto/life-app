"use client";
import { useActionState } from "react";
import { createMealPlan, type ActionState } from "../../actions";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
export default function NewPlanPage() { const [state, action, pending] = useActionState(createMealPlan, null as ActionState); return <main className="mx-auto max-w-2xl p-6"><h1 className="mb-4 text-2xl font-semibold">Nuevo plan semanal</h1><ErrorMessage message={state?.error}/><form action={action} className="space-y-4 rounded border bg-white p-4"><FormField label="Inicio de semana" name="weekStart" type="date" required/><div className="flex gap-2"><Button type="submit" disabled={pending}>Crear</Button><Button href="/meals/plans" variant="secondary">Cancelar</Button></div></form></main>; }