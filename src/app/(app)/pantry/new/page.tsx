"use client";

import Link from "next/link";
import { useActionState, type InputHTMLAttributes } from "react";
import { createPantryItem, type ActionState } from "../actions";

const initialState: ActionState = null;

export default function NewPantryItemPage() {
  const [state, formAction, pending] = useActionState(createPantryItem, initialState);

  return (
    <main className="mx-auto max-w-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Añadir item</h1>
        <Link href="/pantry" className="text-sm text-blue-600 underline">
          Volver
        </Link>
      </div>

      {state?.error && (
        <p className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {state.error}
        </p>
      )}

      <form action={formAction} className="space-y-4 rounded border bg-white p-4">
        <Field label="Nombre" name="name" required />
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Cantidad actual"
            name="currentQty"
            type="number"
            step="0.001"
            defaultValue="0"
            required
          />
          <Field label="Unidad" name="unit" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Stock mínimo"
            name="minStock"
            type="number"
            step="0.001"
            defaultValue="0"
          />
          <Field label="Vence" name="expiresAt" type="date" />
        </div>
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {pending ? "Guardando…" : "Añadir"}
          </button>
          <Link href="/pantry" className="rounded border px-4 py-2">
            Cancelar
          </Link>
        </div>
      </form>
    </main>
  );
}

function Field({
  label,
  name,
  ...rest
}: { label: string; name: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      <input name={name} {...rest} className="w-full rounded border px-3 py-2 text-gray-900" />
    </label>
  );
}