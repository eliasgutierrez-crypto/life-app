"use client";
import { useActionState } from "react";
import { createRecipe, type ActionState } from "../../actions";
import { FormField } from "@/components/ui/form-field";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
export default function NewRecipePage() { const [state, action, pending] = useActionState(createRecipe, null as ActionState); return <main className="mx-auto max-w-2xl p-6"><h1 className="mb-4 text-2xl font-semibold">Nueva receta</h1><ErrorMessage message={state?.error}/><form action={action} className="space-y-4 rounded border bg-white p-4"><FormField label="Nombre" name="name" required/><FormField label="Tipo" name="mealType"><Select name="mealType" defaultValue="BREAKFAST"><option value="BREAKFAST">Desayuno</option><option value="LUNCH">Comida</option><option value="DINNER">Cena</option></Select></FormField><FormField label="Ingredientes" name="ingredients"><textarea name="ingredients" className="w-full rounded border px-3 py-2"/></FormField><FormField label="Notas" name="notes"><textarea name="notes" className="w-full rounded border px-3 py-2"/></FormField><div className="flex gap-2"><Button type="submit" disabled={pending}>Guardar</Button><Button href="/meals/recipes" variant="secondary">Cancelar</Button></div></form></main>; }