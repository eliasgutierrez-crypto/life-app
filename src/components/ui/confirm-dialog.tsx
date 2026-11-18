"use client";

export function ConfirmDialog({ open, title, onCancel, onConfirm }: { open: boolean; title: string; onCancel: () => void; onConfirm: () => void }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"><div className="rounded bg-white p-6"><p className="mb-4 font-medium">{title}</p><div className="flex justify-end gap-2"><button type="button" onClick={onCancel} className="rounded border px-3 py-2">Cancelar</button><button type="button" onClick={onConfirm} className="rounded bg-red-600 px-3 py-2 text-white">Confirmar</button></div></div></div>;
}