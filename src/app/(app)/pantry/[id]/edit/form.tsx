"use client";

import Link from "next/link";
import { useActionState, type InputHTMLAttributes } from "react";
import { updatePantryItem, type ActionState } from "../../actions";

const initialState: ActionState = null;

type Props = {
  item: {
    id: string;
    name: string;
    currentQty: string;
    unit: string;
    minStock: string;
    expiresAt: string | null;
  };
};

export default function EditPantryItemForm({ item }: Props) {
  const updateWithId = updatePantryItem.bind(null, item.id);
  const [state, formAction, pending] = useActionState(updateWithId, initialState);

  return (
    <main className="mx-auto max-w-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Editar item</h1>
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
        <Field label="Nombre" name="name" defaultValue={item.name} required />
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Cantidad actual"
            name="currentQty"
            type="number"
            step="0.001"
            defaultValue={item.currentQty}
            required
          />
          <Field label="Unidad" name="unit" defaultValue={item.unit} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Stock mínimo"
            name="minStock"
            type="number"
            step="0.001"
            defaultValue={item.minStock}
          />
          <Field label="Vence" name="expiresAt" type="date" defaultValue={item.expiresAt ?? ""} />
        </div>
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {pending ? "Guardando…" : "Guardar cambios"}
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